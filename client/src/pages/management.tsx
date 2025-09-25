import React, { useState } from 'react';
import { useAuth } from '@/store/authStore';
import { POSProvider, usePOS } from '@/store/posStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  Users, 
  Menu, 
  Package, 
  BarChart3, 
  Settings, 
  Clock, 
  CreditCard,
  Table2,
  UserCheck,
  LogOut,
  User
} from 'lucide-react';
import { t } from '@/lib/i18n';
import { Link } from 'wouter';
import { StaffManagement } from '@/components/management/StaffManagement';
import { MenuManagement } from '@/components/management/MenuManagement';
import { InventoryManagement } from '@/components/management/InventoryManagement';
import { TableManagement } from '@/components/management/TableManagement';
import { ShiftManagement } from '@/components/management/ShiftManagement';
import { SettlementPayments } from '@/components/management/SettlementPayments';
import { SettingsManagement } from '@/components/management/SettingsManagement';
import { ReportsAnalytics } from '@/components/management/ReportsAnalytics';
import { AdminVerification } from '@/components/management/AdminVerification';
import { ManagerDashboard } from '@/components/management/ManagerDashboard';

function ManagementContent() {
  const { state, logout, hasAnyRole } = useAuth();
  const { language } = usePOS();
  const [activeTab, setActiveTab] = useState('overview');

  if (!state.isAuthenticated) {
    return <div>Unauthorized</div>;
  }

  const isManager = hasAnyRole(['manager', 'admin']);
  const isAdmin = hasAnyRole(['admin']);

  const managementSections = [
    {
      id: 'dashboard',
      title: 'managerDashboard',
      description: 'dashboardDescription',
      icon: BarChart3,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'staff',
      title: 'staffManagement',
      description: 'staffDescription',
      icon: Users,
      access: ['admin'],
      badge: 'adminOnly'
    },
    {
      id: 'menu',
      title: 'menuManagement',
      description: 'menuDescription',
      icon: Menu,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'inventory',
      title: 'inventory',
      description: 'inventoryDescription',
      icon: Package,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'tables',
      title: 'tableManagement',
      description: 'tableDescription',
      icon: Table2,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'shifts',
      title: 'shiftManagement',
      description: 'shiftDescription',
      icon: Clock,
      access: ['cashier', 'manager', 'admin'],
      badge: 'allUsers'
    },
    {
      id: 'reports',
      title: 'reportsAnalytics',
      description: 'reportsDescription',
      icon: BarChart3,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'payments',
      title: 'settlementPayments',
      description: 'settlementDescription',
      icon: CreditCard,
      access: ['manager', 'admin'],
      badge: 'managerPlus'
    },
    {
      id: 'settings',
      title: 'settings',
      description: 'settingsDescription',
      icon: Settings,
      access: ['admin'],
      badge: 'adminOnly'
    },
    {
      id: 'verify',
      title: 'adminVerification',
      description: 'verifyAllFunctionality',
      icon: UserCheck,
      access: ['admin'],
      badge: 'adminOnly'
    }
  ];

  const filteredSections = managementSections.filter(section => 
    hasAnyRole(section.access)
  );

  return (
    <div className="w-full">
      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 lg:grid-cols-9 gap-2 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-md"
            >
              <BarChart3 className="h-4 w-4 data-[state=active]:text-blue-600" />
              {t('overview', language)}
            </TabsTrigger>
            {filteredSections.slice(0, 8).map(section => {
              const Icon = section.icon;
              return (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id} 
                  className="flex items-center gap-2 px-4 py-3 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all duration-200 rounded-md"
                >
                  <Icon className="h-4 w-4 data-[state=active]:text-blue-600" />
                  {t(section.title as any, language)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSections.map(section => {
                const Icon = section.icon;
                return (
                  <Card 
                    key={section.id} 
                    className="group cursor-pointer bg-white/90 backdrop-blur-sm border border-gray-200 p-0 overflow-hidden shadow-lg"
                    onClick={() => setActiveTab(section.id)}
                    data-testid={`card-${section.id}`}
                  >
                    <CardHeader className="pb-4 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                          <Icon className="h-7 w-7 text-blue-600" />
                        </div>
                        <Badge 
                          variant="destructive" 
                          className="text-xs px-3 py-1 shadow-md bg-red-600 hover:bg-red-700"
                        >
                          {t(section.badge as any, language)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold mb-2 text-black">
                        {t(section.title as any, language)}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                        {t(section.description as any, language)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                      <Button 
                        variant="default" 
                        size="lg"
                        className="w-full font-semibold text-base py-4 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {t('manage', language)}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Management sections */}
          {filteredSections.map(section => (
            <TabsContent key={section.id} value={section.id}>
              {section.id === 'dashboard' && <ManagerDashboard isActive={activeTab === section.id} />}
              {section.id === 'staff' && <StaffManagement isActive={activeTab === section.id} />}
              {section.id === 'menu' && <MenuManagement isActive={activeTab === section.id} />}
              {section.id === 'inventory' && <InventoryManagement isActive={activeTab === section.id} />}
              {section.id === 'tables' && <TableManagement isActive={activeTab === section.id} />}
              {section.id === 'shifts' && <ShiftManagement isActive={activeTab === section.id} />}
              {section.id === 'reports' && <ReportsAnalytics isActive={activeTab === section.id} />}
              {section.id === 'payments' && <SettlementPayments isActive={activeTab === section.id} />}
              {section.id === 'settings' && <SettingsManagement isActive={activeTab === section.id} />}
              {section.id === 'verify' && <AdminVerification isActive={activeTab === section.id} />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function Management() {
  return (
    <POSProvider>
      <ManagementContent />
    </POSProvider>
  );
}