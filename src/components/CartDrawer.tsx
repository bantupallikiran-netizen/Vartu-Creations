import React, { useState } from "react";
import { useApp } from "../AppContext";
import { X, Trash2, Tag, Gift, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cart, removeFromCart, updateCartQuantity, coupons, placeOrder 
  } = useApp();

  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  
  // Surcharges
  const [giftWrap, setGiftWrap] = useState(false);
  const [notes, setNotes] = useState("");

  // Delivery details coordinates
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");

  // Order state status
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Coupon matching calculations
  const matchedCoupon = activeCoupon ? coupons.find(c => c.code.toUpperCase() === activeCoupon.toUpperCase()) : null;
  const discountPct = matchedCoupon ? matchedCoupon.discountPercentage : 0;
  const discountAmount = Math.round(subtotal * discountPct / 100);

  // Shipping math
  const shippingCharges = subtotal > 1500 ? 0 : 70;
  
  // Wrapping subtotal
  const wrapCharges = giftWrap ? 50 : 0;

  // Final aggregate math
  const grandTotal = Math.round(subtotal - discountAmount + shippingCharges + wrapCharges);

  const handleApplyCoupon = () => {
    setCouponError("");
    const matched = coupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (matched) {
      setActiveCoupon(matched.code);
      setCouponInput("");
    } else {
      setCouponError("Invalid code. Try: WELCOME10, FESTIVE20");
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!custName || !custEmail || !custPhone || !custAddress) {
      alert("Please specify complete delivery coordinates.");
      return;
    }

    const orderData = await placeOrder(
      { name: custName, email: custEmail, phone: custPhone, address: custAddress },
      activeCoupon || undefined,
      giftWrap,
      notes || undefined
    );

    setPlacedOrderInfo(orderData);
  };

  const handleResetSuccess = () => {
    setPlacedOrderInfo(null);
    setCustName("");
    setCustEmail("");
    setCustPhone("");
    setCustAddress("");
    setNotes("");
    setActiveCoupon(null);
    setGiftWrap(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-[#FAF9F6] border-l border-[#D4A373]/30 shadow-2xl flex flex-col justify-between">
          
          {/* Header Bar */}
          <div className="bg-[#2D302D] text-[#FAF9F6] px-6 py-4.5 flex items-center justify-between border-b border-[#D4A373]/20">
            <h2 className="text-md font-bold uppercase tracking-wider flex items-center gap-2 font-serif italic text-white text-lg">
              <ShoppingBag className="w-5 h-5 text-[#8B9D83]" />
              <span>Checkout Bag ({cart.length})</span>
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dynamic inner container */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {placedOrderInfo ? (
              /* ORDER CONGRATS SUCCESS SCREEN */
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-[#8B9D83] mx-auto animate-pulse" />
                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif italic text-[#2D302D]">Craft Purchased!</h3>
                  <p className="text-xs text-[#6B705C]">
                    Your unique order <strong className="text-[#2D302D] font-mono">{placedOrderInfo.id}</strong> has been logged successfully for ₹{placedOrderInfo.total}.
                  </p>
                  <p className="text-[11px] text-[#6B705C] leading-relaxed pt-1 select-none">
                    Check out your assigned tracking code in our live database list. Lokeswari and Naveen will begin crafting and parceling!
                  </p>
                </div>

                <div className="p-4 bg-white border border-[#D4A373]/15 rounded-xl text-left text-xs font-semibold text-[#2D302D] space-y-1 mt-4">
                  <p><span className="text-[#6B705C] font-normal">Deliver to:</span> {custName}</p>
                  <p><span className="text-[#6B705C] font-normal">Contact phone:</span> +91 {custPhone}</p>
                  <p className="italic text-[#6B705C] font-normal mt-1 pt-1 border-t border-[#D4A373]/10">Address: {custAddress}</p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleResetSuccess}
                    className="w-full py-2.5 bg-[#8B9D83] text-white hover:bg-[#6B705C] font-semibold rounded-full text-xs uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Continue Browsing Crafts
                  </button>
                </div>
              </div>
            ) : cart.length === 0 ? (
              /* EMPTY BAG SCREEN */
              <div className="text-center py-20 text-[#6B705C] space-y-2">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#6B705C]/35 stroke-1" />
                <p className="text-xs font-semibold">Your artisan checkout bag is empty.</p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs text-[#8B9D83] font-bold uppercase tracking-wider hover:underline"
                >
                  Return to catalog &rarr;
                </button>
              </div>
            ) : (
              /* ACTIVE BAG AND CHECKOUT FORM GATEWAY */
              <div className="space-y-6">
                
                {/* 1. Item list scrollbox */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div 
                      key={item.productId} 
                      className="bg-white p-3.5 rounded-xl border border-[#D4A373]/15 flex justify-between gap-3 text-xs"
                    >
                      <div className="flex-grow space-y-1">
                        <h4 className="font-semibold text-[#2D302D] leading-tight mt-0.5">{item.name}</h4>
                        {item.customText && (
                          <span className="inline-block bg-[#E9EDC9]/60 text-[#8B9D83] border border-[#8B9D83]/20 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 select-none">
                            Initials: "{item.customText}"
                          </span>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[#6B705C] text-[11px]">₹{item.price} each</span>
                          <span className="text-gray-200">|</span>
                          <div className="flex items-center select-none bg-[#FAF9F6] border border-[#D4A373]/15 rounded-lg px-2 py-0.5 max-w-[80px]">
                            <button 
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                              className="px-1 text-[#6B705C] font-bold"
                            >
                              -
                            </button>
                            <span className="flex-grow text-center text-[11px] font-semibold text-[#2D302D]">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              className="px-1 text-[#6B705C] font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between shrink-0">
                        <span className="font-serif italic font-semibold text-[#2D302D]">₹{item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="border-[#D4A373]/15" />

                {/* 2. Coupon desk bar */}
                <div className="space-y-2 bg-white rounded-xl p-3 border border-[#D4A373]/15">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon: WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-grow text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] uppercase bg-[#FAF9F6]/50 text-[#2D302D]"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 bg-[#2D302D] text-white hover:bg-[#8B9D83] text-[10px] uppercase tracking-widest font-bold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Apply
                    </button>
                  </div>

                  {couponError && <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {couponError}</p>}
                  {activeCoupon && (
                    <div className="text-[10px] text-[#8B9D83] font-bold uppercase tracking-wider flex items-center gap-1.5 bg-[#E9EDC9]/30 px-2.5 py-1.5 rounded-lg">
                      <Tag className="w-3.5 h-3.5 text-[#8B9D83]" /> Coupon Applied: <strong> {activeCoupon} (-{discountPct}%) </strong>
                    </div>
                  )}
                </div>

                {/* 3. Gift wrap ticking */}
                <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#D4A373]/15 select-none text-xs">
                  <input
                    type="checkbox"
                    id="wrapCheckbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                    className="w-4 h-4 accent-[#8B9D83] rounded cursor-pointer"
                  />
                  <label htmlFor="wrapCheckbox" className="flex-grow cursor-pointer text-[#6B705C]">
                    <strong className="text-[#2D302D] font-bold block flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5 text-[#D4A373] fill-current" /> Add Aesthetic Jute Wrap (+₹50)
                    </strong>
                    <span className="text-[10px] text-[#6B705C] block mt-0.5">Custom wax sealed envelopes, fragrant rose petal shavings.</span>
                  </label>
                </div>

                {/* 4. Delivery addresses and coordinates */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-3 bg-white p-4.5 rounded-2xl border border-[#D4A373]/20 text-xs">
                  <label className="block text-[10px] font-bold text-[#6B705C] uppercase tracking-wider mb-1">Specify Delivery Coordinates</label>
                  
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Receiver's full name"
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-xs text-[#2D302D]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-xs text-[#2D302D]"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone: +91 •••••"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-xs text-[#2D302D]"
                      />
                    </div>
                    <textarea
                      rows={2}
                      required
                      placeholder="Full Shipping Address (City, State, Pincode)"
                      value={custAddress}
                      onChange={(e) => setCustAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-xs text-[#2D302D] leading-relaxed"
                    />
                    <input
                      type="text"
                      placeholder="Special delivery notes (optional)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/20 text-xs text-[#2D302D]"
                    />
                  </div>

                  <hr className="border-[#D4A373]/10 my-4" />

                  {/* 5. Cost specifications calculation logs */}
                  <div className="space-y-2 font-semibold text-[#6B705C] pt-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span>Products Subtotal:</span>
                      <span className="text-[#2D302D]">₹{subtotal}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-baseline text-xs text-[#8B9D83]">
                        <span>Coupon Discount:</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline text-xs">
                      <span>Fragile Shipping Fees:</span>
                      <span className="text-[#2D302D]">{shippingCharges === 0 ? "FREE over ₹1500" : `₹${shippingCharges}`}</span>
                    </div>

                    {giftWrap && (
                      <div className="flex justify-between items-baseline text-xs">
                        <span>Premium Jute Wrapping:</span>
                        <span className="text-[#2D302D]">₹{wrapCharges}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-baseline text-sm text-[#2D302D] font-extrabold border-t border-[#D4A373]/10 pt-3 mt-3">
                      <span className="font-serif italic font-bold text-base">Curation Total:</span>
                      <span className="text-xl font-serif italic text-[#D4A373]">₹{grandTotal}</span>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-full text-xs uppercase tracking-widest shadow-xs transition-colors text-center cursor-pointer"
                    >
                      Place order & Pay (UPI)
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
