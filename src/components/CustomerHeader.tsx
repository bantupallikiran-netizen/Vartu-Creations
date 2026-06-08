import React from "react";
import { useApp } from "../AppContext";
import { ShoppingCart, Heart, Shield, RefreshCw, Smartphone, User } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCartDrawer: () => void;
  openAccountDrawer: () => void;
}

export const CustomerHeader: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openCartDrawer, openAccountDrawer }) => {
  const { 
    cart, wishlist, isFirebaseActive, currentUserRole, setCurrentUserRole,
    firebaseUser, googleSignIn, googleSignOut
  } = useApp();

  const navItems = [
    { id: "home", label: "Home" },
    { id: "shop", label: "Shop All" },
    { id: "custom", label: "Custom Studio" },
    { id: "workshops", label: "Workshops" },
    { id: "corporate", label: "Corporate Gifting" },
    { id: "blog", label: "Art Care Blog" }
  ];

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-[#D4A373]/30 shadow-xs">
      {/* Top micro bar for identity simulation */}
      <div className="bg-[#2D302D] text-[#FAF9F6] text-xs px-4 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8B9D83] animate-pulse"></span>
          <span className="font-mono tracking-tight text-[11px]">
            {isFirebaseActive 
              ? "Live Cloud Database: Connected (GCP Firestore)" 
              : "Database Mode: Simulated Offline Local Sandbox"}
          </span>
          {isFirebaseActive && (
            <div className="flex items-center gap-2 ml-1">
              {firebaseUser ? (
                <div className="flex items-center gap-1.5 bg-black/25 px-2 py-0.5 rounded text-[10px] font-sans">
                  <span 
                    onClick={openAccountDrawer}
                    className="text-[#8B9D83] hover:text-white transition-colors font-medium max-w-[150px] truncate cursor-pointer" 
                    title="View My Profile & Order History"
                  >
                    👤 {firebaseUser.displayName || firebaseUser.email}
                  </span>
                  <button 
                    onClick={googleSignOut} 
                    className="text-[#D4A373] hover:text-white transition-colors underline cursor-pointer font-mono"
                  >
                    [Sign Out]
                  </button>
                </div>
              ) : (
                <button 
                  onClick={googleSignIn} 
                  className="bg-[#D4A373] text-[#2D302D] hover:bg-[#FAF9F6] px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all shadow-xs cursor-pointer font-sans"
                >
                  🔒 Cloud Sign In
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[#FAF9F6]/75 hidden sm:inline text-[11px] font-sans">Simulate Access Identity As:</span>
          <select 
            value={currentUserRole}
            onChange={(e) => {
              const selectedRole = e.target.value as any;
              setCurrentUserRole(selectedRole);
              if (selectedRole !== "Customer") {
                setCurrentTab("admin");
              } else {
                setCurrentTab("home");
              }
            }}
            className="bg-[#3A3F3A] text-white border-none rounded py-0.5 px-2 text-xs focus:ring-1 focus:ring-[#D4A373] cursor-pointer font-sans"
          >
            <option value="Customer">Client / Buyer</option>
            <option value="Super Admin">Super Admin (Founder/Kiran)</option>
            <option value="Operations">Operations (Kiran/Naveen)</option>
            <option value="Inventory Manager">Inventory Manager (Shweta)</option>
            <option value="Marketing">Marketing Specialist</option>
          </select>

          {currentUserRole !== "Customer" && (
            <button 
              onClick={() => setCurrentTab("admin")} 
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                currentTab === "admin" ? "bg-[#8B9D83] text-white" : "bg-white/10 hover:bg-white/20 text-[#D4A373]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Brand header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Brand identity logo */}
        <div 
          onClick={() => setCurrentTab("home")} 
          className="cursor-pointer group flex flex-col"
        >
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-serif tracking-tight leading-none italic text-[#2D302D] transition-transform group-hover:scale-98 duration-200">
              VartU <span className="text-[#8B9D83]">Creations</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#D4A373] mt-1 select-none">
              Art for Every Heart
            </span>
          </div>
        </div>

        {/* Center menu navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`pb-1 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 ${
                currentTab === item.id 
                  ? "text-[#2D302D] border-[#2D302D]" 
                  : "text-[#6B705C] hover:text-[#2D302D] border-transparent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Interactive cart/wishlist icons */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentTab("shop")}
            className="md:hidden text-xs text-[#8B9D83] hover:underline font-semibold uppercase tracking-wider"
          >
            Shop All
          </button>

          {/* Favorited badges */}
          <button 
            onClick={() => {
              setCurrentTab("shop");
            }}
            className="relative p-1.5 text-[#6B705C] hover:text-[#8B9D83] transition-colors rounded-full hover:bg-gray-100"
            title="My Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B9D83] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart trigger button */}
          <button 
            onClick={openCartDrawer}
            className="p-1.5 text-[#6B705C] hover:text-[#8B9D83] transition-colors rounded-full hover:bg-gray-100 relative"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#2D302D] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Account/Profile trigger button */}
          <button 
            onClick={openAccountDrawer}
            className="p-1.5 text-[#6B705C] hover:text-[#8B9D83] transition-colors rounded-full hover:bg-gray-100 relative"
            title="My Orders & Profile"
          >
            <User className="w-5 h-5" />
            {firebaseUser && (
              <span className="absolute top-1.5 right-1.5 bg-[#8B9D83] w-2 h-2 rounded-full border border-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav rail */}
      <div className="md:hidden flex overflow-x-auto border-t border-gray-100 whitespace-nowrap px-2 py-2 no-scrollbar scroll-smooth gap-1.5 bg-[#FAF9F6]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider transition-all ${
              currentTab === item.id 
                ? "bg-[#8B9D83] text-white" 
                : "text-[#6B705C] bg-white border border-[#D4A373]/20 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
