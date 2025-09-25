import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store/authStore';
import { usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';
import { Link, useLocation } from 'wouter';
import { 
  ShoppingCart, 
  BarChart3, 
  Users, 
  ChefHat, 
  Settings,
  Package,
  CreditCard,
  Clock,
  User,
  LogOut,
  Menu,
  X,
  TrendingUp,
  FileText,
  Calendar,
  Shield,
  Zap,
  Star,
  HelpCircle,
  Bell
} from 'lucide-react';

interface MenubarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Menubar({ isOpen, onToggle }: MenubarProps) {
  const { state, logout, hasAnyRole } = useAuth();
  const { language } = usePOS();
  const [location] = useLocation();

  const mainMenuItems = [
    {
      id: 'pos',
      label: 'POS System',
      labelAr: 'نظام نقاط البيع',
      icon: ShoppingCart,
      href: '/',
      access: ['admin', 'manager', 'cashier'],
      badge: 'Live'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      labelAr: 'لوحة التحكم',
      icon: BarChart3,
      href: '/dashboard',
      access: ['admin', 'manager']
    },
    {
      id: 'management',
      label: 'Management',
      labelAr: 'الإدارة',
      icon: Settings,
      href: '/management',
      access: ['admin', 'manager']
    },
    {
      id: 'active-users',
      label: 'Active Users',
      labelAr: 'المستخدمون النشطون',
      icon: Users,
      href: '/active-users',
      access: ['admin', 'manager']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      labelAr: 'الإشعارات',
      icon: Bell,
      href: '/notifications',
      access: ['admin', 'manager', 'cashier']
    }
  ];

  const managementItems = [
    {
      id: 'staff',
      label: 'Staff Management',
      labelAr: 'إدارة الموظفين',
      icon: Users,
      href: '/staff',
      access: ['admin', 'manager']
    },
    {
      id: 'inventory',
      label: 'Inventory',
      labelAr: 'المخزون',
      icon: Package,
      href: '/inventory',
      access: ['admin', 'manager']
    },
    {
      id: 'payments',
      label: 'Payments',
      labelAr: 'المدفوعات',
      icon: CreditCard,
      href: '/payments',
      access: ['admin', 'manager']
    },
    {
      id: 'reports',
      label: 'Reports',
      labelAr: 'التقارير',
      icon: FileText,
      href: '/reports',
      access: ['admin', 'manager']
    },
    {
      id: 'schedule',
      label: 'Schedule',
      labelAr: 'الجدولة',
      icon: Calendar,
      href: '/schedule',
      access: ['admin', 'manager']
    }
  ];

  const kitchenItems = [
    {
      id: 'kitchen-display',
      label: 'Kitchen Display',
      labelAr: 'عرض المطبخ',
      icon: ChefHat,
      href: '/kitchen',
      access: ['admin', 'manager', 'cashier']
    },
    {
      id: 'orders',
      label: 'Active Orders',
      labelAr: 'الطلبات النشطة',
      icon: Clock,
      href: '/orders',
      access: ['admin', 'manager', 'cashier']
    }
  ];

  const systemItems = [
    {
      id: 'help',
      label: 'Help & Support',
      labelAr: 'المساعدة والدعم',
      icon: HelpCircle,
      href: '/help',
      access: ['admin', 'manager', 'cashier']
    }
  ];

  const filteredMainItems = mainMenuItems.filter(item => hasAnyRole(item.access));
  const filteredManagementItems = managementItems.filter(item => hasAnyRole(item.access));
  const filteredKitchenItems = kitchenItems.filter(item => hasAnyRole(item.access));
  const filteredSystemItems = systemItems.filter(item => hasAnyRole(item.access));

  const isActive = (href: string) => location === href;

  const MenuSection = ({ title, titleAr, items }: { title: string; titleAr: string; items: any[] }) => (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
        {language === 'ar' ? titleAr : title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <Button
                variant={isActive(item.href) ? "default" : "ghost"}
                className={`w-full justify-start px-2 py-2 h-auto rounded-lg transition-all duration-200 ${
                  isActive(item.href) 
                    ? 'bg-orange-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="flex-1 text-left text-sm font-medium">
                  {language === 'ar' ? item.labelAr : item.label}
                </span>
                {item.badge && (
                  <Badge 
                    variant={isActive(item.href) ? "secondary" : "default"}
                    className={`text-xs ${
                      isActive(item.href) 
                        ? 'bg-white/20 text-white' 
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-2xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
                 <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {t('digitalKitchen', language)}
              </h2>
              <p className="text-xs text-gray-500">
                {language === 'en' ? 'Restaurant Management' : 'إدارة المطاعم'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{state.user?.username}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <MenuSection 
            title="Main" 
            titleAr="الرئيسية" 
            items={filteredMainItems} 
          />

          {filteredManagementItems.length > 0 && (
            <MenuSection 
              title="Management" 
              titleAr="الإدارة" 
              items={filteredManagementItems} 
            />
          )}

          {filteredKitchenItems.length > 0 && (
            <MenuSection 
              title="Kitchen" 
              titleAr="المطبخ" 
              items={filteredKitchenItems} 
            />
          )}

          <MenuSection 
            title="System" 
            titleAr="النظام" 
            items={filteredSystemItems} 
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg py-2"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}
