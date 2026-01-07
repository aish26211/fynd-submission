export async function callGroq(messages, temperature = 0.7) {
    const API_KEY = process.env.GROQ_API_KEY;
    if (!API_KEY) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('GROQ_API_KEY is not set. Using mock response.');
            return "This is a mock AI response because the Groq API key is missing.";
        }
        throw new Error('GROQ_API_KEY is not set');
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: messages,
                temperature: temperature,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Groq API error: ${response.status}`, errorText);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Groq API connection error:', error);
        throw error;
    }
}

export async function generateUserResponse(rating, review) {
    const messages = [
        {
            role: "system",
            content: "You are a customer service representative. Provide warm, professional, and concise responses."
        },
        {
            role: "user",
            content: `A user left a ${rating}-star review: "${review}"

Generate a response (2-3 sentences) that:
- Thanks them for their feedback
- Acknowledges their specific experience
- ${rating >= 4 ? 'Expresses gratitude and encouragement to return' : 'Shows concern and commitment to improvement'}

Keep it genuine and appropriate for the rating. Do NOT include placeholders.`
        }
    ];

    try {
        return await callGroq(messages, 0.7);
    } catch (error) {
        // Fallback response
        if (rating >= 4) {
            return "Thank you for your wonderful feedback! We're thrilled you had a great experience. We look forward to serving you again soon!";
        } else {
            return "Thank you for sharing your feedback. We take all reviews seriously and will use this to improve our service. We hope to serve you better in the future.";
        }
    }
}

export async function generateSummaryAndActions(rating, review) {
    const messages = [
        {
            role: "system",
            content: "You are a feedback analyst. Output purely valid JSON without markdown formatting."
        },
        {
            role: "user",
            content: `Analyze this customer feedback:
Rating: ${rating} stars
Review: "${review || 'No written review provided'}"

Provide:
1. A brief 1-sentence summary
2. 2-3 specific recommended actions for the business

Format as JSON:
{
  "summary": "...",
  "recommended_actions": ["action 1", "action 2", "action 3"]
}`
        }
    ];

    try {
        const response = await callGroq(messages, 0.3); // Lower temperature for consistent JSON

        // Extract JSON from response (handle potential markdown ticks)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        // Try parsing raw response if no regex match
        try {
            return JSON.parse(response);
        } catch (e) {
            throw new Error('Invalid JSON response structure');
        }

    } catch (error) {
        console.error('Error generating summary:', error);

        // Fallback
        return {
            summary: rating >= 4
                ? "Positive customer experience with satisfaction expressed"
                : "Customer feedback indicates areas needing attention",
            recommended_actions: rating >= 4
                ? ["Thank customer personally", "Share positive feedback with team", "Encourage future visits"]
                : ["Follow up with customer", "Review service procedures", "Implement improvements"]
        };
    }
}
