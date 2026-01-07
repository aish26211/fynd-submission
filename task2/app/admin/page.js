'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch('/api/reviews', { cache: 'no-store' });
            const data = await res.json();
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();

        let interval;
        if (autoRefresh) {
            interval = setInterval(fetchReviews, 5000); // Refresh every 5 seconds
        }
        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Calculate statistics
    const stats = {
        total: reviews.length,
        byRating: [1, 2, 3, 4, 5].map(rating => ({
            rating: `${rating}★`,
            count: reviews.filter(r => r.rating === rating).length
        })),
        avgRating: reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0
    };

    // Filter reviews
    const filteredReviews = filter === 'all'
        ? reviews
        : reviews.filter(r => r.rating === parseInt(filter));

    if (loading && reviews.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="text-gray-600">Real-time customer feedback analytics</p>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                Auto-refresh
                            </label>
                            <button
                                onClick={fetchReviews}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
                            >
                                Refresh Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Total Reviews</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Average Rating</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.avgRating} ★</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Rating Distribution</h3>
                        <div className="h-20 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.byRating}>
                                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <XAxis dataKey="rating" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: 'transparent' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <label className="text-sm font-medium text-gray-700 mr-3">Filter by rating:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                        <option value="all">All Ratings</option>
                        {[1, 2, 3, 4, 5].map(r => (
                            <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                        ))}
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {filteredReviews.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                            No reviews found matching criteria
                        </div>
                    ) : (
                        filteredReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-l-blue-500">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-2xl text-yellow-400">
                                                {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {new Date(review.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${review.analyzed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {review.analyzed ? 'Analyzed' : 'Processing...'}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Customer Review</h4>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{review.review}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-2">AI Summary</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.summary}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Recommended Actions</h4>
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                            {review.recommendedActions.map((action, idx) => (
                                                <li key={idx}>{action}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
