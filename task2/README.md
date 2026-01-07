# Fynd Task 2: Two-Dashboard AI Feedback System

A production-ready web application with separate user submission and admin analytics dashboards, powered by Gemini AI.

## Dashboards
- **User Dashboard** (`/user`): Public-facing interface for submitting reviews with AI-generated responses.
- **Admin Dashboard** (`/admin`): Internal analytics with real-time updates and AI-powered insights.

## Prerequisites
1. **MongoDB Atlas Account**: You need a MongoDB connection string.
2. **Groq API Key**: You need an API key from Groq Console.
3. **Vercel Account**: For deployment.

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Rename `.env.local` (or create one) and add your keys:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   GROQ_API_KEY=your_groq_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Dashboards**
   - User: http://localhost:3000/user
   - Admin: http://localhost:3000/admin

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Add the environment variables in Vercel Project Settings:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy!

## Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB (with connection pooling)
- **AI**: Google Gemini Pro (via API)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
