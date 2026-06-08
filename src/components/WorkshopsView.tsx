import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Workshop } from "../types";
import { Calendar, User, DollarSign, CheckCircle, Ticket, X, CreditCard, ArrowRight } from "lucide-react";

export const WorkshopsView: React.FC = () => {
  const { workshops, bookWorkshopTicket } = useApp();
  
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  
  // Passenger details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketsCount, setTicketsCount] = useState(1);
  
  // Payment simulations
  const [paymentStep, setPaymentStep] = useState<"form" | "razorpay" | "success">("form");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netb">("upi");
  const [upiId, setUpiId] = useState("");

  const handleOpenBooking = (ws: Workshop) => {
    setSelectedWorkshop(ws);
    setName("");
    setEmail("");
    setPhone("");
    setTicketsCount(1);
    setPaymentStep("form");
  };

  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setPaymentStep("razorpay");
  };

  const handleConfirmMockPayment = () => {
    if (!selectedWorkshop) return;
    
    bookWorkshopTicket(selectedWorkshop.id, name, email, phone, ticketsCount);
    setPaymentStep("success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-serif italic text-[#2D302D]">Artisan Masterclasses</h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#6B705C] leading-relaxed">
          Learn beautiful crafts, resin pouring secrets, and terracotta hand-painting directly from Lokeswari and Dharani. All kits shipped to you!
        </p>
      </div>

      {/* Grid of Workshops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {workshops.map((ws) => (
          <div 
            key={ws.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#D4A373]/20 hover:border-[#D4A373]/40 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-56 bg-[#FAF9F6]">
              <img
                src={ws.image}
                referrerPolicy="no-referrer"
                alt={ws.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md font-serif italic font-bold text-[#E99D83] px-3.5 py-1.5 rounded-full border border-[#D4A373]/25 text-xs shadow-xs">
                ₹{ws.price} <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#6B705C]">/ Kit included</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2.5">
                <h3 className="text-lg font-serif italic text-[#2D302D] leading-snug">{ws.title}</h3>
                <p className="text-xs text-[#6B705C] line-clamp-3 leading-relaxed">{ws.description}</p>
                
                {/* Micro info logs */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-[#6B705C]">
                  <span className="flex items-center gap-1 bg-[#FAF9F6] py-1 px-3 rounded-full border border-[#D4A373]/10">
                    <Calendar className="w-3.5 h-3.5 text-[#8B9D83]" /> {ws.date}
                  </span>
                  <span className="flex items-center gap-1 bg-[#FAF9F6] py-1 px-3 rounded-full border border-[#D4A373]/10">
                    <User className="w-3.5 h-3.5 text-[#8B9D83]" /> Zoom Broadcast
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleOpenBooking(ws)}
                  className="w-full py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-semibold rounded-full text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Reserve Seat & Ship Kit &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED BOOKING MODAL & MOCK RAZORPAY BILL IN FRAME */}
      {selectedWorkshop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] w-full max-w-sm rounded-2xl overflow-hidden shadow-xl relative border border-[#D4A373]/30 max-h-[90vh] flex flex-col justify-between">
            {/* Header portion */}
            <div className="bg-[#2D302D] px-6 py-4.5 text-[#FAF9F6] flex items-center justify-between border-b border-[#D4A373]/25">
              <div>
                <span className="text-[9px] text-[#D4A373] uppercase tracking-[0.2em] font-mono block">Masterclass Registration</span>
                <p className="text-xs font-serif italic text-white line-clamp-1 truncate mt-0.5">{selectedWorkshop.title}</p>
              </div>
              <button 
                onClick={() => setSelectedWorkshop(null)}
                className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Inner dynamic content body */}
            <div className="p-6 overflow-y-auto flex-grow bg-white/40">
              {paymentStep === "form" && (
                <form onSubmit={handleInitiatePayment} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D302D] uppercase tracking-wider mb-1">Your Full Name:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sneha Reddy"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#D4A373]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white text-[#2D302D]"
                    />
                  </div>

                  {/* Contact coordinates */}
                  <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#2D302D] uppercase tracking-wider mb-1">Email Address:</label>
                      <input
                        type="email"
                        required
                        placeholder="sneha.r@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#D4A373]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white text-[#2D302D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#2D302D] uppercase tracking-wider mb-1">Phone Number:</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98450 12345"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#D4A373]/25 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white text-[#2D302D]"
                      />
                    </div>
                  </div>

                  {/* Attendance count */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#2D302D] uppercase tracking-wider mb-1">Pass Seats Count:</label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-[#D4A373]/25 rounded-xl bg-white p-1">
                        <button 
                          type="button"
                          onClick={() => setTicketsCount(t => Math.max(1, t - 1))}
                          className="px-2.5 py-0.5 text-xs text-[#6B705C] font-semibold"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#2D302D]">{ticketsCount}</span>
                        <button 
                          type="button"
                          onClick={() => setTicketsCount(t => t + 1)}
                          className="px-2.5 py-0.5 text-xs text-[#6B705C] font-semibold"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[9px] text-[#6B705C] italic leading-tight">Every pass includes 1 shipping physical raw kit.</span>
                    </div>
                  </div>

                  <hr className="border-[#D4A373]/15" />

                  {/* Summary math */}
                  <div className="flex justify-between items-baseline gap-2 pb-1">
                    <span className="text-xs text-[#6B705C]">Subtotal Price:</span>
                    <span className="text-lg font-serif italic text-[#2D302D]">₹{selectedWorkshop.price * ticketsCount}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-semibold rounded-full text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Proceed to Gateway</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {paymentStep === "razorpay" && (
                <div className="space-y-4 border border-dashed border-[#8B9D83]/30 bg-white/50 p-4 rounded-xl">
                  {/* Mock Razorpay Header */}
                  <div className="flex justify-between items-center bg-[#2D302D] p-3 text-white rounded-t-lg -mx-4 -mt-4 border-b border-[#D4A373]/15">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-[#D4A373]">RAZORPAY SIMULATOR</span>
                    <span className="text-xs font-serif italic">₹{selectedWorkshop.price * ticketsCount}</span>
                  </div>

                  {/* Select card vs upi info */}
                  <div className="flex gap-2 bg-white p-1 rounded-lg border border-[#D4A373]/25 text-xs">
                    <button 
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex-1 py-1 px-2 text-[10px] font-bold text-center rounded uppercase tracking-wider transition-colors ${paymentMethod === "upi" ? "bg-[#8B9D83] text-white" : "text-[#6B705C]"}`}
                    >
                      UPI Payment
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("card")}
                      className={`flex-1 py-1 px-2 text-[10px] font-bold text-center rounded uppercase tracking-wider transition-colors ${paymentMethod === "card" ? "bg-[#8B9D83] text-white" : "text-[#6B705C]"}`}
                    >
                      Credit Card
                    </button>
                  </div>

                  {paymentMethod === "upi" ? (
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold text-[#2D302D] uppercase tracking-wide">Enter virtual address (VPA):</label>
                      <input
                        type="text"
                        placeholder="e.g. kiran@okaxis"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-[#D4A373]/25 bg-white text-[#2D302D] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B9D83]"
                      />
                      <span className="text-[9px] text-[#6B705C] block">Simulates the mobile UPI interface popup handler.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-[#2D302D]">
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-wide text-[#6B705C]">Card Number:</label>
                        <input type="text" placeholder="4242 •••• •••• 4242" className="w-full px-3 py-1.5 border border-[#D4A373]/25 rounded mt-1 bg-white focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wide text-[#6B705C]">Expiry:</label>
                          <input type="text" placeholder="MM / YY" className="w-full px-3 py-1.5 border border-[#D4A373]/25 rounded mt-1 bg-white focus:outline-none" />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wide text-[#6B705C]">CVV Code:</label>
                          <input type="password" placeholder="•••" className="w-full px-3 py-1.5 border border-[#D4A373]/25 rounded mt-1 bg-white focus:outline-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleConfirmMockPayment}
                    className="w-full py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-lg text-xs uppercase tracking-widest transition-colors shadow flex items-center justify-center gap-1.5 text-center cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{selectedWorkshop.price * ticketsCount} Now</span>
                  </button>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="text-center py-6 space-y-4">
                  <CheckCircle className="w-12 h-12 text-[#8B9D83] mx-auto animate-pulse" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif italic text-[#2D302D]">Seat Confirmed!</h3>
                    <p className="text-xs text-[#6B705C]">
                      Thanks for registering, <strong className="text-[#2D302D]">{name}</strong>! We have emailed your secure PDF tickets to <span className="underline text-[#8B9D83]">{email}</span>.
                    </p>
                    <p className="text-[11px] text-[#6B705C] mt-3 bg-white/60 p-3.5 rounded-xl border border-[#D4A373]/20 italic">
                      "Dharani and Naveen will prepare your artisan kit containing Resin mold bases, paints, and instructions, and ship it to {phone} within 48 hours."
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedWorkshop(null)}
                    className="mt-6 px-6 py-2 bg-[#2D302D] hover:bg-[#8B9D83] text-[#FAF9F6] font-[#FAF9F6] text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
