import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Warehouse, 
  Plus, 
  Edit2, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Search,
  Filter,
  BarChart3,
  Package2,
  Zap,
  DollarSign,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';
import type { Inventory } from '@shared/schema';

interface InventoryManagementProps {
  isActive: boolean;
}

interface StockMovement {
  id: string;
  inventoryId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
  userId: string;
}

export function InventoryManagement({ isActive }: InventoryManagementProps) {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [selectedItem, setSelectedItem] = useState<Inventory | null>(null);
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'ok'>('all');
  const [activeTab, setActiveTab] = useState('overview');

  const [formData, setFormData] = useState({
    name: { en: '', ar: '' },
    unit: 'piece',
    currentStock: '',
    minStock: '',
    cost: '',
    isActive: true
  });

  const [movementForm, setMovementForm] = useState({
    type: 'in' as 'in' | 'out' | 'adjustment',
    quantity: '',
    reason: ''
  });

  useEffect(() => {
    if (isActive) {
      fetchInventory();
      fetchMovements();
    }
  }, [isActive]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToFetchInventory'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMovements = async () => {
    try {
      const response = await fetch('/api/inventory/movements');
      if (response.ok) {
        const data = await response.json();
        setMovements(data);
      }
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/inventory/${editingItem.id}` : '/api/inventory';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          currentStock: formData.currentStock.toString(),
          minStock: formData.minStock.toString(),
          cost: formData.cost.toString()
        }),
      });

      if (!response.ok) throw new Error('Failed to save inventory item');

      toast({
        title: t('success'),
        description: editingItem ? t('inventoryUpdated') : t('inventoryCreated'),
      });

      setIsDialogOpen(false);
      setEditingItem(null);
      resetForm();
      fetchInventory();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSaveInventory'),
        variant: 'destructive',
      });
    }
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const response = await fetch('/api/inventory/movements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryId: selectedItem.id,
          type: movementForm.type,
          quantity: movementForm.quantity.toString(),
          reason: movementForm.reason
        }),
      });

      if (!response.ok) throw new Error('Failed to record movement');

      toast({
        title: t('success'),
        description: t('movementRecorded'),
      });

      setIsMovementDialogOpen(false);
      setSelectedItem(null);
      resetMovementForm();
      fetchInventory();
      fetchMovements();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToRecordMovement'),
        variant: 'destructive',
      });
    }
  };

  const toggleItemStatus = async (itemId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/inventory/${itemId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: t('success'),
        description: t('statusUpdated'),
      });

      fetchInventory();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToUpdateStatus'),
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: { en: '', ar: '' },
      unit: 'piece',
      currentStock: '',
      minStock: '',
      cost: '',
      isActive: true
    });
  };

  const resetMovementForm = () => {
    setMovementForm({
      type: 'in',
      quantity: '',
      reason: ''
    });
  };

  const openEditDialog = (item: Inventory) => {
    setEditingItem(item);
    setFormData({
      name: item.name as { en: string; ar: string },
      unit: item.unit,
      currentStock: item.currentStock.toString(),
      minStock: item.minStock.toString(),
      cost: item.cost.toString(),
      isActive: item.isActive ?? true
    });
    setIsDialogOpen(true);
  };

  const openMovementDialog = (item: Inventory) => {
    setSelectedItem(item);
    setIsMovementDialogOpen(true);
  };

  const getStockLevel = (item: Inventory) => {
    const percentage = (parseFloat(item.currentStock.toString()) / parseFloat(item.minStock.toString())) * 100;
    return Math.min(percentage, 100);
  };

  const getStockStatus = (item: Inventory) => {
    const current = parseFloat(item.currentStock.toString());
    const min = parseFloat(item.minStock.toString());
    
    if (current <= 0) return 'out';
    if (current <= min) return 'low';
    if (current <= min * 1.5) return 'medium';
    return 'high';
  };

  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'low' || getStockStatus(item) === 'out');
  const totalValue = inventory.reduce((sum, item) => 
    sum + (parseFloat(item.currentStock.toString()) * parseFloat(item.cost.toString())), 0
  );

  const filteredInventory = useMemo(() => {
    let list = inventory;
    if (statusFilter !== 'all') {
      list = list.filter(item => {
        const status = getStockStatus(item);
        return statusFilter === 'low' ? (status === 'low' || status === 'out') : (status === 'high' || status === 'medium');
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(item =>
        `${(item.name as any)?.en ?? ''} ${(item.name as any)?.ar ?? ''}`.toLowerCase().includes(q)
      );
    }
    return list;
  }, [inventory, statusFilter, query]);

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-200 rounded-3xl flex items-center justify-center shadow-2xl">
            <Warehouse className="h-8 w-8 text-blue-700" />
          </div>
        <div>
            <h2 className="text-4xl font-bold text-black">
              Smart Inventory Hub
            </h2>
            <div className="flex items-center gap-3 mt-2">
            <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Track and manage your inventory intelligently
              </span>
        </div>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm} 
              size="lg"
              className="bg-blue-600 text-white shadow-xl transition-all duration-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </DialogTitle>
              <DialogDescription className="text-base">
                {editingItem ? 'Update the inventory item details' : 'Create a new inventory item with stock tracking'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nameEn" className="text-sm font-semibold">Name (English)</Label>
                  <Input
                    id="nameEn"
                    value={formData.name.en}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, en: e.target.value }
                    })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="nameAr" className="text-sm font-semibold">Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={formData.name.ar}
                    onChange={(e) => setFormData({
                      ...formData,
                      name: { ...formData.name, ar: e.target.value }
                    })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="unit" className="text-sm font-semibold">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="bottle">Bottle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currentStock" className="text-sm font-semibold">Current Stock</Label>
                  <Input
                    id="currentStock"
                    type="number"
                    step="0.001"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="minStock" className="text-sm font-semibold">Minimum Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    step="0.001"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="cost" className="text-sm font-semibold">Cost Per Unit</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-sm font-semibold">Active Item</Label>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingItem ? 'Update Item' : 'Create Item'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Total Items</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{inventory.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Items in inventory</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Low Stock Alert</CardTitle>
            <div className="w-12 h-12 bg-red-200 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-900 dark:text-red-100">{lowStockItems.length}</div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Need restocking</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Total Value</CardTitle>
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Inventory value</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-gray-200 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Active Items</CardTitle>
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {inventory.filter(item => item.isActive).length}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Low Stock Alert:</strong> {lowStockItems.length} items are running low on stock and need immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory List</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black font-bold text-lg">
                  <div className="w-8 h-8 bg-blue-200 rounded-xl flex items-center justify-center shadow-md">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  Stock Level Distribution
                </CardTitle>
                <CardDescription>Current inventory status breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['high', 'medium', 'low', 'out'].map((status) => {
                  const count = inventory.filter(item => getStockStatus(item) === status).length;
                  const percentage = inventory.length > 0 ? (count / inventory.length) * 100 : 0;
                  const colors = {
                    high: 'bg-emerald-500',
                    medium: 'bg-amber-500',
                    low: 'bg-orange-500',
                    out: 'bg-red-500'
                  };
                  return (
                    <div key={status} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{status} Stock</span>
                        <span className="text-slate-600">{count} items ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black font-bold text-lg">
                  <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center shadow-md">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  Recent Stock Movements
                </CardTitle>
                <CardDescription>Latest inventory changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {movements.slice(0, 5).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          movement.type === 'in' ? 'bg-emerald-100 text-emerald-600' :
                          movement.type === 'out' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {movement.type === 'in' ? <Plus className="h-4 w-4" /> :
                           movement.type === 'out' ? <Minus className="h-4 w-4" /> :
                           <Edit2 className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{movement.reason}</div>
                          <div className="text-xs text-slate-500">{new Date(movement.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Badge variant={movement.type === 'in' ? 'success' : movement.type === 'out' ? 'destructive' : 'warning'}>
                        {movement.quantity} {movement.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-200 rounded-xl flex items-center justify-center shadow-md">
                  <Package2 className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-black">Inventory Items</CardTitle>
                  <CardDescription>
                    Total items: {inventory.length} | Showing: {filteredInventory.length}
                  </CardDescription>
                </div>
              </div>
              
              {/* Search and Filter */}
              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search inventory items..."
                    className="pl-10 h-12 rounded-xl"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                  <SelectTrigger className="w-[150px] h-12 rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="ok">In Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <div className="border border-blue-600 rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const stockLevel = getStockLevel(item);
                const currentStock = parseFloat(item.currentStock.toString());
                const cost = parseFloat(item.cost.toString());
                const value = currentStock * cost;
                
                return (
                      <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {(item.name as any)?.en || 'N/A'}
                        </div>
                            <div className="text-sm text-slate-500">
                          {(item.name as any)?.ar || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {t(item.unit as any) || item.unit}
                          </Badge>
                        </TableCell>
                    <TableCell>
                          <span className={`font-semibold ${
                            stockStatus === 'low' || stockStatus === 'out' ? 'text-red-600' : 'text-slate-900'
                          }`}>
                        {item.currentStock}
                      </span>
                    </TableCell>
                    <TableCell>{item.minStock}</TableCell>
                    <TableCell>
                          <div className="space-y-2">
                        <Progress 
                          value={stockLevel} 
                          className={`h-2 ${
                                stockStatus === 'out' ? 'bg-red-200' :
                                stockStatus === 'low' ? 'bg-amber-200' :
                                'bg-emerald-200'
                          }`}
                        />
                        <Badge 
                          variant={
                            stockStatus === 'out' ? 'destructive' :
                                stockStatus === 'low' ? 'warning' :
                            stockStatus === 'medium' ? 'outline' :
                                'success'
                          }
                          className="text-xs"
                        >
                              {stockStatus === 'out' ? 'Out of Stock' :
                               stockStatus === 'low' ? 'Low Stock' :
                               stockStatus === 'medium' ? 'Medium Stock' :
                               'High Stock'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>${cost.toFixed(2)}</TableCell>
                    <TableCell>${value.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.isActive ?? true}
                          onCheckedChange={(checked) => toggleItemStatus(item.id, checked)}
                        />
                            <Badge variant={item.isActive ? 'success' : 'secondary'}>
                              {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openMovementDialog(item)}
                              className="hover:bg-amber-50 hover:border-amber-200"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(item)}
                              className="hover:bg-blue-50 hover:border-blue-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
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

        <TabsContent value="movements" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-indigo-200 rounded-xl flex items-center justify-center shadow-md">
                  <Activity className="h-4 w-4 text-indigo-600" />
                </div>
                Stock Movement History
              </CardTitle>
              <CardDescription>Complete history of all inventory movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Movement Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Stock movement history will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Movement Dialog */}
      <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Record Stock Movement</DialogTitle>
            <DialogDescription className="text-base">
              {selectedItem && `${(selectedItem.name as any)?.en} - Current Stock: ${selectedItem.currentStock} ${t(selectedItem.unit as any) || selectedItem.unit}`}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleMovementSubmit} className="space-y-6">
            <div>
              <Label htmlFor="movementType" className="text-sm font-semibold">Movement Type</Label>
              <Select 
                value={movementForm.type} 
                onValueChange={(value: 'in' | 'out' | 'adjustment') => setMovementForm({ ...movementForm, type: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (+)</SelectItem>
                  <SelectItem value="out">Stock Out (-)</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity" className="text-sm font-semibold">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.001"
                value={movementForm.quantity}
                onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                required
                className="h-12 rounded-xl"
              />
            </div>
            
            <div>
              <Label htmlFor="reason" className="text-sm font-semibold">Reason</Label>
              <Input
                id="reason"
                value={movementForm.reason}
                onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                placeholder="Enter reason for this movement..."
                required
                className="h-12 rounded-xl"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Record Movement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
