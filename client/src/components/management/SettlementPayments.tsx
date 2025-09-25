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
  CreditCard, 
  Plus, 
  Edit2, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  Shield,
  Receipt,
  Banknote,
  Smartphone,
  AlertTriangle,
  Calendar,
  User,
  Building,
  Wallet,
  Landmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { t } from '@/lib/i18n';

interface SettlementPaymentsProps {
  isActive: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'cash' | 'digital' | 'bank_transfer';
  isActive: boolean;
  processingFee: number;
  settlementTime: string;
  icon: string;
}

interface Settlement {
  id: string;
  date: string;
  paymentMethod: string;
  totalAmount: number;
  processingFee: number;
  netAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'processing';
  transactionCount: number;
  reference: string;
}

interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  timestamp: string;
  customerName: string;
  reference: string;
}

export function SettlementPayments({ isActive }: SettlementPaymentsProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'Credit Card',
      type: 'card',
      isActive: true,
      processingFee: 2.9,
      settlementTime: '2-3 business days',
      icon: '💳'
    },
    {
      id: '2',
      name: 'Cash',
      type: 'cash',
      isActive: true,
      processingFee: 0,
      settlementTime: 'Immediate',
      icon: '💵'
    },
    {
      id: '3',
      name: 'Apple Pay',
      type: 'digital',
      isActive: true,
      processingFee: 2.5,
      settlementTime: '1-2 business days',
      icon: '📱'
    },
    {
      id: '4',
      name: 'Bank Transfer',
      type: 'bank_transfer',
      isActive: false,
      processingFee: 1.5,
      settlementTime: '3-5 business days',
      icon: '🏦'
    }
  ]);

  const [settlements] = useState<Settlement[]>([
    {
      id: '1',
      date: '2024-01-15',
      paymentMethod: 'Credit Card',
      totalAmount: 1250.50,
      processingFee: 36.26,
      netAmount: 1214.24,
      status: 'completed',
      transactionCount: 45,
      reference: 'STL-2024-001'
    },
    {
      id: '2',
      date: '2024-01-14',
      paymentMethod: 'Apple Pay',
      totalAmount: 890.25,
      processingFee: 22.26,
      netAmount: 867.99,
      status: 'completed',
      transactionCount: 32,
      reference: 'STL-2024-002'
    },
    {
      id: '3',
      date: '2024-01-13',
      paymentMethod: 'Cash',
      totalAmount: 2100.00,
      processingFee: 0,
      netAmount: 2100.00,
      status: 'completed',
      transactionCount: 58,
      reference: 'STL-2024-003'
    },
    {
      id: '4',
      date: '2024-01-12',
      paymentMethod: 'Credit Card',
      totalAmount: 1750.30,
      processingFee: 50.76,
      netAmount: 1699.54,
      status: 'processing',
      transactionCount: 48,
      reference: 'STL-2024-004'
    }
  ]);

  const [transactions] = useState<PaymentTransaction[]>([
    {
      id: '1',
      orderId: 'ORD-001',
      amount: 45.50,
      paymentMethod: 'Credit Card',
      status: 'success',
      timestamp: '2024-01-15 14:30:00',
      customerName: 'Ahmed Hassan',
      reference: 'TXN-001'
    },
    {
      id: '2',
      orderId: 'ORD-002',
      amount: 32.75,
      paymentMethod: 'Apple Pay',
      status: 'success',
      timestamp: '2024-01-15 14:25:00',
      customerName: 'Fatima Al-Zahra',
      reference: 'TXN-002'
    },
    {
      id: '3',
      orderId: 'ORD-003',
      amount: 28.90,
      paymentMethod: 'Cash',
      status: 'success',
      timestamp: '2024-01-15 14:20:00',
      customerName: 'Omar Khalil',
      reference: 'TXN-003'
    },
    {
      id: '4',
      orderId: 'ORD-004',
      amount: 55.25,
      paymentMethod: 'Credit Card',
      status: 'pending',
      timestamp: '2024-01-15 14:15:00',
      customerName: 'Layla Mahmoud',
      reference: 'TXN-004'
    }
  ]);

  const [paymentMethodForm, setPaymentMethodForm] = useState({
    name: '',
    type: 'card' as 'card' | 'cash' | 'digital' | 'bank_transfer',
    processingFee: '',
    settlementTime: '',
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
      // In real app, fetch data from API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch payment data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPaymentMethod ? `/api/payment-methods/${editingPaymentMethod.id}` : '/api/payment-methods';
      const method = editingPaymentMethod ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentMethodForm,
          processingFee: parseFloat(paymentMethodForm.processingFee),
          icon: getPaymentMethodIcon(paymentMethodForm.type)
        }),
      });

      if (!response.ok) throw new Error('Failed to save payment method');

      toast({
        title: 'Success',
        description: editingPaymentMethod ? 'Payment method updated' : 'Payment method created',
      });

      setIsPaymentMethodDialogOpen(false);
      setEditingPaymentMethod(null);
      resetPaymentMethodForm();
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save payment method',
        variant: 'destructive',
      });
    }
  };

  const togglePaymentMethodStatus = async (methodId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/payment-methods/${methodId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Success',
        description: 'Payment method status updated',
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payment method status',
        variant: 'destructive',
      });
    }
  };

  const resetPaymentMethodForm = () => {
    setPaymentMethodForm({
      name: '',
      type: 'card',
      processingFee: '',
      settlementTime: '',
      isActive: true
    });
  };

  const openEditDialog = (method: PaymentMethod) => {
    setEditingPaymentMethod(method);
    setPaymentMethodForm({
      name: method.name,
      type: method.type,
      processingFee: method.processingFee.toString(),
      settlementTime: method.settlementTime,
      isActive: method.isActive
    });
    setIsPaymentMethodDialogOpen(true);
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-6 w-6 text-blue-600" />;
      case 'cash': return <Banknote className="h-6 w-6 text-green-600" />;
      case 'digital': return <Smartphone className="h-6 w-6 text-purple-600" />;
      case 'bank_transfer': return <Landmark className="h-6 w-6 text-indigo-600" />;
      default: return <CreditCard className="h-6 w-6 text-blue-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'refunded':
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return <Badge variant="success">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'processing':
        return <Badge variant="info">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const totalRevenue = settlements.reduce((sum, settlement) => sum + settlement.totalAmount, 0);
  const totalFees = settlements.reduce((sum, settlement) => sum + settlement.processingFee, 0);
  const netRevenue = totalRevenue - totalFees;
  const totalTransactions = settlements.reduce((sum, settlement) => sum + settlement.transactionCount, 0);

  const filteredSettlements = settlements.filter(settlement => {
    const matchesSearch = searchQuery === '' || 
      settlement.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || settlement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
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
          <div className="w-16 h-16 bg-blue-300 rounded-3xl flex items-center justify-center shadow-2xl">
            <CreditCard className="h-8 w-8 text-blue-700" />
                </div>
                <div>
            <h2 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
              Payment Center
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="default" className="px-3 py-1 text-sm font-semibold bg-red-200 text-red-800">
                Manager+
              </Badge>
              <span className="text-slate-600 text-sm">
                Manage payments, settlements, and financial transactions
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
            className="border border-blue-600 shadow-lg text-blue-600 hover:shadow-xl"
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
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Total Revenue</CardTitle>
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">QR {totalRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">+12.5%</span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Net Revenue</CardTitle>
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex items-center justify-center">
              <Receipt className="h-6 w-6 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">QR {netRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-blue-600 font-medium">After fees</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Processing Fees</CardTitle>
            <div className="w-12 h-12 bg-amber-200 rounded-2xl flex items-center justify-center">
              <Banknote className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">QR {totalFees.toFixed(2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm text-amber-600 font-medium">{((totalFees / totalRevenue) * 100).toFixed(1)}% of revenue</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-black">Transactions</CardTitle>
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{totalTransactions}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">+8.3%</span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Status */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
        <Shield className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Payment Security:</strong> All payment methods are secured with industry-standard encryption. 
          {paymentMethods.filter(m => m.isActive).length} of {paymentMethods.length} payment methods are currently active.
          </AlertDescription>
        </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-emerald-200 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  Revenue by Payment Method
                </CardTitle>
                <CardDescription>Revenue distribution across different payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.map((method) => {
                  const methodSettlements = settlements.filter(s => s.paymentMethod === method.name);
                  const methodRevenue = methodSettlements.reduce((sum, s) => sum + s.totalAmount, 0);
                  const percentage = totalRevenue > 0 ? (methodRevenue / totalRevenue) * 100 : 0;
                  
                  return (
                    <div key={method.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{method.icon}</span>
                          <span className="font-medium">{method.name}</span>
                        </div>
                        <span className="text-slate-600">QR {methodRevenue.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-black">
                  <div className="w-8 h-8 bg-blue-200 rounded-xl flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest payment transactions</CardDescription>
            </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <div className="font-medium text-sm">{transaction.orderId}</div>
                          <div className="text-xs text-slate-500">{transaction.customerName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm">QR {transaction.amount.toFixed(2)}</div>
                        <div className="text-xs text-slate-500">{transaction.paymentMethod}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold">Settlement History</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search settlements..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="w-24 px-4 py-4 font-semibold text-slate-700">Date</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700">Reference</TableHead>
                      <TableHead className="w-40 px-4 py-4 font-semibold text-slate-700">Payment Method</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700 text-right">Total Amount</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700 text-right">Processing Fee</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700 text-right">Net Amount</TableHead>
                      <TableHead className="w-24 px-4 py-4 font-semibold text-slate-700 text-center">Transactions</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700 text-center">Status</TableHead>
                      <TableHead className="w-20 px-4 py-4 font-semibold text-slate-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSettlements.map((settlement) => (
                      <TableRow key={settlement.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100">
                        <TableCell className="px-4 py-4 font-medium text-slate-800">
                          {new Date(settlement.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="px-4 py-4 font-mono text-sm text-slate-600">{settlement.reference}</TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="font-medium text-slate-700">{settlement.paymentMethod}</span>
                        </TableCell>
                        <TableCell className="px-4 py-4 font-mono font-semibold text-slate-800 text-right">QR {settlement.totalAmount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-4 font-mono text-slate-600 text-right">QR {settlement.processingFee.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-4 font-mono font-semibold text-green-600 text-right">QR {settlement.netAmount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-semibold px-3 py-1">
                            {settlement.transactionCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(settlement.status)}
                            {getStatusBadge(settlement.status)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200 w-10 h-10 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="transactions" className="space-y-6">
          <Card className="group hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50">
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-bold">Payment Transactions</h3>
                <div className="flex items-center gap-3">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 z-10 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search transactions..."
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
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-blue-600 rounded-2xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="w-28 px-4 py-4 font-semibold text-slate-700">Order ID</TableHead>
                      <TableHead className="w-40 px-4 py-4 font-semibold text-slate-700">Customer</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700">Amount</TableHead>
                      <TableHead className="w-40 px-4 py-4 font-semibold text-slate-700">Payment Method</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700 text-center">Status</TableHead>
                      <TableHead className="w-48 px-4 py-4 font-semibold text-slate-700">Date & Time</TableHead>
                      <TableHead className="w-32 px-4 py-4 font-semibold text-slate-700">Reference</TableHead>
                      <TableHead className="w-20 px-4 py-4 font-semibold text-slate-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 border-b border-slate-100">
                        <TableCell className="px-4 py-4 font-mono font-medium text-slate-800">{transaction.orderId}</TableCell>
                        <TableCell className="px-4 py-4 font-medium text-slate-700">{transaction.customerName}</TableCell>
                        <TableCell className="px-4 py-4 font-mono font-semibold text-slate-800">QR {transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="px-4 py-4">
                          <span className="font-medium text-slate-700">{transaction.paymentMethod}</span>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-sm text-slate-600">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-4 py-4 font-mono text-sm text-slate-600">{transaction.reference}</TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-blue-50 hover:border-blue-200 w-10 h-10 rounded-full"
                          >
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="methods" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Payment Methods</h3>
            <Dialog open={isPaymentMethodDialogOpen} onOpenChange={setIsPaymentMethodDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetPaymentMethodForm}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {editingPaymentMethod ? 'Edit Payment Method' : 'Add New Payment Method'}
                  </DialogTitle>
                  <DialogDescription className="text-base">
                    {editingPaymentMethod ? 'Update the payment method details' : 'Configure a new payment method for your restaurant'}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handlePaymentMethodSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="methodName" className="text-sm font-semibold">Payment Method Name</Label>
                    <Input
                      id="methodName"
                      value={paymentMethodForm.name}
                      onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, name: e.target.value })}
                      required
                      className="h-12 rounded-xl mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="methodType" className="text-sm font-semibold">Payment Type</Label>
                    <Select 
                      value={paymentMethodForm.type} 
                      onValueChange={(value: any) => setPaymentMethodForm({ ...paymentMethodForm, type: value })}
                    >
                      <SelectTrigger className="h-12 rounded-xl mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="digital">Digital Wallet</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="processingFee" className="text-sm font-semibold">Processing Fee (%)</Label>
                      <Input
                        id="processingFee"
                        type="number"
                        step="0.01"
                        value={paymentMethodForm.processingFee}
                        onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, processingFee: e.target.value })}
                        className="h-12 rounded-xl mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="settlementTime" className="text-sm font-semibold">Settlement Time</Label>
                      <Input
                        id="settlementTime"
                        value={paymentMethodForm.settlementTime}
                        onChange={(e) => setPaymentMethodForm({ ...paymentMethodForm, settlementTime: e.target.value })}
                        placeholder="e.g., 2-3 business days"
                        className="h-12 rounded-xl mt-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="methodActive"
                      checked={paymentMethodForm.isActive}
                      onCheckedChange={(checked) => setPaymentMethodForm({ ...paymentMethodForm, isActive: checked })}
                    />
                    <Label htmlFor="methodActive" className="text-sm font-semibold">Active Payment Method</Label>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                    >
                      {editingPaymentMethod ? 'Update Method' : 'Create Method'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      {getPaymentMethodIcon(method.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-black font-bold">{method.name}</CardTitle>
                      <CardDescription className="text-sm">{method.settlementTime}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  <Switch
                    checked={method.isActive}
                    onCheckedChange={(checked) => togglePaymentMethodStatus(method.id, checked)}
                  />
                    <Badge variant={method.isActive ? 'success' : 'destructive'}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Processing Fee:</span>
                      <span className="font-semibold">{method.processingFee}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Type:</span>
                      <span className="font-semibold capitalize">{method.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(method)}
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
      </Tabs>
    </div>
  );
}

// Helper function for export (placeholder)
const exportReport = (format: string) => {
  console.log(`Exporting report as ${format}`);
};
