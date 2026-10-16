# Adaptive Learning and Assessment Portal 🎓

**Personalized Learning. Adaptive Assessments. Measurable Progress.**

The Adaptive Learning and Assessment Portal is an educational platform designed to personalize the learning experience based on a student's performance, knowledge gaps, and learning progress.

The platform aims to help students learn at their own pace while enabling trainers and evaluators to assess understanding through quizzes, coding challenges, and performance analytics.

## 🚀 Problem Statement

Traditional learning platforms often provide the same learning content and assessments to every student, regardless of their current knowledge or individual learning needs.

Students may struggle to identify their knowledge gaps, while trainers may find it difficult to track individual progress and determine whether students genuinely understand the concepts they have studied.

## 💡 Our Solution

The platform aims to create a personalized learning and assessment environment where learning recommendations and assessment difficulty can adapt to student performance.

It also aims to provide evidence of student understanding through assessment results, coding submissions, and explain-your-code activities.

## ✨ Key Features

### 👨‍🎓 Student Portal
- Personalized student dashboard.
- Access to learning materials and topic-wise modules.
- Adaptive quizzes and assessments.
- Coding challenges with automated evaluation.
- Progress tracking and identification of knowledge gaps.
- Recommendations for topics that need improvement.
- Assessment history and performance reports.

### 👨‍🏫 Trainer Portal
- Create and manage courses and learning modules.
- Upload learning resources and assessment questions.
- Configure quizzes and coding challenges.
- Monitor student performance and topic-wise progress.
- Identify concepts where students commonly struggle.

### 🧑‍⚖️ Evaluator Portal
- Review assessment submissions.
- Evaluate coding solutions and explanations.
- Inspect assessment history and relevant activity records.
- Compare demonstrated performance across learning objectives.

### 🧠 Adaptive Learning Engine
- Analyze student assessment performance.
- Identify weak and strong topics.
- Recommend suitable learning resources.
- Adjust subsequent question difficulty based on performance.
- Track progress as students practice and improve.

### 💻 Coding Assessment
- Support programming challenges.
- Execute submitted code in a controlled

## Voice Coding Mentor

The coding workspace uses Monaco Editor diagnostics when available and can also
accept output copied from an existing compiler or runner. It does not execute
student code. No code runner or isolated execution service exists in this
repository; use a separate sandboxed runner with time, memory, filesystem, and
network restrictions before enabling code execution.

### Setup

1. Install Node.js 20.19+ and Python 3.10+.
2. Install frontend packages with `npm install`, then start the portal with
   `npm run dev`.
3. Install backend packages with `python -m pip install -r backend/requirements.txt`.
4. If `backend/.env` does not exist, copy `backend/.env.example` to create it.
   Otherwise, preserve the existing file and add only the missing variable
   names. Set `GEMINI_API_KEY` on the backend and `FRONTEND_ORIGINS` to the
   exact frontend origin. The optional `GEMINI_MODEL` defaults to
   `gemini-2.5-flash`.
5. Start the API from the repository root with
   `python -m uvicorn main:app --app-dir backend --reload`.
6. Run the backend unit tests from the repository root with
   `python -m unittest backend.test_mentor`.

The frontend sends requests to `http://localhost:8000` by default. Set
`VITE_API_BASE_URL` in a local frontend `.env.local` to change it. The backend
limits request sizes, supports a fixed language list, and does not save mentor
events or open a MongoDB connection. The existing MongoDB test script and
portal page sources are retained unchanged.

The hint endpoint is not connected to an authentication system because this
repository contains none. Before public deployment, protect it with the
portal's authentication and server-side rate limiting. CORS is not
authentication. Student code and diagnostics are sent to Gemini when a hint is
requested; review the provider's data handling requirements before use.
