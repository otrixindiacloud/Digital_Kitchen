  import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/authStore';
import { POSProvider, usePOS } from '@/store/posStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Bell, 
  Search,
  Filter,
  RefreshCw,
  Check,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Trash2,
  CheckCheck,
  Eye
} from 'lucide-react';
import { t } from '@/lib/i18n';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  category: string;
  actionRequired: boolean;
  expiresAt?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderNotifications: boolean;
  systemNotifications: boolean;
  lowStockAlerts: boolean;
  paymentAlerts: boolean;
  maintenanceAlerts: boolean;
}

function NotificationsContent() {
  const { state } = useAuth();
  const { language } = usePOS();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    orderNotifications: true,
    systemNotifications: true,
    lowStockAlerts: true,
    paymentAlerts: true,
    maintenanceAlerts: false
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: language === 'ar' ? 'طلب جديد' : 'New Order',
        message: language === 'ar' ? 'تم إنشاء طلب جديد #1234 من الطاولة 5' : 'New order #1234 created from Table 5',
        type: 'info',
        priority: 'high',
        timestamp: '2 minutes ago',
        isRead: false,
        category: 'orders',
        actionRequired: true
      },
      {
        id: '2',
        title: language === 'ar' ? 'مخزون منخفض' : 'Low Stock Alert',
        message: language === 'ar' ? 'كمية البيتزا المارغريتا منخفضة (5 قطع متبقية)' : 'Pizza Margherita stock is low (5 items remaining)',
        type: 'warning',
        priority: 'medium',
        timestamp: '15 minutes ago',
        isRead: false,
        category: 'inventory',
        actionRequired: true
      },
      {
        id: '3',
        title: language === 'ar' ? 'دفعة ناجحة' : 'Payment Successful',
        message: language === 'ar' ? 'تم استلام دفعة بقيمة 150 ريال للطلب #1233' : 'Payment of 150 QR received for order #1233',
        type: 'success',
        priority: 'low',
        timestamp: '1 hour ago',
        isRead: true,
        category: 'payments',
        actionRequired: false
      },
      {
        id: '4',
        title: language === 'ar' ? 'خطأ في النظام' : 'System Error',
        message: language === 'ar' ? 'حدث خطأ في طباعة الإيصال. يرجى إعادة المحاولة.' : 'Error occurred while printing receipt. Please try again.',
        type: 'error',
        priority: 'urgent',
        timestamp: '2 hours ago',
        isRead: true,
        category: 'system',
        actionRequired: true
      },
      {
        id: '5',
        title: language === 'ar' ? 'تحديث النظام' : 'System Update',
        message: language === 'ar' ? 'تم تحديث النظام بنجاح إلى الإصدار 2.1.0' : 'System successfully updated to version 2.1.0',
        type: 'info',
        priority: 'low',
        timestamp: '1 day ago',
        isRead: true,
        category: 'system',
        actionRequired: false
      },
      {
        id: '6',
        title: language === 'ar' ? 'صيانة مجدولة' : 'Scheduled Maintenance',
        message: language === 'ar' ? 'سيتم إجراء صيانة للنظام غداً من 2:00 صباحاً إلى 4:00 صباحاً' : 'System maintenance scheduled tomorrow from 2:00 AM to 4:00 AM',
        type: 'warning',
        priority: 'medium',
        timestamp: '2 days ago',
        isRead: true,
        category: 'maintenance',
        actionRequired: false
      }
    ];

    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, [language]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return language === 'ar' ? 'عاجل' : 'Urgent';
      case 'high': return language === 'ar' ? 'عالي' : 'High';
      case 'medium': return language === 'ar' ? 'متوسط' : 'Medium';
      case 'low': return language === 'ar' ? 'منخفض' : 'Low';
      default: return priority;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    return matchesSearch && matchesType && matchesPriority;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(notification => !notification.isRead));
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4 shadow-lg relative">
                <Bell className="h-6 w-6 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              {language === 'ar' ? 'الإشعارات' : 'Notifications'}
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-3 bg-blue-100 text-blue-800">
                  {unreadCount} {language === 'ar' ? 'جديد' : 'new'}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              {language === 'ar' ? 'إدارة وإشعارات النظام' : 'Manage and view system notifications'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="border-blue-500 border text-blue-600 hover:bg-blue-50"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تعيين الكل كمقروء' : 'Mark All Read'}
            </Button>
            <Button 
              variant="outline" 
              onClick={clearAllRead}
              className="border-blue-500 border text-blue-600 hover:bg-blue-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'مسح المقروء' : 'Clear Read'}
            </Button>
            <Button 
              variant="outline"
              className="border-blue-500 border text-blue-600 hover:bg-blue-50 bg-transparent"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                }, 1000);
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'تحديث' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{language === 'ar' ? 'إجمالي الإشعارات' : 'Total Notifications'}</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{language === 'ar' ? 'غير مقروء' : 'Unread'}</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{language === 'ar' ? 'عاجل' : 'Urgent'}</p>
                <p className="text-2xl font-bold text-gray-900">{urgentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{language === 'ar' ? 'يتطلب إجراء' : 'Action Required'}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.actionRequired && !n.isRead).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 border border-gray-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-900" />
            {language === 'ar' ? 'البحث والتصفية' : 'Filter and Search'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={language === 'ar' ? 'البحث في الإشعارات...' : 'Search notifications...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:ring-0 focus:border-gray-300 hover:border-gray-300 shadow-none"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            >
              <option value="all">{language === 'ar' ? 'جميع الأنواع' : 'All Types'}</option>
              <option value="info">{language === 'ar' ? 'معلومات' : 'Info'}</option>
              <option value="success">{language === 'ar' ? 'نجاح' : 'Success'}</option>
              <option value="warning">{language === 'ar' ? 'تحذير' : 'Warning'}</option>
              <option value="error">{language === 'ar' ? 'خطأ' : 'Error'}</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
            >
              <option value="all">{language === 'ar' ? 'جميع الأولويات' : 'All Priorities'}</option>
              <option value="urgent">{language === 'ar' ? 'عاجل' : 'Urgent'}</option>
              <option value="high">{language === 'ar' ? 'عالي' : 'High'}</option>
              <option value="medium">{language === 'ar' ? 'متوسط' : 'Medium'}</option>
              <option value="low">{language === 'ar' ? 'منخفض' : 'Low'}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="notifications"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <Bell className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الإشعارات' : 'Notifications'} ({filteredNotifications.length})
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm text-gray-600 hover:text-gray-900 transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الإعدادات' : 'Settings'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications found'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {language === 'ar' 
                      ? 'لا توجد إشعارات تطابق معايير البحث الخاصة بك' 
                      : 'No notifications match your search criteria'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterPriority('all');
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إعادة تعيين المرشحات' : 'Reset Filters'}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => {
              const TypeIcon = getTypeIcon(notification.type);
              
              return (
                <TooltipProvider key={notification.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${
                          !notification.isRead ? 'ring-2 ring-blue-200 bg-orange-50/30' : ''
                        }`}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                      >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        <TypeIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              )}
                              {notification.actionRequired && (
                                <Badge variant="outline" className="text-xs">
                                  {language === 'ar' ? 'يتطلب إجراء' : 'Action Required'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {notification.timestamp}
                              </div>
                              <div className="flex items-center">
                                <div className={`w-2 h-2 ${getPriorityColor(notification.priority)} rounded-full mr-1`}></div>
                                {getPriorityText(notification.priority)}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-orange-600 hover:text-orange-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                      </Card>
                    </TooltipTrigger>
                    {!notification.isRead && (
                      <TooltipContent>
                        <p>{language === 'ar' ? 'انقر لتعيين كمقروء' : 'Click to mark as read'}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              );
            }))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-blue-400">
            <CardHeader>
              <CardTitle className="text-blue-600">{language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}</CardTitle>
              <CardDescription>
                {language === 'ar' ? 'تخصيص أنواع الإشعارات التي تريد استلامها' : 'Customize which types of notifications you want to receive'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{language === 'ar' ? 'التنبيهات العامة' : 'General Alerts'}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications'}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{language === 'ar' ? 'إشعارات العمل' : 'Work Notifications'}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.orderNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, orderNotifications: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'إشعارات الطلبات' : 'Order Notifications'}</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.systemNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, systemNotifications: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'إشعارات النظام' : 'System Notifications'}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{language === 'ar' ? 'تنبيهات المخزون' : 'Inventory Alerts'}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.lowStockAlerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, lowStockAlerts: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'تنبيهات المخزون المنخفض' : 'Low Stock Alerts'}</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.paymentAlerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, paymentAlerts: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'تنبيهات الدفع' : 'Payment Alerts'}</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{language === 'ar' ? 'تنبيهات الصيانة' : 'Maintenance Alerts'}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceAlerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, maintenanceAlerts: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm">{language === 'ar' ? 'تنبيهات الصيانة' : 'Maintenance Alerts'}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Notifications() {
  return (
    <POSProvider>
      <NotificationsContent />
    </POSProvider>
  );
}
