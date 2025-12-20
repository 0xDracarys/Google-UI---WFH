
import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Workspace } from './components/Workspace';
import { FeaturesPage } from './components/FeaturesPage';
import { PricingPage } from './components/PricingPage';
import { DashboardPage } from './components/DashboardPage';

export type View = 'landing' | 'workspace' | 'features' | 'pricing' | 'dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('landing');

  const navigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    console.log("Rendering view:", currentView);
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'workspace':
        return <Workspace onBack={() => navigate('landing')} />;
      case 'features':
        return <FeaturesPage onNavigate={navigate} />;
      case 'pricing':
        return <PricingPage onNavigate={navigate} />;
      case 'dashboard':
        return <DashboardPage onNavigate={navigate} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#F8F9FA]">
      {renderView()}
    </div>
  );
};

export default App;
