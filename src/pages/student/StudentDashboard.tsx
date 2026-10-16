import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  AlertTriangle, 
  Flame, 
  Code2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Play, 
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../../components/layout/PageHeader';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { AdaptiveCycleTracker } from '../../components/common/AdaptiveCycleTracker';
import { mockCourses, mockPersonalizedRecommendations } from '../../data/mockData';

export const StudentDashboard: React.FC = () => {
  const { student, topics, quizHistory } = useApp();
  const navigate = useNavigate();

  const weakTopics = topics.filter(t => t.proficiencyScore < 60);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${student.name.split(' ')[0]}!`}
        subtitle="Your personalized adaptive learning engine is active and tracking your mastery."
        badgeText={student.cohort}
      >
        <button
          onClick={() => navigate('/assessments')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all shadow-indigo-500/20"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Take Adaptive Quiz</span>
        </button>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Mastery"
          value={`${student.overallMastery}%`}
          subtitle="Calculated across 6 core domains"
          icon={Trophy}
          accentColor="indigo"
          trend={{ value: '+8%', isPositive: true }}
        />
        <StatCard
          title="Knowledge Gaps"
          value={`${weakTopics.length} Topics`}
          subtitle="Proficiency below 60% threshold"
          icon={AlertTriangle}
          accentColor="rose"
          onClick={() => navigate('/adaptive-cycle')}
        />
        <StatCard
          title="Active Streak"
          value={`${student.streakDays} Days`}
          subtitle="Consistent daily practice"
          icon={Flame}
          accentColor="amber"
          trend={{ value: 'Top 5%', isPositive: true }}
        />
        <StatCard
          title="Code Challenges"
          value={`${student.codingChallengesCompleted}`}
          subtitle="With explain-code rubrics"
          icon={Code2}
          accentColor="emerald"
          onClick={() => navigate('/coding-challenges')}
        />
      </div>

      {/* Suggested Differentiation Feature: 5-Stage Adaptive Loop */}
      <AdaptiveCycleTracker />

      {/* Main Grid: Courses + Weak Topics vs Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Weak Topics Alert & Enrolled Courses */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Weak Topics Diagnostic Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Identified Knowledge Gaps
                  </h3>
                  <Badge variant="critical" size="sm">
                    {weakTopics.length} Require Focus
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  The adaptive engine prioritizes easier scaffolding for these concepts before advancing difficulty.
                </p>
              </div>
              <button
                onClick={() => navigate('/adaptive-cycle')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Cycle Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {weakTopics.map((topic) => (
                <div 
                  key={topic.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{topic.name}</span>
                        <Badge variant={topic.status} size="sm">
                          {topic.status.toUpperCase()}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Category: {topic.category} • Attempted {topic.questionsAttempted} questions
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-rose-600">
                        {topic.proficiencyScore}%
                      </span>
                      <button
                        onClick={() => navigate('/assessments')}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                      >
                        Targeted Drill
                      </button>
                    </div>
                  </div>

                  <ProgressBar value={topic.proficiencyScore} height="h-1.5" />
                  
                  <div className="mt-2 text-[11px] text-slate-600 flex items-start gap-1">
                    <span className="font-semibold text-slate-700">Remedial Focus:</span>
                    <span className="text-slate-500">{topic.remedialRecommended}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Courses */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Enrolled Courses & Progress</h3>
                <p className="text-xs text-slate-500 mt-0.5">Active curricula aligned with your target competencies</p>
              </div>
              <span className="text-xs text-slate-400 font-semibold">{mockCourses.length} Enrolled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockCourses.map((course) => (
                <div 
                  key={course.id}
                  className="rounded-xl border border-slate-200/80 p-4 hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {course.level}
                      </span>
                      <span className="text-xs font-bold text-indigo-700">
                        {course.progressPercent}% Completed
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <ProgressBar value={course.progressPercent} height="h-1.5" className="mb-2" />
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{course.completedModules} / {course.totalModules} modules</span>
                      <span className="font-medium text-slate-700">{course.instructor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Recommendations & Recent Assessment Logs */}
        <div className="space-y-6">
          
          {/* Personalized Recommendations */}
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white shadow-md">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h3 className="text-sm font-bold tracking-tight text-white">
                Adaptive AI Recommendations
              </h3>
            </div>
            <p className="text-xs text-indigo-200 mb-4">
              Generated in real-time based on your latest diagnostic results
            </p>

            <div className="space-y-3">
              {mockPersonalizedRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer"
                  onClick={() => navigate('/assessments')}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/20 text-indigo-100">
                      {rec.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {rec.impact}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white mt-1.5 leading-snug">
                    {rec.title}
                  </h5>
                  <p className="text-[11px] text-indigo-200/80 mt-1 leading-snug">
                    {rec.reason}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-indigo-300 pt-2 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {rec.estimatedMinutes} mins
                    </span>
                    <span className="font-bold text-white flex items-center gap-0.5 hover:underline">
                      Launch <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Score History */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Recent Assessment Logs</h3>
              <button 
                onClick={() => navigate('/assessments')} 
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {quizHistory.slice(0, 3).map((res, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {res.topicName}
                    </span>
                    <span className={`text-xs font-extrabold ${res.score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {res.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {res.adaptiveAdjustment}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{res.correctCount} / {res.totalQuestions} correct</span>
                    <span>{res.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
