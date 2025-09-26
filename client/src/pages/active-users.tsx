import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/authStore';
import { POSProvider, usePOS } from '@/store/posStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchFilterCard } from '@/components/ui/search-filter-card';
import { 
  Users, 
  User, 
  Clock, 
  MapPin, 
  Activity, 
  Search,
  Filter,
  RefreshCw,
  Eye,
  Shield,
  ChefHat,
  ShoppingCart,
  BarChart3,
  Settings
} from 'lucide-react';
import { t } from '@/lib/i18n';

interface ActiveUser {
  id: string;
  username: string;
  role: string;
  lastActivity: string;
  currentPage: string;
  ipAddress: string;
  device: string;
  status: 'online' | 'away' | 'busy';
  avatar?: string;
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
  page: string;
}

function ActiveUsersContent() {
  const { state } = useAuth();
  const { language } = usePOS();
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockActiveUsers: ActiveUser[] = [
      {
        id: '1',
        username: 'admin',
        role: 'admin',
        lastActivity: '2 minutes ago',
        currentPage: 'POS System',
        ipAddress: '192.168.1.100',
        device: 'Desktop Chrome',
        status: 'online'
      },
      {
        id: '2',
        username: 'manager1',
        role: 'manager',
        lastActivity: '5 minutes ago',
        currentPage: 'Management',
        ipAddress: '192.168.1.101',
        device: 'Mobile Safari',
        status: 'online'
      },
      {
        id: '3',
        username: 'cashier1',
        role: 'cashier',
        lastActivity: '1 minute ago',
        currentPage: 'POS System',
        ipAddress: '192.168.1.102',
        device: 'Desktop Firefox',
        status: 'busy'
      },
      {
        id: '4',
        username: 'cashier2',
        role: 'cashier',
        lastActivity: '15 minutes ago',
        currentPage: 'Kitchen',
        ipAddress: '192.168.1.103',
        device: 'Tablet Chrome',
        status: 'away'
      }
    ];

    const mockActivities: UserActivity[] = [
      {
        id: '1',
        userId: '1',
        action: 'Logged in',
        timestamp: '2 minutes ago',
        details: 'Successfully logged into the system',
        page: 'Login'
      },
      {
        id: '2',
        userId: '2',
        action: 'Created order',
        timestamp: '5 minutes ago',
        details: 'Order #1234 created for Table 5',
        page: 'POS System'
      },
      {
        id: '3',
        userId: '3',
        action: 'Updated inventory',
        timestamp: '8 minutes ago',
        details: 'Updated stock for Pizza Margherita',
        page: 'Management'
      },
      {
        id: '4',
        userId: '1',
        action: 'Viewed reports',
        timestamp: '10 minutes ago',
        details: 'Generated sales report for today',
        page: 'Dashboard'
      }
    ];

    setTimeout(() => {
      setActiveUsers(mockActiveUsers);
      setUserActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return language === 'ar' ? 'متصل' : 'Online';
      case 'away': return language === 'ar' ? 'غائب' : 'Away';
      case 'busy': return language === 'ar' ? 'مشغول' : 'Busy';
      default: return status;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'manager': return BarChart3;
      case 'cashier': return ShoppingCart;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600';
      case 'manager': return 'text-blue-600';
      case 'cashier': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleIconBg = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-200';
      case 'manager': return 'bg-blue-200';
      case 'cashier': return 'bg-green-200';
      default: return 'bg-gray-200';
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    return 'bg-red-200 text-red-600';
  };

  const getPageIcon = (page: string) => {
    switch (page) {
      case 'POS System': return ShoppingCart;
      case 'Management': return Settings;
      case 'Kitchen': return ChefHat;
      case 'Dashboard': return BarChart3;
      case 'Login': return Activity;
      default: return Activity;
    }
  };

  const getPageColor = (page: string) => {
    switch (page) {
      case 'Login':
      case 'POS System':
      case 'Management':
      case 'Dashboard':
        return 'text-blue-500';
      default:
        return 'text-gray-400';
    }
  };

  const getPageTextColor = (page: string) => {
    switch (page) {
      case 'Login':
      case 'POS System':
      case 'Management':
      case 'Dashboard':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredUsers = activeUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredActivities = userActivities.filter(activity => {
    const user = activeUsers.find(u => u.id === activity.userId);
    return user && user.username.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse" />
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
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-blue-200 shadow-sm mt-1">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                {language === 'ar' ? 'المستخدمون النشطون' : 'Active Users'}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === 'ar' ? 'مراقبة المستخدمين النشطين وأنشطتهم في النظام' : 'Monitor active users and their activities in the system'}
              </p>
            </div>
          </div>
          <Button className="bg-white  text-blue-500 border border-blue-500 ">
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Search and Filters Card */}
      <div className="mb-6">
        <Card className="shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            {/* Search and Filter Heading */}
            <div className="mb-4 flex items-center text-bl-600">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
              </div>
              <h3 className="text-sm font-bold">
                {language === 'ar' ? 'البحث والتصفية' : 'Search and Filter'}
              </h3>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={language === 'ar' ? 'البحث عن المستخدمين...' : 'Search users...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg"
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2.5 h-11 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 min-w-[120px]"
                >
                  <option value="all">{language === 'ar' ? 'جميع الأدوار' : 'All Roles'}</option>
                  <option value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</option>
                  <option value="manager">{language === 'ar' ? 'مدير مطعم' : 'Manager'}</option>
                  <option value="cashier">{language === 'ar' ? 'أمين صندوق' : 'Cashier'}</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'المستخدمون' : 'Users'} ({filteredUsers.length})
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Activity className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'الأنشطة' : 'Activities'} ({filteredActivities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              const PageIcon = getPageIcon(user.currentPage);
              const roleColor = getRoleColor(user.role);
              
              return (
                <Card key={user.id} className="shadow-lg bg-white">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className={`w-12 h-12 ${getRoleIconBg(user.role)} rounded-full flex items-center justify-center`}>
                            <RoleIcon className={`h-6 w-6 ${roleColor}`} />
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                        </div>
                        <div>
                          <CardTitle className="text-lg text-black font-bold">{user.username}</CardTitle>
                          <Badge className={`text-xs ${getRoleBadgeStyle(user.role)}`}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {user.lastActivity}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PageIcon className="h-4 w-4 mr-2" />
                      {user.currentPage}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.ipAddress}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Activity className="h-4 w-4 mr-2" />
                      {user.device}
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {language === 'ar' ? 'الحالة' : 'Status'}:
                        </span>
                        <Badge 
                          variant={user.status === 'online' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            user.status === 'online' 
                              ? 'bg-green-100 text-green-700' 
                              : user.status === 'away'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {getStatusText(user.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const user = activeUsers.find(u => u.id === activity.userId);
              const PageIcon = getPageIcon(activity.page);
              const roleColor = user ? getRoleColor(user.role) : 'text-gray-600';
              
              return (
                <Card key={activity.id} className="shadow-lg bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 ${getRoleIconBg(user?.role || 'default')} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <PageIcon className={`h-5 w-5 ${roleColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {user?.username} {activity.action}
                          </h3>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                        <div className="flex items-center mt-2">
                          <PageIcon className={`h-3 w-3 mr-1 ${getPageColor(activity.page)}`} />
                          <span className={`text-xs ${getPageTextColor(activity.page)}`}>{activity.page}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ActiveUsers() {
  return (
    <POSProvider>
      <ActiveUsersContent />
    </POSProvider>
  );
}
