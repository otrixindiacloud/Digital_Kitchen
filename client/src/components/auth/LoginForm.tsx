import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/store/authStore';
import { POSProvider, usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';

function LoginFormContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, state } = useAuth();
  const { language } = usePOS();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-amber-500/20 to-transparent rounded-full blur-3xl"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl">
        <CardHeader className="text-center relative pb-8">
          {/* Language selector in top-right corner */}
          <div className="absolute top-6 right-6">
            <LanguageSelector variant="compact" />
          </div>
          
          {/* Logo */}
          <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fas fa-utensils text-3xl text-white"></i>
          </div>
          
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            {t('digitalKitchen', language)}
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            {t('signInToAccess', language)}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                {t('username', language)}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('enterUsername', language)}
                disabled={state.isLoading}
                data-testid="input-username"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                {t('password', language)}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enterPassword', language)}
                disabled={state.isLoading}
                data-testid="input-password"
                className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl border-2">
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              size="xl"
              className="w-full h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              disabled={state.isLoading}
              data-testid="button-login"
            >
              {state.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('signingIn', language)}
                </div>
              ) : (
                t('signIn', language)
              )}
            </Button>
          </form>

          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <p className="text-sm font-semibold text-center text-gray-600 mb-4">
              {t('defaultCredentials', language)}
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                <span className="font-medium text-gray-800">Admin</span>
                <code className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-mono">admin / admin123</code>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                <span className="font-medium text-gray-800">Manager</span>
                <code className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg font-mono">manager / manager123</code>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                <span className="font-medium text-gray-800">Cashier</span>
                <code className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-lg font-mono">cashier / cashier123</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LoginForm() {
  return (
    <POSProvider>
      <LoginFormContent />
    </POSProvider>
  );
}