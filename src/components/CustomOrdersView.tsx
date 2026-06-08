import React, { useState } from "react";
import { useApp } from "../AppContext";
import { CustomOrderStatus } from "../types";
import { Upload, Clipboard, CheckCircle, Clock, XCircle, ArrowUpRight, HelpCircle } from "lucide-react";

export const CustomOrdersView: React.FC = () => {
  const { customOrders, submitCustomOrder, isFirebaseActive } = useApp();

  const [productType, setProductType] = useState("Resin Flower Preservation Slab");
  const [customDetails, setCustomDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [inspirationImage, setInspirationImage] = useState("");
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const productOptions = [
    "Resin Flower Preservation Slab",
    "Wooden Border Resin Tea Tray",
    "Preserved Petal Pendant Pendant",
    "Artisanal Concrete Desk planter Pot",
    "Scented Soy Wax Terracotta Matka Candle",
    "Traditional Satin Thread Bangles Bulk Set",
    "Custom Crochet Wildlife/Anime Doll"
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setInspirationImage(reader.result);
        }
      };
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDetails.trim()) return;

    submitCustomOrder(
      productType,
      customDetails,
      quantity,
      inspirationImage || undefined
    );

    setIsSubmittedSuccessfully(true);
    setCustomDetails("");
    setQuantity(1);
    setInspirationImage("");

    setTimeout(() => {
      setIsSubmittedSuccessfully(false);
    }, 5000);
  };

  const getStatusBadge = (status: CustomOrderStatus) => {
    switch (status) {
      case CustomOrderStatus.REQUESTED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#D4A373] bg-[#FEFAE0]/50 px-2.5 py-1 rounded-full border border-[#D4A373]/30">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case CustomOrderStatus.APPROVED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8B9D83] bg-[#E9EDC9]/55 px-2.5 py-1 rounded-full border border-[#8B9D83]/20">
            <CheckCircle className="w-3 h-3" /> Approved Quote
          </span>
        );
      case CustomOrderStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case CustomOrderStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#8B9D83] bg-[#E9EDC9]/30 px-2.5 py-1 rounded-full border border-[#8B9D83]/30">
            <CheckCircle className="w-3 h-3" /> Fabricated
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Core Request Form Panel (Left Col) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#D4A373]/30 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#D4A373] tracking-[0.2em] block">
              VartU Craft Studio
            </span>
            <h1 className="text-3xl font-serif italic text-[#2D302D]">Design Your Keepsake</h1>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Have specific bridal flowers, children's clothing yarns, or home themes? Outline your vision, upload a visual inspiration, and our operations and art head (Lokeswari) will evaluate and price your custom commission.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Action product type select */}
            <div>
              <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5">
                Product Base Medium:
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3.5 border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white cursor-pointer text-[#2D302D]"
              >
                {productOptions.map((opt, idx) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Custom parameters detail input text area */}
            <div>
              <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5">
                Customization & Story Directives:
              </label>
              <textarea
                rows={4}
                required
                placeholder="Mention specific parameters here. e.g.: 'We are enclosing rose petals from our reception on 12th May. I want them embedded in the slab alphabetically spelling 'S & R' using gold foil fonts inside the corner...'"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="w-full p-4.5 border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/50 text-xs text-[#2D302D] placeholder-gray-400 leading-relaxed"
              />
            </div>

            {/* Quantitative selector and custom image uploader in Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5">
                  Requested Batch Quantity:
                </label>
                <div className="flex items-center select-none bg-white border border-[#D4A373]/20 rounded-xl max-w-[140px] px-2 py-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 text-xs text-[#6B705C] font-semibold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-semibold text-[#2D302D]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 text-xs text-[#6B705C] font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5">
                  Upload Inspiration Photo Link:
                </label>
                <input
                  type="text"
                  placeholder="Paste image URL (or drag files below)"
                  value={inspirationImage}
                  onChange={(e) => setInspirationImage(e.target.value)}
                  className="w-full text-xs py-2 px-3.5 border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-[#FAF9F6]/50 text-xs text-[#2D302D]"
                />
              </div>
            </div>

            {/* Drag and drop interactive mockup area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive ? "border-[#8B9D83] bg-[#E9EDC9]/10" : "border-[#D4A373]/20 bg-[#FAF9F6]/40"
              }`}
            >
              {inspirationImage ? (
                <div className="relative inline-block max-w-[120px] aspect-square rounded-xl overflow-hidden border border-[#D4A373]/15">
                  <img
                    src={inspirationImage}
                    referrerPolicy="no-referrer"
                    alt="Inspiration Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setInspirationImage("")}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <Upload className="w-7 h-7 text-[#8B9D83] mb-2" />
                  <p className="text-xs font-semibold text-[#2D302D]">Drag & drop your reference photo here</p>
                  <p className="text-[10px] text-[#6B705C] mt-1">Accepts local PNG or JPG files</p>
                </div>
              )}
            </div>

            {isSubmittedSuccessfully && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Design submitted successfully! Dharani and Lokeswari have received your specifications and will respond with pricing shortly.
                </span>
              </div>
            )}

            {/* Form execution trigger */}
            <button
              type="submit"
              className="w-full py-3 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-full text-xs uppercase tracking-widest transition-colors shadow-xs cursor-pointer text-center"
            >
              Submit Specifications for Pricing
            </button>
          </form>
        </div>

        {/* Historic ledger feedback area (Right Col) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 w-full">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-[#D4A373]/30 p-6 shadow-xs">
            <h2 className="text-md font-bold text-[#2D302D] flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-[#8B9D83]" />
              <span className="font-serif italic text-lg font-medium">Status of My Custom Quotes</span>
            </h2>
            <p className="text-xs text-[#6B705C] mt-1 leading-relaxed">
              Check quotes and design approvals issued by Lokeswari & Kiran here in real-time.
            </p>

            {customOrders.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-[#D4A373]/20 rounded-xl mt-4">
                <Clock className="w-8 h-8 text-[#6B705C]/35 mx-auto mb-2" />
                <p className="text-xs text-[#6B705C] font-semibold">No custom quote requests submitted yet.</p>
                <p className="text-[10px] text-[#6B705C]/75 mt-0.5">Use the left form to design your first item!</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4 max-h-[480px] overflow-y-auto pr-1">
                {customOrders.map((order) => {
                  const isApproved = order.status === CustomOrderStatus.APPROVED;

                  return (
                    <div
                      key={order.id}
                      className="p-4.5 rounded-xl border border-[#D4A373]/20 bg-white/70 space-y-3 hover:shadow-xs transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#D4A373] font-semibold">ID: {order.id}</span>
                          <h3 className="text-xs font-bold text-[#2D302D] mt-0.5">{order.productType}</h3>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <p className="text-xs text-[#6B705C] line-clamp-2 bg-[#FAF9F6]/80 p-3 rounded-lg border border-[#D4A373]/10 italic">
                        "{order.customizationDetails}"
                      </p>

                      {/* Display Quotation if approved */}
                      {isApproved && order.quotedPrice && (
                        <div className="bg-[#E9EDC9]/40 p-3 rounded-lg border border-[#8B9D83]/20 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-[9px] text-[#2D302D] font-bold uppercase tracking-wider block">Official Price Quoted:</span>
                            <span className="text-sm font-serif italic font-bold text-[#2D302D]">₹{order.quotedPrice}</span>
                          </div>
                          
                          <a
                            href={`https://wa.me/918123445678?text=Hi%20Kiran!%20My%20Custom%20Order%20Quote%20${order.id}%20was%20approved%20for%20₹${order.quotedPrice}.%20I'd%20love%20to%20proceed%20and%20coordinate%20the%20shipping%20of%20our%20flowers!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold py-1.5 px-3 rounded-full text-[9px] uppercase tracking-widest transition-all flex items-center gap-1 shadow-sm"
                          >
                            <span>Approve & Pay (UPI)</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {order.notes && (
                        <div className="text-[11px] text-[#6B705C] bg-[#FAF9F6] p-2.5 rounded-lg border border-[#D4A373]/15 leading-relaxed">
                          <strong className="text-gray-700">Artisan Notes:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Guidelines on Customizations card */}
          <div className="bg-[#2D302D] text-[#FAF9F6] rounded-2xl p-6 shadow-xs border border-[#D4A373]/20 relative overflow-hidden">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4A373] mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#8B9D83]" /> Custom Preservations Guidelines
            </h4>
            <ul className="space-y-2.5 text-[11px] text-[#FAF9F6]/85 leading-relaxed list-disc list-inside">
              <li><strong>Drying Flowers:</strong> Ensure your wedding or memory floral bouquets are dried completely in dark ventilated settings, or shipped wrapped in newspapers (never plastic!) within 48 hours.</li>
              <li><strong>Crafting Cycle:</strong> Epoxy standard flower cast molds require 3 distinct layered pours over 5-7 days to prevent combustion or shrinkage. Resin curation takes another 48 hours before packing by Naveen.</li>
              <li><strong>Care Directions:</strong> Keep finalized custom trays out of direct sunlight to maintain flower pigmentation indefinitely. Clean with dynamic soft microfiber cloths.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
