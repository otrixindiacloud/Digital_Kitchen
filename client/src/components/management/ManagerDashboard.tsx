import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users,
  ShoppingCart, 
  Clock,
  Calendar,
  Download,
  RefreshCw,
  PieChart,
  Activity,
  Target,
  Award,
  Zap,
  Eye,
  Filter,
  ChevronRight,
  Star,
  Settings,
  Package,
  Menu,
  Table2,
  CreditCard,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';
import { usePOS } from '@/store/posStore';

interface ManagerDashboardProps {
  isActive: boolean;
}

interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  activeStaff: number;
  availableTables: number;
  occupiedTables: number;
  lowStockItems: number;
  pendingOrders: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'payment' | 'staff' | 'inventory' | 'table';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface TopPerformer {
  id: string;
  name: string;
  metric: string;
  value: number;
  change: number;
  icon: React.ComponentType<any>;
}

export function ManagerDashboard({ isActive }: ManagerDashboardProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { language } = usePOS();

  // Mock data - in real app, this would come from API
  const [metrics] = useState<DashboardMetrics>({
    totalRevenue: 45680.50,
    totalOrders: 1247,
    averageOrderValue: 36.65,
    activeStaff: 8,
    availableTables: 12,
    occupiedTables: 8,
    lowStockItems: 3,
    pendingOrders: 5,
    todayRevenue: 1250.75,
    weekRevenue: 8750.25,
    monthRevenue: 45680.50
  });

  const [recentActivity] = useState<RecentActivity[]>([
    { id: '1', type: 'order', message: 'New order #1247 received from Table 5', timestamp: '2 min ago', status: 'success' },
    { id: '2', type: 'payment', message: 'Payment of QR 125.50 processed successfully', timestamp: '5 min ago', status: 'success' },
    { id: '3', type: 'inventory', message: 'Low stock alert: Chicken breast running low', timestamp: '15 min ago', status: 'warning' },
    { id: '4', type: 'staff', message: 'Ahmed Hassan started his shift', timestamp: '1 hour ago', status: 'info' },
    { id: '5', type: 'table', message: 'Table 3 is now available', timestamp: '1 hour ago', status: 'info' },
    { id: '6', type: 'order', message: 'Order #1245 completed and served', timestamp: '2 hours ago', status: 'success' }
  ]);

  const [topPerformers] = useState<TopPerformer[]>([
    { id: '1', name: 'Chicken Shawarma', metric: 'Revenue', value: 1875.00, change: 12.5, icon: TrendingUp },
    { id: '2', name: 'Ahmed Hassan', metric: 'Orders Handled', value: 45, change: 8.3, icon: Users },
    { id: '3', name: 'Table 5', metric: 'Turnover', value: 6, change: 15.2, icon: Table2 },
    { id: '4', name: 'Evening Shift', metric: 'Efficiency', value: 94, change: 5.7, icon: Clock }
  ]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In real app, fetch data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Success',
        description: 'Dashboard data refreshed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'staff': return <Users className="h-4 w-4" />;
      case 'inventory': return <Package className="h-4 w-4" />;
      case 'table': return <Table2 className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-3xl flex items-center justify-center shadow-lg">
            <UserCheck className="h-8 w-8 text-purple-700" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-600">
              {t('managerDashboard', language)}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                {t('managerPlus', language)}
              </Badge>
              <span className="text-gray-600 text-sm">
                {t('completeRestaurantManagementOverview', language)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchDashboardData} 
            disabled={loading}
            size="lg"
            variant="outline" 
            className="border border-blue-600 shadow-lg hover:shadow-xl text-blue-600"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('refresh', language)}
          </Button>
          <Button 
            onClick={() => toast({ title: 'Export Started', description: 'Exporting dashboard data...' })}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl"
          >
            <Download className="h-5 w-5 mr-2" />
            {t('export', language)}
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">{t('todaysRevenue', language)}</CardTitle>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-200">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">QR {metrics.todayRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-xs text-gray-500">{t('vsYesterday', language)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">{t('activeOrders', language)}</CardTitle>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-200">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{metrics.pendingOrders}</div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">{t('inProgress', language)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">{t('staffOnDuty', language)}</CardTitle>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-200">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{metrics.activeStaff}</div>
            <div className="flex items-center gap-1 mt-1">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">4.8 {t('avgRating', language)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">{t('tableStatus', language)}</CardTitle>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md border border-gray-200">
              <Table2 className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{metrics.availableTables}/{metrics.availableTables + metrics.occupiedTables}</div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">{t('available', language)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {metrics.lowStockItems > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>{t('lowStockAlert', language)}:</strong> {metrics.lowStockItems} {t('itemsNeedAttention', language)}. 
            <Button variant="link" className="p-0 h-auto text-yellow-800 underline">
              {t('viewInventory', language)}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t('overview', language)}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('performance', language)}
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {t('recentActivity', language)}
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t('systemAlerts', language)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Overview */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 font-bold text-black">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  {t('revenueOverview', language)}
                </CardTitle>
                <CardDescription>{t('revenueBreakdownByPeriod', language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('today', language)}</span>
                    <span className="text-lg font-bold text-green-600">QR {metrics.todayRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('thisWeek', language)}</span>
                    <span className="text-lg font-bold text-blue-600">QR {metrics.weekRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t('thisMonth', language)}</span>
                    <span className="text-lg font-bold text-purple-600">QR {metrics.monthRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 font-bold text-black">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  {t('quickActions', language)}
                </CardTitle>
                <CardDescription>{t('commonManagementTasks', language)}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                    <Menu className="h-4 w-4" />
                    <span className="text-xs">Menu</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Staff</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span className="text-xs">Inventory</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex flex-col items-center gap-1">
                    <Table2 className="h-4 w-4" />
                    <span className="text-xs">Tables</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 font-bold text-black">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <TrendingUp className="h-4 w-4 text-purple-700" />
                  </div>
                  Top Performers
              </CardTitle>
              <CardDescription>Best performing items, staff, and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item/Person</TableHead>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Change</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {topPerformers.map((performer) => {
                    const Icon = performer.icon;
                    return (
                      <TableRow key={performer.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{performer.name}</TableCell>
                        <TableCell>{performer.metric}</TableCell>
                        <TableCell className="font-semibold">
                          {performer.metric === 'Revenue' ? `QR ${performer.value.toFixed(2)}` : 
                           performer.metric === 'Efficiency' ? `${performer.value}%` : 
                           performer.value}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {performer.change >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${performer.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {performer.change >= 0 ? '+' : ''}{performer.change}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${Math.min(performer.value / 100 * 100, 100)}%` }}
                            ></div>
                          </div>
                          <Icon className="h-4 w-4 text-gray-500" />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 font-bold text-black">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <Activity className="h-4 w-4 text-purple-700" />
                  </div>
                  Recent Activity
              </CardTitle>
              <CardDescription>Latest restaurant activities and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.timestamp}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2 pt-3">
                  <CardTitle className="flex items-center gap-3 font-bold text-black">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                      <AlertTriangle className="h-4 w-4 text-purple-700" />
                    </div>
                    System Alerts
                </CardTitle>
                <CardDescription>Issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Low Stock Alert</p>
                      <p className="text-xs text-gray-600">3 items need restocking</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Info className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">System Update</p>
                      <p className="text-xs text-gray-600">New features available</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2 pt-3">
                  <CardTitle className="flex items-center gap-3 font-bold text-black">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                      <CheckCircle className="h-4 w-4 text-purple-700" />
                    </div>
                    System Status
                </CardTitle>
                <CardDescription>All systems operational</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">POS System</p>
                      <p className="text-xs text-gray-600">Running smoothly</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Payment Gateway</p>
                      <p className="text-xs text-gray-600">All methods active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Kitchen Display</p>
                      <p className="text-xs text-gray-600">Connected</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
