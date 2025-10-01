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
  Clock, 
  Plus, 
  Edit2, 
  Eye,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  User,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  BarChart3
} from 'lucide-react';
import { DetailsModal } from './DetailsModal';
import { StaffManagement } from './StaffManagement';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface ShiftManagementProps {
  isActive: boolean;
}

interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  maxStaff: number;
  currentStaff: number;
  hourlyRate: number;
  description: string;
  color: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isActive: boolean;
  currentShift?: string;
  hourlyRate: number;
  totalHours: number;
  totalEarnings: number;
}

interface ShiftAssignment {
  id: string;
  staffId: string;
  shiftId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

export function ShiftManagement({ isActive }: ShiftManagementProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const { toast } = useToast();

  // Modal state for assignment details
  const [assignmentDetailsOpen, setAssignmentDetailsOpen] = useState(false);
  const [assignmentDetailsTitle, setAssignmentDetailsTitle] = useState('');
  const [assignmentDetailsDescription, setAssignmentDetailsDescription] = useState('');
  const [assignmentDetailsData, setAssignmentDetailsData] = useState<Record<string, any>>({});

  // Modal state for staff edit
  const [staffEditOpen, setStaffEditOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    hourlyRate: '',
    isActive: true
  });

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      name: 'Morning Shift',
      startTime: '06:00',
      endTime: '14:00',
      isActive: true,
      maxStaff: 4,
      currentStaff: 3,
      hourlyRate: 25.00,
      description: 'Early morning operations and breakfast service',
      color: '#3B82F6'
    },
    {
      id: '2',
      name: 'Afternoon Shift',
      startTime: '14:00',
      endTime: '22:00',
      isActive: true,
      maxStaff: 6,
      currentStaff: 5,
      hourlyRate: 30.00,
      description: 'Lunch and dinner service peak hours',
      color: '#10B981'
    },
    {
      id: '3',
      name: 'Night Shift',
      startTime: '22:00',
      endTime: '06:00',
      isActive: false,
      maxStaff: 2,
      currentStaff: 1,
      hourlyRate: 35.00,
      description: 'Late night operations and cleanup',
      color: '#8B5CF6'
    }
  ]);

  const [staffMembers] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'Ahmed Hassan',
      role: 'Manager',
      email: 'ahmed@restaurant.com',
      phone: '+974 1234 5678',
      isActive: true,
      currentShift: 'Afternoon Shift',
      hourlyRate: 30.00,
      totalHours: 160,
      totalEarnings: 4800.00
    },
    {
      id: '2',
      name: 'Fatima Al-Zahra',
      role: 'Server',
      email: 'fatima@restaurant.com',
      phone: '+974 1234 5679',
      isActive: true,
      currentShift: 'Morning Shift',
      hourlyRate: 25.00,
      totalHours: 140,
      totalEarnings: 3500.00
    },
    {
      id: '3',
      name: 'Omar Khalil',
      role: 'Chef',
      email: 'omar@restaurant.com',
      phone: '+974 1234 5680',
      isActive: true,
      currentShift: 'Afternoon Shift',
      hourlyRate: 35.00,
      totalHours: 150,
      totalEarnings: 5250.00
    },
    {
      id: '4',
      name: 'Layla Mahmoud',
      role: 'Cashier',
      email: 'layla@restaurant.com',
      phone: '+974 1234 5681',
      isActive: false,
      hourlyRate: 22.00,
      totalHours: 120,
      totalEarnings: 2640.00
    }
  ]);

  const [assignments] = useState<ShiftAssignment[]>([
    {
      id: '1',
      staffId: '1',
      shiftId: '2',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '22:00',
      status: 'in_progress',
      notes: 'Regular shift assignment'
    },
    {
      id: '2',
      staffId: '2',
      shiftId: '1',
      date: '2024-01-15',
      startTime: '06:00',
      endTime: '14:00',
      status: 'completed',
      notes: 'Morning service completed'
    },
    {
      id: '3',
      staffId: '3',
      shiftId: '2',
      date: '2024-01-15',
      startTime: '14:00',
      endTime: '22:00',
      status: 'in_progress',
      notes: 'Kitchen lead for dinner service'
    }
  ]);

  // Handler for opening assignment details modal
  const openAssignmentDetails = (assignment, staff, shift) => {
    setAssignmentDetailsTitle('Assignment Details');
    setAssignmentDetailsDescription(`${staff?.name || 'Unknown'} - ${shift?.name || 'Unknown'}`);
    setAssignmentDetailsData({
      'Staff': staff?.name || 'Unknown',
      'Role': staff?.role || 'Unknown',
      'Shift': shift?.name || 'Unknown',
      'Date': assignment.date,
      'Time': `${assignment.startTime} - ${assignment.endTime}`,
      'Status': assignment.status,
      'Notes': assignment.notes || '-'
    });
    setAssignmentDetailsOpen(true);
  };

  // Handler for opening staff edit modal
  const openStaffEdit = (staff: StaffMember) => {
    setEditingStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      hourlyRate: staff.hourlyRate.toString(),
      isActive: staff.isActive
    });
    setStaffEditOpen(true);
  };

  // Update staff member in table
  const handleStaffEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    // Update staffMembers array (simulate local update)
    const updatedStaff = {
      ...editingStaff,
      name: staffForm.name,
      role: staffForm.role,
      email: staffForm.email,
      phone: staffForm.phone,
      hourlyRate: parseFloat(staffForm.hourlyRate),
      isActive: staffForm.isActive
    };
    const idx = staffMembers.findIndex(s => s.id === editingStaff.id);
    if (idx !== -1) {
      staffMembers[idx] = updatedStaff;
    }
    setStaffEditOpen(false);
    setEditingStaff(null);
  };

  const [shiftForm, setShiftForm] = useState({
    name: '',
    startTime: '',
    endTime: '',
    maxStaff: '',
    hourlyRate: '',
    description: '',
    color: '#3B82F6',
    isActive: true
  });

  const [assignmentForm, setAssignmentForm] = useState({
    staffId: '',
    shiftId: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  useEffect(() => {
    if (isActive) {
      fetchData();
    }
  }, [isActive]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In real app, fetch data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch shift data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingShift ? `/api/shifts/${editingShift.id}` : '/api/shifts';
      const method = editingShift ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...shiftForm,
          maxStaff: parseInt(shiftForm.maxStaff),
          hourlyRate: parseFloat(shiftForm.hourlyRate),
          currentStaff: 0
        }),
      });

      if (!response.ok) throw new Error('Failed to save shift');

      toast({
        title: 'Success',
        description: editingShift ? 'Shift updated successfully' : 'Shift created successfully',
      });

      setIsShiftDialogOpen(false);
      setEditingShift(null);
      resetShiftForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save shift',
        variant: 'destructive',
      });
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/shifts/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assignmentForm,
          status: 'scheduled'
        }),
      });

      if (!response.ok) throw new Error('Failed to create assignment');

      toast({
        title: 'Success',
        description: 'Shift assignment created successfully',
      });

      setIsAssignmentDialogOpen(false);
      resetAssignmentForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create assignment',
        variant: 'destructive',
      });
    }
  };

  const toggleShiftStatus = async (shiftId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/shifts/${shiftId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update shift status');

      toast({
        title: 'Success',
        description: 'Shift status updated successfully',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update shift status',
        variant: 'destructive',
      });
    }
  };

  const resetShiftForm = () => {
    setShiftForm({
      name: '',
      startTime: '',
      endTime: '',
      maxStaff: '',
      hourlyRate: '',
      description: '',
      color: '#3B82F6',
      isActive: true
    });
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      staffId: '',
      shiftId: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
  };

  const openEditDialog = (shift: Shift) => {
    setEditingShift(shift);
    setShiftForm({
      name: shift.name,
      startTime: shift.startTime,
      endTime: shift.endTime,
      maxStaff: shift.maxStaff.toString(),
      hourlyRate: shift.hourlyRate.toString(),
      description: shift.description,
      color: shift.color,
      isActive: shift.isActive
    });
    setIsShiftDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'scheduled':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="info">In Progress</Badge>;
      case 'scheduled':
        return <Badge variant="warning">Scheduled</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalStaff = staffMembers.filter(staff => staff.isActive).length;
  const activeShifts = shifts.filter(shift => shift.isActive).length;
  const totalEarnings = staffMembers.reduce((sum, staff) => sum + staff.totalEarnings, 0);
  const currentAssignments = assignments.filter(assignment => assignment.status === 'in_progress').length;

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = searchQuery === '' || 
      assignment.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        <div>
            <h2 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
              Shift Control
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Manage staff shifts, schedules, and workforce planning
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
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
                </Button>
          <Button 
            onClick={() => exportReport('pdf')}
            size="lg"
            className="bg-blue-600 text-white shadow-xl hover:shadow-2xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
                    </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Active Staff</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
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
        
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Active Shifts</CardTitle>
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{activeShifts}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-green-600 font-medium">of {shifts.length} total</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Current Assignments</CardTitle>
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Play className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{currentAssignments}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-purple-600 font-medium">staff on duty</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Total Earnings</CardTitle>
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">QR {totalEarnings.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">+15.2%</span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status Alert */}
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-700">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>All Systems Operational:</strong> {currentAssignments} staff members are currently on duty across {activeShifts} active shifts. 
          All scheduled shifts are running smoothly.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  Shift Distribution
                </CardTitle>
                <CardDescription>Staff distribution across different shifts</CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                {shifts.map((shift) => {
                  const percentage = shift.maxStaff > 0 ? (shift.currentStaff / shift.maxStaff) * 100 : 0;
                  return (
                    <div key={shift.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: shift.color }}
                          ></div>
                          <span className="font-medium">{shift.name}</span>
                        </div>
                        <span className="text-slate-600">{shift.currentStaff}/{shift.maxStaff} staff</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: shift.color
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-green-200 rounded-xl flex items-center justify-center shadow-md">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  Staff Performance
                </CardTitle>
                <CardDescription>Top performing staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {staffMembers.slice(0, 4).map((staff, index) => (
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
                        <div className="font-semibold text-sm">QR {staff.totalEarnings.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{staff.totalHours}h worked</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Shift Management</h3>
            <Dialog open={isShiftDialogOpen} onOpenChange={setIsShiftDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetShiftForm}
                  size="lg"
                  className="bg-blue-600 text-white shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Shift
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingShift ? 'Edit Shift' : 'Add New Shift'}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {editingShift ? 'Update the shift details' : 'Create a new shift schedule for your staff'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleShiftSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="shiftName" className="text-sm font-semibold">Shift Name</Label>
                    <Input
                      id="shiftName"
                      value={shiftForm.name}
                      onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                      required
                      className="h-12 rounded-xl mt-2"
                    />
                      </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime" className="text-sm font-semibold">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={shiftForm.startTime}
                        onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                        required
                        className="h-12 rounded-xl mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime" className="text-sm font-semibold">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={shiftForm.endTime}
                        onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                        required
                        className="h-12 rounded-xl mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxStaff" className="text-sm font-semibold">Max Staff</Label>
                      <Input
                        id="maxStaff"
                        type="number"
                        value={shiftForm.maxStaff}
                        onChange={(e) => setShiftForm({ ...shiftForm, maxStaff: e.target.value })}
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
                        value={shiftForm.hourlyRate}
                        onChange={(e) => setShiftForm({ ...shiftForm, hourlyRate: e.target.value })}
                        required
                        className="h-12 rounded-xl mt-2"
                      />
                          </div>
                        </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                    <Input
                      id="description"
                      value={shiftForm.description}
                      onChange={(e) => setShiftForm({ ...shiftForm, description: e.target.value })}
                      className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="shiftActive"
                      checked={shiftForm.isActive}
                      onCheckedChange={(checked) => setShiftForm({ ...shiftForm, isActive: checked })}
                    />
                    <Label htmlFor="shiftActive" className="text-sm font-semibold">Active Shift</Label>
                          </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    >
                      {editingShift ? 'Update Shift' : 'Create Shift'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
                        </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift) => (
              <Card key={shift.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: shift.color }}
                    ></div>
                    <div>
                      <CardTitle className="text-lg text-black">{shift.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {shift.startTime} - {shift.endTime}
                      </CardDescription>
                          </div>
                        </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={shift.isActive}
                      onCheckedChange={(checked) => toggleShiftStatus(shift.id, checked)}
                    />
                    <Badge variant={shift.isActive ? 'success' : 'secondary'}>
                      {shift.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                          </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Staff:</span>
                      <span className="font-semibold">{shift.currentStaff}/{shift.maxStaff}</span>
                        </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rate:</span>
                      <span className="font-semibold">QR {shift.hourlyRate}/hr</span>
                      </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${shift.maxStaff > 0 ? (shift.currentStaff / shift.maxStaff) * 100 : 0}%`,
                          backgroundColor: shift.color
                        }}
                      ></div>
                    </div>
                </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(shift)}
                      className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-green-50 hover:border-green-200"
                    >
                      <Eye className="h-4 w-4" />
                  </Button>
                </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </TabsContent>

  <TabsContent value="assignments" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold">Shift Assignments</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search assignments..."
                      className="pl-10 h-12 rounded-xl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-12 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={resetAssignmentForm}
                        size="lg"
                        className="bg-blue-600 text-white shadow-xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Assign Shift
                      </Button>
                    </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Assign Staff to Shift</DialogTitle>
                    <DialogDescription className="text-base">
                      Schedule a staff member for a specific shift
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAssignmentSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="staffSelect" className="text-sm font-semibold">Staff Member</Label>
                      <Select 
                        value={assignmentForm.staffId} 
                        onValueChange={(value) => setAssignmentForm({ ...assignmentForm, staffId: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl mt-2">
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {staffMembers.filter(staff => staff.isActive).map((staff) => (
                            <SelectItem key={staff.id} value={staff.id}>
                              {staff.name} - {staff.role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="shiftSelect" className="text-sm font-semibold">Shift</Label>
                      <Select 
                        value={assignmentForm.shiftId} 
                        onValueChange={(value) => setAssignmentForm({ ...assignmentForm, shiftId: value })}
                      >
                        <SelectTrigger className="h-12 rounded-xl mt-2">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.filter(shift => shift.isActive).map((shift) => (
                            <SelectItem key={shift.id} value={shift.id}>
                              {shift.name} ({shift.startTime} - {shift.endTime})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="assignmentDate" className="text-sm font-semibold">Date</Label>
                        <Input
                          id="assignmentDate"
                          type="date"
                          value={assignmentForm.date}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, date: e.target.value })}
                          required
                          className="h-12 rounded-xl mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignmentNotes" className="text-sm font-semibold">Notes</Label>
                        <Input
                          id="assignmentNotes"
                          value={assignmentForm.notes}
                          onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                          className="h-12 rounded-xl mt-2"
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                      >
                        Create Assignment
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => {
                    const staff = staffMembers.find(s => s.id === assignment.staffId);
                    const shift = shifts.find(s => s.id === assignment.shiftId);
                    
                    return (
                      <TableRow key={assignment.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <TableCell className="font-medium">{staff?.name || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: shift?.color || '#6B7280' }}
                            ></div>
                            <span>{shift?.name || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(assignment.date).toLocaleDateString()}</TableCell>
                        <TableCell>{assignment.startTime} - {assignment.endTime}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(assignment.status)}
                            {getStatusBadge(assignment.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">{assignment.notes || '-'}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200"
                            onClick={() => openAssignmentDetails(assignment, staff, shift)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

  <TabsContent value="staff" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-blue-200 rounded-xl flex items-center justify-center shadow-md">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                Staff Members
              </CardTitle>
              <CardDescription>Manage your restaurant staff and their schedules</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="border border-blue-600 rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Shift</TableHead>
                    <TableHead>Hourly Rate</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>
                        <Badge variant="outline">{staff.role}</Badge>
                        </TableCell>
                        <TableCell>
                        {staff.currentShift ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">{staff.currentShift}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">QR {staff.hourlyRate.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">{staff.totalHours}h</TableCell>
                      <TableCell className="font-mono font-semibold">QR {staff.totalEarnings.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={staff.isActive ? 'success' : 'secondary'}>
                          {staff.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-blue-50 hover:border-blue-200"
                          onClick={() => openStaffEdit(staff)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
             </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    {/* Assignment Details Modal */}
    <DetailsModal
      open={assignmentDetailsOpen}
      onClose={() => setAssignmentDetailsOpen(false)}
      title={assignmentDetailsTitle}
      description={assignmentDetailsDescription}
      details={assignmentDetailsData}
    />

    {/* Staff Edit Modal */}
    <Dialog open={staffEditOpen} onOpenChange={setStaffEditOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Staff Member</DialogTitle>
          <DialogDescription className="text-base">Update staff member information</DialogDescription>
        </DialogHeader>
        {editingStaff && (
          <form onSubmit={handleStaffEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="editStaffName">Name</Label>
              <Input
                id="editStaffName"
                value={staffForm.name}
                onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editStaffRole">Role</Label>
              <Select
                value={staffForm.role}
                onValueChange={value => setStaffForm({ ...staffForm, role: value })}
              >
                <SelectTrigger id="editStaffRole">
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
            <div>
              <Label htmlFor="editStaffEmail">Email</Label>
              <Input
                id="editStaffEmail"
                value={staffForm.email}
                onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editStaffPhone">Phone</Label>
              <Input
                id="editStaffPhone"
                value={staffForm.phone}
                onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="editStaffRate">Hourly Rate</Label>
              <Input
                id="editStaffRate"
                type="number"
                value={staffForm.hourlyRate}
                onChange={e => setStaffForm({ ...staffForm, hourlyRate: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <Switch
                id="editStaffActive"
                checked={staffForm.isActive}
                onCheckedChange={checked => setStaffForm({ ...staffForm, isActive: checked })}
              />
              <Label htmlFor="editStaffActive">Active Staff Member</Label>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
    </div>
  );
}

// Helper function for export (placeholder)
const exportReport = (format: string) => {
  console.log(`Exporting report as ${format}`);
};
