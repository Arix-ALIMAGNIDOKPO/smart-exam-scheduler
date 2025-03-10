
import React, { useState } from 'react';
import { 
  Calendar, 
  LayoutDashboard, 
  School, 
  BookOpen, 
  Settings, 
  Menu, 
  X, 
  PanelLeft, 
  PanelRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ScheduleForm from './ScheduleForm';
import ScheduleResult from './ScheduleResult';
import Hero from './Hero';

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
          ? "bg-primary text-white font-medium" 
          : "text-slate-700 hover:bg-slate-200"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="flex-grow truncate">{label}</span>
    </button>
  );
};

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("schedule");
  const [scheduleResults, setScheduleResults] = useState<any[]>([]);
  const [totalPeriod, setTotalPeriod] = useState<number>(0);
  const [days, setDays] = useState<number>(3);
  const [slotsPerDay, setSlotsPerDay] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      default:
        return <div className="p-6">Contenu en cours de développement</div>;
    }
  };

  return (
    <div className="flex h-full">
      {/* Mobile sidebar toggle */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
        aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] z-40 w-64 bg-white border-r border-slate-200 shadow-sm transition-all duration-300 lg:relative lg:top-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Toggle sidebar width button (desktop only) */}
          <button 
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-full mb-6 p-2 text-slate-500 hover:text-primary"
          >
            {sidebarOpen ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>
          
          {/* Navigation */}
          <nav className="space-y-2">
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
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "flex-grow transition-all duration-300 min-h-[calc(100vh-4rem)]",
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
