import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Edit2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  User,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Star,
  Award,
  BarChart3,
  Briefcase,
  ChefHat,
  Utensils,
  Building2
} from 'lucide-react';
import { DetailsModal } from './DetailsModal';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface StaffManagementProps {
  isActive: boolean;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  hireDate: string;
  hourlyRate: number;
  isActive: boolean;
  totalHours: number;
  totalEarnings: number;
  rating: number;
  department: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export function StaffManagement({ isActive }: StaffManagementProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isStaffDialogOpen, setIsStaffDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsModalTitle, setDetailsModalTitle] = useState('');
  const [detailsModalDescription, setDetailsModalDescription] = useState<string | undefined>(undefined);
  const [detailsModalData, setDetailsModalData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      role: 'Manager',
      email: 'ahmed@restaurant.com',
      phone: '+974 1234 5678',
      hireDate: '2023-01-15',
      hourlyRate: 35.00,
      isActive: true,
      totalHours: 2080,
      totalEarnings: 72800.00,
      rating: 4.9,
      department: 'Management',
      emergencyContact: 'Fatima Hassan',
      emergencyPhone: '+974 1234 5679'
    },
    {
      id: '2',
      name: 'Fatima Al-Zahra',
      role: 'Head Chef',
      email: 'fatima@restaurant.com',
      phone: '+974 1234 5680',
      hireDate: '2023-03-20',
      hourlyRate: 30.00,
      isActive: true,
      totalHours: 1950,
      totalEarnings: 58500.00,
      rating: 4.8,
      department: 'Kitchen',
      emergencyContact: 'Omar Al-Zahra',
      emergencyPhone: '+974 1234 5681'
    },
    {
      id: '3',
      name: 'Omar Khalil',
      role: 'Server',
      email: 'omar@restaurant.com',
      phone: '+974 1234 5682',
      hireDate: '2023-06-10',
      hourlyRate: 25.00,
      isActive: true,
      totalHours: 1800,
      totalEarnings: 45000.00,
      rating: 4.7,
      department: 'Service',
      emergencyContact: 'Layla Khalil',
      emergencyPhone: '+974 1234 5683'
    },
    {
      id: '4',
      name: 'Layla Mahmoud',
      role: 'Cashier',
      email: 'layla@restaurant.com',
      phone: '+974 1234 5684',
      hireDate: '2023-09-05',
      hourlyRate: 22.00,
      isActive: false,
      totalHours: 1200,
      totalEarnings: 26400.00,
      rating: 4.5,
      department: 'Front Office',
      emergencyContact: 'Ahmed Mahmoud',
      emergencyPhone: '+974 1234 5685'
    }
  ]);
  const openDetailsModal = (title: string, description: string | undefined, details: Record<string, any>) => {
    setDetailsModalTitle(title);
    setDetailsModalDescription(description);
    setDetailsModalData(details);
    setDetailsModalOpen(true);
  };

  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hireDate: '',
    hourlyRate: '',
    department: '',
    emergencyContact: '',
    emergencyPhone: '',
    isActive: true
  });

  useEffect(() => {
    if (isActive) {
      fetchData();
    }
  }, [isActive]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch staff data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...staffForm,
          hourlyRate: parseFloat(staffForm.hourlyRate),
          totalHours: 0,
          totalEarnings: 0,
          rating: 5.0
        }),
      });

      if (!response.ok) throw new Error('Failed to save staff member');

      toast({
        title: 'Success',
        description: editingStaff ? 'Staff member updated' : 'Staff member added',
      });

      setIsStaffDialogOpen(false);
      setEditingStaff(null);
      resetStaffForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save staff member',
        variant: 'destructive',
      });
    }
  };

  const toggleStaffStatus = async (staffId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/staff/${staffId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Success',
        description: 'Staff status updated',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update staff status',
        variant: 'destructive',
      });
    }
  };

  const resetStaffForm = () => {
    setStaffForm({
      name: '',
      role: '',
      email: '',
      phone: '',
      hireDate: '',
      hourlyRate: '',
      department: '',
      emergencyContact: '',
      emergencyPhone: '',
      isActive: true
    });
  };

  const openEditDialog = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      hireDate: staff.hireDate,
      hourlyRate: staff.hourlyRate.toString(),
      department: staff.department,
      emergencyContact: staff.emergencyContact,
      emergencyPhone: staff.emergencyPhone,
      isActive: staff.isActive
    });
    setIsStaffDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      'Manager': 'bg-blue-100 text-blue-800',
      'Head Chef': 'bg-red-100 text-red-800',
      'Chef': 'bg-orange-100 text-orange-800',
      'Server': 'bg-green-100 text-green-800',
      'Cashier': 'bg-purple-100 text-purple-800',
      'Host': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800'}>
        {role}
      </Badge>
    );
  };

  const totalStaff = staffMembers.length;
  const activeStaff = staffMembers.filter(staff => staff.isActive).length;
  const totalEarnings = staffMembers.reduce((sum, staff) => sum + staff.totalEarnings, 0);
  const averageRating = staffMembers.reduce((sum, staff) => sum + staff.rating, 0) / totalStaff;

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = searchQuery === '' || 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-3xl flex items-center justify-center shadow-2xl">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        <div>
            <h2 className="text-4xl font-bold text-blue-600">
              Team Management
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Manage your restaurant team and staff information
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={fetchData}
            disabled={loading}
            size="lg"
            variant="outline"
            className="border border-blue-600 shadow-lg hover:shadow-xl text-blue-600"
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
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">Total Staff</CardTitle>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalStaff}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">+2 this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">Active Staff</CardTitle>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{activeStaff}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-green-600 font-medium">{((activeStaff / totalStaff) * 100).toFixed(1)}% of total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">Total Earnings</CardTitle>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">QR {totalEarnings.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3">
            <CardTitle className="text-lg font-bold text-black">Avg Rating</CardTitle>
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shadow-lg">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Award className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alert */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Great Team Performance!</strong> Your staff has an average rating of {averageRating.toFixed(1)}/5.0. 
          {activeStaff} of {totalStaff} staff members are currently active and performing well.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="staff">Staff List</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 text-xl font-bold text-black">
                  <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="h-4 w-4 text-orange-600" />
                  </div>
                  Department Distribution
                </CardTitle>
                <CardDescription>Staff distribution across departments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Management', icon: Briefcase, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
                  { name: 'Kitchen', icon: ChefHat, color: 'from-red-400 to-red-600', bgColor: 'bg-red-100', textColor: 'text-red-600' },
                  { name: 'Service', icon: Utensils, color: 'from-green-400 to-green-600', bgColor: 'bg-green-100', textColor: 'text-green-600' },
                  { name: 'Front Office', icon: Building2, color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-100', textColor: 'text-purple-600' }
                ].map((dept) => {
                  const deptStaff = staffMembers.filter(staff => staff.department === dept.name);
                  const percentage = totalStaff > 0 ? (deptStaff.length / totalStaff) * 100 : 0;
                  const IconComponent = dept.icon;
                  return (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 ${dept.bgColor} rounded-lg flex items-center justify-center`}>
                            <IconComponent className={`h-3 w-3 ${dept.textColor}`} />
                          </div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <span className="text-slate-600">{deptStaff.length} staff ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${dept.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="flex items-center gap-3 font-bold text-black">
                  <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="h-4 w-4 text-emerald-600" />
                  </div>
                  Top Performers
                </CardTitle>
                <CardDescription>Highest rated staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffMembers
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4)
                    .map((staff, index) => (
                    <div key={staff.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                          index === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                          'bg-gradient-to-br from-slate-300 to-slate-400'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{staff.name}</div>
                          <div className="text-xs text-slate-500">{staff.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold text-sm">{staff.rating}</span>
                        </div>
                        <div className="text-xs text-slate-500">{staff.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-black">Staff Members</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search staff..."
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px] h-12 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Head Chef">Head Chef</SelectItem>
                      <SelectItem value="Chef">Chef</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Cashier">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isStaffDialogOpen} onOpenChange={setIsStaffDialogOpen}>
                <DialogTrigger asChild>
                      <Button 
                        onClick={resetStaffForm}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
              <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                </DialogTitle>
                    <DialogDescription className="text-base">
                      {editingStaff ? 'Update staff member information' : 'Add a new team member to your restaurant'}
                </DialogDescription>
              </DialogHeader>
                  
                  <form onSubmit={handleStaffSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="staffName" className="text-sm font-semibold">Full Name</Label>
                        <Input
                          id="staffName"
                          value={staffForm.name}
                          onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                          required
                          className="h-12 rounded-xl mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="staffRole" className="text-sm font-semibold">Role</Label>
                        <Select 
                          value={staffForm.role} 
                          onValueChange={(value) => setStaffForm({ ...staffForm, role: value })}
                        >
                          <SelectTrigger className="h-12 rounded-xl mt-2">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Head Chef">Head Chef</SelectItem>
                            <SelectItem value="Chef">Chef</SelectItem>
                            <SelectItem value="Server">Server</SelectItem>
                            <SelectItem value="Cashier">Cashier</SelectItem>
                            <SelectItem value="Host">Host</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                <div className="grid grid-cols-2 gap-4">
                  <div>
                        <Label htmlFor="staffEmail" className="text-sm font-semibold">Email</Label>
                    <Input
                          id="staffEmail"
                          type="email"
                          value={staffForm.email}
                          onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                          required
                          className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  <div>
                        <Label htmlFor="staffPhone" className="text-sm font-semibold">Phone</Label>
                    <Input
                          id="staffPhone"
                          value={staffForm.phone}
                          onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                          required
                          className="h-12 rounded-xl mt-2"
                    />
                  </div>
                </div>
                    
                    
                    <div className="grid grid-cols-2 gap-4">
                <div>
                        <Label htmlFor="hireDate" className="text-sm font-semibold">Hire Date</Label>
                  <Input
                          id="hireDate"
                          type="date"
                          value={staffForm.hireDate}
                          onChange={(e) => setStaffForm({ ...staffForm, hireDate: e.target.value })}
                    required
                          className="h-12 rounded-xl mt-2"
                  />
                </div>
                <div>
                        <Label htmlFor="hourlyRate" className="text-sm font-semibold">Hourly Rate (QR)</Label>
                  <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value={staffForm.hourlyRate}
                          onChange={(e) => setStaffForm({ ...staffForm, hourlyRate: e.target.value })}
                          required
                          className="h-12 rounded-xl mt-2"
                  />
                </div>
                    </div>
                    
                <div>
                      <Label htmlFor="department" className="text-sm font-semibold">Department</Label>
                      <Select 
                        value={staffForm.department} 
                        onValueChange={(value) => setStaffForm({ ...staffForm, department: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl mt-2">
                          <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="Kitchen">Kitchen</SelectItem>
                          <SelectItem value="Service">Service</SelectItem>
                          <SelectItem value="Front Office">Front Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                    
                <div className="grid grid-cols-2 gap-4">
                  <div>
                        <Label htmlFor="emergencyContact" className="text-sm font-semibold">Emergency Contact</Label>
                    <Input
                          id="emergencyContact"
                          value={staffForm.emergencyContact}
                          onChange={(e) => setStaffForm({ ...staffForm, emergencyContact: e.target.value })}
                          className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  <div>
                        <Label htmlFor="emergencyPhone" className="text-sm font-semibold">Emergency Phone</Label>
                    <Input
                          id="emergencyPhone"
                          value={staffForm.emergencyPhone}
                          onChange={(e) => setStaffForm({ ...staffForm, emergencyPhone: e.target.value })}
                          className="h-12 rounded-xl mt-2"
                    />
                  </div>
                </div>
                    
                    <div className="flex items-center space-x-3">
                  <Switch
                        id="staffActive"
                        checked={staffForm.isActive}
                        onCheckedChange={(checked) => setStaffForm({ ...staffForm, isActive: checked })}
                      />
                      <Label htmlFor="staffActive" className="text-sm font-semibold">Active Staff Member</Label>
                </div>
                    
                <DialogFooter>
                      <Button 
                        type="submit" 
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      >
                        {editingStaff ? 'Update Staff' : 'Add Staff'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
            </CardHeader>

            <div className="mx-6 mb-6">
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                    <TableHead className="font-semibold text-gray-900">Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Role</TableHead>
                    <TableHead className="font-semibold text-gray-900">Department</TableHead>
                    <TableHead className="font-semibold text-gray-900">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-900">Hourly Rate</TableHead>
                    <TableHead className="font-semibold text-gray-900">Total Hours</TableHead>
                    <TableHead className="font-semibold text-gray-900">Earnings</TableHead>
                    <TableHead className="font-semibold text-gray-900">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-blue-50 border-b border-gray-100">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{getRoleBadge(staff.role)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{staff.department}</Badge>
                      </TableCell>
                    <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{staff.email}</span>
                        </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500">
                            <Phone className="h-3 w-3" />
                            <span>{staff.phone}</span>
                          </div>
                      </div>
                    </TableCell>
                      <TableCell className="font-mono">QR {staff.hourlyRate.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">{staff.totalHours}h</TableCell>
                      <TableCell className="font-mono font-semibold">QR {staff.totalEarnings.toFixed(2)}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-semibold">{staff.rating}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                            checked={staff.isActive}
                            onCheckedChange={(checked) => toggleStaffStatus(staff.id, checked)}
                        />
                          <Badge variant={staff.isActive ? 'success' : 'secondary'}>
                            {staff.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailsModal(
                          'Staff Details',
                          staff.name,
                          {
                            Name: staff.name,
                            Role: staff.role,
                            Email: staff.email,
                            Phone: staff.phone,
                            Status: staff.isActive ? 'Active' : 'Inactive'
                          }
                        )}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
      {/* Details Modal */}
      <DetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title={detailsModalTitle}
        description={detailsModalDescription}
        details={detailsModalData}
      />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white border border-gray-200">
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="flex items-center gap-3 font-bold text-black">
                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                </div>
                Performance Analytics
              </CardTitle>
              <CardDescription>Staff performance metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Performance Analytics
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced performance tracking and analytics coming soon
                </p>
              </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function for export (placeholder)
const exportReport = (format: string) => {
  console.log(`Exporting report as ${format}`);
};
