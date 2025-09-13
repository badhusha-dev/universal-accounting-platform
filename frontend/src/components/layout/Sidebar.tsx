import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  BarChart3,
  FileText,
  Receipt,
  Settings,
  Calculator,
  TrendingUp,
  Scale
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Ledger', href: '/ledger', icon: FileText },
  { name: 'Trial Balance', href: '/ledger/trial-balance', icon: Calculator },
  { name: 'P&L Report', href: '/reports/pnl', icon: TrendingUp },
  { name: 'Balance Sheet', href: '/reports/balance-sheet', icon: Scale },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          </div>
          
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Close mobile menu when navigating
                    if (window.innerWidth < 768) {
                      onClose();
                    }
                  }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-primary/10 text-primary"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
