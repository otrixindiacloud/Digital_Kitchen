import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface ReportsAnalyticsProps {
  isActive: boolean;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface TopItem {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
  category: string;
}

interface StaffPerformance {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
  rating: number;
}

export function ReportsAnalytics({ isActive }: ReportsAnalyticsProps) {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock data - in real app, this would come from API
  const [salesData] = useState<SalesData[]>([
    { date: '2024-01-01', revenue: 1250.50, orders: 45, averageOrderValue: 27.79 },
    { date: '2024-01-02', revenue: 1890.25, orders: 62, averageOrderValue: 30.49 },
    { date: '2024-01-03', revenue: 2100.75, orders: 58, averageOrderValue: 36.22 },
    { date: '2024-01-04', revenue: 1750.00, orders: 48, averageOrderValue: 36.46 },
    { date: '2024-01-05', revenue: 2200.30, orders: 65, averageOrderValue: 33.85 },
    { date: '2024-01-06', revenue: 1950.80, orders: 52, averageOrderValue: 37.52 },
    { date: '2024-01-07', revenue: 2300.45, orders: 68, averageOrderValue: 33.83 },
  ]);

  const [topItems] = useState<TopItem[]>([
    { id: '1', name: 'Chicken Shawarma', quantity: 125, revenue: 1875.00, category: 'Main Dishes' },
    { id: '2', name: 'Falafel Wrap', quantity: 98, revenue: 1470.00, category: 'Wraps' },
    { id: '3', name: 'Hummus Plate', quantity: 87, revenue: 1305.00, category: 'Appetizers' },
    { id: '4', name: 'Lamb Kebab', quantity: 76, revenue: 1900.00, category: 'Main Dishes' },
    { id: '5', name: 'Baklava', quantity: 65, revenue: 975.00, category: 'Desserts' },
  ]);

  const [staffPerformance] = useState<StaffPerformance[]>([
    { id: '1', name: 'Ahmed Hassan', orders: 45, revenue: 1250.50, averageOrderValue: 27.79, rating: 4.8 },
    { id: '2', name: 'Fatima Al-Zahra', orders: 38, revenue: 1100.25, averageOrderValue: 28.95, rating: 4.9 },
    { id: '3', name: 'Omar Khalil', orders: 42, revenue: 1180.75, averageOrderValue: 28.11, rating: 4.7 },
    { id: '4', name: 'Layla Mahmoud', orders: 35, revenue: 950.00, averageOrderValue: 27.14, rating: 4.6 },
  ]);

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const revenueGrowth = 12.5; // Mock growth percentage
  const orderGrowth = 8.3; // Mock growth percentage

  const fetchReports = async () => {
    try {
      setLoading(true);
      // In real app, fetch data based on dateRange
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: 'Success',
        description: 'Reports data refreshed successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch reports data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
          toast({
      title: 'Export Started',
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
    // In real app, implement actual export functionality
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center shadow-2xl">
            <BarChart3 className="h-8 w-8 text-blue-700" />
          </div>
        <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h2>
            <div className="flex items-center gap-3 mt-2">
            <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Comprehensive business insights and performance metrics
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px] h-12 rounded-xl border border-gray-300">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
                    <Button 
            onClick={fetchReports} 
            disabled={loading}
            size="lg"
                      variant="outline" 
            className="text-blue-600 border border-blue-500 hover:bg-blue-50 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => exportReport('pdf')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

            {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Total Revenue</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
                </CardHeader>
                <CardContent>
            <div className="text-3xl font-bold text-gray-900">QR {totalRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+{revenueGrowth}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                </CardContent>
              </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Total Orders</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
                </CardHeader>
                <CardContent>
            <div className="text-3xl font-bold text-gray-900">{totalOrders}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+{orderGrowth}%</span>
              <span className="text-xs text-gray-500">vs last period</span>
                    </div>
                </CardContent>
              </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Avg Order Value</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
            <div className="text-3xl font-bold text-gray-900">QR {averageOrderValue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+5.2%</span>
              <span className="text-xs text-gray-500">vs last period</span>
            </div>
                </CardContent>
              </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Active Staff</CardTitle>
            <div className="w-12 h-12 bg-orange-200 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
              </CardHeader>
              <CardContent>
            <div className="text-3xl font-bold text-gray-900">{staffPerformance.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <Award className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-600 font-medium">4.8 avg rating</span>
                </div>
              </CardContent>
            </Card>
      </div>

      {/* Performance Alert */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
        <Activity className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Great Performance!</strong> Your restaurant is performing 15% better than last month. 
          Revenue is up {revenueGrowth}% and customer satisfaction is at an all-time high.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="items">Top Items</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  Revenue Trend
                </CardTitle>
                <CardDescription>Daily revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesData.map((day, index) => {
                    const maxRevenue = Math.max(...salesData.map(d => d.revenue));
                    const percentage = (day.revenue / maxRevenue) * 100;
                    return (
                      <div key={day.date} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                          <span className="text-slate-600">QR {day.revenue.toFixed(2)}</span>
                          </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center">
                    <PieChart className="h-4 w-4 text-purple-600" />
                  </div>
                  Order Distribution
                </CardTitle>
                <CardDescription>Orders by time of day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: 'Morning (6-12)', orders: 45, color: 'from-yellow-400 to-orange-500' },
                    { time: 'Afternoon (12-18)', orders: 120, color: 'from-blue-400 to-cyan-500' },
                    { time: 'Evening (18-24)', orders: 95, color: 'from-purple-400 to-pink-500' },
                    { time: 'Night (0-6)', orders: 15, color: 'from-slate-400 to-slate-500' },
                  ].map((period, index) => {
                    const totalOrders = 275;
                    const percentage = (period.orders / totalOrders) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{period.time}</span>
                          <span className="text-slate-600">{period.orders} orders ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${period.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
          </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-green-200 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                Sales Performance
              </CardTitle>
              <CardDescription>Detailed sales metrics and trends</CardDescription>
                </CardHeader>
            <CardContent>
            <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((day, index) => {
                    const prevDay = index > 0 ? salesData[index - 1] : null;
                    const growth = prevDay ? ((day.revenue - prevDay.revenue) / prevDay.revenue) * 100 : 0;
                    
                    return (
                      <TableRow key={day.date} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableCell className="font-medium">
                          {new Date(day.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-mono font-semibold">
                          QR {day.revenue.toFixed(2)}
                        </TableCell>
                        <TableCell>{day.orders}</TableCell>
                        <TableCell className="font-mono">QR {day.averageOrderValue.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {growth >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </span>
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

        <TabsContent value="items" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center">
                  <Award className="h-4 w-4 text-orange-600" />
                </div>
                Top Performing Items
              </CardTitle>
              <CardDescription>Best selling menu items by revenue and quantity</CardDescription>
                </CardHeader>
            <CardContent>
            <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topItems.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                            'bg-gradient-to-br from-slate-300 to-slate-400'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{item.quantity}</TableCell>
                      <TableCell className="font-mono font-semibold">QR {item.revenue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
                              style={{ width: `${(item.quantity / Math.max(...topItems.map(i => i.quantity))) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {((item.quantity / Math.max(...topItems.map(i => i.quantity))) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
               </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-indigo-200 rounded-xl flex items-center justify-center">
                  <Users className="h-4 w-4 text-indigo-600" />
                </div>
                Staff Performance
              </CardTitle>
              <CardDescription>Individual staff performance metrics and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Orders Handled</TableHead>
                    <TableHead>Revenue Generated</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell className="font-semibold">{staff.orders}</TableCell>
                      <TableCell className="font-mono font-semibold">QR {staff.revenue.toFixed(2)}</TableCell>
                      <TableCell className="font-mono">QR {staff.averageOrderValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < Math.floor(staff.rating) 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-slate-300'
                                }`} 
                              />
                            ))}
                      </div>
                          <span className="text-sm font-medium ml-1">{staff.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full"
                              style={{ width: `${(staff.rating / 5) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {((staff.rating / 5) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-pink-200 rounded-xl flex items-center justify-center">
                  <Users className="h-4 w-4 text-pink-600" />
                </div>
                Customer Analytics
              </CardTitle>
              <CardDescription>Customer behavior and satisfaction metrics</CardDescription>
                </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Customer Analytics
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced customer insights and behavior analysis coming soon
                </p>
                  </div>
                </CardContent>
              </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
