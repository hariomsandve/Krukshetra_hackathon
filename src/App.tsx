import React from 'react';
import { BrowserRouter, Link, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AppRoutes } from './routes/AppRoutes';
import { 
  LayoutDashboard, 
  RotateCw, 
  ClipboardCheck, 
  Code2, 
  FileText, 
  BarChart3, 
  Users, 
  ShieldCheck 
} from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const { role } = useApp();
  const location = useLocation();

  const getLinks = () => {
    if (role === 'trainer') {
      return [
        { to: '/trainer', label: 'Trainer', icon: Users },
        { to: '/trainer/cohorts', label: 'Cohorts', icon: LayoutDashboard },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
      ];
    }
    if (role === 'evaluator') {
      return [
        { to: '/evaluator', label: 'Queue', icon: ShieldCheck },
        { to: '/explain-code', label: 'Code Essay', icon: FileText },
        { to: '/analytics', label: 'Audit', icon: BarChart3 },
      ];
    }
    return [
      { to: '/', label: 'Home', icon: LayoutDashboard },
      { to: '/adaptive-cycle', label: 'Cycle', icon: RotateCw },
      { to: '/assessments', label: 'Quiz', icon: ClipboardCheck },
      { to: '/coding-challenges', label: 'Coding', icon: Code2 },
      { to: '/explain-code', label: 'Explain', icon: FileText },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    ];
  };

  const links = getLinks();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition-colors ${
              isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 overflow-x-hidden">
          <AppRoutes />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
