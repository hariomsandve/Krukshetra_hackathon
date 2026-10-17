# Mentos — AI-Powered Adaptive Learning & Assessment Platform

> **Learn smarter. Practice continuously. Improve with personalized AI guidance.**

Mentos is an AI-powered adaptive learning and assessment platform designed to help students learn technical concepts, identify knowledge gaps, practice coding, track progress, and receive personalized guidance through text, voice, screen sharing, and repository-based code analysis.

The platform brings academic learning, technical skill development, coding assessments, AI mentorship, and progress tracking into one unified learning environment.

**Project status:** Prototype / Active Development

---

## Table of Contents

1. [Overview](#1-overview)
2. [Problem Statement](#2-problem-statement)
3. [Our Solution](#3-our-solution)
4. [Key Features](#4-key-features)
5. [Complete User Workflow](#5-complete-user-workflow)
6. [System Architecture](#6-system-architecture)
7. [Technology Stack](#7-technology-stack)
8. [Project Structure](#8-project-structure)
9. [Authentication and Role-Based Access](#9-authentication-and-role-based-access)
10. [AI Voice Tutor](#10-ai-voice-tutor)
11. [Screen Mentor and GitHub Integration](#11-screen-mentor-and-github-integration)
12. [Adaptive Learning Engine](#12-adaptive-learning-engine)
13. [Installation and Setup](#13-installation-and-setup)
14. [Environment Configuration](#14-environment-configuration)
15. [API Design](#15-api-design)
16. [Database Design](#16-database-design)
17. [Security and Privacy](#17-security-and-privacy)
18. [Testing](#18-testing)
19. [Deployment](#19-deployment)
20. [Current Limitations](#20-current-limitations)
21. [Future Enhancements](#21-future-enhancements)
22. [Contributing](#22-contributing)
23. [License](#23-license)

---

## 1. Overview

Mentos is designed to make learning more personalized, interactive, and practical.

Traditional learning platforms primarily provide predefined content and assessments. Mentos aims to go further by helping learners understand what they know, identify what they need to improve, and choose their next learning activity based on their progress.

Students can use Mentos to:

- Organize academic notes, tasks, and learning schedules.
- Explore personalized learning roadmaps.
- Practice programming and technical assessments.
- Identify weak concepts and knowledge gaps.
- Ask an AI tutor questions using text or voice.
- Share their screen for contextual assistance.
- Connect authorized GitHub repositories for code explanations and reviews.
- Track learning progress through dashboards.

Mentos is being developed as a modular platform where new learning tools can be added without rebuilding the entire application.

## 2. Problem Statement

Students often rely on multiple disconnected tools for notes, coding practice, project debugging, research, interview preparation, and progress tracking.

This creates several challenges:

- Learning paths may not adapt to individual skill levels.
- Students may not know which concept to study next.
- Generic AI responses may lack the context of the learner's actual code or screen.
- Coding assessments may focus on the final answer rather than the learner's understanding.
- Academic and technical progress can be difficult to monitor in one place.
- Students may struggle to get immediate, contextual explanations while working.

Mentos addresses these challenges through a unified adaptive learning and AI mentorship experience.

## 3. Our Solution

Mentos combines an adaptive learning experience with AI-powered assistance.

The platform is built around five core ideas:

1. **Personalized learning:** Recommend learning activities based on concept mastery and prerequisite relationships.
2. **Interactive mentorship:** Allow students to ask questions through text and voice.
3. **Context-aware assistance:** Analyze user-authorized screen captures and connected repository content.
4. **Practical assessment:** Evaluate coding submissions and help students understand their mistakes.
5. **Progress visibility:** Present learning history, weak concepts, roadmaps, and assessment performance.

The long-term objective is to create a learning companion that supports the learner throughout the journey, from understanding fundamental concepts to building projects and preparing for interviews.

## 4. Key Features

Feature availability depends on the current implementation. Planned or partially implemented modules should be verified in the repository before being presented as completed functionality.

### 4.1 Student Dashboard

- Centralized learning workspace.
- Academic and technical skill sections.
- Access to learning tools through the Master Operator.
- Learning activity and progress summaries.
- Entry points for AI mentorship and personalized roadmaps.

### 4.2 Master Operator

The Master Operator acts as the central launcher for Mentos.

Students can use it to discover and access the platform's learning modules without navigating through multiple unrelated pages.

### 4.3 Academic Learning

- **Academic Notes:** Organize and review study material.
- **Academic Progress Tracker:** Monitor academic learning progress.
- **Scheduling and Tasks:** Manage study plans, deadlines, and daily activities.
- **Deep Research:** Explore topics with AI-assisted research.
- **Guided Learning:** Follow structured, step-by-step explanations.
- **Academic Chat:** Ask questions and clarify difficult concepts.
- **Missed-Class Recovery:** Review missed topics and continue learning through relevant material and chat assistance.

### 4.4 Technical Skills Development

- **Path Monitor:** Track progress along a selected learning path.
- **Code Assessment:** Practice coding problems and evaluate submissions.
- **Data Analyzer:** Explore and analyze data.
- **VS Code Analyzer:** Get assistance with code and development errors.
- **Architecture Explainer:** Understand project architecture and component relationships.
- **Personalized Coding Language Learning:** Learn programming languages through guided practice.
- **Personalized Language Learning:** Practice language skills.
- **Personalized Mentor Tracker:** Track mentorship and learning activities.
- **Task Tracker:** Organize practical learning tasks.
- **Interview Preparation:** Practice technical interview questions.
- **Speaking Skills:** Improve communication and speaking confidence.
- **Creative Image:** Support visual learning and creative tasks.
- **Deep Research and Guided Learning:** Explore topics and learn through structured explanations.

### 4.5 Learning Roadmaps

Mentos is designed to support domain-specific roadmaps, such as:

- Java Development
- Web Development
- Python Programming
- Artificial Intelligence and Machine Learning
- Blockchain Development
- Other technical domains

A roadmap can organize a domain into stages, concepts, prerequisites, and recommended activities. Downloadable roadmap support depends on the current implementation.

### 4.6 AI Mentor

The AI mentor is intended to assist learners across different sections of the platform.

It can support:

- Concept explanations.
- Follow-up questions.
- Coding assistance.
- Learning recommendations.
- Voice-based interaction.
- Contextual guidance using supported screen or repository inputs.

### 4.7 Screen Mentor

Screen Mentor is designed to let a student share a screen, application window, or browser tab through the browser's native screen-sharing permission flow.

Potential workflows include:

- Explain a visible error.
- Understand code displayed in an IDE.
- Analyze a development workflow.
- Discuss a visible webpage or diagram.
- Ask follow-up questions about a shared screen.

Screen capture and AI analysis are separate operations: the student must explicitly initiate capture, and analysis must use an image or other context actually supplied to the AI.

### 4.8 GitHub Integration

The planned GitHub integration allows students to connect authorized repositories and obtain contextual assistance with their projects.

Intended capabilities include:

- Browse authorized repositories and branches.
- Inspect repository files.
- Understand project structure.
- Explain selected code.
- Identify potential bugs.
- Review code and suggest improvements.
- Discuss repository code alongside screen context.

The initial implementation should be read-only. Creating commits, pushing code, or changing repositories should not happen without an explicitly authorized workflow.

---

## 5. Complete User Workflow

### Step 1 — Open Mentos

The user opens the application and reaches the loading or landing experience.

### Step 2 — Sign In

The user authenticates using the configured Firebase Authentication flow.

### Step 3 — Resolve User Role

The backend verifies the user's Firebase identity and obtains the user's authorized role.

Supported role categories are:

- Student
- Teacher
- Trainer
- Evaluator
- Admin

The role assigned to a user must be trusted from server-side records or an authorized provisioning process, not from an arbitrary role value submitted by the frontend.

### Step 4 — Open the Dashboard

The authenticated user is directed to the appropriate dashboard based on permissions and the current implementation.

The student dashboard provides access to academic learning, skills development, roadmaps, assessments, and AI tools.

Teacher, trainer, evaluator, and administrator experiences depend on the corresponding modules being implemented.

### Step 5 — Select a Learning Activity

The student selects a feature from the Master Operator or the relevant dashboard section.

For example, the student may:

- Study an academic topic.
- Follow a Java learning roadmap.
- Complete a coding assessment.
- Ask a question through Academic Chat.
- Review a weak concept.
- Prepare for an interview.

### Step 6 — Receive Contextual Assistance

Where supported, the student can provide relevant context through:

- A text question.
- A voice interaction.
- An explicitly shared screen capture.
- Authorized GitHub repository content.
- An assessment submission.

The AI response should be based on the context actually received by the backend and model.

### Step 7 — Review Feedback

The student reviews explanations, assessment feedback, suggested improvements, or recommended learning activities.

### Step 8 — Track Progress

Assessment results and learning activity can contribute to the student's progress dashboard and future recommendations, provided the relevant persistence and adaptive-learning modules are implemented.

### Step 9 — Continue Learning

The student moves to another activity or asks follow-up questions without needing to restart the entire learning workflow.

---

## 6. System Architecture

Mentos follows a frontend–backend architecture.

```text
                     MENTOS PLATFORM
                            |
              +-------------+-------------+
              |                           |
        React Frontend              Firebase Auth
              |                           |
              |                     User Identity
              |                           |
              +-------------+-------------+
                            |
                     Authenticated API
                            |
                      FastAPI Backend
                            |
       +--------------------+--------------------+
       |                    |                    |
  Learning Modules      AI Services        Integration Layer
       |                    |                    |
       |               Gemini / Voice       GitHub API
       |               Supported AI         Repository Data
       |
       +--------------------+--------------------+
                            |
                       MongoDB Atlas
                            |
              Users, Learning Data, History,
              Assessments and Other Records
```

This is the intended logical architecture. Exact service boundaries and integrations must match the implementation in the repository.

### Frontend responsibilities

- Render the user interface.
- Manage navigation and feature state.
- Support authenticated API requests.
- Handle screen-sharing permission and preview.
- Display AI conversations and learning results.
- Provide clear loading, error, and permission states.

### Backend responsibilities

- Verify Firebase ID tokens.
- Enforce role-based permissions.
- Validate requests and uploaded content.
- Manage learning and assessment workflows.
- Connect to AI and third-party services.
- Access MongoDB Atlas.
- Protect credentials and enforce usage limits.

### Database responsibilities

MongoDB Atlas stores application records according to the implemented data model.

### AI responsibilities

AI services provide supported capabilities such as explanations, conversational assistance, voice interactions, and contextual code analysis.

AI-generated content must not automatically be treated as verified or authoritative.

---

## 7. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React | User interface |
| Language | TypeScript | Frontend type safety |
| Build tool | Vite | Development and production builds |
| Styling | Tailwind CSS | Responsive interface |
| Backend | Python, FastAPI | REST APIs and backend services |
| Database | MongoDB Atlas | Persistent application data |
| Authentication | Firebase Authentication | User identity |
| Backend identity verification | Firebase Admin SDK | Verify authenticated requests |
| Generative AI | Gemini API | AI assistance and supported multimodal features |
| Real-time voice | Gemini Live API, where configured | Low-latency voice interaction |
| Source control | Git and GitHub | Version control and repository integration |
| Code execution | Judge0 API, if configured | Sandboxed coding assessment |

**Note:** Judge0, GitHub App authentication, Gemini Live, and individual AI providers must be confirmed against the actual codebase and environment configuration before being described as operational.

---

## 8. Project Structure

The following is a logical reference structure. Preserve the existing repository layout and update this section to match the actual folders rather than moving files merely to match this example.

```text
mentos/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── learning/
│   │   ├── voice/
│   │   └── screen-mentor/
│   ├── data/
│   ├── services/
│   │   ├── api.js
│   │   ├── historyService.ts
│   │   └── voiceSocket.js
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   ├── auth/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── database/
│   ├── tests/
│   └── requirements.txt
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── ...
```

### Important directories

- `src/components/` — reusable UI components and feature interfaces.
- `src/services/` — frontend API clients, history services, and voice communication.
- `src/data/` — static data or mock data used by supported features.
- `backend/` — FastAPI application, API routes, authentication, integrations, and persistence.
- `backend/tests/` — automated backend tests, where configured.
- `.env.example` — documented environment-variable names with placeholder values.

The actual application may use a different organization. Inspect the repository before changing paths or adding duplicate services.

---

## 9. Authentication and Role-Based Access

Mentos uses Firebase Authentication for user identity and FastAPI for protected backend operations.

### Authentication flow

1. The user signs in through Firebase Authentication.
2. The frontend obtains a Firebase ID token.
3. The frontend sends the token with protected API requests.
4. FastAPI verifies the token using the Firebase Admin SDK.
5. The backend resolves the user's authorized role and permissions.
6. The backend grants or denies access to the requested resource.

Example request header:

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

### Role permissions

| Role | Intended responsibilities |
|---|---|
| Student | Access learning tools, assessments, personal history, and progress |
| Teacher | Access authorized teaching and student-support workflows |
| Trainer | Support assigned training and skill-development workflows |
| Evaluator | Access authorized evaluation and assessment records |
| Admin | Manage permitted platform-level operations |

These are intended responsibilities, not a claim that every role dashboard is complete.

**Security requirements:**

- Never trust a role supplied only by the frontend.
- Protect backend routes using server-side authorization checks.
- Restrict users to their own data unless sharing is explicitly authorized.
- Return appropriate `401 Unauthorized` and `403 Forbidden` responses.
- Never expose Firebase Admin credentials in frontend code.

---

## 10. AI Voice Tutor

The AI Voice Tutor is intended to provide conversational learning assistance without requiring the student to type every question.

### Intended workflow

1. The student opens the voice assistant.
2. The browser requests microphone access when necessary.
3. The audio session connects to the configured backend/provider workflow.
4. The student speaks naturally.
5. Supported transcription events appear in the conversation.
6. The AI processes the user's question.
7. The assistant responds through text and/or audio.
8. The student can ask a follow-up question.
9. The session ends when the student explicitly closes it.

### Voice interaction requirements

- Clear listening, processing, speaking, and error indicators.
- Responsive end-of-speech detection.
- Incremental transcription and audio streaming where supported.
- Multi-turn conversation handling.
- Microphone mute and session-ending controls.
- Cleanup of audio tracks and WebSocket resources.
- Clear handling of network, authentication, and provider quota errors.

The exact implementation depends on the configured Gemini SDK, model, and session protocol. Automatic activity detection and explicit activity controls must not be used in conflicting modes.

### Voice privacy

Microphone access must be permission-based. Raw audio should not be persisted by default unless an explicit, documented feature requires it.

---

## 11. Screen Mentor and GitHub Integration

Screen Mentor is intended to combine a user's visible development environment with authorized repository context.

### Screen-sharing workflow

1. The user opens Screen Mentor.
2. The user clicks **Share Screen**.
3. The browser displays its native screen, window, or tab picker.
4. The user selects what to share.
5. Mentos displays the permitted preview and sharing status.
6. The user requests analysis or asks a question.
7. The application sends an appropriate captured frame and question to the backend.
8. The backend calls the configured AI service.
9. The assistant returns an explanation or suggested next step.
10. The user can stop sharing at any time.

Screen capture should use the browser's supported `getDisplayMedia()` API and run in a secure context, such as HTTPS or localhost.

The application must handle permission denial, unsupported browsers, stopped sharing tracks, and component cleanup.

**Important:** Browser screen sharing does not grant unrestricted access to the user's computer. Mentos must not silently capture screens or bypass the browser's permission controls.

### GitHub workflow

1. The user selects **Connect GitHub**.
2. The user authorizes the configured integration.
3. The backend associates the authorization with the authenticated user.
4. The user selects an authorized repository and branch.
5. Mentos retrieves permitted repository metadata and source content.
6. The student asks a question about the repository.
7. The AI analyzes the available context and returns an explanation or review.

### GitHub security requirements

- Prefer a GitHub App or another supported authorization mechanism with least-privilege permissions.
- Keep access tokens on the backend.
- Encrypt sensitive credentials at rest where they are persisted.
- Respect repository access permissions and API rate limits.
- Allow disconnection and authorization revocation.
- Do not expose private repository contents to other users.
- Start with read-only repository analysis.
- Never commit, push, or modify source code without an explicit authorized workflow.

### Combined screen and repository assistance

A typical workflow might be:

> A student shares a VS Code window, connects a GitHub repository, and asks why a particular function is failing. Mentos analyzes the latest permitted screen capture and the relevant authorized source files, then explains the likely cause and suggests debugging steps.

The assistant must distinguish information visible in the captured image from source code actually retrieved from GitHub. It should not claim to have inspected a file or observed a screen change unless that content was supplied to it.

---

## 12. Adaptive Learning Engine

Mentos aims to move beyond fixed learning sequences through a concept-based adaptive learning system.

### Concept map

A learning domain can be represented as a graph of concepts and prerequisite relationships.

For example:

```text
Java Fundamentals
        |
        v
Object-Oriented Programming
        |
        v
Collections Framework
        |
        v
Data Structures and Algorithms
        |
        v
Advanced Problem Solving
```

A concept should become eligible for recommendation when its required prerequisites are sufficiently mastered according to the configured rules.

### Mastery estimation

The platform can estimate a learner's mastery using assessment outcomes and learning history.

A future or implemented mastery model may consider:

- Correct and incorrect answers.
- Assessment difficulty.
- Repeated attempts.
- Performance across related concepts.
- Prerequisite mastery.
- Evidence from coding assessments.

The selected model must be documented accurately. Do not claim that a specific Bayesian Knowledge Tracing (BKT) or machine-learning model is implemented unless the code confirms it.

### Recommendation process

An intended recommendation workflow is:

1. Retrieve the learner's available concept and assessment history.
2. Estimate mastery for relevant concepts.
3. Identify concepts whose prerequisites are satisfied.
4. Find weak or insufficiently practiced eligible concepts.
5. Recommend a suitable next question or learning activity.
6. Record the outcome for future recommendations.

### Explainable feedback

Recommendations should ideally explain why a concept or activity was selected.

For example:

> “Review Java Collections because recent assessments show difficulty distinguishing lists from sets.”

The recommendation must be grounded in actual recorded results rather than invented student history.

### Coding assessments

Where implemented, coding assessments should support appropriate validation and sandboxed execution.

Security requirements include:

- Isolated execution environments.
- Execution timeouts and memory limits.
- Restricted filesystem and network access.
- Input and output validation.
- Protection of hidden test cases.
- Per-user execution limits.

Executing untrusted student code directly inside the main FastAPI process is not safe.

---

## 13. Installation and Setup

### Prerequisites

Install or configure:

- Node.js and npm.
- Python compatible with the backend dependencies.
- MongoDB Atlas access.
- A Firebase project with Authentication enabled.
- Gemini API access for the AI features being used.
- Git and a GitHub account.
- Judge0 access if coding execution is enabled.

### Step 1 — Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

Replace the placeholders with the actual repository URL and directory name.

### Step 2 — Install frontend dependencies

From the project root, if it contains `package.json`:

```bash
npm install
```

Start the development server using the script defined in `package.json`:

```bash
npm run dev
```

Vite commonly serves the frontend at `http://localhost:5173`, but use the actual URL printed by your terminal.

### Step 3 — Set up the backend

Open a separate terminal and navigate to the actual backend directory.

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows Command Prompt:

```bat
.venv\Scripts\activate.bat
```

macOS or Linux:

```bash
source .venv/bin/activate
```

Install the dependencies using the dependency file that actually exists in the repository. If it contains `requirements.txt`:

```bash
pip install -r requirements.txt
```

Start the backend using the actual FastAPI application import path. For example, if the entry point is `app.main:app`:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If your existing backend uses a different entry point, use that instead.

When available, the FastAPI documentation is typically accessible at:

```text
http://127.0.0.1:8000/docs
```

### Step 4 — Configure MongoDB Atlas

1. Create or open your MongoDB Atlas project.
2. Create a database user with an appropriate password.
3. Configure network access for your development environment.
4. Copy the database connection string.
5. Store it in the backend environment configuration.
6. Confirm the backend connects successfully.

Do not commit your database credentials or unrestricted network-access settings.

### Step 5 — Configure Firebase

1. Create or select your Firebase project.
2. Enable the authentication provider used by the application.
3. Configure the frontend Firebase client.
4. Configure Firebase Admin SDK credentials securely on the backend.
5. Verify that protected API requests reject missing or invalid ID tokens.
6. Configure authorized user roles through a trusted server-side process.

### Step 6 — Configure AI services

Set the required server-side AI credentials and model settings.

Verify the configured provider, SDK version, model name, and supported streaming features before enabling voice or multimodal workflows.

### Step 7 — Start both services

Run the frontend and backend in separate terminals.

Confirm:

- The frontend loads.
- Firebase sign-in works.
- The backend starts without configuration errors.
- MongoDB Atlas connectivity succeeds.
- Protected API requests authenticate correctly.
- AI functionality works with valid server-side credentials.

---

## 14. Environment Configuration

Create environment files locally using the variable names required by the existing codebase. The following is an illustrative template, not a guarantee that every variable already exists.

### Frontend environment

Example `.env.example`:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000

VITE_FIREBASE_API_KEY=replace_with_firebase_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=replace_with_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=replace_with_firebase_project_id
VITE_FIREBASE_APP_ID=replace_with_firebase_app_id
```

Only public Firebase web configuration should be exposed through frontend variables. Never place Firebase Admin credentials, Gemini secrets, Groq secrets, or GitHub access tokens in `VITE_*` variables.

### Backend environment

Example backend `.env.example`:

```dotenv
APP_ENV=development
HOST=127.0.0.1
PORT=8000

MONGODB_URI=replace_with_mongodb_atlas_connection_string
MONGODB_DATABASE=mentos

FIREBASE_PROJECT_ID=replace_with_firebase_project_id
GOOGLE_APPLICATION_CREDENTIALS=path_to_secure_firebase_admin_credentials

GEMINI_API_KEY=replace_with_server_side_gemini_api_key
GEMINI_MODEL=replace_with_supported_model_name

GITHUB_APP_ID=replace_with_github_app_id
GITHUB_PRIVATE_KEY_PATH=path_to_secure_private_key
GITHUB_CALLBACK_URL=http://localhost:8000/api/github/callback
```

Add only variables that the implementation actually uses. If the project uses another supported Firebase credential mechanism, follow its existing setup instead of forcing this example.

If Groq or Judge0 is configured, document its required variables separately and only when they are present in the actual application.

### Environment-variable rules

- Keep `.env` files out of version control.
- Commit placeholder values only in `.env.example`.
- Validate required settings when the backend starts.
- Rotate any credential accidentally exposed in a screenshot, commit, or public repository.
- Never print secret values in logs or error messages.

---

## 15. API Design

The exact endpoints must be documented from the existing FastAPI routes. The following table describes the intended API areas, not verified endpoint names.

| API area | Intended purpose |
|---|---|
| Authentication | Verify identity and authorize protected operations |
| User profile | Retrieve permitted user information |
| Learning | Access learning content and guided activities |
| Progress | Retrieve and update permitted learning records |
| Assessments | Submit answers and retrieve results |
| AI chat | Process text-based learning questions |
| Voice | Manage supported real-time voice sessions |
| Screen Mentor | Submit authorized screen captures for analysis |
| GitHub | Connect authorization and browse permitted repositories |
| History | Retrieve permitted conversation or activity history |

### Example protected request

```http
POST /api/ai/chat
Authorization: Bearer <FIREBASE_ID_TOKEN>
Content-Type: application/json
```

Illustrative request body:

```json
{
  "message": "Explain the difference between an ArrayList and a HashSet."
}
```

The actual route and request schema must match the backend implementation.

### API implementation requirements

- Use Pydantic models to validate request data.
- Verify Firebase ID tokens on protected endpoints.
- Enforce role and resource-level authorization.
- Apply request-size limits.
- Return consistent HTTP status codes and error responses.
- Add timeouts and bounded retries for external services.
- Avoid returning secrets or internal stack traces to clients.
- Document implemented routes using FastAPI's OpenAPI documentation.

---

## 16. Database Design

Mentos uses MongoDB Atlas as its intended primary application database.

Possible logical collections include:

| Collection | Purpose |
|---|---|
| `users` | User profile, role reference, and preferences |
| `learning_progress` | Concept mastery and progress records |
| `assessments` | Assessment metadata and permitted results |
| `learning_activities` | Activity history and recommendations |
| `conversations` | Persisted chat history, where enabled |
| `roadmaps` | Learning paths and concept relationships |
| `github_connections` | Authorized integration metadata |
| `screen_sessions` | Screen-session metadata, if persistence is needed |

These are suggested logical collections. The actual collection names and schemas must follow the existing database implementation.

### Data-handling principles

- Associate records with authenticated user identities.
- Restrict access to personal learning data.
- Store only information necessary for the feature.
- Avoid persisting raw screen captures or audio by default.
- Never store plaintext provider credentials in ordinary user documents.
- Use indexes for frequently queried fields where appropriate.
- Validate document structure at application boundaries.

---

## 17. Security and Privacy

Security is essential because Mentos may process private source code, voice input, screen content, and student performance records.

### Authentication and authorization

- Verify Firebase ID tokens on the backend.
- Enforce server-side role-based access control.
- Apply resource-level permissions.
- Protect private learning and repository data.

### API and integration security

- Keep AI credentials on the server.
- Validate request bodies and uploads.
- Apply rate limits and request-size restrictions.
- Use HTTPS in deployed environments.
- Handle third-party failures without exposing sensitive information.
- Restrict GitHub integration to explicitly authorized repositories and permissions.

### Screen-sharing privacy

- Use the browser's native sharing permission flow.
- Show a clear sharing indicator.
- Allow users to stop sharing.
- Avoid unnecessary capture or persistence.
- Analyze only content intentionally submitted for processing.
- Do not claim to continuously observe the screen if only occasional screenshots are analyzed.

### AI safety and reliability

- Treat AI responses as assistance, not guaranteed truth.
- Ask users to verify important code changes and explanations.
- Do not automatically classify a learner as cheating based on a single signal.
- Explain uncertainty where the available context is insufficient.
- Avoid logging raw audio, private code, tokens, or unnecessary sensitive data.

---

## 18. Testing

Testing should cover individual services as well as complete user workflows.

### Frontend tests

- Dashboard and feature navigation.
- Loading, empty, and error states.
- Login and logout behaviour.
- Screen-sharing permission denial and stop controls.
- Voice state transitions.
- Responsive layout and keyboard accessibility.

### Backend tests

- Firebase token verification.
- Role and resource-level authorization.
- Request validation.
- MongoDB connectivity and persistence.
- AI service error handling.
- GitHub authorization and repository permissions.
- Screen-analysis request limits.

### Integration tests

- Authenticated user requests a learning explanation.
- Student submits an assessment and receives feedback.
- Voice session handles multiple consecutive turns.
- Screen Mentor analyzes a deliberately selected capture.
- GitHub integration retrieves only authorized repository data.
- User disconnects GitHub or ends a voice/screen session.
- Invalid tokens, provider quotas, and network failures produce appropriate errors.

### Example test commands

Run only commands supported by the current repository. Examples include:

```bash
npm run build
```

```bash
pytest
```

If tests are not configured, add an appropriate test setup before treating these commands as mandatory.

A successful build is not proof that the complete voice, screen-sharing, GitHub, or AI workflow works. Browser permission flows and real provider integrations may also require manual testing.

---

## 19. Deployment

Mentos requires separate deployment configuration for its frontend and backend, plus secure external services.

### Frontend deployment

The React/Vite frontend can be deployed to a suitable static frontend hosting provider.

Typical process:

1. Configure production environment variables.
2. Build the frontend.
3. Deploy the generated build directory.
4. Configure the frontend domain and routing.
5. Update Firebase authorized domains.
6. Point the frontend API URL to the deployed backend.

Typical build command:

```bash
npm run build
```

The build output is commonly written to `dist/`.

### Backend deployment

Deploy FastAPI to a Python-compatible hosting environment.

Configure:

- Production environment variables.
- MongoDB Atlas connectivity.
- Firebase Admin credentials.
- AI provider credentials.
- CORS allowlist for the production frontend.
- HTTPS and appropriate request limits.
- Logging, monitoring, and health checks.

Do not assume that a local `.env` file will automatically be available in production.

### Screen-sharing requirements

Screen sharing should run in a supported browser and secure context. Production deployments should use HTTPS.

### GitHub integration requirements

Configure the actual GitHub App or OAuth callback URL, allowed permissions, and production secrets. Never reuse development private keys or expose integration tokens to the browser.

### Production checklist

- [ ] Frontend production build succeeds.
- [ ] Backend starts with production configuration.
- [ ] MongoDB Atlas is accessible.
- [ ] Firebase authentication works on the production domain.
- [ ] Protected APIs reject unauthorized requests.
- [ ] CORS allows only required origins.
- [ ] AI credentials remain server-side.
- [ ] GitHub permissions and callback URLs are correct.
- [ ] Voice and screen-sharing workflows are manually tested.
- [ ] Logs do not expose secrets or unnecessary private content.

---

## 20. Current Limitations

Mentos is an evolving prototype. Its capabilities depend on which modules are fully implemented, integrated, and tested.

Potential limitations include:

- Some dashboard modules may still use mock data.
- Adaptive recommendations require reliable assessment history and a defined mastery model.
- AI-generated explanations may be incomplete or incorrect.
- Real-time voice latency depends on the network, provider, SDK, and model configuration.
- Screen sharing does not automatically mean continuous video understanding; image analysis may occur only when a frame is explicitly submitted.
- GitHub analysis requires successful authorization and repository permissions.
- Code execution requires a properly isolated sandbox.
- Teacher, trainer, evaluator, and admin workflows may require additional implementation.
- Performance, recommendation quality, and learning outcomes must be evaluated before making quantitative effectiveness claims.

A feature should be marked complete only after its actual workflow has been implemented and tested.

---

## 21. Future Enhancements

Potential improvements include:

- More robust concept-mastery estimation.
- Better explainable learning recommendations.
- Additional assessment types and programming languages.
- Secure coding labs and repository-based project reviews.
- More detailed teacher and trainer dashboards.
- Personalized interview simulations.
- Better voice interruption and end-of-speech handling.
- Optional, privacy-preserving screen-context history.
- Learning analytics and progress reports.
- Accessibility and multilingual learning improvements.
- Docker-based development and deployment.
- Monitoring, automated tests, and CI/CD pipelines.

These are roadmap ideas, not claims of existing functionality.

---

## 22. Contributing

Contributions should preserve the existing stack and follow the project's security requirements.

1. Review the current repository structure and implementation.
2. Create a separate branch for your change.
3. Keep changes focused on a specific feature or bug.
4. Avoid introducing duplicate services or unnecessary dependencies.
5. Add or update tests for changed behaviour.
6. Never commit API keys, database passwords, private keys, or personal data.
7. Run the available build and test commands.
8. Submit a pull request explaining the change and its verification.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add: describe your change"
git push origin feature/your-feature
```

Review staged files before committing, especially environment files and generated artifacts.

---

## 23. License

Add the project's chosen license before distributing or accepting contributions. Until a license is selected and included in the repository, do not assume that others have permission to reuse or redistribute the code.

---

## Project Vision

Mentos aims to become a unified AI-powered learning companion that connects personalized learning, practical assessments, project development, and contextual mentorship in one environment.

**The goal is not just to help students find answers, but to help them understand concepts, identify weaknesses, practice deliberately, and become independent problem-solvers.**

