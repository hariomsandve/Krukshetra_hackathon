# AdaptIQ — Adaptive Learning & Assessment Portal

> **Hackathon Track:** Problem Statement 2 (PS-2)  
> **Team:** Krukshetra  
> **Branch:** `parth`

---

## 🎯 Problem Statement Context (PS-2)
Traditional educational platforms enforce a static, one-size-fits-all approach to instructional content and assessments. Every student receives identical questions and curricula regardless of their prior knowledge, learning velocity, or foundational gaps.

- **Students** struggle to diagnose exact weak sub-topics and get demotivated by mismatched difficulty.
- **Trainers** lack granular, cohort-wide telemetry on knowledge gaps and learning velocity.
- **Evaluators** lack verifiable qualitative evidence of student understanding beyond rote multiple-choice scores.

---

## 💡 The AdaptIQ Solution & Core Differentiation

AdaptIQ demonstrates the **complete closed-loop adaptive learning cycle**:

```
 ┌───────────────┐
 │  1. ASSESS    │ ──► Dynamic diagnostic tests with real-time branching
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │ 2. IDENTIFY   │ ──► Pinpoints specific knowledge gaps (e.g., Tabulation in DP)
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │ 3. RECOMMEND  │ ──► Recommends scaffolded remedial modules & targeted drills
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │  4. REASSESS  │ ──► Dynamically escalates difficulty as accuracy improves
 └───────┬───────┘
         ▼
 ┌───────────────┐
 │  5. TRACK     │ ──► Quantifies net proficiency delta & updates evaluator records
 └───────────────┘
```

---

## 🚀 Key Features Demonstrated

### 1. 🎓 Student Experience
- **Personalized Dashboard:** Live mastery index (74%), enrolled curricula, 14-day streak, flagged knowledge gaps.
- **Adaptive Diagnostic Quizzes:** Dynamic branching engine that scales questions (Easy ↔ Medium ↔ Hard) based on real-time answer accuracy.
- **Interactive Coding Challenges:** Code workspace with test case validation runner (4/4 test cases pass with execution benchmarks).
- **Explain-Your-Code Proofs:** Dedicated qualitative submission portal where students justify their algorithmic choices, derive Time/Space complexities, and detail edge-case protections.
- **AI-Powered Rubric Feedback:** Instant multi-dimensional evaluation (Clarity, Complexity Derivation, Edge Cases).

### 2. 👨‍🏫 Trainer Command Center
- **Cohort Mastery Analytics:** Real-time distribution across 142 students in the Alpha Cohort.
- **Systemic Gap Heatmap:** Identifies high-risk topics (e.g., 48% cohort struggling on Dynamic Programming).
- **Automated Remedial Actions:** Directly assigns targeted scaffolded drills to struggling students.
- **Curriculum Management:** Track module completion and syllabus progression.

### 3. ⚖️ Evaluator Verification Portal
- **Submission Audit Queue:** In-depth review queue for student code and explanation essays.
- **Multi-Factor Rubric Scoring:** Sliders for Algorithmic Clarity (30 pts), Complexity Proof (35 pts), and Edge Case Handling (35 pts).
- **Signed Audit Log:** Qualitative commentary and grade authorization for hackathon and accreditation standards.

### 4. 📊 Topic Telemetry & Analytics
- **Recharts Competency Radar Matrix:** Multi-axial comparison against cohort benchmarks.
- **Mastery Bar Charts:** Topic-wise proficiency bars relative to the 70% threshold.
- **Learning Velocity Curve:** Longitudinal progression demonstrating mastery recovery post-intervention.
- **Adaptive Difficulty Accuracy:** Empirical breakdown of Easy vs. Medium vs. Hard success rates.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Custom Design System (Indigo / Slate palette)
- **Routing:** React Router v7
- **Data Visualization:** Recharts
- **Iconography:** Lucide React
- **Architecture:** Modular components, layouts, custom context state store, realistic mock data

---

## 🏃 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/hariomsandve/Krukshetra_hackathon.git
cd Krukshetra_hackathon

# 2. Switch to branch
git checkout parth

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will run at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🎭 Persona Switcher (For Judges)

Use the top navigation bar's **Persona Switcher** to seamlessly evaluate all 3 stakeholder experiences without logging in or clearing cookies:
- **Student View (Alex Rivera):** Take adaptive quizzes, solve coding challenges, explain algorithms.
- **Trainer View (Dr. Sarah Chen):** Review cohort knowledge gaps and assign remedial drills.
- **Evaluator View (Marcus Vance):** Grade qualitative submissions using the 100-point rubric.
- **Reset Demo:** Click the "Reset Demo" button in the header at any time to restore the baseline state.

---

## 📁 Modular Directory Structure

```
src/
├── components/
│   ├── common/             # Reusable UI (Badge, ProgressBar, StatCard, AdaptiveCycleTracker)
│   └── layout/             # Navbar with persona toggle, Sidebar, PageHeader
├── context/
│   └── AppContext.tsx      # Central reactive store (roles, mastery telemetry, submissions)
├── data/
│   └── mockData.ts         # Realistic mock data (students, courses, quizzes, submissions)
├── pages/
│   ├── student/            # Dashboard, Adaptive Cycle Loop, Assessments, Coding, Explain Code
│   ├── trainer/            # Cohort Telemetry, Weak Topics, Curricula Management
│   ├── evaluator/          # Evaluation Queue, Rubric Scoring, Assessed Archive
│   └── analytics/          # Recharts visualizations (Radar, Bar, Velocity Area)
├── routes/
│   └── AppRoutes.tsx       # Route definitions
├── types/
│   └── index.ts            # TypeScript data contracts & models
├── App.tsx                 # App entry layout & mobile drawer
├── index.css               # Design tokens & Tailwind directives
└── main.tsx                # React DOM mount
```

---
*Built with passion for the Krukshetra Hackathon — PS-2: Adaptive Learning and Assessment Portal.*
