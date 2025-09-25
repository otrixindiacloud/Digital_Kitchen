import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChefHat, 
  Plus, 
  Edit2, 
  Package, 
  Coffee, 
  AlertTriangle,
  Utensils,
  Star,
  TrendingUp,
  Eye,
  Search,
  Filter,
  Image,
  Settings,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';
import type { Category, Item, ItemSize, Modifier, Inventory } from '@shared/schema';

interface MenuManagementProps {
  isActive: boolean;
}

export function MenuManagement({ isActive }: MenuManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  // Category form state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: { en: '', ar: '' },
    icon: '',
    sortOrder: 0,
    active: true
  });

  // Item form state
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemForm, setItemForm] = useState({
    categoryId: '',
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    basePrice: '',
    image: '',
    hasSizes: false,
    hasModifiers: false,
    active: true,
    sortOrder: 0
  });

  useEffect(() => {
    if (isActive) {
      fetchData();
    }
  }, [isActive]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, itemsRes, inventoryRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/menu/items'),
        fetch('/api/inventory')
      ]);

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (itemsRes.ok) setItems(await itemsRes.json());
      if (inventoryRes.ok) setInventory(await inventoryRes.json());
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToFetchData'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm),
      });

      if (!response.ok) throw new Error('Failed to save category');

      toast({
        title: t('success'),
        description: editingCategory ? t('categoryUpdated') : t('categoryCreated'),
      });

      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchData();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSaveCategory'),
        variant: 'destructive',
      });
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/menu/items/${editingItem.id}` : '/api/menu/items';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...itemForm,
          basePrice: parseFloat(itemForm.basePrice)
        }),
      });

      if (!response.ok) throw new Error('Failed to save item');

      toast({
        title: t('success'),
        description: editingItem ? t('itemUpdated') : t('itemCreated'),
      });

      setIsItemDialogOpen(false);
      setEditingItem(null);
      resetItemForm();
      fetchData();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSaveItem'),
        variant: 'destructive',
      });
    }
  };

  const toggleCategoryStatus = async (categoryId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: t('success'),
        description: t('statusUpdated'),
      });

      fetchData();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToUpdateStatus'),
        variant: 'destructive',
      });
    }
  };

  const toggleItemStatus = async (itemId: string, active: boolean) => {
    try {
      const response = await fetch(`/api/menu/items/${itemId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: t('success'),
        description: t('statusUpdated'),
      });

      fetchData();
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToUpdateStatus'),
        variant: 'destructive',
      });
    }
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: { en: '', ar: '' },
      icon: '',
      sortOrder: 0,
      active: true
    });
  };

  const resetItemForm = () => {
    setItemForm({
      categoryId: '',
      name: { en: '', ar: '' },
      description: { en: '', ar: '' },
      basePrice: '',
      image: '',
      hasSizes: false,
      hasModifiers: false,
      active: true,
      sortOrder: 0
    });
  };

  const openCategoryEditDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name as { en: string; ar: string },
      icon: category.icon || '',
      sortOrder: category.sortOrder || 0,
      active: category.active ?? true
    });
    setIsCategoryDialogOpen(true);
  };

  const openItemEditDialog = (item: Item) => {
    setEditingItem(item);
    setItemForm({
      categoryId: item.categoryId,
      name: item.name as { en: string; ar: string },
      description: item.description as { en: string; ar: string } || { en: '', ar: '' },
      basePrice: item.basePrice,
      image: item.image || '',
      hasSizes: item.hasSizes ?? false,
      hasModifiers: item.hasModifiers ?? false,
      active: item.active ?? true,
      sortOrder: item.sortOrder || 0
    });
    setIsItemDialogOpen(true);
  };

  const getStockStatus = (item: Item) => {
    const hasLowStock = inventory.some(inv => inv.currentStock <= inv.minStock);
    return hasLowStock ? 'low' : 'good';
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === '' || 
      `${(item.name as any)?.en || ''} ${(item.name as any)?.ar || ''}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = items.reduce((sum, item) => sum + parseFloat(item.basePrice), 0);
  const activeItems = items.filter(item => item.active).length;
  const lowStockItems = items.filter(item => getStockStatus(item) === 'low').length;

  if (loading) {
    return <div className="flex justify-center p-8">{t('loading')}</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center shadow-2xl">
            <ChefHat className="h-8 w-8 text-blue-700" />
          </div>
        <div>
            <h2 className="text-4xl font-bold text-blue-600">
              Culinary Command Center
            </h2>
            <div className="flex items-center gap-3 mt-2">
            <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Design and manage your restaurant's menu
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Total Menu Items</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center shadow-lg ">
              <Utensils className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{items.length}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Items on menu</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Active Items</CardTitle>
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex items-center justify-center shadow-lg ">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100">{activeItems}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Currently available</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Low Stock Items</CardTitle>
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center shadow-lg ">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">{lowStockItems}</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-black">Menu Value</CardTitle>
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center shadow-lg ">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">QR {totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Total menu value</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems > 0 && (
        <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800 dark:text-amber-200">
            <strong>Low Stock Alert:</strong> {lowStockItems} menu items have low inventory and may need restocking.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-emerald-200 rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <Package className="h-4 w-4 text-emerald-600" />
                  </div>
                  Category Distribution
                </CardTitle>
                <CardDescription>Menu items by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => {
                  const categoryItems = items.filter(item => item.categoryId === category.id);
                  const percentage = items.length > 0 ? (categoryItems.length / items.length) * 100 : 0;
                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{(category.name as any)?.en}</span>
                        </div>
                        <span className="text-slate-600">{categoryItems.length} items ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
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
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center shadow-md border border-gray-200">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  Featured Items
                </CardTitle>
                <CardDescription>Top performing menu items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{(item.name as any)?.en}</div>
                          <div className="text-xs text-slate-500">QR {item.basePrice}</div>
                        </div>
                      </div>
                      <Badge variant={item.active ? 'success' : 'secondary'}>
                        {item.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">Menu Categories</h3>
                <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={resetCategoryForm}
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                      </DialogTitle>
                      <DialogDescription className="text-base">
                        {editingCategory ? 'Update the category details' : 'Create a new menu category'}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleCategorySubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nameEn" className="text-sm font-semibold">Name (English)</Label>
                          <Input
                            id="nameEn"
                            value={categoryForm.name.en}
                            onChange={(e) => setCategoryForm({
                              ...categoryForm,
                              name: { ...categoryForm.name, en: e.target.value }
                            })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nameAr" className="text-sm font-semibold">Name (Arabic)</Label>
                          <Input
                            id="nameAr"
                            value={categoryForm.name.ar}
                            onChange={(e) => setCategoryForm({
                              ...categoryForm,
                              name: { ...categoryForm.name, ar: e.target.value }
                            })}
                            required
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="icon" className="text-sm font-semibold">Icon</Label>
                          <Input
                            id="icon"
                            value={categoryForm.icon}
                            onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                            placeholder="🍔"
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sortOrder" className="text-sm font-semibold">Sort Order</Label>
                          <Input
                            id="sortOrder"
                            type="number"
                            value={categoryForm.sortOrder}
                            onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: parseInt(e.target.value) || 0 })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Switch
                          id="active"
                          checked={categoryForm.active}
                          onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, active: checked })}
                        />
                        <Label htmlFor="active" className="text-sm font-semibold">Active Category</Label>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          size="lg"
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <div className="mx-6 mb-6">
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900">Category Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Icon</TableHead>
                      <TableHead className="font-semibold text-gray-900">Items</TableHead>
                      <TableHead className="font-semibold text-gray-900">Sort Order</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-blue-50 border-b border-gray-100">
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-medium">
                              {(category.name as any)?.en || 'N/A'}
                            </div>
                            <div className="text-sm text-slate-500">
                              {(category.name as any)?.ar || 'N/A'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-2xl">{category.icon}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                          {items.filter(item => item.categoryId === category.id).length}
                          </Badge>
                        </TableCell>
                        <TableCell>{category.sortOrder}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.active ?? true}
                              onCheckedChange={(checked) => toggleCategoryStatus(category.id, checked)}
                            />
                            <Badge variant={category.active ? 'success' : 'secondary'}>
                              {category.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openCategoryEditDialog(category)}
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
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-black">Menu Items</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-20 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search menu items..."
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[150px] h-12 rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {(category.name as any)?.en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={resetItemForm}
                        size="lg"
                        className="bg-blue-600 shadow-xl hover:shadow-2xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                      {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                  </DialogTitle>
                    <DialogDescription className="text-base">
                      {editingItem ? 'Update the menu item details' : 'Create a new menu item with pricing and options'}
                    </DialogDescription>
                </DialogHeader>
                
                  <form onSubmit={handleItemSubmit} className="space-y-6">
                  <div>
                      <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                    <Select 
                      value={itemForm.categoryId} 
                      onValueChange={(value) => setItemForm({ ...itemForm, categoryId: value })}
                    >
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {(category.name as any)?.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="itemNameEn" className="text-sm font-semibold">Name (English)</Label>
                      <Input
                        id="itemNameEn"
                        value={itemForm.name.en}
                        onChange={(e) => setItemForm({
                          ...itemForm,
                          name: { ...itemForm.name, en: e.target.value }
                        })}
                        required
                          className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                        <Label htmlFor="itemNameAr" className="text-sm font-semibold">Name (Arabic)</Label>
                      <Input
                        id="itemNameAr"
                        value={itemForm.name.ar}
                        onChange={(e) => setItemForm({
                          ...itemForm,
                          name: { ...itemForm.name, ar: e.target.value }
                        })}
                        required
                          className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="descEn" className="text-sm font-semibold">Description (English)</Label>
                      <Textarea
                        id="descEn"
                        value={itemForm.description.en}
                        onChange={(e) => setItemForm({
                          ...itemForm,
                          description: { ...itemForm.description, en: e.target.value }
                        })}
                          className="rounded-xl"
                      />
                    </div>
                    <div>
                        <Label htmlFor="descAr" className="text-sm font-semibold">Description (Arabic)</Label>
                      <Textarea
                        id="descAr"
                        value={itemForm.description.ar}
                        onChange={(e) => setItemForm({
                          ...itemForm,
                          description: { ...itemForm.description, ar: e.target.value }
                        })}
                          className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="basePrice" className="text-sm font-semibold">Base Price</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        step="0.01"
                        value={itemForm.basePrice}
                        onChange={(e) => setItemForm({ ...itemForm, basePrice: e.target.value })}
                        required
                          className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                        <Label htmlFor="itemSortOrder" className="text-sm font-semibold">Sort Order</Label>
                      <Input
                        id="itemSortOrder"
                        type="number"
                        value={itemForm.sortOrder}
                        onChange={(e) => setItemForm({ ...itemForm, sortOrder: parseInt(e.target.value) || 0 })}
                          className="h-12 rounded-xl"
                      />
                    </div>
                    <div>
                        <Label htmlFor="image" className="text-sm font-semibold">Image URL</Label>
                      <Input
                        id="image"
                        value={itemForm.image}
                        onChange={(e) => setItemForm({ ...itemForm, image: e.target.value })}
                          className="h-12 rounded-xl"
                      />
                    </div>
                  </div>

                    <div className="flex space-x-6">
                      <div className="flex items-center space-x-3">
                      <Switch
                        id="hasSizes"
                        checked={itemForm.hasSizes}
                        onCheckedChange={(checked) => setItemForm({ ...itemForm, hasSizes: checked })}
                      />
                        <Label htmlFor="hasSizes" className="text-sm font-semibold">Has Sizes</Label>
                    </div>
                      <div className="flex items-center space-x-3">
                      <Switch
                        id="hasModifiers"
                        checked={itemForm.hasModifiers}
                        onCheckedChange={(checked) => setItemForm({ ...itemForm, hasModifiers: checked })}
                      />
                        <Label htmlFor="hasModifiers" className="text-sm font-semibold">Has Modifiers</Label>
                    </div>
                      <div className="flex items-center space-x-3">
                      <Switch
                        id="itemActive"
                        checked={itemForm.active}
                        onCheckedChange={(checked) => setItemForm({ ...itemForm, active: checked })}
                      />
                        <Label htmlFor="itemActive" className="text-sm font-semibold">Active</Label>
                    </div>
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
              </div>
            </CardHeader>

            <div className="mx-6 mb-6">
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900">Item Name</TableHead>
                      <TableHead className="font-semibold text-gray-900">Category</TableHead>
                      <TableHead className="font-semibold text-gray-900">Price</TableHead>
                      <TableHead className="font-semibold text-gray-900">Stock</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => {
                      const category = categories.find(c => c.id === item.categoryId);
                      const stockStatus = getStockStatus(item);
                      
                      return (
                        <TableRow key={item.id} className="hover:bg-blue-50 border-b border-gray-100">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              {item.image && (
                                <img 
                                  src={item.image} 
                                  alt={(item.name as any)?.en}
                                  className="w-12 h-12 rounded-xl object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {(item.name as any)?.en || 'N/A'}
                                </div>
                                <div className="text-sm text-slate-500">
                                  {(item.name as any)?.ar || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{category?.icon}</span>
                              <span>{(category?.name as any)?.en}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono font-semibold">QR {item.basePrice}</span>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={stockStatus === 'low' ? 'warning' : 'success'}
                              className="gap-1"
                            >
                              {stockStatus === 'low' && <AlertTriangle className="h-3 w-3" />}
                              {stockStatus === 'low' ? 'Low Stock' : 'In Stock'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={item.active ?? true}
                                onCheckedChange={(checked) => toggleItemStatus(item.id, checked)}
                              />
                              <Badge variant={item.active ? 'success' : 'secondary'}>
                                {item.active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openItemEditDialog(item)}
                              className="hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="modifiers">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-black">
                <div className="w-8 h-8 bg-purple-200 rounded-xl flex items-center justify-center shadow-md">
                  <Settings className="h-4 w-4 text-blue-600" />
                </div>
                Item Modifiers
              </CardTitle>
              <CardDescription>Manage item customizations and add-ons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  Modifier Management
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced modifier management features coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
