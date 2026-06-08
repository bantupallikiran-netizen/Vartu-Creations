import React, { useState, useEffect } from "react";
import { useApp } from "../AppContext";
import { 
  X, User, Search, Package, Calendar, Clock, MapPin, 
  HelpCircle, MessageCircle, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2, Ticket 
} from "lucide-react";
import { OrderStatus } from "../types";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDrawer: React.FC<AccountDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    orders, customOrders, workshops, firebaseUser, isFirebaseActive, googleSignIn, googleSignOut 
  } = useApp();

  // Guest inquiry state
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"purchases" | "customs" | "workshops">("purchases");

  // Load last queried email from local storage for convenience
  useEffect(() => {
    const cached = localStorage.getItem("vartu_inquiry_email");
    if (cached) {
      setInquiryEmail(cached);
    } else if (firebaseUser?.email) {
      setInquiryEmail(firebaseUser.email);
    }
  }, [firebaseUser]);

  if (!isOpen) return null;

  // Save inquiry email to local storage whenever it changes
  const handleEmailChange = (val: string) => {
    setInquiryEmail(val);
    localStorage.setItem("vartu_inquiry_email", val);
  };

  // Determine current active email context
  const currentEmail = firebaseUser?.email || inquiryEmail.trim();

  // Filter regular orders by email or userId
  const filteredOrders = orders.filter(ord => {
    const ordEmail = ord.customerDetails?.email?.toLowerCase();
    const query = currentEmail.toLowerCase();
    
    // Exact email match
    if (query && ordEmail === query) return true;
    
    // Auth user ID match
    if (firebaseUser && ord.userId === firebaseUser.uid) return true;

    return false;
  });

  // Filter custom orders by email or user
  const filteredCustoms = customOrders.filter(cust => {
    // Search custom orders
    if (firebaseUser && cust.userId === firebaseUser.uid) return true;
    // Or if guest, match by standard query context if there are guest orders (our customs don't has email field directly in type, but fallback to all or matching userId)
    return firebaseUser ? (cust.userId === firebaseUser.uid) : true;
  });

  // Filter workshop tickets booked by this email
  const bookedWorkshops = workshops.filter(ws => {
    return ws.attendees?.some(att => att.email.toLowerCase() === currentEmail.toLowerCase());
  });

  // Map order status to numeric steps
  const getStatusStep = (status: OrderStatus): number => {
    switch (status) {
      case OrderStatus.NEW: return 1;
      case OrderStatus.CONFIRMED: return 2;
      case OrderStatus.IN_PRODUCTION: return 3;
      case OrderStatus.PACKED: return 4;
      case OrderStatus.SHIPPED: return 5;
      case OrderStatus.DELIVERED: return 6;
      case OrderStatus.CANCELLED: return -1;
      default: return 1;
    }
  };

  const steps = [
    { num: 1, label: "Ordered", desc: "Received at VartU Studio" },
    { num: 2, label: "Confirmed", desc: "Materials Allocated" },
    { num: 3, label: "In Production", desc: "Lokeswari floral setting" },
    { num: 4, label: "Packed", desc: "Naveen eco-wrapped box" },
    { num: 5, label: "Shipped", desc: "Fragile partner transit" },
    { num: 6, label: "Delivered", desc: "Safely in your heart" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop overlay with blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-lg bg-[#FAF9F6] border-l border-[#D4A373]/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header Bar */}
          <div className="bg-[#2D302D] text-[#FAF9F6] px-6 py-4 flex items-center justify-between border-b border-[#D4A373]/20">
            <h2 className="text-md font-bold uppercase tracking-wider flex items-center gap-2 font-serif italic text-white text-lg">
              <User className="w-5 h-5 text-[#8B9D83]" />
              <span>Artisan Account & Orders</span>
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Identity Hub Widget */}
          <div className="bg-white border-b border-[#D4A373]/15 px-6 py-5 space-y-4">
            {firebaseUser ? (
              /* Signed In Profile Card */
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#E9EDC9] border border-[#8B9D83] flex items-center justify-center font-serif text-[#8B9D83] text-lg font-bold select-none">
                    {firebaseUser.displayName ? firebaseUser.displayName.charAt(0) : "V"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2D302D] font-sans">
                      {firebaseUser.displayName || "Artisan Client"}
                    </h4>
                    <p className="text-[10px] text-[#6B705C] font-mono leading-tight">
                      {firebaseUser.email}
                    </p>
                    <span className="inline-block px-2 py-0.5 mt-1 bg-[#E9EDC9] text-[#8B9D83] rounded-sm text-[8px] font-bold uppercase tracking-wider">
                      🔒 Verified Cloud Profile
                    </span>
                  </div>
                </div>
                <button
                  onClick={googleSignOut}
                  className="px-3 py-1 text-[10px] text-[#D4A373] hover:text-[#2D302D] border border-[#D4A373]/30 hover:border-[#D4A373] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-sans"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              /* Signed Out Guest Card with Google SignIn & Email Search */
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#D4A373]/10">
                  <div>
                    <p className="text-xs font-semibold text-[#2D302D]">Looking for your orders?</p>
                    <p className="text-[10px] text-[#6B705C] leading-normal pt-0.5">
                      Authenticating aggregates all your custom designs & workshop passes under one secure lounge.
                    </p>
                  </div>
                  {isFirebaseActive && (
                    <button
                      onClick={googleSignIn}
                      className="shrink-0 bg-[#D4A373] hover:bg-[#FAF9F6] text-[#2D302D] border border-[#D4A373] px-3.5 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer font-sans flex items-center justify-center gap-1"
                    >
                      <span>🔒 Google Login</span>
                    </button>
                  )}
                </div>

                {/* Manual track order filter */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] text-[#6B705C] font-mono tracking-wider uppercase font-bold">
                    Quick Track as Guest (Search by Billing Email)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. sneha.r@gmail.com"
                      value={inquiryEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-[#2D302D]"
                    />
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <p className="text-[9px] text-[#6B705C]/75 italic font-mono block">
                    Type <strong className="text-rose-700/80 underline font-bold cursor-pointer" onClick={() => handleEmailChange("sneha.r@gmail.com")}>sneha.r@gmail.com</strong> or <strong className="text-rose-700/80 underline font-bold cursor-pointer" onClick={() => handleEmailChange("rajesh.kan@yahoo.com")}>rajesh.kan@yahoo.com</strong> to view client history simulation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Horizontal tab selectors */}
          <div className="flex border-b border-gray-100 bg-[#FAF9F6]/50 shrink-0 text-xs text-center font-semibold">
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 py-3 border-b-2 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1 ${
                activeTab === "purchases" 
                  ? "text-[#2D302D] border-[#2D302D] bg-[#2D302D]/5" 
                  : "text-[#6B705C] border-transparent hover:text-[#2D302D]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Shop Purchases ({filteredOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("customs")}
              className={`flex-1 py-3 border-b-2 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1 ${
                activeTab === "customs" 
                  ? "text-[#2D302D] border-[#2D302D] bg-[#2D302D]/5" 
                  : "text-[#6B705C] border-transparent hover:text-[#2D302D]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Studio ({filteredCustoms.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("workshops")}
              className={`flex-1 py-3 border-b-2 uppercase tracking-wider text-[10px] flex items-center justify-center gap-1 ${
                activeTab === "workshops" 
                  ? "text-[#2D302D] border-[#2D302D] bg-[#2D302D]/5" 
                  : "text-[#6B705C] border-transparent hover:text-[#2D302D]"
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Workshops ({bookedWorkshops.length})</span>
            </button>
          </div>

          {/* Results Scrollbox */}
          <div className="flex-grow overflow-y-auto px-6 py-4 bg-[#FAF9F6]/20">
            
            {/* EMAIL CONTEXT INDICATOR */}
            {currentEmail && (
              <div className="text-[10px] text-[#6B705C] bg-[#FAF9F6] p-2 rounded-lg border border-[#D4A373]/10 flex items-center justify-between mb-4 select-none font-mono font-semibold">
                <span>Displaying history for email:</span>
                <span className="text-[#2D302D] font-bold">{currentEmail}</span>
              </div>
            )}

            {/* TAB ONE: STANDARD SHOP PURCHASES / ORDER STATUS PROGRESS TIMELINE */}
            {activeTab === "purchases" && (
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-20 text-[#6B705C] space-y-3">
                    <Package className="w-12 h-12 mx-auto text-[#6B705C]/30 stroke-1" />
                    <p className="text-xs font-semibold">No shop purchases detected under this email.</p>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Use the seed links above or make a checkout purchase with your billing email to trace history live!
                    </p>
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const activeStepNum = getStatusStep(ord.status);
                    const isCancelled = ord.status === OrderStatus.CANCELLED;

                    return (
                      <div 
                        key={ord.id} 
                        className="bg-white rounded-2xl border border-[#D4A373]/15 shadow-2xs divide-y divide-[#D4A373]/10 overflow-hidden"
                      >
                        {/* Order Header Info */}
                        <div className="p-4.5 bg-[#FAF9F6]/60 space-y-1">
                          <div className="flex justify-between items-start">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono font-bold text-[#6B705C]">ORDER ID</span>
                              <h3 className="font-mono text-xs font-extrabold text-[#2D302D]">{ord.id}</h3>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-mono text-gray-400 block">TOTAL CURATED</span>
                              <span className="font-serif italic text-[#D4A373] text-sm font-bold">₹{ord.total}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between text-[10px] text-[#6B705C] pt-2 font-mono gap-1">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                            </span>
                            <span className="bg-[#E9EDC9] text-[#8B9D83] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        {/* HIGHLY INTERACTIVE LIVE STEPEER TIMELINE SECTION */}
                        <div className="p-4.5 space-y-3 bg-white">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D302D] block">VartU Creation Progress</span>
                          
                          {isCancelled ? (
                            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-[10px] font-mono font-bold border border-red-200">
                              🛑 THIS ORDER HAS BEEN CANCELLED.
                            </div>
                          ) : (
                            <div className="space-y-4 pt-1">
                              {/* Graphical Horizontal Connector line on desktop, vertical list layout as well */}
                              <div className="hidden sm:flex items-center justify-between relative pl-2 pr-2">
                                {/* Connector Line background */}
                                <div className="absolute left-6 right-6 top-[13px] h-0.5 bg-gray-100 -z-10" />
                                {/* Underway highlighted connector line */}
                                <div 
                                  className="absolute left-6 top-[13px] h-0.5 bg-[#8B9D83] -z-10 transition-all duration-500" 
                                  style={{ width: `${Math.min(100, Math.max(0, ((activeStepNum - 1) / 5) * 85))}%` }}
                                />

                                {steps.map((st) => {
                                  const completed = st.num <= activeStepNum;
                                  const currentActive = st.num === activeStepNum;
                                  return (
                                    <div key={st.num} className="flex flex-col items-center flex-1 relative group" title={st.desc}>
                                      <div 
                                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                          currentActive 
                                            ? "bg-[#D4A373] text-white ring-4 ring-[#D4A373]/25 scale-110" 
                                            : completed 
                                              ? "bg-[#8B9D83] text-white" 
                                              : "bg-gray-100 text-gray-400"
                                        } text-[10px] font-mono font-bold`}
                                      >
                                        {completed && !currentActive ? "✓" : st.num}
                                      </div>
                                      <span className={`text-[8px] font-bold uppercase tracking-wider mt-1 text-center font-sans ${currentActive ? "text-[#D4A373]" : completed ? "text-[#2D302D]" : "text-gray-400"}`}>
                                        {st.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Concise Vertical Step status list for responsive mobile viewport details or quick read */}
                              <div className="block sm:hidden space-y-2">
                                <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#D4A373]/10 space-y-1">
                                  <p className="text-[10px] font-bold text-[#2D302D] flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                                    <span>Current Status: <strong className="text-[#8B9D83]">{ord.status}</strong></span>
                                  </p>
                                  <p className="text-[9px] text-[#6B705C] italic leading-normal">
                                    {steps[Math.max(0, activeStepNum - 1)]?.desc || "Updating coordinates catalog..."}
                                  </p>
                                </div>
                              </div>

                              {/* Extra descriptive helper annotation depending on status */}
                              <div className="bg-[#FAF9F6] p-2.5 rounded-lg border border-dashed border-[#D4A373]/15 text-[9px] text-[#6B705C]">
                                {activeStepNum === 3 && (
                                  <p className="leading-snug">
                                    🔨 <strong>Production Update:</strong> Lokeswari is currently placing country wildflowers inside the vacuum mold. Naveen will prepare secondary hardware polish shortly.
                                  </p>
                                )}
                                {activeStepNum === 5 && (
                                  <p className="leading-snug">
                                    🚚 <strong>Fulfillment Update:</strong> Packed with utmost care. Sent via BlueDart Fragile Post. Tracking detail will arrive via customer registered telephone.
                                  </p>
                                )}
                                {activeStepNum < 3 && activeStepNum > 0 && (
                                  <p className="leading-snug">
                                    📋 <strong>Verification Pass:</strong> Order is queued. Material accounts are locked for VartU hand crafting.
                                  </p>
                                )}
                                {activeStepNum >= 6 && (
                                  <p className="leading-snug text-emerald-800 font-semibold font-sans">
                                    ✨ Delivered! Thank you for supporting custom handmade Indian art. Feel free to leave a review in the Shop!
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Items Purchased List */}
                        <div className="p-4 bg-white text-xs space-y-2">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#2D302D] block">Items in Curation Packet</span>
                          <div className="space-y-1.5">
                            {ord.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-[#FAF9F6]/40 p-2 rounded-lg border border-[#D4A373]/5">
                                <div className="space-y-0.5">
                                  <p className="font-bold text-[#2D302D] text-[11px]">{item.name}</p>
                                  {item.customText && (
                                    <p className="text-[8px] bg-[#E9EDC9] text-[#8B9D83] font-bold uppercase px-1.5 py-0.5 rounded-full inline-block">
                                      Custom initials: "{item.customText}"
                                    </p>
                                  )}
                                </div>
                                <span className="font-mono text-xs text-[#6B705C] font-semibold">
                                  {item.quantity}x • ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping address & helper direct link */}
                        <div className="p-4 bg-white text-[10px] text-[#6B705C] space-y-3.5">
                          <div className="flex items-start gap-2 max-w-sm">
                            <MapPin className="w-3.5 h-3.5 text-[#8B9D83] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-[#2D302D] block">Shipped to coordinates:</span>
                              <span className="leading-snug">{ord.customerDetails?.name} — {ord.customerDetails?.address}</span>
                            </div>
                          </div>

                          <div className="pt-2 flex gap-2">
                            <a 
                              href={`https://wa.me/918123445678?text=Hi%20Kiran%20and%20Naveen,%20I'am%20inquiring%20about%20my%20Order%20ID%20${ord.id}%20placed%20on%20${ord.createdAt.slice(0, 10)}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-[#FAF9F6] text-[#2D302D] border border-[#d4a373]/30 hover:bg-[#8B9D83]/10 font-bold py-1.5 px-3 rounded-xl transition-all text-center flex items-center justify-center gap-1.5 font-sans uppercase tracking-wider text-[9px]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-[#8B9D83]" />
                              <span>Consult head on WhatsApp</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB TWO: CUSTOM STUDIO DESIGN REQUESTS */}
            {activeTab === "customs" && (
              <div className="space-y-4">
                {filteredCustoms.length === 0 ? (
                  <div className="text-center py-20 text-[#6B705C] space-y-3">
                    <Sparkles className="w-12 h-12 mx-auto text-[#6B705C]/35 stroke-1" />
                    <p className="text-xs font-semibold">No custom requests listed.</p>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Lodge an inquiry request on the "Custom Studio" tab to custom mold your floral wedding preservation.
                    </p>
                  </div>
                ) : (
                  filteredCustoms.map((cust) => (
                    <div 
                      key={cust.id} 
                      className="bg-white p-4 rounded-xl border border-[#D4A373]/20 space-y-3 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-[#6B705C] font-semibold">CUSTOM ID: {cust.id}</span>
                          <h4 className="font-bold text-[#2D302D] text-sm mt-0.5">{cust.productType}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                          cust.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : cust.status === "Requested"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-gray-100 text-gray-700"
                        }`}>
                          {cust.status}
                        </span>
                      </div>

                      <div className="p-3 bg-[#FAF9F6] rounded-xl border border-gray-100 text-[#6B705C] leading-relaxed text-[11px]">
                        <strong>My Request Details:</strong>
                        <p className="mt-1 italic">"{cust.customizationDetails}"</p>
                        <p className="text-[10px] mt-2 text-[#2D302D] font-mono font-bold">Planned Qty: {cust.quantity} unit(s)</p>
                      </div>

                      {cust.quotedPrice && (
                        <div className="flex items-center justify-between p-3 bg-[#E9EDC9]/50 rounded-xl border border-[#8B9D83]/20">
                          <div>
                            <span className="text-[9px] text-[#6B705C] font-mono font-semibold block uppercase">Admin Quoted price</span>
                            <span className="text-sm font-bold text-[#8B9D83]">₹{cust.quotedPrice}</span>
                          </div>
                          <span className="text-[9px] text-[#8B9D83] font-bold uppercase tracking-wider">
                            Ready to pay
                          </span>
                        </div>
                      )}

                      {cust.notes && (
                        <div className="border-t border-[#D4A373]/10 pt-2.5">
                          <span className="text-[9px] text-amber-800 font-mono font-bold block">Artisanal Response:</span>
                          <p className="text-[10px] text-[#6B705C] italic leading-snug">"{cust.notes}"</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <a 
                          href={`https://wa.me/918123445678?text=Hi%20Kiran,%20I'm%20seeking%20progress%20input%20on%20my%20Custom%20Artwork%20ID%20${cust.id}%20(${cust.productType}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#FAF9F6] text-[#2D302D] border border-gray-200 hover:bg-[#8B9D83]/10 font-bold py-1.5 rounded-lg text-center flex items-center justify-center gap-1 uppercase tracking-wider text-[9px]"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#8B9D83]" />
                          <span>WhatsApp Consultation</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB THREE: WORKSHOPS PARTICIPATIONS */}
            {activeTab === "workshops" && (
              <div className="space-y-4">
                {bookedWorkshops.length === 0 ? (
                  <div className="text-center py-20 text-[#6B705C] space-y-3">
                    <Calendar className="w-12 h-12 mx-auto text-[#6B705C]/30 stroke-1" />
                    <p className="text-xs font-semibold">No workshop coordinates booked.</p>
                    <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
                      Browse and secure seating on our "Workshops" tab to acquire resin & candle art masterclass badges!
                    </p>
                  </div>
                ) : (
                  bookedWorkshops.map((ws) => {
                    const myTickets = ws.attendees?.filter(att => att.email.toLowerCase() === currentEmail.toLowerCase());
                    const ticketCount = myTickets.reduce((sum, att) => sum + att.tickets, 0);

                    return (
                      <div 
                        key={ws.id} 
                        className="bg-white rounded-xl border border-[#D4A373]/15 overflow-hidden text-xs"
                      >
                        <div className="h-28 w-full bg-cover bg-center" style={{ backgroundImage: `url(${ws.image})` }} />
                        
                        <div className="p-4 space-y-3">
                          <div>
                            <span className="text-[8px] bg-[#E9EDC9] text-[#8B9D83] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded">
                              Confirmed Ticket
                            </span>
                            <h4 className="font-bold text-[#2D302D] text-sm mt-1.5 leading-snug">{ws.title}</h4>
                          </div>

                          <div className="space-y-1.5 border-t border-gray-100 pt-2.5 text-[11px] text-[#6B705C]">
                            <p className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#D4A373]" />
                              <span>Session Date: <strong className="text-[#2D302D]">{ws.date}</strong></span>
                            </p>
                            <p className="flex items-center gap-1.5">
                              <Ticket className="w-3.5 h-3.5 text-[#D4A373]" />
                              <span>Reserved Seating: <strong className="text-[#2D302D]">{ticketCount} Ticket(s)</strong></span>
                            </p>
                          </div>

                          <div className="p-2.5 bg-emerald-50 rounded-lg text-[10px] text-[#6B705C] leading-snug">
                            🎉 <strong>Admission active:</strong> Digital entry link has been verified for {currentEmail}. Prepare your craft workspace coordinates.
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>

          {/* Footer Assistance Badge */}
          <div className="bg-[#FAF9F6] border-t border-[#D4A373]/20 px-6 py-4.5 text-center text-[10px] text-[#6B705C] space-y-2">
            <div className="flex items-center justify-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#8B9D83]" />
              <span>Seeking artisanal order assistance or cancellation requests?</span>
            </div>
            <p className="max-w-[340px] mx-auto leading-normal">
              Contact Lokeswari or Kiran directly at <span className="font-semibold text-[#2D302D] font-mono">+91 81234 45678</span> — we take extreme pride in VartU.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
