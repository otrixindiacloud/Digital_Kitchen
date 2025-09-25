import React from "react";
import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/store/authStore";
import { POSProvider } from "@/store/posStore";
import { LoginForm } from "@/components/auth/LoginForm";
import { MainLayout } from "@/components/layout/MainLayout";
import POS from "@/pages/pos";
import Management from "@/pages/management";
import Hero from "@/pages/hero";
import Dashboard from "@/pages/dashboard";
import Kitchen from "@/pages/kitchen";
import ActiveUsers from "@/pages/active-users";
import Notifications from "@/pages/notifications";
import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <POSProvider>
      <MainLayout>
               <Switch>
                 <Route path="/hero">
                   <Redirect to="/" />
                 </Route>
                 <Route path="/" component={POS} />
                 <Route path="/dashboard" component={Dashboard} />
                 <Route path="/management" component={Management} />
                 <Route path="/kitchen" component={Kitchen} />
                 <Route path="/active-users" component={ActiveUsers} />
                 <Route path="/notifications" component={Notifications} />
                 <Route component={NotFound} />
               </Switch>
      </MainLayout>
    </POSProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AuthenticatedRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
