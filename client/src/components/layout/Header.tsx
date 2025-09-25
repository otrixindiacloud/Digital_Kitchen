import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/store/authStore';
import { usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';
import { Link, useLocation } from 'wouter';
import { 
  Menu, 
  User, 
  LogOut, 
  ShoppingCart,
  BarChart3,
  Users,
  ChefHat,
  Clock,
  Settings,
  Package,
  CreditCard,
  FileText,
  Calendar,
  X,
  Bell
} from 'lucide-react';

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { state, logout, hasAnyRole } = useAuth();
  const { language } = usePOS();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isManagementMenuOpen, setIsManagementMenuOpen] = useState(false);
  
  // Mock notification data for badge count
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #1234 has been placed',
      time: '2 minutes ago',
      isRead: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Low Inventory Alert',
      message: 'Chicken breast is running low (5 items left)',
      time: '15 minutes ago',
      isRead: false,
      type: 'inventory'
    },
    {
      id: 3,
      title: 'Payment Processed',
      message: 'Payment of $45.50 has been processed successfully',
      time: '1 hour ago',
      isRead: true,
      type: 'payment'
    },
    {
      id: 4,
      title: 'Kitchen Update',
      message: 'Order #1230 is ready for pickup',
      time: '2 hours ago',
      isRead: true,
      type: 'kitchen'
    }
  ]);

  const mainNavigationItems = [
    {
      id: 'pos',
      label: 'POS System',
      labelAr: 'نظام نقاط البيع',
      href: '/',
      icon: ShoppingCart,
      access: ['admin', 'manager', 'cashier'],
      badge: 'Live'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      href: '/dashboard',
      icon: BarChart3,
      access: ['admin', 'manager']
    },
    {
      id: 'kitchen',
      label: 'Kitchen',
      labelAr: 'المطبخ',
      href: '/kitchen',
      icon: ChefHat,
      access: ['admin', 'manager', 'cashier']
    },
    {
      id: 'active-users',
      label: 'Active Users',
      labelAr: 'المستخدمون النشطون',
      href: '/active-users',
      icon: Users,
      access: ['admin', 'manager']
    }
  ];

  const managementItems = [
    {
      id: 'management',
      label: 'Management',
      labelAr: 'الإدارة',
      href: '/management',
      icon: Settings,
      access: ['admin', 'manager']
    },
    {
      id: 'staff',
      label: 'Staff Management',
      labelAr: 'إدارة الموظفين',
      href: '/staff',
      icon: Users,
      access: ['admin', 'manager']
    },
    {
      id: 'inventory',
      label: 'Inventory',
      labelAr: 'المخزون',
      href: '/inventory',
      icon: Package,
      access: ['admin', 'manager']
    },
    {
      id: 'payments',
      label: 'Payments',
      labelAr: 'المدفوعات',
      href: '/payments',
      icon: CreditCard,
      access: ['admin', 'manager']
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      href: '/reports',
      icon: FileText,
      access: ['admin', 'manager']
    },
    {
      id: 'schedule',
      label: 'Schedule',
      labelAr: 'الجدولة',
      href: '/schedule',
      icon: Calendar,
      access: ['admin', 'manager']
    }
  ];

  const systemItems: Array<{
    id: string;
    label: string;
    labelAr: string;
    href: string;
    icon: any;
    access: string[];
  }> = [];

  const filteredMainItems = mainNavigationItems.filter(item => hasAnyRole(item.access));
  const filteredManagementItems = managementItems.filter(item => hasAnyRole(item.access));
  const filteredSystemItems = systemItems.filter(item => hasAnyRole(item.access));

  const isActive = (href: string) => location === href;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NavButton = ({ item, className = "" }: { item: any; className?: string }) => {
    const Icon = item.icon;
    return (
      <Link href={item.href}>
        <Button
          variant={isActive(item.href) ? "default" : "ghost"}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${className} ${
            isActive(item.href) 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'hover:bg-blue-50 hover:text-blue-600'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="font-medium">
            {language === 'ar' ? item.labelAr : item.label}
          </span>
          {item.badge && (
            <Badge 
              variant={isActive(item.href) ? "secondary" : "default"}
              className={`text-xs ${
                isActive(item.href) 
                  ? 'bg-white/20 text-white' 
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {item.badge}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };


  return (
    <header className="w-full bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-800">
                  {t('digitalKitchen', language)}
                </h1>
                <p className="text-xs text-gray-500">
                  {language === 'en' ? 'Al-Matbakh Ar-Raqami' : 'المطبخ الرقمي'}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {filteredMainItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
            
            {/* Management Direct Link */}
            {filteredManagementItems.length > 0 && (
              <NavButton 
                item={{
                  id: 'management',
                  label: 'Management',
                  labelAr: 'الإدارة',
                  href: '/management',
                  icon: Settings,
                  access: ['admin', 'manager']
                }} 
              />
            )}

            {filteredSystemItems.map((item) => (
              <NavButton key={item.id} item={item} />
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{state.user?.username}</p>
              </div>
            </div>

            {/* Language Selector */}
            <LanguageSelector variant="compact" />

            {/* Notifications */}
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-blue-500 relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Logout */}
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-gray-500 hover:text-blue-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {filteredMainItems.map((item) => (
                <NavButton key={item.id} item={item} className="w-full justify-start" />
              ))}
              
              {filteredManagementItems.length > 0 && (
                <NavButton 
                  item={{
                    id: 'management',
                    label: 'Management',
                    labelAr: 'الإدارة',
                    href: '/management',
                    icon: Settings,
                    access: ['admin', 'manager']
                  }} 
                  className="w-full justify-start"
                />
              )}

              {filteredSystemItems.map((item) => (
                <NavButton key={item.id} item={item} className="w-full justify-start" />
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}