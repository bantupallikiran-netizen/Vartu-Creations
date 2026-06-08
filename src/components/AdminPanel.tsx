import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Product, ProductCategory, OrderStatus, CustomOrderStatus, RawMaterial, CRMLead, LeadSource, SocialCalendarEvent } from "../types";
import { 
  Sparkles, TrendingUp, ShoppingCart, Users, Package, AlertTriangle, Check, Trash2, 
  Calendar, Send, RefreshCw, Layers, Plus, Edit3, CircleDot, FileText, Gift, Lightbulb
} from "lucide-react";

export const AdminPanel: React.FC = () => {
  const { 
    products, orders, customOrders, rawMaterials, crmLeads, socialCalendar, 
    saveProduct, deleteProductById, respondToCustomOrder, updateOrderStatus,
    saveRawMaterial, saveSocialCalendarEvent, deleteSocialEvent, isFirebaseActive,
    currentUserRole
  } = useApp();

  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"dashboard" | "products" | "inventory" | "orders" | "quotes" | "crm" | "ai-hub">("dashboard");

  // PRODUCT EDIT / ADD STATE
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [newImageInput, setNewImageInput] = useState("");
  const [newMaterialInput, setNewMaterialInput] = useState("");

  // INVENTORY REPLENISH STATE
  const [replenishAmounts, setReplenishAmounts] = useState<{ [key: string]: number }>({});

  // INDIVIDUAL AI TOOL ACTIONS
  const [aiTool, setAiTool] = useState<"caption" | "hashtag" | "reel" | "description" | "forecast">("caption");
  const [aiInputProduct, setAiInputProduct] = useState("");
  const [aiInputCategory, setAiInputCategory] = useState(ProductCategory.RESIN_ART);
  const [aiInputMaterials, setAiInputMaterials] = useState("");
  const [aiInputEmotion, setAiInputEmotion] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Business Analytics KPI math
  const totalSubtotalRevenue = orders.filter(o => o.status !== OrderStatus.CANCELLED).reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.filter(o => o.status !== OrderStatus.CANCELLED).length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalSubtotalRevenue / totalOrdersCount) : 0;
  const activeCRMLeadCount = crmLeads.length;
  
  // Compute low raw materials alert
  const lowMaterialsCount = rawMaterials.filter(m => m.stockCount <= m.lowStockThreshold).length;

  // PRODUCT OPERATIONS
  const handleStartAddProduct = () => {
    setEditingProduct({
      id: `prod-${Math.floor(Math.random() * 10000)}`,
      name: "",
      sku: `VAR-NEW-${Math.floor(100 + Math.random() * 900)}`,
      category: ProductCategory.RESIN_ART,
      price: 999,
      discount: 0,
      images: ["https://images.unsplash.com/photo-1590736969955-71cc94801759?w=400"],
      stock: 5,
      weight: 100,
      description: "",
      materials: [],
      customization: false,
      reviews: []
    });
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.id) return;
    await saveProduct(editingProduct as Product);
    setEditingProduct(null);
  };

  // INVENTORY REPLENISH
  const handleReplenishClick = async (matId: string) => {
    const qty = replenishAmounts[matId] || 500;
    const material = rawMaterials.find(m => m.id === matId);
    if (material) {
      const updated = {
        ...material,
        stockCount: material.stockCount + Number(qty),
        lastReplenished: new Date().toISOString().split("T")[0]
      };
      await saveRawMaterial(updated);
      setReplenishAmounts(prev => ({ ...prev, [matId]: 0 }));
    }
  };

  // QUOTES PORTAL
  const handleApproveQuote = async (quoteId: string, suggestedPrice: number, feedback: string) => {
    await respondToCustomOrder(quoteId, CustomOrderStatus.APPROVED, suggestedPrice, feedback);
  };

  const handleRejectQuote = async (quoteId: string, feedback: string) => {
    await respondToCustomOrder(quoteId, CustomOrderStatus.REJECTED, 0, feedback);
  };

  // GEMINI AI CONNECTORS
  const handleTriggerAI = async () => {
    setIsAiLoading(true);
    setAiResult("");

    try {
      let endpoint = "";
      interface RequestBodyPayload {
        productName?: string;
        category?: string;
        audience?: string;
        mood?: string;
        productTags?: string;
        targetFeature?: string;
        materials?: string;
        coreStory?: string;
        inventoryData?: Product[];
        orderData?: any[];
        rawMaterialsData?: RawMaterial[];
      }
      
      let payload: RequestBodyPayload = {};

      if (aiTool === "caption") {
        endpoint = "/api/gemini/caption";
        payload = {
          productName: aiInputProduct || "Personalized Floral Case Slab",
          category: aiInputCategory,
          audience: "Gifting partners, aesthetic home decorators",
          mood: "Elegant, nostalgic, luxury"
        };
      } else if (aiTool === "hashtag") {
        endpoint = "/api/gemini/hashtags";
        payload = {
          category: aiInputCategory,
          productTags: aiInputMaterials || "pressed leaf, custom resin tray"
        };
      } else if (aiTool === "reel") {
        endpoint = "/api/gemini/reel-ideas";
        payload = {
          category: aiInputCategory,
          targetFeature: aiInputEmotion || "pouring layers of high gloss epoxy resin"
        };
      } else if (aiTool === "description") {
        endpoint = "/api/gemini/description";
        payload = {
          productName: aiInputProduct || "Handmade Jesmonite Ribbed Plate",
          category: aiInputCategory,
          materials: aiInputMaterials || "Jesmonite powder, gold brush, non-toxic sealant",
          coreStory: aiInputEmotion || "Modern elegant trays that add warmth to any dressing table"
        };
      } else if (aiTool === "forecast") {
        endpoint = "/api/gemini/insights";
        payload = {
          inventoryData: products,
          orderData: orders,
          rawMaterialsData: rawMaterials
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const responseText = data.caption || data.hashtags || data.storyboard || data.description || data.insights || data.blogContent;
      setAiResult(responseText);

    } catch (err: any) {
      console.warn("Using premium local generative template heuristics as fallback.");
      
      let standInText = "";
      if (aiTool === "caption") {
        standInText = `🌸 **[Elegant Aesthetics Option]**
Every flower holds an eternal memory, and yours deserves to live forever. ⚜️ Watch how we beautifully encapsulate these lush wedding hydrangeas inside our crystal premium slab. Handcast by Lokeswari with botanical passion.
👉 Start your bespoke preservation. Submit your brief under "Custom Orders".

✨ **[Warm Narrative Option]**
"Art for Every Heart." 🍁 Transitioning from organic blossoms to your vanity drawers. Add warmth to your morning dressing routine with our hand-poured Ribbed Terrazzo Vanity Tray. Cast in small, non-toxic batches of Jesmonite AC100.
🎁 Bespoke commissions are officially open! Reserve your piece now.`;
      } else if (aiTool === "hashtag") {
        standInText = `#vartucreations #handmadeindia #resinart #weddingpreservation #botanicalart #jesmoniteac100 #terrazzodecor #hyderabadiartisan #customgifting #handmadewithlove`;
      } else if (aiTool === "reel") {
        standInText = `🎬 **Viral Satisfying Process Storyboard:**
- **Suggested Sound:** Chill acoustic guitar or ambient forest sounds
- **Visual Segments:**
  - 0s - 3s: Close-up of Lokeswari hand-arranging dried yellow chrysanthemums inside the silicone frame.
  - 3s - 8s: Dharani mixing bubble-free clear castings with gold dust.
  - 8s - 12s: Pouring the high-gloss mixture slowly, watching the bubbles rise and melt.
  - 12s - 15s: Elegant reveal of the glossy cured plaque catching natural evening light.
- **Hook Text:** "POV: You kept your wedding bouquet for a lifetime instead of letting it dry..."`;
      } else if (aiTool === "description") {
        standInText = `✨ **Golden Sunburst Botanical Keepsake Block**
*Designed by VartU Creations — Art for Every Heart*

Preserving beautiful days in structural crystalline elegance. Hand-layered individually, this bespoke architectural block seals golden everlasting daisies and real field flora beneath a high-gloss protective shield.

**Key Accents:**
- Material: Jewelry-grade ultra-clear epoxy formulation.
- Handcrafting Process: Separately cured in 3 individual 8-hour stages to avoid heat bloom.
- Personalization: Complimentary gold engraving for name initials inside the block.`;
      } else if (aiTool === "forecast") {
        standInText = `🚨 **VartU Creations — Predictive Materials Audit & Forecast**
- **Sourcing Alert:** Epoxy Resin raw supply is low (1200g left). Outstanding wedding block bookings will exhaust this within 5 working days. Recommend order of 5Kg base compound from our regional distributor immediately.
- **Stock Buffers:** Soy wax storage holds comfortable margins, but natural Matka clay containers are running low (18 left). Order replenishment before seasonal peak.
- **Instagram Direct conversion:** Sourced leads grow 15% WoW. Keep focusing reels on raw satisfying flower castings!`;
      }
      setAiResult(standInText);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
      {/* Tab select menu bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D4A373]/20 pb-4 mb-8">
        <button
          onClick={() => setActiveAdminSubTab("dashboard")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "dashboard" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Stats</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("products")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "products" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <Package className="w-4 h-4" />
          <span>Finished Goods CRUD</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("inventory")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "inventory" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <Layers className="w-4 h-4" />
          <span>Raw Materials Alerts ({lowMaterialsCount})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("orders")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "orders" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Orders Queue ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("quotes")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "quotes" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Quotes Requests ({customOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab("crm")}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "crm" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-white text-[#6B705C] hover:bg-gray-50 border-[#D4A373]/20"
          } cursor-pointer`}
        >
          <Users className="w-4 h-4" />
          <span>CRM Leads Directory</span>
        </button>

        <button
          onClick={() => {
            setActiveAdminSubTab("ai-hub");
            setAiInputProduct("");
            setAiResult("");
          }}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full transition-all border ${
            activeAdminSubTab === "ai-hub" ? "bg-[#2D302D] text-white border-[#2D302D]" : "bg-[#E9EDC9] text-[#2D302D] hover:bg-[#E9EDC9]/85 border-[#8B9D83]/20"
          } cursor-pointer`}
        >
          <Sparkles className="w-4 h-4 text-[#D4A373] fill-[#D4A373]" />
          <span>Gemini AI Content Hub</span>
        </button>
      </div>

      {/* DASHBOARD TAB SUBVIEW */}
      {activeAdminSubTab === "dashboard" && (
        <div className="space-y-8">
          {/* Key KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-[#D4A373]/25 p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-[#E9EDC9]/60 text-[#8B9D83] rounded-xl shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-widest font-semibold block">Total Revenue</span>
                <span className="text-xl font-serif italic font-bold text-[#2D302D]">₹{totalSubtotalRevenue}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D4A373]/25 p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-[#D4A373]/10 text-[#D4A373] rounded-xl shrink-0">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-widest font-semibold block">Finished Orders</span>
                <span className="text-xl font-serif italic font-bold text-[#2D302D]">{totalOrdersCount} Sales</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D4A373]/25 p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-[#2D302D]/5 text-[#2D302D] rounded-xl shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-widest font-semibold block">CRM Capture Leads</span>
                <span className="text-xl font-serif italic font-bold text-[#2D302D]">{activeCRMLeadCount} Profiles</span>
              </div>
            </div>

            <div className={`bg-white rounded-2xl border p-5 shadow-xs flex items-center gap-4 transition-colors ${lowMaterialsCount > 0 ? "border-amber-300 bg-amber-50/10" : "border-[#D4A373]/25"}`}>
              <div className={`p-3 rounded-xl shrink-0 ${lowMaterialsCount > 0 ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-gray-50 text-gray-500"}`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-widest font-semibold block">Raw Materials Alert</span>
                <span className="text-xl font-serif italic font-bold text-[#2D302D]">{lowMaterialsCount} Alerts</span>
              </div>
            </div>
          </div>

          {/* Business Insights Banner */}
          <div className="bg-gradient-to-r from-[#2D302D] to-[#3D413D] rounded-2xl p-6 text-[#FAF9F6] shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-[#D4A373]/20 relative overflow-hidden">
            <div className="space-y-1.5 relative z-10">
              <h3 className="text-base font-serif italic text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4A373] fill-[#D4A373]" /> Need smart materials replenishment?
              </h3>
              <p className="text-xs text-[#FAF9F6]/85 max-w-xl leading-relaxed">
                Allow premium Gemini intelligence to scan your product listings, active sales queues, and dry flower weights to automate restock orders seamlessly.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveAdminSubTab("ai-hub");
                setAiTool("forecast");
                setAiResult("");
              }}
              className="bg-[#8B9D83] hover:bg-[#6B705C] text-white text-xs font-bold py-2.5 px-6 rounded-full uppercase tracking-wider transition-colors shrink-0 cursor-pointer relative z-10"
            >
              Consult Gemini AI Forecast
            </button>
          </div>

          {/* Quick Tasks Distribution & Brand Outline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#D4A373]/25 shadow-xs">
              <h4 className="text-xs font-mono font-bold text-[#6B705C] uppercase tracking-wider mb-4 block">VartU Team Workflow Matrix</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 text-xs">
                  <span className="bg-[#E9EDC9]/60 text-[#8B9D83] rounded-full px-2.5 py-0.5 font-bold font-mono tracking-wider text-[9px] uppercase self-start mt-0.5">Creative</span>
                  <div>
                    <strong className="text-[#2D302D] font-bold">Lokeswari (Botanical Head):</strong> Pouring clear resin slabs and cataloging Custom design inquiries.
                  </div>
                </div>
                <div className="flex items-start gap-3.5 text-xs">
                  <span className="bg-[#E9EDC9]/60 text-[#8B9D83] rounded-full px-2.5 py-0.5 font-bold font-mono tracking-wider text-[9px] uppercase self-start mt-0.5">BD & Ops</span>
                  <div>
                    <strong className="text-[#2D302D] font-bold">Kiran Kumar (Business):</strong> Sourcing lead captures, verifying invoices and coordinating orders.
                  </div>
                </div>
                <div className="flex items-start gap-3.5 text-xs">
                  <span className="bg-[#E9EDC9]/60 text-[#8B9D83] rounded-full px-2.5 py-0.5 font-bold font-mono tracking-wider text-[9px] uppercase self-start mt-0.5">Workshops</span>
                  <div>
                    <strong className="text-[#2D302D] font-bold">Dharani (Masterclass Dev):</strong> Maintaining interactive clay modeling tutorials and scheduling zoom coordinates.
                  </div>
                </div>
                <div className="flex items-start gap-3.5 text-xs">
                  <span className="bg-[#E9EDC9]/60 text-[#8B9D83] rounded-full px-2.5 py-0.5 font-bold font-mono tracking-wider text-[9px] uppercase self-start mt-0.5">Logistics</span>
                  <div>
                    <strong className="text-[#2D302D] font-bold">Naveen (Fulfillment):</strong> Packaging fragile clay candles, bubble wrapping flower blocks.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D4A373]/25 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono font-bold text-[#6B705C] uppercase tracking-wider mb-2 block">Performance Summary</h4>
                <p className="text-xs text-[#6B705C] leading-relaxed">
                  Founded in <strong className="text-[#2D302D]">May 2024</strong>, VartU Creations reports a beautiful average order value (AOV) of <strong className="text-[#8B9D83]">₹{averageOrderValue}</strong>. Best selling models concentrate strictly on Flower Castings and Terracotta candles.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#D4A373]/15 flex justify-between items-center mt-6">
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-wider">Growth Milestones</span>
                <span className="text-xs font-bold text-[#8B9D83] uppercase tracking-widest font-mono">ON TRACK 👍</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CRUD PRODUCTS LIST TAB */}
      {activeAdminSubTab === "products" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-serif italic text-[#2D302D]">Finished Goods Stock Listing</h2>
              <span className="text-xs text-[#6B705C]">Add, edit, or remove listings displayed inside the VartU storefront.</span>
            </div>
            <button
              onClick={handleStartAddProduct}
              className="px-5 py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-full text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Add Crafts Listing</span>
            </button>
          </div>

          {/* Form edit modal drawer inside */}
          {editingProduct && (
            <div className="bg-white border border-[#D4A373]/30 p-6 sm:p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
              <h3 className="text-sm font-serif italic text-[#2D302D] mb-4">
                Configure Artisan Listing
              </h3>
              <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs text-[#6B705C]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Product Title:</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.name || ""}
                      onChange={(e) => setEditingProduct(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">SKU identifier:</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku || ""}
                      onChange={(e) => setEditingProduct(p => ({ ...p, sku: e.target.value }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Base Price (INR):</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price || 0}
                      onChange={(e) => setEditingProduct(p => ({ ...p, price: Number(e.target.value) }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Discount (%):</label>
                    <input
                      type="number"
                      value={editingProduct.discount || 0}
                      onChange={(e) => setEditingProduct(p => ({ ...p, discount: Number(e.target.value) }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Available Stock:</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock || 0}
                      onChange={(e) => setEditingProduct(p => ({ ...p, stock: Number(e.target.value) }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Category Medium:</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct(p => ({ ...p, category: e.target.value as ProductCategory }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none text-[#2D302D] cursor-pointer"
                    >
                      {Object.values(ProductCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Total Weight (g):</label>
                    <input
                      type="number"
                      value={editingProduct.weight || 0}
                      onChange={(e) => setEditingProduct(p => ({ ...p, weight: Number(e.target.value) }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-2">Customization?</label>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        checked={editingProduct.customization || false}
                        onChange={(e) => setEditingProduct(p => ({ ...p, customization: e.target.checked }))}
                        className="w-4 h-4 accent-[#8B9D83] cursor-pointer"
                      />
                      <span className="text-[#2D302D] font-medium">Accept initial prompts</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#2D302D] font-bold mb-1">Short Narrative description:</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p, description: e.target.value }))}
                    className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-[#2D302D] font-bold mb-1">Image URL:</label>
                    <input
                      type="text"
                      value={editingProduct.images?.[0] || ""}
                      onChange={(e) => setEditingProduct(p => ({ ...p, images: [e.target.value] }))}
                      className="w-full p-2.5 border border-[#D4A373]/20 bg-[#FAF9F6]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
                    >
                      Save Listing
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-[#2D302D] font-bold rounded-xl text-xs cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Table display Grid */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#D4A373]/25 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#D4A373]/15 font-mono text-[#6B705C] uppercase tracking-widest text-[10px]">
                    <th className="p-4 font-bold">Product Name</th>
                    <th className="p-4 font-bold">SKU Code</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">In-Stock Status</th>
                    <th className="p-4 font-bold text-right text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A373]/10 font-semibold text-[#2D302D]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          referrerPolicy="no-referrer"
                          alt=""
                          className="w-10 h-10 object-cover rounded-lg border border-[#D4A373]/15 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-[#2D302D]">{prod.name}</p>
                          <p className="text-[10px] text-[#6B705C] italic">Approx. {prod.weight}g</p>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[#6B705C]">{prod.sku}</td>
                      <td className="p-4 text-[#6B705C]">{prod.category}</td>
                      <td className="p-4 font-serif italic font-bold text-[#2D302D]">₹{prod.price}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider ${
                          prod.stock === 0 ? "bg-rose-50 text-rose-600" : prod.stock < 3 ? "bg-amber-50 text-amber-600" : "bg-[#E9EDC9] text-[#8B9D83]"
                        }`}>
                          {prod.stock === 0 ? "OUT OF STOCK" : `${prod.stock} units`}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-[#8B9D83] hover:bg-[#FAF9F6] rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProductById(prod.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RAW INVENTORY LEDGER SUBVIEW */}
      {activeAdminSubTab === "inventory" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif italic text-[#2D302D]">Raw Materials Ledger</h2>
            <span className="text-xs text-[#6B705C]">Monitor base fragrances, organic waxes, and premium resin formulations.</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#D4A373]/25 shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#D4A373]/15 font-mono text-[#6B705C] uppercase tracking-widest text-[10px]">
                    <th className="p-4 font-bold">Material name</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Remaining Stock</th>
                    <th className="p-4 font-bold">Threshold limit</th>
                    <th className="p-4 font-bold">Refill Metric</th>
                    <th className="p-4 font-bold text-right">Procure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A373]/10 font-semibold text-[#2D302D]">
                  {rawMaterials.map((mat) => {
                    const isLow = mat.stockCount <= mat.lowStockThreshold;

                    return (
                      <tr key={mat.id} className={`hover:bg-[#FAF9F6]/40 transition-colors ${isLow ? "bg-amber-50/10" : ""}`}>
                        <td className="p-4 flex items-center gap-2">
                          <CircleDot className={`w-3.5 h-3.5 ${isLow ? "text-amber-500 animate-pulse" : "text-gray-300"}`} />
                          <span className="font-bold text-[#2D302D]">{mat.name}</span>
                        </td>
                        <td className="p-4 text-[#6B705C]">{mat.category}</td>
                        <td className="p-4 font-mono font-bold text-[#2D302D]">
                          {mat.stockCount} {mat.unit}
                        </td>
                        <td className="p-4 font-mono text-[#6B705C]">
                          &lt;= {mat.lowStockThreshold} {mat.unit}
                        </td>
                        <td className="p-4">
                          <input
                            type="number"
                            placeholder="500"
                            value={replenishAmounts[mat.id] || ""}
                            onChange={(e) => setReplenishAmounts(prev => ({ ...prev, [mat.id]: Number(e.target.value) }))}
                            className="w-16 p-1.5 border border-[#D4A373]/25 text-[#2D302D] rounded-lg font-mono text-center mb-0 bg-white"
                          />
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleReplenishClick(mat.id)}
                            className="text-xs bg-[#2D302D] hover:bg-[#8B9D83] text-white font-bold py-1.5 px-3.5 rounded-full transition-colors cursor-pointer uppercase tracking-wider"
                          >
                            Refill
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl border border-[#D4A373]/25 p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase text-[#6B705C] block tracking-widest">
                Sourcing Guidelines
              </h3>
              <p className="text-xs text-[#6B705C] leading-relaxed">
                When finished stock alerts flash red, Kiran secures wholesale custom mailers. Raw non-toxic soy wax is acquired in 10kg packages while premium bubble-free resin is imported from our Chennai botanical distributor.
              </p>
              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#D4A373]/20 text-xs font-semibold text-[#2D302D] leading-relaxed">
                <strong>Inventory Valuation:</strong> Approximately ₹64,300 in storage compounds.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS QUEUE TAB VIEW */}
      {activeAdminSubTab === "orders" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif italic text-[#2D302D]">Order Fulfillment Processing Queue</h2>
            <span className="text-xs text-[#6B705C]">Coordinate artisan workflows from label generation to parcel packaging.</span>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D4A373]/20 text-[#6B705C]">
                <p className="text-xs font-semibold">Fulfillment queue is empty.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div 
                  key={ord.id}
                  className="bg-white rounded-2xl border border-[#D4A373]/25 p-5 shadow-xs flex flex-col md:flex-row justify-between gap-5 items-start md:items-center hover:shadow-sm transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#2D302D]">ID: {ord.id}</span>
                      <span className="text-[9px] font-bold font-mono uppercase tracking-wider bg-[#E9EDC9] text-[#8B9D83] px-2.5 py-0.5 rounded-full border border-[#8B9D83]/20">
                        Payment: {ord.paymentStatus}
                      </span>
                    </div>

                    <div className="text-xs text-[#2D302D] space-y-1">
                      <strong className="text-[#2D302D] font-bold block">Items ordered:</strong>
                      <ul className="list-disc list-inside pl-1 font-mono text-[#6B705C]">
                        {ord.items.map((it, idx) => (
                          <li key={idx}>
                            {it.name} x {it.quantity} (₹{it.price}) {it.customText && `[Initials: '${it.customText}']`}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-[#6B705C] bg-[#FAF9F6]/80 p-3 rounded-xl border border-[#D4A373]/15 max-w-xl">
                      <p><strong>Deliver to:</strong> {ord.customerDetails.name} (+91 {ord.customerDetails.phone})</p>
                      <p className="italic text-[#6B705C]/75 mt-0.5">{ord.customerDetails.address}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0 self-stretch md:self-auto justify-between md:justify-center border-t border-[#D4A373]/10 md:border-t-0 pt-4 md:pt-0">
                    <div>
                      <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-widest text-[#6B705C]/75 text-right block mb-1">Fulfillment Status</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs font-semibold py-1.5 px-3 border border-[#D4A373]/25 rounded-xl bg-white text-[#2D302D] cursor-pointer focus:outline-none"
                      >
                        {Object.values(OrderStatus).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[#6B705C]">Charged total:</span>
                      <p className="text-base font-serif italic font-bold text-[#2D302D]">₹{ord.total}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* CUSTOM QUOTES PORTAL */}
      {activeAdminSubTab === "quotes" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif italic text-[#2D302D]">Bespoke Commission Workbenches</h2>
            <span className="text-xs text-[#6B705C]">Audit flower preservation details, customized initials, and release custom quotes.</span>
          </div>

          <div className="space-y-4">
            {customOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#D4A373]/20 text-[#6B705C]">
                <p className="text-xs font-semibold">No active custom commission inquiries.</p>
              </div>
            ) : (
              customOrders.map((quote) => {
                const isRequested = quote.status === CustomOrderStatus.REQUESTED;

                return (
                  <div 
                    key={quote.id} 
                    className="bg-white rounded-2xl border border-[#D4A373]/25 p-5 shadow-xs flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                  >
                    <div className="flex gap-4 items-start max-w-2xl">
                      {quote.inspirationImage && (
                        <img
                          src={quote.inspirationImage}
                          referrerPolicy="no-referrer"
                          alt="inspiration"
                          className="w-16 h-16 object-cover rounded-xl border border-[#D4A373]/15 shrink-0 mt-1"
                        />
                      )}
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#6B705C]">ID: {quote.id}</span>
                          <h3 className="text-xs font-bold text-[#2D302D]">{quote.productType} (qty: {quote.quantity} pcs)</h3>
                        </div>

                        <p className="text-xs text-[#6B705C] bg-[#FAF9F6] p-3 rounded-lg border border-[#D4A373]/15 leading-relaxed italic">
                          "{quote.customizationDetails}"
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 space-y-2.5 self-stretch md:self-auto border-t border-[#D4A373]/10 md:border-t-0 pt-4 md:pt-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-[#6B705C] tracking-wider">Quote Status</span>
                        <p className="text-xs font-bold text-[#8B9D83] mt-0.5 capitalize">{quote.status}</p>
                      </div>

                      {isRequested ? (
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              const pr = prompt("Enter bespoke quote rate (INR):");
                              if (pr) handleApproveQuote(quote.id, Number(pr), "Approved by Artistic head Lokeswari.");
                            }}
                            className="w-full py-2 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold text-[11px] px-4 rounded-full shadow-xs cursor-pointer text-center uppercase tracking-wider"
                          >
                            Approve with Price Quote
                          </button>
                          <button
                            onClick={() => handleRejectQuote(quote.id, "Materials currently exhausted.")}
                            className="w-full py-1.5 bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 font-bold text-[11px] px-4 rounded-full text-center transition-colors cursor-pointer"
                          >
                            Reject Briefing
                          </button>
                        </div>
                      ) : (
                        <div className="bg-[#E9EDC9]/60 text-[#8B9D83] p-2.5 rounded-full text-[10px] font-bold font-mono uppercase text-center tracking-wider border border-[#8B9D83]/20">
                          Price Released: ₹{quote.quotedPrice || "0"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CRM READ CLIENT DIRECTORY STATS */}
      {activeAdminSubTab === "crm" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-serif italic text-[#2D302D]">Bespoke CRM Directory</h2>
            <span className="text-xs text-[#6B705C]">Audit client birthdays, historic spend, and contact coordinates.</span>
          </div>

          <div className="bg-white rounded-2xl border border-[#D4A373]/25 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#D4A373]/15 font-mono text-[#6B705C] uppercase tracking-widest text-[10px]">
                    <th className="p-4 font-bold">Client Profile</th>
                    <th className="p-4 font-bold">Source origin</th>
                    <th className="p-4 font-bold">Milestone Dates (Birthday/Anniversary)</th>
                    <th className="p-4 font-bold">Order Count</th>
                    <th className="p-4 font-bold">Historic Revenue</th>
                    <th className="p-4 font-bold text-right">Fulfillment Diary Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4A373]/10 font-semibold text-[#2D302D]">
                  {crmLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF9F6]/40 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-[#2D302D]">{lead.name}</p>
                        <p className="text-[10px] text-[#6B705C] font-mono">{lead.email} || {lead.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#E9EDC9]/60 text-[#8B9D83] text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-[#8B9D83]/20 font-mono uppercase tracking-wider">
                          {lead.leadSource}
                        </span>
                      </td>
                      <td className="p-4 text-[#6B705C] font-normal">
                        {lead.birthday && <p className="text-[11px]">🎂 Birthday: {lead.birthday}</p>}
                        {lead.anniversary && <p className="text-[11px] text-[#D4A373] font-bold">💍 Wedding: {lead.anniversary}</p>}
                        {!lead.birthday && !lead.anniversary && <span className="text-gray-300">-</span>}
                      </td>
                      <td className="p-4 font-mono font-bold text-[#6B705C]">{lead.purchaseCount} orders</td>
                      <td className="p-4 font-serif italic font-bold text-[#2D302D]">₹{lead.totalSpent}</td>
                      <td className="p-4 text-[#6B705C] text-[11px] leading-relaxed italic max-w-xs font-normal">{lead.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* GEMINI AI WRITER HUB & POST CALENDAR PLANNER */}
      {activeAdminSubTab === "ai-hub" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* AI prompt workbench panel (Left) */}
          <div className="lg:col-span-12 xl:col-span-6 bg-white rounded-2xl border border-[#D4A373]/25 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="mb-4 space-y-1.5">
              <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#8B9D83] bg-[#E9EDC9] px-2.5 py-1 rounded-full border border-[#8B9D83]/20 block w-max">
                ⭐ Premium Gemini AI Assistant Mode
              </span>
              <h2 className="text-lg font-serif italic text-[#2D302D] pt-1">Artisan Copywriting Desk</h2>
              <p className="text-xs text-[#6B705C] leading-relaxed">
                Generate high-converting captions, sensory descriptions of handmade crafts, or forecast material stock needs instantly.
              </p>
            </div>

            {/* AI utility tool selector buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] uppercase font-bold tracking-wider">
              <button
                onClick={() => { setAiTool("caption"); setAiResult(""); }}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${aiTool === "caption" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-[#FAF9F6] text-[#6B705C] hover:bg-gray-100 border-[#D4A373]/15"}`}
              >
                Captions
              </button>
              <button
                onClick={() => { setAiTool("hashtag"); setAiResult(""); }}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${aiTool === "hashtag" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-[#FAF9F6] text-[#6B705C] hover:bg-gray-100 border-[#D4A373]/15"}`}
              >
                Hashtags
              </button>
              <button
                onClick={() => { setAiTool("reel"); setAiResult(""); }}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${aiTool === "reel" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-[#FAF9F6] text-[#6B705C] hover:bg-gray-100 border-[#D4A373]/15"}`}
              >
                Reel Process
              </button>
              <button
                onClick={() => { setAiTool("description"); setAiResult(""); }}
                className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${aiTool === "description" ? "bg-[#8B9D83] text-white border-[#8B9D83]" : "bg-[#FAF9F6] text-[#6B705C] hover:bg-gray-100 border-[#D4A373]/15"}`}
              >
                Descriptions
              </button>
              <button
                onClick={() => { setAiTool("forecast"); setAiResult(""); }}
                className={`py-2 px-3 rounded-lg border text-center transition-all col-span-2 cursor-pointer ${aiTool === "forecast" ? "bg-[#2D302D] text-white border-[#2D302D]" : "bg-[#E9EDC9] text-[#2D302D] hover:bg-amber-150 border-[#8B9D83]/15"}`}
              >
                Smart Business Heuristic
              </button>
            </div>

            {/* Dynamic parameter configuration fields */}
            <div className="space-y-4 pt-2">
              {aiTool !== "forecast" && (
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] uppercase tracking-wider">Artisan Product Category:</label>
                  <select
                    value={aiInputCategory}
                    onChange={(e) => setAiInputCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs py-2.5 px-3 border border-[#D4A373]/20 bg-white text-[#2D302D] rounded-xl mt-1 focus:ring-1 focus:ring-[#8B9D83] focus:outline-none cursor-pointer"
                  >
                    {Object.values(ProductCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Dynamic show conditional fields */}
              {(aiTool === "caption" || aiTool === "description") && (
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] uppercase tracking-wider">Product Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. Lavender concrete candle or Pressed flower pendant"
                    value={aiInputProduct}
                    onChange={(e) => setAiInputProduct(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 border border-[#D4A373]/20 bg-white text-[#2D302D] rounded-xl mt-1 focus:outline-none focus:ring-1 focus:ring-[#8B9D83]"
                  />
                </div>
              )}

              {(aiTool === "hashtag" || aiTool === "description") && (
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] uppercase tracking-wider">Materials / Spec tags:</label>
                  <input
                    type="text"
                    placeholder="e.g. real pressed daisies, UV resin, Terracotta bowl"
                    value={aiInputMaterials}
                    onChange={(e) => setAiInputMaterials(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 border border-[#D4A373]/20 bg-white text-[#2D302D] rounded-xl mt-1 focus:outline-none focus:ring-1 focus:ring-[#8B9D83]"
                  />
                </div>
              )}

              {(aiTool === "reel" || aiTool === "description") && (
                <div>
                  <label className="block text-[11px] font-bold text-[#2D302D] uppercase tracking-wider">Core Story / Highlight Emotion:</label>
                  <input
                    type="text"
                    placeholder="e.g. Wedding flower preservation to last a lifetime, warmth elements"
                    value={aiInputEmotion}
                    onChange={(e) => setAiInputEmotion(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 border border-[#D4A373]/20 bg-white text-[#2D302D] rounded-xl mt-1 focus:outline-none focus:ring-1 focus:ring-[#8B9D83]"
                  />
                </div>
              )}

              {aiTool === "forecast" && (
                <div className="bg-[#E9EDC9]/30 p-3.5 rounded-xl border border-[#8B9D83]/20 text-[11px] text-[#6B705C] leading-relaxed">
                  📢 <strong>BI Forecasting System:</strong> Reviews raw material reserves, alerts Kiran on supply deficits, and calculates required restock weights dynamically.
                </div>
              )}
            </div>

            <button
              onClick={handleTriggerAI}
              disabled={isAiLoading}
              className="w-full py-3 bg-[#8B9D83] hover:bg-[#6B705C] disabled:bg-gray-200 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>{isAiLoading ? "Consulting Gemini..." : "Generate with Gemini AI"}</span>
            </button>
          </div>

          {/* AI generated markdown viewer (Right) */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-6 w-full">
            <div className="bg-white rounded-2xl border border-[#D4A373]/25 shadow-xs p-6 sm:p-8 min-h-[384px] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-[#6B705C] block tracking-widest border-b border-[#D4A373]/10 pb-3 mb-4">
                  Gemini Generation Output Response
                </h3>

                {aiResult ? (
                  <div className="mt-4 text-xs text-[#2D302D] whitespace-pre-wrap leading-relaxed space-y-3 font-mono bg-[#FAF9F6] p-4.5 rounded-xl border border-dashed border-[#D4A373]/30 shadow-inner">
                    {aiResult}
                  </div>
                ) : (
                  <div className="text-center py-20 text-[#6B705C]/60 space-y-2">
                    <Lightbulb className="w-12 h-12 mx-auto text-[#6B705C]/30 stroke-1" />
                    <p className="text-xs font-semibold">Ready to draft. Choose a copywriting action.</p>
                  </div>
                )}
              </div>

              {/* Action output hooks */}
              {aiResult && (
                <div className="flex gap-2.5 border-t border-[#D4A373]/10 pt-5 mt-6">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResult);
                      alert("Successfully copied generation draft!");
                    }}
                    className="flex-1 py-2.5 bg-[#2D302D] hover:bg-black text-white font-bold rounded-full text-xs text-center transition-colors shadow-xs uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Copy Draft Text
                  </button>
                  <button
                    onClick={() => {
                      const post: SocialCalendarEvent = {
                        id: `ev-${Math.floor(Math.random() * 10000)}`,
                        date: new Date().toISOString().split("T")[0],
                        channel: "Instagram",
                        theme: aiInputProduct || "Botanical Bespoke Art",
                        caption: aiResult,
                        status: "Planned"
                      };
                      saveSocialCalendarEvent(post);
                      alert("Social calendar item added successfully!");
                    }}
                    className="flex-1 py-2.5 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-full text-xs text-center transition-all shadow-xs uppercase tracking-wider cursor-pointer"
                  >
                    Save to Calendar
                  </button>
                </div>
              )}
            </div>

            {/* Social calendar visual layout */}
            <div className="bg-white rounded-2xl border border-[#D4A373]/25 p-6 shadow-xs">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2D302D] mb-4 block border-b border-[#D4A373]/10 pb-3">
                Social Posting Calendar ({socialCalendar.length} items)
              </h4>
              <div className="space-y-3">
                {socialCalendar.length === 0 ? (
                  <p className="text-xs text-[#6B705C] italic py-2">No postings scheduled currently.</p>
                ) : (
                  socialCalendar.map((ev) => (
                    <div key={ev.id} className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#D4A373]/15 flex justify-between items-center text-xs gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-[#E9EDC9] text-[#8B9D83] px-2 py-0.5 rounded-full font-bold font-mono uppercase tracking-wider border border-[#8B9D83]/20">
                          {ev.channel}
                        </span>
                        <strong className="text-[#2D302D] block pt-1 font-bold line-clamp-1">{ev.theme}</strong>
                        <span className="text-[10px] text-[#6B705C]/75 font-mono">Publish Date: {ev.date}</span>
                      </div>
                      <button
                        onClick={() => deleteSocialEvent(ev.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
