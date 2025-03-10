
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  LayoutDashboard, 
  School, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ScheduleForm from './ScheduleForm';
import ScheduleResult from './ScheduleResult';
import Hero from './Hero';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-left transition-colors",
        active 
          ? "bg-primary text-white font-medium shadow-sm" 
          : "text-slate-700 hover:bg-slate-100"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-grow truncate">{label}</span>
    </button>
  );
};

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [scheduleResults, setScheduleResults] = useState<any[]>([]);
  const [totalPeriod, setTotalPeriod] = useState<number>(0);
  const [days, setDays] = useState<number>(3);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if there's a hash in the URL that should trigger navigation to schedule tab
  useEffect(() => {
    if (location.hash === '#schedule-form') {
      setActiveTab('schedule');
    } else if (location.pathname === '/') {
      // Show overview on home page by default
      setActiveTab('overview');
    }
  }, [location]);

  const handleScheduleResults = (
    results: any[], 
    total: number, 
    daysCount: number, 
    slots: number
  ) => {
    setScheduleResults(results);
    setTotalPeriod(total);
    setDays(daysCount);
    setSlotsPerDay(slots);
    
    // Automatically switch to results tab if we have results
    if (results.length > 0) {
      setActiveTab("results");
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "schedule":
        return (
          <div>
            <ScheduleForm 
              onResults={handleScheduleResults} 
              setIsLoading={setIsLoading}
              setError={setError}
            />
          </div>
        );
      case "results":
        return (
          <ScheduleResult
            results={scheduleResults}
            totalPeriod={totalPeriod}
            days={days}
            slotsPerDay={slotsPerDay}
            isLoading={isLoading}
            error={error}
          />
        );
      case "overview":
        return <Hero />;
      case "docs":
        // Redirect to About page when docs is clicked
        useEffect(() => {
          navigate('/about');
        }, []);
        return <div className="p-6">Redirection vers la documentation...</div>;
      default:
        return <div className="p-6 text-center text-gray-500">Contenu en cours de développement</div>;
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:shadow-none lg:transform-none lg:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header with logo */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                <Calendar size={18} />
              </div>
              {sidebarOpen && <span className="font-medium text-primary">ExamOptim</span>}
            </div>
            
            {/* Toggle button for desktop */}
            <button 
              onClick={toggleSidebar}
              className="hidden lg:flex text-slate-400 hover:text-primary p-1 rounded-md transition-colors"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
            
            {/* Close button for mobile */}
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-slate-400 hover:text-primary p-1 rounded-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label="Vue d'ensemble" 
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <NavItem 
              icon={<Calendar size={20} />} 
              label="Planification" 
              active={activeTab === "schedule"}
              onClick={() => setActiveTab("schedule")}
            />
            <NavItem 
              icon={<School size={20} />} 
              label="Résultats" 
              active={activeTab === "results"}
              onClick={() => setActiveTab("results")}
            />
            <NavItem 
              icon={<BookOpen size={20} />} 
              label="Documentation" 
              active={activeTab === "docs"}
              onClick={() => setActiveTab("docs")}
            />
            <NavItem 
              icon={<Settings size={20} />} 
              label="Paramètres" 
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            />
          </nav>
          
          {/* Sidebar footer with version */}
          {sidebarOpen && (
            <div className="p-4 border-t text-xs text-slate-500 flex items-center space-x-2">
              <Info size={14} />
              <span>Version 1.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        {/* Top bar for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Calendar size={18} />
            </div>
            <span className="font-medium text-primary">ExamOptim</span>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-white text-slate-700 shadow hover:bg-slate-50"
          >
            <Menu size={20} />
          </button>
        </div>
        
        {/* Page content */}
        <div className="p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
      
      {/* Background overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
