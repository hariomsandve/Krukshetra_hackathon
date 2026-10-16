import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { AdaptiveLearningPage } from '../pages/student/AdaptiveLearningPage';
import { AssessmentsPage } from '../pages/student/AssessmentsPage';
import { CodingChallengePage } from '../pages/student/CodingChallengePage';
import { ExplainCodePage } from '../pages/student/ExplainCodePage';
import { TrainerDashboard } from '../pages/trainer/TrainerDashboard';
import { EvaluatorDashboard } from '../pages/evaluator/EvaluatorDashboard';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Student Routes */}
      <Route path="/" element={<StudentDashboard />} />
      <Route path="/adaptive-cycle" element={<AdaptiveLearningPage />} />
      <Route path="/assessments" element={<AssessmentsPage />} />
      <Route path="/coding-challenges" element={<CodingChallengePage />} />
      <Route path="/explain-code" element={<ExplainCodePage />} />
      
      {/* Analytics */}
      <Route path="/analytics" element={<AnalyticsPage />} />

      {/* Trainer Routes */}
      <Route path="/trainer" element={<TrainerDashboard />} />
      <Route path="/trainer/cohorts" element={<TrainerDashboard />} />
      <Route path="/trainer/courses" element={<TrainerDashboard />} />

      {/* Evaluator Routes */}
      <Route path="/evaluator" element={<EvaluatorDashboard />} />
      <Route path="/evaluator/history" element={<EvaluatorDashboard />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
