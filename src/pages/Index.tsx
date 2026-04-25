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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-lg mx-auto px-4 pt-6">
        {renderPage()}
      </div>

      {/* FAB */}
      {tab !== 'settings' && tab !== 'admin' && (
        <button
          onClick={() => setTxModalOpen(true)}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full gradient-primary flex items-center justify-center fab-shadow transition-transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6 text-primary-foreground" />
        </button>
      )}

      <BottomNav active={tab} onChange={setTab} />
      <TransactionModal open={txModalOpen} onClose={() => setTxModalOpen(false)} />
    </div>
  );
};

export default Index;
