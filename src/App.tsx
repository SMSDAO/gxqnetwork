import React from 'react';
import { GXQProvider, useGXQ } from './context/GXQContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/ui/ToastContainer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { ArchitectureView } from './components/views/ArchitectureView';
import { ExplorerView } from './components/views/ExplorerView';
import { SwapView } from './components/views/SwapView';
import { MiningView } from './components/views/MiningView';
import { ContractsView } from './components/views/ContractsView';
import { BridgeView } from './components/views/BridgeView';
import { LaunchpadView } from './components/views/LaunchpadView';
import { TopUsersView } from './components/views/TopUsersView';
import { WalletView } from './components/views/WalletView';
import { EnterpriseView } from './components/views/EnterpriseView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AIIntelligenceView } from './components/views/AIIntelligenceView';
import { ControlPlaneView } from './components/views/ControlPlaneView';
import { SecurityAuditView } from './components/views/SecurityAuditView';
import { WhitepaperView } from './components/views/WhitepaperView';
import { BrandGuideView } from './components/views/BrandGuideView';
import { DocsView } from './components/views/DocsView';

const AppContent: React.FC = () => {
  const { activeTab, googleUser } = useGXQ();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'explorer':
        return <ExplorerView />;
      case 'swap':
        return <SwapView />;
      case 'mining':
        return <MiningView />;
      case 'contracts':
        return <ContractsView />;
      case 'bridge':
        return <BridgeView />;
      case 'launchpad':
        return <LaunchpadView />;
      case 'top_users':
        return <TopUsersView />;
      case 'wallet':
        return <WalletView />;
      case 'enterprise':
        return <EnterpriseView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'ai':
        return <AIIntelligenceView />;
      case 'control_plane':
        return googleUser?.email === 'gxqstudio@gmail.com' ? <ControlPlaneView /> : <div className='p-8 glass-lvl-3 rounded-xl'>Access Denied</div>;

      case 'security':
        return <SecurityAuditView />;
      case 'whitepaper':
        return <WhitepaperView />;
      case 'brand':
        return <BrandGuideView />;
      case 'docs':
        return <DocsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030507]">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 lg:pl-64 px-4 sm:px-6 lg:px-8 py-6 w-full max-w-[1600px] mx-auto min-h-[calc(100vh-130px)] pb-24 lg:pb-12">
          {renderActiveView()}
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <GXQProvider>
      <AppContent />
    </GXQProvider>
  );
}
