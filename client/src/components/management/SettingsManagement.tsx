import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Globe,
  Bell,
  Shield,
  Palette,
  Database,
  Wifi,
  Printer,
  CreditCard,
  Clock,
  Users,
  Zap,
  Eye,
  EyeOff,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface SettingsManagementProps {
  isActive: boolean;
}

interface RestaurantSettings {
  name: { en: string; ar: string };
  phone: string;
  email: string;
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  serviceCharge: number;
  logo: string;
}

interface NotificationSettings {
  orderNotifications: boolean;
  lowStockAlerts: boolean;
  paymentNotifications: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  ipWhitelist: string[];
  auditLogs: boolean;
}

export function SettingsManagement({ isActive }: SettingsManagementProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();

  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: { en: 'Digital Kitchen', ar: 'المطبخ الرقمي' },
    phone: '+974 1234 5678',
    email: 'info@digitalkitchen.qa',
    currency: 'QAR',
    timezone: 'Asia/Qatar',
    language: 'en',
    taxRate: 0.0,
    serviceCharge: 0.0,
    logo: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderNotifications: true,
    lowStockAlerts: true,
    paymentNotifications: true,
    systemAlerts: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    ipWhitelist: [],
    auditLogs: true
  });

  const [newIpAddress, setNewIpAddress] = useState('');

  useEffect(() => {
    if (isActive) {
      fetchSettings();
    }
  }, [isActive]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In real app, fetch settings from API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType: string) => {
    try {
      setSaving(true);
      // In real app, save settings to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: `${settingsType} settings saved successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to save ${settingsType} settings`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addIpAddress = () => {
    if (newIpAddress.trim() && !securitySettings.ipWhitelist.includes(newIpAddress.trim())) {
      setSecuritySettings({
        ...securitySettings,
        ipWhitelist: [...securitySettings.ipWhitelist, newIpAddress.trim()]
      });
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (ip: string) => {
    setSecuritySettings({
      ...securitySettings,
      ipWhitelist: securitySettings.ipWhitelist.filter(address => address !== ip)
    });
  };

  const exportSettings = () => {
    const allSettings = {
      restaurant: restaurantSettings,
      notifications: notificationSettings,
      security: securitySettings
    };
    
    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'restaurant-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Settings exported successfully',
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl flex items-center justify-center shadow-2xl">
            <Settings className="h-8 w-8 text-orange-700" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              System Settings
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default" className="px-3 py-1 text-sm font-semibold">
                Admin Only
              </Badge>
              <span className="text-slate-600 text-sm">
                Configure restaurant settings and system preferences
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={exportSettings}
            size="lg"
            variant="outline"
            className="shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Settings
          </Button>
          <Button 
            onClick={() => saveSettings('All')}
            disabled={saving}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl"
          >
            <Save className={`h-5 w-5 mr-2 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                Restaurant Information
              </CardTitle>
              <CardDescription>Basic restaurant details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="nameEn" className="text-sm font-semibold">Restaurant Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={restaurantSettings.name.en}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      name: { ...restaurantSettings.name, en: e.target.value }
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="nameAr" className="text-sm font-semibold">Restaurant Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={restaurantSettings.name.ar}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      name: { ...restaurantSettings.name, ar: e.target.value }
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                  <Input
                    id="phone"
                    value={restaurantSettings.phone}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      phone: e.target.value
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={restaurantSettings.email}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      email: e.target.value
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="currency" className="text-sm font-semibold">Currency</Label>
                  <Select 
                    value={restaurantSettings.currency} 
                    onValueChange={(value) => setRestaurantSettings({ ...restaurantSettings, currency: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QAR">QAR - Qatari Riyal</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone" className="text-sm font-semibold">Timezone</Label>
                  <Select 
                    value={restaurantSettings.timezone} 
                    onValueChange={(value) => setRestaurantSettings({ ...restaurantSettings, timezone: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Qatar">Asia/Qatar</SelectItem>
                      <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language" className="text-sm font-semibold">Default Language</Label>
                  <Select 
                    value={restaurantSettings.language} 
                    onValueChange={(value) => setRestaurantSettings({ ...restaurantSettings, language: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="taxRate" className="text-sm font-semibold">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    value={restaurantSettings.taxRate}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      taxRate: parseFloat(e.target.value) || 0
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceCharge" className="text-sm font-semibold">Service Charge (%)</Label>
                  <Input
                    id="serviceCharge"
                    type="number"
                    step="0.01"
                    value={restaurantSettings.serviceCharge}
                    onChange={(e) => setRestaurantSettings({
                      ...restaurantSettings,
                      serviceCharge: parseFloat(e.target.value) || 0
                    })}
                    className="h-12 rounded-xl mt-2"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('Restaurant')}
                  disabled={saving}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Restaurant Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Order Notifications</div>
                      <div className="text-sm text-slate-600">Get notified when new orders are received</div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      orderNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Low Stock Alerts</div>
                      <div className="text-sm text-slate-600">Receive alerts when inventory is running low</div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      lowStockAlerts: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Payment Notifications</div>
                      <div className="text-sm text-slate-600">Get notified about payment confirmations</div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.paymentNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      paymentNotifications: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">System Alerts</div>
                      <div className="text-sm text-slate-600">Receive important system notifications</div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      systemAlerts: checked
                    })}
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="font-semibold text-lg mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Email Notifications</div>
                        <div className="text-sm text-slate-600">Send notifications via email</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">SMS Notifications</div>
                        <div className="text-sm text-slate-600">Send notifications via SMS</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('Notification')}
                  disabled={saving}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                Security Settings
              </CardTitle>
              <CardDescription>Configure security preferences and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Two-Factor Authentication</div>
                      <div className="text-sm text-slate-600">Add an extra layer of security to your account</div>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Audit Logs</div>
                      <div className="text-sm text-slate-600">Keep track of all system activities</div>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogs}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      auditLogs: checked
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold">Session Timeout (minutes)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout.toString()} 
                    onValueChange={(value) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: parseInt(value)
                    })}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Password Policy</Label>
                  <Select 
                    value={securitySettings.passwordPolicy} 
                    onValueChange={(value) => setSecuritySettings({
                      ...securitySettings,
                      passwordPolicy: value
                    })}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - 6+ characters</SelectItem>
                      <SelectItem value="medium">Medium - 8+ characters, mixed case</SelectItem>
                      <SelectItem value="high">High - 12+ characters, mixed case, numbers, symbols</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">IP Whitelist</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newIpAddress}
                      onChange={(e) => setNewIpAddress(e.target.value)}
                      placeholder="Enter IP address (e.g., 192.168.1.1)"
                      className="h-12 rounded-xl"
                    />
                    <Button 
                      onClick={addIpAddress}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {securitySettings.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                        <span className="font-mono text-sm">{ip}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIpAddress(ip)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={() => saveSettings('Security')}
                  disabled={saving}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                  <Palette className="h-4 w-4 text-white" />
                </div>
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel of your application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Palette className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Theme Customization
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced appearance settings coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Wifi className="h-4 w-4 text-white" />
                </div>
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Connect with external services and APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Wifi className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Integration Hub
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Third-party integrations and API connections coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
