# Fynd Task 2: Two-Dashboard AI Feedback System Report

## 1. Project Overview
This project serves as a comprehensive feedback management solution featuring two distinct interfaces: a public-facing User Dashboard for submitting reviews and an internal Admin Dashboard for analyzing feedback. The system leverages Groq's LLM capabilities to provide real-time, personalized responses to users and actionable insights for administrators.

## 2. System Architecture

### 2.1 Technology Stack
- **Frontend/Backend**: Next.js 14 (App Router)
- **Database**: MongoDB Atlas
- **AI Integration**: Groq API (llama3-8b-8192)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts

### 2.2 Data Flow
1. **User Submission**: User submits rating/review via `/user`.
2. **Analysis**: 
   - Backend immediately calls Groq API to generate a personalized response.
   - Review is stored in MongoDB.
   - Background process (triggered on Admin load) analyzes review for summary & actions.
3. **Admin View**: Admin dashboard fetches data from MongoDB and displays analytics.

## 3. Implementation Details

### User Dashboard
- **URL**: [Your Vercel Deployment URL]
- **Features**:
  - Interactive 5-star rating component.
  - Character-limited text area (max 2000 chars).
  - Immediate AI feedback upon submission.
  - Form validation handling empty reviews.

### Admin Dashboard
- **URL**: [Your Vercel Deployment URL]/admin
- **Features**:
  - Real-time statistics (Total Reviews, Average Rating).
  - Rating distribution bar chart.
  - Auto-refreshing list of reviews.
  - AI-generated summaries and recommended actions for each review.
  - Filtering capabilities.

### AI Integration
- **Platform**: Groq (Llama 3 8B)
- **Server-Side Execution**: All AI calls occur in `lib/groq.js` on the server, ensuring API key security.
- **Fallbacks**: Robust error handling provides default responses if the AI service is unavailable.

## 4. Challenges & Solutions
- **Real-time Analysis**: To ensure the user interface remains responsive, complex analysis (summary/actions) is decoupled from the initial submission response.
- **Data Persistence**: MongoDB connection pooling was implemented to handle serverless environment constraints efficiently.

## 5. Deployment
The application is designed for Vercel deployment.
- **Environment Variables**:
  - `MONGODB_URI`: Persistent database connection.
  - `GROQ_API_KEY`: AI service authentication.
  - `NEXT_PUBLIC_APP_URL`: Base URL for API calls.

## 6. Repository Contents
- **`app/`**: Application source code.
- **`lib/`**: Utility libraries for DB and AI.
- **`prompt_engineering.ipynb`**: Documentation of prompt testing logic.
