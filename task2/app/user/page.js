'use client';

import { useState } from 'react';

export default function UserDashboard() {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, review: review.trim() })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            setResponse(data.aiResponse);
            setRating(0);
            setReview('');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h1>
                    <p className="text-gray-600 mb-8">We value your feedback and use it to improve our service</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                How would you rate your experience?
                            </label>
                            <div className="flex gap-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-4xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        aria-label={`Rate ${star} stars`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    You selected {rating} star{rating !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>

                        {/* Review Text */}
                        <div>
                            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                                Tell us more (optional)
                            </label>
                            <textarea
                                id="review"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                rows={5}
                                maxLength={2000}
                                placeholder="Share your thoughts, suggestions, or concerns..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {review.length}/2000 characters
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || rating === 0}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>

                    {/* Error State */}
                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Success State with AI Response */}
                    {response && (
                        <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg animate-fade-in">
                            <h3 className="font-semibold text-green-900 mb-2">Thank you for your feedback!</h3>
                            <p className="text-gray-700">{response}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
