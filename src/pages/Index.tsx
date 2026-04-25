import { useState } from 'react';
import { BottomNav, TabId } from '@/components/BottomNav';
import { TransactionModal } from '@/components/TransactionModal';
import { OverviewPage } from '@/pages/Overview';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { ChartPage } from '@/pages/ChartPage';
import { FixedExpensesPage } from '@/pages/FixedExpensesPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Admin } from '@/pages/Admin';
import { IncomePage } from '@/pages/IncomePage';
import { Plus } from 'lucide-react';

const Index = () => {
  const [tab, setTab] = useState<TabId>('overview');
  const [txModalOpen, setTxModalOpen] = useState(false);

  const renderPage = () => {
    switch (tab) {
      case 'overview': return <OverviewPage />;
      case 'income': return <IncomePage />;
      case 'categories': return <CategoriesPage />;
      case 'chart': return <ChartPage />;
      case 'fixed': return <FixedExpensesPage />;
      case 'settings': return <SettingsPage />;
      case 'admin': return <Admin />;
    }
  };

  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Elements */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <div className="max-w-lg mx-auto px-4 pt-6 pb-32">
        {renderPage()}
      </div>

      <BottomNav active={tab} onChange={setTab} onAddClick={() => setTxModalOpen(true)} />
      <TransactionModal open={txModalOpen} onClose={() => setTxModalOpen(false)} />
    </div>
  );
};



export default Index;
