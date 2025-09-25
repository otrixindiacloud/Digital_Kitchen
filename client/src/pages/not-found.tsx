import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { usePOS } from "@/store/posStore";
import { t } from "@/lib/i18n";

export default function NotFound() {
  const { language } = usePOS();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-2xl mx-4">
        <Card className="w-full shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="text-center">
              {/* 404 Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
              
              {/* Error Message */}
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {language === 'ar' 
                  ? 'عذراً، الصفحة التي تبحث عنها غير موجودة. تحقق من الرابط أو عد إلى الصفحة الرئيسية.'
                  : 'Sorry, the page you are looking for does not exist. Check the URL or return to the homepage.'
                }
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Home className="h-5 w-5 mr-2" />
                    {language === 'ar' ? 'الصفحة الرئيسية' : 'Go Home'}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  {language === 'ar' ? 'العودة' : 'Go Back'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
