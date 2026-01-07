import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { generateUserResponse, generateSummaryAndActions } from '@/lib/groq';

// JSON Schema for request validation
const reviewSchema = {
    rating: { type: 'number', min: 1, max: 5, required: true },
    review: { type: 'string', maxLength: 2000, required: true }
};

function validateReview(data) {
    const errors = [];

    if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        errors.push('Rating must be a number between 1 and 5');
    }

    if (typeof data.review !== 'string') {
        errors.push('Review must be a string');
    }

    if (data.review && data.review.length > 2000) {
        errors.push('Review must be less than 2000 characters');
    }

    return errors;
}

// POST: Submit new review
export async function POST(request) {
    try {
        const body = await request.json();

        // Validate input
        const errors = validateReview(body);
        if (errors.length > 0) {
            return NextResponse.json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const { rating, review } = body;

        // Handle empty reviews
        const reviewText = review.trim() || 'No written review provided';

        // Generate AI response for user (this happens immediately)
        let aiResponse;
        try {
            aiResponse = await generateUserResponse(rating, reviewText);
        } catch (error) {
            console.error('AI response generation failed:', error);
            aiResponse = "Thank you for your feedback! We appreciate you taking the time to share your experience.";
        }

        // Store in database
        const client = await clientPromise;
        const db = client.db('fynd-feedback');
        const reviews = db.collection('reviews');

        const document = {
            rating,
            review: reviewText,
            aiResponse,
            timestamp: new Date(),
            analyzed: false
        };

        const result = await reviews.insertOne(document);

        // Return immediate response to user
        return NextResponse.json({
            success: true,
            message: 'Review submitted successfully',
            aiResponse,
            reviewId: result.insertedId
        }, { status: 201 });

    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json(
            { error: 'Failed to submit review', details: error.message },
            { status: 500 }
        );
    }
}

// GET: Fetch all reviews (for admin dashboard)
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('fynd-feedback');
        const reviews = db.collection('reviews');

        // Get all reviews, sorted by most recent first
        const allReviews = await reviews
            .find({})
            .sort({ timestamp: -1 })
            .limit(100) // Limit to recent 100
            .toArray();

        // Generate analysis for reviews that haven't been analyzed yet
        const reviewsToAnalyze = allReviews.filter(r => !r.analyzed);

        if (reviewsToAnalyze.length > 0) {
            // Analyze in background (don't wait for completion)
            // Note: In serverless, background tasks might be cut off. 
            // Ideally we would use a queue, but for this task, this simple approach is acceptable
            // as long as the Vercel function invocation lasts long enough or we client-side poll.
            // However, to ensure it doesn't block the response, we start it without await.

            reviewsToAnalyze.map(async (review) => {
                try {
                    const analysis = await generateSummaryAndActions(review.rating, review.review);
                    await reviews.updateOne(
                        { _id: review._id },
                        {
                            $set: {
                                summary: analysis.summary,
                                recommendedActions: analysis.recommended_actions,
                                analyzed: true
                            }
                        }
                    );
                } catch (error) {
                    console.error('Error analyzing review:', review._id, error);
                }
            });
        }

        // Return all reviews with their current state
        const reviewsWithAnalysis = allReviews.map(review => ({
            id: review._id.toString(),
            rating: review.rating,
            review: review.review,
            aiResponse: review.aiResponse,
            summary: review.summary || 'Analyzing...',
            recommendedActions: review.recommendedActions || ['Analysis in progress...'],
            timestamp: review.timestamp,
            analyzed: review.analyzed || false
        }));

        return NextResponse.json({
            success: true,
            reviews: reviewsWithAnalysis,
            total: allReviews.length
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews', details: error.message },
            { status: 500 }
        );
    }
}
