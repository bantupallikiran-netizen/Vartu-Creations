import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Mail, Briefcase, Calculator, CheckCircle, PackageOpen } from "lucide-react";

export const CorporateGiftingView: React.FC = () => {
  const { registerNewLead, isFirebaseActive } = useApp();

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSet, setSelectedSet] = useState("Jesmonite Table Accents Tray Set");
  const [volume, setVolume] = useState(50);
  const [ribbonColors, setRibbonColors] = useState("Gold Satin Print Ribbon");
  const [isSuccess, setIsSuccess] = useState(false);

  const pricingPerSet: { [key: string]: number } = {
    "Jesmonite Table Accents Tray Set": 450,
    "Scented Terracotta Clay Soy Candle Set": 300,
    "Pressed Petal Keychain & Coaster Keepsake Box": 650,
    "Crochet Cute Succulent Cacti Desktop Gift Crate": 350
  };

  const handleCalculateTotal = () => {
    const base = pricingPerSet[selectedSet] || 300;
    let multiplier = 1;
    if (volume >= 200) multiplier = 0.8; 
    else if (volume >= 100) multiplier = 0.85; 
    else if (volume >= 50) multiplier = 0.9; 

    return Math.round(base * volume * multiplier);
  };

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email) return;

    const calcTotal = handleCalculateTotal();

    await registerNewLead({
      name: `${contactPerson} (${companyName})`,
      email,
      phone,
      leadSource: "Corporate Gifting" as any,
      purchaseCount: 0,
      totalSpent: 0,
      notes: `CORPORATE INQUIRY: Selected Set: '${selectedSet}' qty ${volume} pcs. Configured Ribbon: ${ribbonColors}. Estimated quote: ₹${calcTotal}.`
    });

    setIsSuccess(true);
    setCompanyName("");
    setContactPerson("");
    setEmail("");
    setPhone("");
    setVolume(50);

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Bulk calculator and Inquiry module (Left) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white/50 backdrop-blur-sm rounded-2xl border border-[#D4A373]/30 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 space-y-1">
            <span className="text-[10px] uppercase font-mono font-bold text-[#D4A373] tracking-[0.2em] block">
              Empowered bulk gifting
            </span>
            <h1 className="text-3xl font-serif italic text-[#2D302D]">Corporate Hamper Planner</h1>
            <p className="text-xs text-[#6B705C] leading-relaxed">
              Need handcrafted, non-toxic, local gifts that leave an impression? Budget custom setups ranging from custom resin logos to sustainable screen-printed jute bags with customized stamp labeling.
            </p>
          </div>

          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            {/* Coordinates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1">Company name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1">Contact Person:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kiran Kumar"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1">Work Email Coordinate:</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1">Phone Number:</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 91234 56789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
                />
              </div>
            </div>

            <hr className="border-[#D4A373]/10" />

            {/* Custom choice metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5">Select Hamper Combo Scheme:</label>
                <select
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-[#D4A373]/20 bg-white rounded-xl focus:outline-none text-[#2D302D] cursor-pointer"
                >
                  {Object.keys(pricingPerSet).map((set, i) => (
                    <option key={i} value={set}>{set}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                  <span>Batch Volume (units):</span>
                  <span className="text-[#8B9D83] font-bold font-mono">{volume} pcs</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={500}
                  step={10}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#8B9D83] mt-2.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#2D302D] font-bold uppercase tracking-wider mb-1">Ribbon Branding Colors Option:</label>
              <input
                type="text"
                placeholder="e.g. Navy Blue ribbon with ACME company logo embossed"
                value={ribbonColors}
                onChange={(e) => setRibbonColors(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-[#D4A373]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#8B9D83] text-[#2D302D]"
              />
            </div>

            {/* Dynamic calculator summary box */}
            <div className="bg-[#FAF9F6] rounded-xl p-4 border border-[#D4A373]/20 flex justify-between items-baseline gap-2">
              <div>
                <span className="text-[10px] text-[#6B705C] font-mono uppercase tracking-wider block">Estimated Bulk Quote:</span>
                <span className="text-xl font-serif italic font-bold text-[#2D302D]">₹{handleCalculateTotal()}</span>
                {volume >= 100 && <span className="text-[10px] text-[#8B9D83] font-semibold block mt-0.5">Custom volume discount applied!</span>}
              </div>
              <span className="text-[10px] text-[#6B705C] text-right font-mono">Based on INR ₹{pricingPerSet[selectedSet]}/pc rate</span>
            </div>

            {isSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bulk hamper blueprint received successfully! Kiran Kumar will draft a custom mail catalog to you.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-full text-xs uppercase tracking-widest transition-colors cursor-pointer text-center shadow-xs"
            >
              Submit Hamper RFP Briefing
            </button>
          </form>
        </div>

        {/* Crate visualization showcase cards (Right) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6 w-full">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-[#D4A373]/30 p-6 space-y-4 shadow-xs">
            <h3 className="text-md font-bold text-[#2D302D] flex items-center gap-2 font-serif italic text-lg">
              <PackageOpen className="w-5 h-5 text-[#8B9D83]" />
              <span>Catalog Presets</span>
            </h3>

            {/* Showcase 1 */}
            <div className="p-3.5 bg-[#FAF9F6] border border-[#D4A373]/15 rounded-xl flex gap-3 text-xs">
              <img
                src="https://images.unsplash.com/photo-1590736969955-71cc94801759?w=120"
                referrerPolicy="no-referrer"
                alt=""
                className="w-12 h-12 object-cover rounded-lg border shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-bold text-[#2D302D]">Jesmonite Accent Desk Set</h4>
                <p className="text-[10px] text-[#6B705C] leading-snug mt-0.5">Minimal Terrazzo trays + Ribbed pen cups. Coated with organic natural beeswax.</p>
              </div>
            </div>

            {/* Showcase 2 */}
            <div className="p-3.5 bg-[#FAF9F6] border border-[#D4A373]/15 rounded-xl flex gap-3 text-xs">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=120"
                referrerPolicy="no-referrer"
                alt=""
                className="w-12 h-12 object-cover rounded-lg border shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-bold text-[#2D302D]">Crystalline Logo Preservation Block</h4>
                <p className="text-[10px] text-[#6B705C] leading-snug mt-0.5">Pouring brand emblems with pressed flora layers inside high-clarity square boxes.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2D302D] text-[#FAF9F6] rounded-2xl p-6 shadow-xs border border-[#D4A373]/20 relative overflow-hidden">
            <strong className="text-[10px] font-mono tracking-widest text-[#D4A373] uppercase mb-1 block">🚚 Corporate Delivery Logistics:</strong>
            <p className="text-[11px] text-[#FAF9F6]/85 leading-relaxed pt-1">
              We process custom delivery layouts across India. For orders exceeding index volume sheets (50+ hampers), Naveen executes wooden palette crating to avoid shipment breakage entirely. Minimum lead curation cycle: 14 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
