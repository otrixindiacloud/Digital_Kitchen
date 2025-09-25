import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/store/authStore';
import { usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';
import { Link } from 'wouter';
import { 
  ShoppingCart, 
  BarChart3, 
  Users, 
  ChefHat, 
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Star,
  ArrowRight,
  Play,
  CheckCircle
} from 'lucide-react';

export default function Hero() {
  const { state, hasAnyRole } = useAuth();
  const { language } = usePOS();

  const features = [
    {
      icon: ShoppingCart,
      title: 'POS System',
      titleAr: 'نظام نقاط البيع',
      description: 'Complete point of sale with multiple payment methods',
      descriptionAr: 'نظام نقاط بيع كامل مع طرق دفع متعددة',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      titleAr: 'لوحة تحكم التحليلات',
      description: 'Real-time insights and performance metrics',
      descriptionAr: 'رؤى في الوقت الفعلي ومقاييس الأداء',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Staff Management',
      titleAr: 'إدارة الموظفين',
      description: 'Complete staff scheduling and performance tracking',
      descriptionAr: 'جدولة الموظفين الكاملة وتتبع الأداء',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: ChefHat,
      title: 'Kitchen Display',
      titleAr: 'عرض المطبخ',
      description: 'Real-time order management for kitchen staff',
      descriptionAr: 'إدارة الطلبات في الوقت الفعلي لطاقم المطبخ',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  const stats = [
    { label: 'Orders Today', labelAr: 'الطلبات اليوم', value: '127', change: '+12%' },
    { label: 'Revenue', labelAr: 'الإيرادات', value: 'QR 8,450', change: '+8%' },
    { label: 'Active Tables', labelAr: 'الطاولات النشطة', value: '23', change: '+5%' },
    { label: 'Staff Online', labelAr: 'الموظفون متصلون', value: '12', change: '+2%' }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Welcome Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {t('welcome', language)}, {state.user?.username}
              </span>
              <Badge variant="secondary" className="text-xs">
                {state.user?.role?.toUpperCase()}
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              {language === 'ar' ? 'المطبخ الرقمي' : 'Digital Kitchen'}
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {language === 'ar' ? 'نظام إدارة المطاعم' : 'Restaurant Management'}
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'نظام شامل لإدارة المطاعم مع نقاط البيع والتحليلات وإدارة الموظفين'
                : 'Complete restaurant management system with POS, analytics, and staff management'
              }
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <ShoppingCart className="mr-3 h-6 w-6" />
                  {language === 'ar' ? 'بدء البيع' : 'Start Selling'}
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              
              {hasAnyRole(['admin', 'manager']) && (
                <Link href="/management">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-blue-50 transition-all duration-200"
                  >
                    <BarChart3 className="mr-3 h-6 w-6" />
                    {language === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-1">
                      {language === 'ar' ? stat.labelAr : stat.label}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">{stat.change}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'كل ما تحتاجه لإدارة مطعمك بكفاءة'
                : 'Everything you need to manage your restaurant efficiently'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border border-gray-200"
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className={`h-8 w-8 ${feature.textColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {language === 'ar' ? feature.titleAr : feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {language === 'ar' ? feature.descriptionAr : feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-20">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'ar' 
                ? 'ابدأ فوراً مع هذه الإجراءات الشائعة'
                : 'Get started immediately with these common actions'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* POS System */}
            <Link href="/">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <ShoppingCart className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {language === 'ar' ? 'نظام نقاط البيع' : 'POS System'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === 'ar' 
                      ? 'ابدأ في معالجة الطلبات والمبيعات'
                      : 'Start processing orders and sales'
                    }
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    {language === 'ar' ? 'ابدأ البيع' : 'Start Selling'}
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Management Dashboard */}
            {hasAnyRole(['admin', 'manager']) && (
              <Link href="/management">
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                      <BarChart3 className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {language === 'ar' ? 'لوحة التحكم' : 'Management Dashboard'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {language === 'ar' 
                        ? 'إدارة شاملة للمطعم والتحليلات'
                        : 'Comprehensive restaurant management and analytics'
                      }
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      {language === 'ar' ? 'إدارة المطعم' : 'Manage Restaurant'}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )}

            {/* Kitchen Display */}
            <Link href="/kitchen">
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                    <ChefHat className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {language === 'ar' ? 'عرض المطبخ' : 'Kitchen Display'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {language === 'ar' 
                      ? 'إدارة طلبات المطبخ في الوقت الفعلي'
                      : 'Real-time kitchen order management'
                    }
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                    {language === 'ar' ? 'عرض المطبخ' : 'View Kitchen'}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">
                {language === 'ar' ? 'المطبخ الرقمي' : 'Digital Kitchen'}
              </h3>
            </div>
            <p className="text-gray-400 mb-6">
              {language === 'ar' 
                ? 'نظام إدارة المطاعم الأكثر تطوراً'
                : 'The most advanced restaurant management system'
              }
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Digital Kitchen</span>
              <span>•</span>
              <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
