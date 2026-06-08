import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./AppContext";
import { CustomerHeader } from "./components/CustomerHeader";
import { HomeView } from "./components/HomeView";
import { ShopView } from "./components/ShopView";
import { CustomOrdersView } from "./components/CustomOrdersView";
import { WorkshopsView } from "./components/WorkshopsView";
import { CorporateGiftingView } from "./components/CorporateGiftingView";
import { BlogView } from "./components/BlogView";
import { AdminPanel } from "./components/AdminPanel";
import { CartDrawer } from "./components/CartDrawer";
import { AccountDrawer } from "./components/AccountDrawer";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { Heart, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function MainLayout() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoadingView, setIsLoadingView] = useState(true);
  const { currentUserRole } = useApp();

  useEffect(() => {
    setIsLoadingView(true);
    const timer = setTimeout(() => {
      setIsLoadingView(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentTab]);

  const renderActiveView = () => {
    switch (currentTab) {
      case "home":
        return <HomeView setCurrentTab={setCurrentTab} />;
      case "shop":
        return <ShopView onOpenCart={() => setIsCartOpen(true)} />;
      case "custom":
        return <CustomOrdersView />;
      case "workshops":
        return <WorkshopsView />;
      case "corporate":
        return <CorporateGiftingView />;
      case "blog":
        return <BlogView />;
      case "admin":
        // Fallback checks for administrative role simulations
        if (currentUserRole === "Customer") {
          return (
            <div className="max-w-md mx-auto text-center py-20 px-4">
              <ShieldCheck className="w-12 h-12 text-[#8B9D83] mx-auto mb-4" />
              <h2 className="text-xl font-serif italic text-[#2D302D]">Administrative Authorization Needed</h2>
              <p className="text-xs text-[#6B705C] mt-2 leading-relaxed">
                Please use the "Identity Simulator" dropdown in the top bar to verify access roles as Super Admin, Operations, or Inventory Manager.
              </p>
            </div>
          );
        }
        return <AdminPanel />;
      default:
        return <HomeView setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-between">
      {/* 1. BRAND GLOBAL NAV HEADER BAR */}
      <CustomerHeader 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        openCartDrawer={() => setIsCartOpen(true)} 
        openAccountDrawer={() => setIsAccountOpen(true)}
      />

      {/* 2. DYNAMIC CONTENT MAIN AREA WITH MOTION TRANSITION */}
      <main className="flex-grow overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab + (isLoadingView ? "-loading" : "-loaded")}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {isLoadingView ? (
              <SkeletonLoader currentTab={currentTab} />
            ) : (
              renderActiveView()
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. CHECKOUT BAG DRIP SLIDE */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* 3b. ARTISAN ACCOUNT & ORDER HISTORY DRAWER */}
      <AccountDrawer 
        isOpen={isAccountOpen} 
        onClose={() => setIsAccountOpen(false)} 
      />

      {/* 4. BOUTIQUE DESIGN FOOTER CARD */}
      <footer className="bg-[#2D302D] text-[#FAF9F6] border-t border-[#D4A373]/25 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif italic font-bold text-[#D4A373]">VartU</span>
              <span className="text-white text-md font-light tracking-wide font-sans">Creations</span>
            </div>
            <p className="text-[#FAF9F6]/75 capitalize max-w-xs leading-relaxed">
              Meticulously crafted home decor accessories, premium dried-flower castings, and scented soy candles. Connecting memories to your heart. Founded May 2024.
            </p>
            <div className="text-[9px] text-[#D4A373] uppercase tracking-[0.25em] font-mono font-medium">
              Art for Every Heart
            </div>
          </div>

          {/* Sourcing Directions Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-[9px]">Studio Coordinates</h4>
            <div className="space-y-2.5 text-[#FAF9F6]/75">
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 shrink-0 text-[#8B9D83]" />
                <span>Madhapur Art Row, near Cyber Towers, Hyderabad, Telangana, 500081, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8B9D83]" />
                <span>hello@vartucreations.com</span>
              </p>
              <p className="flex items-center gap-2 font-mono text-[11px]">
                <Phone className="w-4 h-4 text-[#8B9D83]" />
                <span>+91 81234 45678 (Kiran Kumar - Business head)</span>
              </p>
            </div>
          </div>

          {/* Dream team credits Col */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-bold uppercase tracking-widest text-[9px]">VartU Dream Team</h4>
            <div className="grid grid-cols-2 gap-3 text-[#FAF9F6]/75">
              <div>
                <p className="font-bold text-white">Lokeswari</p>
                <p className="text-[10px] text-[#D4A373]">Founder & Art Head</p>
              </div>
              <div>
                <p className="font-bold text-white">Kiran Kumar</p>
                <p className="text-[10px] text-[#D4A373]">Ops & BD</p>
              </div>
              <div>
                <p className="font-bold text-white">Dharani</p>
                <p className="text-[10px] text-[#D4A373]">Creative Dev</p>
              </div>
              <div>
                <p className="font-bold text-white">Naveen</p>
                <p className="text-[10px] text-[#D4A373]">Fulfillment Head</p>
              </div>
              <div>
                <p className="font-bold text-white">Shweta</p>
                <p className="text-[10px] text-[#D4A373]">Product Design</p>
              </div>
            </div>
          </div>

        </div>

        <hr className="border-[#FAF9F6]/10 my-8 max-w-7xl mx-auto" />

        {/* Base strip copyright */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-[#FAF9F6]/50 uppercase tracking-widest">
          <p>All Rights Preserved &copy; {new Date().getFullYear()} VartU Creations, Hyderabad.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-[#8B9D83] fill-current animate-pulse" />
            <span>using React & Google Gemini API</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
