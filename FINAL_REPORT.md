# Final Project Report - Fynd AI Assessment
**Google drive PDF link**: https://drive.google.com/file/d/151nTes6rww3A6cDHaLUTkCtjVxvlSdXn/view?usp=sharing

**Author**: Aish Sinha
**Date**: January 7, 2026

---

## 📋 Executive Summary
This report documents the successful completion of both tasks for the Fynd AI Assessment.
1.  **Task 1 (Prompt Engineering)**: Developed and evaluated 4 prompting strategies on 200 Yelp reviews using Groq (Llama 3.3). The Chain-of-Thought approach achieved the highest accuracy (70.15%).
2.  **Task 2 (AI Feedback System)**: Built and deployed a production-grade web application with User and Admin dashboards, integrated with MongoDB Atlas and Groq API.

---

# Part 1: Prompt Engineering (Task 1)

## 1.1 Methodology
We evaluated four distinct prompting approaches to predict star ratings (1-5) from review text:
1.  **Zero-Shot**: Direct prediction without examples.
2.  **Few-Shot**: Provided 3 diverse examples (positive, mixed, negative).
3.  **Chain-of-Thought (CoT)**: Required step-by-step reasoning before rating.
4.  **Hybrid**: Combined Few-Shot, CoT, and explicit scoring criteria.

**Dataset**: 200 balanced Yelp reviews (40 per star rating).
**Model**: Llama 3.3 70B Versatile via Groq API.

## 1.2 Results Summary

| Approach | Exact Accuracy | Off-by-1 Accuracy | Cohen's Kappa |
|----------|---------------|-------------------|---------------|
| **Chain-of-Thought** | **70.15%** 🏆 | **100.00%** | **0.628** |
| Zero-Shot Direct | 65.88% | 98.82% | 0.571 |
| Few-Shot | 65.08% | 100.00% | 0.559 |
| Hybrid | 54.55% | 100.00% | 0.433 |

**Key Finding**: The **Chain-of-Thought** approach significantly outperformed others, demonstrating that forcing the model to reason about positive/negative aspects before scoring leads to better alignment with human ratings. The Hybrid approach underperformed likely due to prompt complexity confusing the output format.

## 1.3 Visualization
The following chart compares the accuracy and reliability of each approach:

![Prompt Comparison Results](Fynd%20Task1/prompt_comparison_results.png)

---

# Part 2: Two-Dashboard AI Feedback System (Task 2)

## 2.1 System Overview
A robust feedback management system designed to collect user reviews and provide actionable insights for administrators.

**Live Deployment URLs**:
- **User Dashboard** (Submission): `https://fynd-submission.vercel.app/user`
- **Admin Dashboard** (Analytics): `https://fynd-submission.vercel.app/admin`

## 2.2 System Architecture
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas (Persistent storage)
- **AI Integration**: Groq API (Llama 3 8B) for 0.7s latency
- **Styling**: Tailwind CSS for modern, responsive UI

### Data Flow
1.  **Submission**: User submits a review → API validates input.
2.  **Immediate Response**: AI generates a personalized "Thank Your" message in <1s.
3.  **Async Analysis**: Review is stored in MongoDB. A background process analyzes sentiment, generates a summary, and suggests 3 actionable steps.
4.  **Admin View**: Dashboard live-polls MongoDB to show updated stats and analysis.

## 2.3 Features Implemented

### User Dashboard
- Interactive 5-star rating component.
- Real-time character counter and validation.
- Instant AI-generated response card (e.g., "We're sorry you had a bad experience with the service...").

### Admin Dashboard
- **Live Analytics**: Total Reviews, Average Rating, Rating Distribution Chart.
- **AI Insights**:
    - One-line summary of every review.
    - "Recommended Actions" (e.g., "Investigate delivery delays", "Reward staff member John").
- **Filtering**: Filter reviews by star rating.
- **Auto-Refresh**: Toggleable live updates every 5 seconds.

## 2.4 Challenges & Solutions
- **Challenge**: Vercel Serverless Function timeouts.
    - *Solution*: Decoupled the complex "Analysis" step from the user submission. The user gets an instant response, while the heavy analysis happens asynchronously.
- **Challenge**: MongoDB SSL Errors on Vercel.
    - *Solution*: Whitelisted `0.0.0.0/0` on Atlas and upgraded connection logic to use `ServerApiVersion.v1`.
- **Challenge**: Formatting AI Outputs.
    - *Solution*: Used strict JSON schema enforcement in prompt engineering to ensure the Admin Dashboard never breaks due to malformed AI responses.

---

## 3. Conclusion
The project successfully meets all requirements:
- ✅ **Scalable Architecture**: Next.js + MongoDB is production-ready.
- ✅ **Smart Integration**: Fast, effective use of Groq API for both user interaction and backend analytics.
- ✅ **Data-Driven**: Task 1 proved that "Chain-of-Thought" is the optimal strategy for rating prediction, justifying its use in future iterations of the feedback analyzer.
