import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/store/authStore';
import { usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';
import { Link } from 'wouter';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  Clock, 
  DollarSign,
  ChefHat,
  AlertTriangle,
  CheckCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { state, hasAnyRole } = useAuth();
  const { language } = usePOS();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Mock data - in real app, this would come from API
  const metrics = {
    revenue: {
      today: 8450,
      yesterday: 7200,
      change: 17.4
    },
    orders: {
      today: 127,
      yesterday: 98,
      change: 29.6
    },
    customers: {
      today: 89,
      yesterday: 76,
      change: 17.1
    },
    avgOrderValue: {
      today: 66.5,
      yesterday: 73.5,
      change: -9.5
    }
  };

  const topItems = [
    { name: 'Chicken Shawarma', nameAr: 'شاورما الدجاج', orders: 45, revenue: 1350, growth: 12 },
    { name: 'Beef Burger', nameAr: 'برجر اللحم', orders: 38, revenue: 1140, growth: 8 },
    { name: 'Falafel Wrap', nameAr: 'لف الفلافل', orders: 32, revenue: 640, growth: 15 },
    { name: 'Lamb Kebab', nameAr: 'كباب الضأن', orders: 28, revenue: 1120, growth: 5 },
    { name: 'Hummus Plate', nameAr: 'طبق الحمص', orders: 25, revenue: 500, growth: 22 }
  ];

  const recentOrders = [
    { id: '#1001', table: '5', items: 3, total: 45.50, status: 'preparing', time: '2 min ago' },
    { id: '#1002', table: '12', items: 2, total: 32.00, status: 'ready', time: '5 min ago' },
    { id: '#1003', table: '8', items: 4, total: 67.50, status: 'served', time: '8 min ago' },
    { id: '#1004', table: '3', items: 1, total: 18.00, status: 'preparing', time: '12 min ago' },
    { id: '#1005', table: '15', items: 2, total: 28.50, status: 'ready', time: '15 min ago' }
  ];

  const staffPerformance = [
    { name: 'Ahmed Ali', nameAr: 'أحمد علي', role: 'Chef', orders: 45, rating: 4.8, status: 'online' },
    { name: 'Sarah Johnson', nameAr: 'سارة جونسون', role: 'Server', orders: 32, rating: 4.9, status: 'online' },
    { name: 'Mohammed Hassan', nameAr: 'محمد حسن', role: 'Cashier', orders: 28, rating: 4.7, status: 'break' },
    { name: 'Fatima Al-Zahra', nameAr: 'فاطمة الزهراء', role: 'Server', orders: 35, rating: 4.9, status: 'online' }
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Low stock: Chicken Breast (5 items left)', messageAr: 'مخزون منخفض: صدر الدجاج (5 قطع متبقية)' },
    { type: 'info', message: 'New order received from Table 7', messageAr: 'طلب جديد من الطاولة 7' },
    { type: 'success', message: 'Payment processed successfully - QR 45.50', messageAr: 'تم معالجة الدفع بنجاح - 45.50 ريال قطري' },
    { type: 'warning', message: 'Kitchen display connection restored', messageAr: 'تم استعادة اتصال عرض المطبخ' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'served': return 'bg-blue-100 text-blue-800';
      case 'online': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Activity className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="w-full bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center mr-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {language === 'ar' 
                      ? 'نظرة عامة شاملة على أداء المطعم'
                      : 'Comprehensive overview of restaurant performance'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="rounded-xl border-blue-500 border-[1px] text-blue-600 hover:bg-blue-50">
                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                {language === 'ar' ? 'عرض التقرير' : 'View Report'}
              </Button>
              <Link href="/management">
                <Button className="bg-red-600 hover:bg-red-700 rounded-xl">
                  <Settings className="h-4 w-4 mr-2 text-white" />
                  {language === 'ar' ? 'الإعدادات' : 'Settings'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-base font-bold text-black">
                    {language === 'ar' ? 'إيرادات اليوم' : 'Today\'s Revenue'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">QR {metrics.revenue.today.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{metrics.revenue.change}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {language === 'ar' ? 'من الأمس' : 'vs yesterday'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-base font-bold text-black">
                    {language === 'ar' ? 'الطلبات اليوم' : 'Today\'s Orders'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.orders.today}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{metrics.orders.change}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {language === 'ar' ? 'من الأمس' : 'vs yesterday'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-base font-bold text-black">
                    {language === 'ar' ? 'العملاء اليوم' : 'Today\'s Customers'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.customers.today}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+{metrics.customers.change}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {language === 'ar' ? 'من الأمس' : 'vs yesterday'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-base font-bold text-black">
                    {language === 'ar' ? 'متوسط قيمة الطلب' : 'Avg Order Value'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">QR {metrics.avgOrderValue.today}</p>
                  <div className="flex items-center mt-2">
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    <span className="text-sm text-red-600 font-medium">{metrics.avgOrderValue.change}%</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {language === 'ar' ? 'من الأمس' : 'vs yesterday'}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50 rounded-xl p-1.5 overflow-hidden">
            <TabsTrigger value="overview" className="rounded-lg flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 hover:bg-white/50 transition-colors h-10">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-lg flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 hover:bg-white/50 transition-colors h-10">
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'الطلبات' : 'Orders'}</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="rounded-lg flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 hover:bg-white/50 transition-colors h-10">
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'الموظفون' : 'Staff'}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="rounded-lg flex items-center justify-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 hover:bg-white/50 transition-colors h-10">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'ar' ? 'التنبيهات' : 'Alerts'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Items */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center mr-2">
                      <ChefHat className="h-4 w-4 text-orange-600" />
                    </div>
                    {language === 'ar' ? 'أفضل الأطباق' : 'Top Items'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-black">
                              {language === 'ar' ? item.nameAr : item.name}
                            </p>
                            <p className="text-sm text-black">{item.orders} {language === 'ar' ? 'طلب' : 'orders'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">QR {item.revenue}</p>
                          <div className="flex items-center">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-xs text-green-600">+{item.growth}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-black">
                    <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center mr-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-black font-bold text-sm">
                            {order.id.slice(1)}
                          </div>
                          <div>
                            <p className="font-medium text-black">{order.id}</p>
                            <p className="text-sm text-black">
                              {language === 'ar' ? `الطاولة ${order.table}` : `Table ${order.table}`} • {order.items} {language === 'ar' ? 'عنصر' : 'items'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">QR {order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-black">
                      <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center mr-2">
                        <ShoppingCart className="h-4 w-4 text-blue-600" />
                      </div>
                      {language === 'ar' ? 'الطلبات الحالية' : 'Current Orders'}
                    </CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 font-bold">
                          {order.id.slice(1)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {language === 'ar' ? `الطاولة ${order.table}` : `Table ${order.table}`} • {order.items} {language === 'ar' ? 'عنصر' : 'items'}
                          </p>
                          <p className="text-xs text-gray-400">{order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-bold text-gray-900">QR {order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-6">
            <Card className="bg-white border border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-black">
                      <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      {language === 'ar' ? 'أداء الموظفين' : 'Staff Performance'}
                    </CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformance.map((staff, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 border border-gray-300 rounded-xl flex items-center justify-center text-gray-700 font-bold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {language === 'ar' ? staff.nameAr : staff.name}
                          </p>
                          <p className="text-sm text-gray-500">{staff.role}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs text-gray-600">{staff.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{staff.orders} {language === 'ar' ? 'طلب' : 'orders'}</p>
                          <Badge className={`text-xs ${getStatusColor(staff.status)}`}>
                            {staff.status}
                          </Badge>
                        </div>
                        <div className="w-16">
                          <Progress value={staff.rating * 20} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center mr-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  {language === 'ar' ? 'تنبيهات النظام' : 'System Alerts'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className={`flex items-start space-x-3 p-4 rounded-xl border ${getAlertColor(alert.type)}`}>
                      <div className="flex-shrink-0 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {language === 'ar' ? alert.messageAr : alert.message}
                        </p>
                        <p className="text-xs opacity-75 mt-1">
                          {language === 'ar' ? 'منذ دقائق قليلة' : 'A few minutes ago'}
                        </p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-xs">
                        {language === 'ar' ? 'عرض' : 'View'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
