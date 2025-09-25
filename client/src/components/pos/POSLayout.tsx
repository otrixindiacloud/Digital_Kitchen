import React, { useState } from "react";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { KitchenDisplay } from "./KitchenDisplay";
import { Button } from "@/components/ui/button";
import { POSProvider, usePOS } from "@/store/posStore";
import { useAuth } from "@/store/authStore";
import { t } from "@/lib/i18n";

function POSLayoutContent() {
  const [showKDS, setShowKDS] = useState(false);
  const { language } = usePOS();

  return (
           <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 relative" data-testid="pos-layout">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-to-r from-orange-500/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-l from-amber-500/5 to-transparent rounded-full blur-3xl"></div>
      
      {/* Main Content with enhanced styling */}
      <div className="relative z-10 flex w-full">
        <LeftPanel />
        <RightPanel />
      </div>
      
      {showKDS && (
        <KitchenDisplay onClose={() => setShowKDS(false)} />
      )}
      
    </div>
  );
}

export function POSLayout() {
  return (
    <POSProvider>
      <POSLayoutContent />
    </POSProvider>
  );
}
