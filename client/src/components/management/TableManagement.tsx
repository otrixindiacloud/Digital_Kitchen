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
  Table2, 
  Plus, 
  Edit2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  MapPin,
  AlertTriangle,
  Settings,
  BarChart3,
  Coffee,
  Utensils
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface TableManagementProps {
  isActive: boolean;
}

interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: string;
  section: string;
  isActive: boolean;
  currentOrder?: string;
  currentGuests?: number;
  lastCleaned?: string;
  notes?: string;
}

interface TableSection {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  tableCount: number;
}

export function TableManagement({ isActive }: TableManagementProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);
  const [editingSection, setEditingSection] = useState<TableSection | null>(null);
  const { toast } = useToast();

  const [tables, setTables] = useState<RestaurantTable[]>([
    {
      id: '1',
      number: 'T-01',
      capacity: 4,
      status: 'occupied',
      location: 'Window Side',
      section: 'Main Dining',
      isActive: true,
      currentOrder: 'ORD-001',
      currentGuests: 3,
      lastCleaned: '2024-01-15 10:30:00',
      notes: 'Near window, great view'
    },
    {
      id: '2',
      number: 'T-02',
      capacity: 2,
      status: 'available',
      location: 'Center',
      section: 'Main Dining',
      isActive: true,
      lastCleaned: '2024-01-15 09:15:00'
    },
    {
      id: '3',
      number: 'T-03',
      capacity: 6,
      status: 'reserved',
      location: 'Corner',
      section: 'Main Dining',
      isActive: true,
      lastCleaned: '2024-01-15 08:45:00',
      notes: 'Large family table'
    },
    {
      id: '4',
      number: 'T-04',
      capacity: 4,
      status: 'maintenance',
      location: 'Near Kitchen',
      section: 'Main Dining',
      isActive: false,
      lastCleaned: '2024-01-14 22:00:00',
      notes: 'Chair needs repair'
    },
    {
      id: '5',
      number: 'T-05',
      capacity: 2,
      status: 'available',
      location: 'Patio',
      section: 'Outdoor',
      isActive: true,
      lastCleaned: '2024-01-15 11:00:00'
    },
    {
      id: '6',
      number: 'T-06',
      capacity: 8,
      status: 'occupied',
      location: 'Private Area',
      section: 'VIP',
      isActive: true,
      currentOrder: 'ORD-002',
      currentGuests: 6,
      lastCleaned: '2024-01-15 09:30:00',
      notes: 'VIP section, premium service'
    }
  ]);

  const [sections] = useState<TableSection[]>([
    {
      id: '1',
      name: 'Main Dining',
      description: 'Primary dining area with window views',
      isActive: true,
      tableCount: 4
    },
    {
      id: '2',
      name: 'Outdoor',
      description: 'Patio seating for outdoor dining',
      isActive: true,
      tableCount: 1
    },
    {
      id: '3',
      name: 'VIP',
      description: 'Premium section for special occasions',
      isActive: true,
      tableCount: 1
    }
  ]);

  const [tableForm, setTableForm] = useState({
    number: '',
    capacity: '',
    location: '',
    section: '',
    notes: '',
    isActive: true
  });

  const [sectionForm, setSectionForm] = useState({
    name: '',
    description: '',
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
        description: 'Failed to fetch table data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTableSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTable ? `/api/tables/${editingTable.id}` : '/api/tables';
      const method = editingTable ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tableForm,
          capacity: parseInt(tableForm.capacity),
          status: 'available'
        }),
      });

      if (!response.ok) throw new Error('Failed to save table');

      toast({
        title: 'Success',
        description: editingTable ? 'Table updated successfully' : 'Table created successfully',
      });

      setIsTableDialogOpen(false);
      setEditingTable(null);
      resetTableForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save table',
        variant: 'destructive',
      });
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingSection ? `/api/table-sections/${editingSection.id}` : '/api/table-sections';
      const method = editingSection ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionForm),
      });

      if (!response.ok) throw new Error('Failed to save section');

      toast({
        title: 'Success',
        description: editingSection ? 'Section updated successfully' : 'Section created successfully',
      });

      setIsSectionDialogOpen(false);
      setEditingSection(null);
      resetSectionForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save section',
        variant: 'destructive',
      });
    }
  };

  const toggleTableStatus = async (tableId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/tables/${tableId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update table status');

      toast({
        title: 'Success',
        description: 'Table status updated successfully',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update table status',
        variant: 'destructive',
      });
    }
  };

  const resetTableForm = () => {
    setTableForm({
      number: '',
      capacity: '',
      location: '',
      section: '',
      notes: '',
      isActive: true
    });
  };

  const resetSectionForm = () => {
    setSectionForm({
      name: '',
      description: '',
      isActive: true
    });
  };

  const openEditDialog = (table: RestaurantTable) => {
    setEditingTable(table);
    setTableForm({
      number: table.number,
      capacity: table.capacity.toString(),
      location: table.location,
      section: table.section,
      notes: table.notes || '',
      isActive: table.isActive
    });
    setIsTableDialogOpen(true);
  };

  const openSectionEditDialog = (section: TableSection) => {
    setEditingSection(section);
    setSectionForm({
      name: section.name,
      description: section.description,
      isActive: section.isActive
    });
    setIsSectionDialogOpen(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'occupied':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'reserved':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'occupied':
        return <Badge variant="info">Occupied</Badge>;
      case 'reserved':
        return <Badge variant="warning">Reserved</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalTables = tables.length;
  const availableTables = tables.filter(table => table.status === 'available').length;
  const occupiedTables = tables.filter(table => table.status === 'occupied').length;
  const reservedTables = tables.filter(table => table.status === 'reserved').length;
  const totalCapacity = tables.reduce((sum, table) => sum + table.capacity, 0);
  const currentGuests = tables
    .filter(table => table.currentGuests)
    .reduce((sum, table) => sum + (table.currentGuests || 0), 0);

  const filteredTables = tables.filter(table => {
    const matchesSearch = searchQuery === '' || 
      table.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
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
            <Table2 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
              Table Control
            </h2>
            <div className="flex items-center gap-3 mt-2">
            <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Manage restaurant tables, seating, and reservations
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
            className="border border-blue-500 text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl"
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
        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Available Tables</CardTitle>
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{availableTables}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-green-600 font-medium">Ready for guests</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Occupied Tables</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{occupiedTables}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-blue-600 font-medium">Currently serving</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Total Capacity</CardTitle>
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Utensils className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalCapacity}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-purple-600 font-medium">Seats available</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Current Guests</CardTitle>
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Coffee className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{currentGuests}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-600 font-medium">Dining now</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
        <CheckCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Table Status:</strong> {availableTables} tables are available for immediate seating. 
          {occupiedTables} tables are currently occupied and {reservedTables} tables are reserved.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  Table Status Distribution
                </CardTitle>
                <CardDescription>Current status of all tables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { status: 'Available', count: availableTables, color: 'from-green-400 to-emerald-500' },
                  { status: 'Occupied', count: occupiedTables, color: 'from-blue-400 to-cyan-500' },
                  { status: 'Reserved', count: reservedTables, color: 'from-yellow-400 to-orange-500' },
                  { status: 'Maintenance', count: tables.filter(t => t.status === 'maintenance').length, color: 'from-red-400 to-pink-500' }
                ].map((item, index) => {
                  const percentage = totalTables > 0 ? (item.count / totalTables) * 100 : 0;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.status}</span>
                        <span className="text-slate-600">{item.count} tables ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`bg-gradient-to-r ${item.color} h-3 rounded-full transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center shadow-md">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  Section Overview
                </CardTitle>
                <CardDescription>Tables by section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sections.map((section) => {
                    const sectionTables = tables.filter(table => table.section === section.name);
                    const availableInSection = sectionTables.filter(table => table.status === 'available').length;
                    
                    return (
                      <div key={section.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center text-purple-600 text-sm font-bold">
                            {sectionTables.length}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{section.name}</div>
                            <div className="text-xs text-slate-500">{section.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm text-green-600">{availableInSection} available</div>
                          <div className="text-xs text-slate-500">{sectionTables.length} total</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold">Table Management</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tables..."
                      className="pl-12 h-12 rounded-xl border-blue-200 focus:border-blue-500 relative z-0"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-12 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={resetTableForm}
                        size="lg"
                        className="bg-blue-600 text-white shadow-xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Table
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-2xl">
                          {editingTable ? 'Edit Table' : 'Add New Table'}
                        </DialogTitle>
                        <DialogDescription className="text-base">
                          {editingTable ? 'Update table details' : 'Add a new table to your restaurant'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <form onSubmit={handleTableSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tableNumber" className="text-sm font-semibold">Table Number</Label>
                            <Input
                              id="tableNumber"
                              value={tableForm.number}
                              onChange={(e) => setTableForm({ ...tableForm, number: e.target.value })}
                              required
                              className="h-12 rounded-xl mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tableCapacity" className="text-sm font-semibold">Capacity</Label>
                            <Input
                              id="tableCapacity"
                              type="number"
                              value={tableForm.capacity}
                              onChange={(e) => setTableForm({ ...tableForm, capacity: e.target.value })}
                              required
                              className="h-12 rounded-xl mt-2"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="tableLocation" className="text-sm font-semibold">Location</Label>
                          <Input
                            id="tableLocation"
                            value={tableForm.location}
                            onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                            required
                            className="h-12 rounded-xl mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="tableSection" className="text-sm font-semibold">Section</Label>
                          <Select 
                            value={tableForm.section} 
                            onValueChange={(value) => setTableForm({ ...tableForm, section: value })}
                          >
                            <SelectTrigger className="h-12 rounded-xl mt-2">
                              <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                              {sections.map((section) => (
                                <SelectItem key={section.id} value={section.name}>
                                  {section.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="tableNotes" className="text-sm font-semibold">Notes</Label>
                          <Input
                            id="tableNotes"
                            value={tableForm.notes}
                            onChange={(e) => setTableForm({ ...tableForm, notes: e.target.value })}
                            className="h-12 rounded-xl mt-2"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Switch
                            id="tableActive"
                            checked={tableForm.isActive}
                            onCheckedChange={(checked) => setTableForm({ ...tableForm, isActive: checked })}
                          />
                          <Label htmlFor="tableActive" className="text-sm font-semibold">Active Table</Label>
                        </div>
                        
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                          >
                            {editingTable ? 'Update Table' : 'Create Table'}
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
                    <TableHead>Table</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Current Order</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Last Cleaned</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map((table) => (
                    <TableRow key={table.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <TableCell className="font-mono font-medium">{table.number}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold">{table.capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span>{table.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{table.section}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(table.status)}
                          {getStatusBadge(table.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {table.currentOrder ? (
                          <Badge variant="info" className="font-mono">{table.currentOrder}</Badge>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {table.currentGuests ? (
                          <span className="font-semibold">{table.currentGuests}</span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {table.lastCleaned ? new Date(table.lastCleaned).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-32 truncate">
                        {table.notes || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(table)}
                          className="hover:bg-blue-50 hover:border-blue-200"
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

        <TabsContent value="sections" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Table Sections</h3>
            <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetSectionForm}
                  size="lg"
                   className="bg-blue-600 text-white shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingSection ? 'Edit Section' : 'Add New Section'}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {editingSection ? 'Update section details' : 'Create a new table section'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSectionSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="sectionName" className="text-sm font-semibold">Section Name</Label>
                    <Input
                      id="sectionName"
                      value={sectionForm.name}
                      onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })}
                      required
                      className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="sectionDescription" className="text-sm font-semibold">Description</Label>
                    <Input
                      id="sectionDescription"
                      value={sectionForm.description}
                      onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
                      className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="sectionActive"
                      checked={sectionForm.isActive}
                      onCheckedChange={(checked) => setSectionForm({ ...sectionForm, isActive: checked })}
                    />
                    <Label htmlFor="sectionActive" className="text-sm font-semibold">Active Section</Label>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    >
                      {editingSection ? 'Update Section' : 'Create Section'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Card key={section.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                      <CardTitle className="text-lg text-black">{section.name}</CardTitle>
                    <CardDescription className="text-sm">{section.description}</CardDescription>
                  </div>
                  <Badge variant={section.isActive ? 'success' : 'secondary'}>
                    {section.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Tables:</span>
                      <span className="font-semibold">{section.tableCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Available:</span>
                      <span className="font-semibold text-green-600">
                        {tables.filter(t => t.section === section.name && t.status === 'available').length}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSectionEditDialog(section)}
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

        <TabsContent value="layout" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                  <Settings className="h-4 w-4 text-indigo-600" />
                </div>
                Restaurant Layout
              </CardTitle>
              <CardDescription>Visual table layout and floor plan management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Layout Designer
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Interactive floor plan and table layout designer coming soon
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
