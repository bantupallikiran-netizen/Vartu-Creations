import React from "react";
import { useApp } from "../AppContext";
import { Product } from "../types";
import { Sparkles, Calendar, Gift, ArrowRight, MessageCircle, Star, Award, Shield } from "lucide-react";

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentTab }) => {
  const { products, toggleWishlist, wishlist } = useApp();

  const featuredListings = products.slice(0, 3); // Grab best sellers
  const reviews = [
    { name: "Sneha Reddy", text: "Lokeswari preserved our wedding bouquet so perfectly! Every petal looks so brilliant in the crystal block. Highly recommended!", rating: 5, date: "May 2024" },
    { name: "Kushal Kumar", text: "Placed a custom bulk Matka candle order for Diwali client gifting. Naveen's packing was bulletproof, not a single clay chip broken!", rating: 5, date: "Nov 2024" },
    { name: "Dhivya S.", text: "Learned botanical resin craft from Dharani on the live zoom workshop. The kit was packed with generous supplies!", rating: 5, date: "March 2025" }
  ];

  return (
    <div className="space-y-16 py-8">
      {/* 1. HERO BANNER PORTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#E9EDC9]/35 via-[#FAF9F6] to-[#FAEDCD]/40 border border-[#D4A373]/30 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-6 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A373] bg-white px-3.5 py-1.5 rounded-full border border-[#D4A373]/20 shadow-xs select-none">
              <Sparkles className="w-3.5 h-3.5 text-[#8B9D83]" /> Established May 2024
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif italic text-[#2D302D] leading-tight tracking-tight">
              Aesthetic Keepsakes & Handmade Décor
            </h1>
            <p className="text-xs sm:text-sm text-[#6B705C] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Transforming botanical petals, wedding memories, names and special family stories into crystal resin blocks, scented matka wax jars, and beautiful bespoke yarn crafts. 
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => setCurrentTab("shop")}
                className="w-full sm:w-auto bg-[#8B9D83] hover:bg-[#6B705C] text-white font-semibold py-3 px-8 rounded-full text-xs uppercase tracking-widest shadow-xs transition-colors cursor-pointer text-center"
              >
                Explore Artisanal Shop
              </button>
              <button
                onClick={() => setCurrentTab("custom")}
                className="w-full sm:w-auto bg-white hover:bg-[#FAF9F6] text-[#2D302D] border border-[#D4A373]/30 font-semibold py-3 px-8 rounded-full text-xs uppercase tracking-widest transition-colors text-center"
              >
                Design Custom Keepsake
              </button>
            </div>
          </div>

          {/* Right Floating collage previews */}
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-white/50 border border-[#D4A373]/20 p-2.5 shadow-sm">
            <div className="w-full h-full rounded-xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500"
                referrerPolicy="no-referrer"
                alt="Pressed Flower Resin block craft"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#2D302D]/90 backdrop-blur-md p-4 rounded-xl border border-[#D4A373]/20 text-[#FAF9F6]">
                <span className="text-[9px] uppercase tracking-[0.2em] font-mono font-medium text-[#D4A373] block">Artisan Masterpiece</span>
                <p className="text-xs text-white italic mt-1 font-serif">Bridal Floral Preservation Block</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS STRIPS */}
      <section className="bg-white/60 backdrop-blur-xs border-y border-[#D4A373]/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="text-[#8B9D83] mb-2 flex justify-center sm:justify-start"><Award className="w-6 h-6" /></div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D302D]">100% Handcast</h4>
            <p className="text-[11px] text-[#6B705C] leading-relaxed">No mass industrial printers. Individually layer-poured by Lokeswari and Shweta.</p>
          </div>
          <div className="space-y-1.5">
            <div className="text-[#8B9D83] mb-2 flex justify-center sm:justify-start"><Gift className="w-6 h-6" /></div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D302D]">Bespoke Monograms</h4>
            <p className="text-[11px] text-[#6B705C] leading-relaxed">Write personalized alphabets, anniversary dates, or gold lettering requests.</p>
          </div>
          <div className="space-y-1.5">
            <div className="text-[#8B9D83] mb-2 flex justify-center sm:justify-start"><Calendar className="w-6 h-6" /></div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D302D]">Live Masterclasses</h4>
            <p className="text-[11px] text-[#6B705C] leading-relaxed">Zoom lessons led by Dharani containing bulk supply kits shipped directly.</p>
          </div>
          <div className="space-y-1.5">
            <div className="text-[#8B9D83] mb-2 flex justify-center sm:justify-start"><Shield className="w-6 h-6" /></div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#2D302D]">Bulletproof Packaging</h4>
            <p className="text-[11px] text-[#6B705C] leading-relaxed">Friction layered cardboard buffers compiled by Naveen to avoid glass cracks.</p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (Best Sellers) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-baseline gap-2">
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#D4A373] font-bold">Ready to Ship</h3>
            <h2 className="text-3xl font-serif italic text-[#2D302D] mt-1">Our Favorite Creations</h2>
          </div>
          <button
            onClick={() => setCurrentTab("shop")}
            className="text-xs text-[#8B9D83] uppercase tracking-wider font-semibold hover:text-[#6B705C] flex items-center gap-1.5 group transition-colors"
          >
            <span>See entire catalogs</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map((prod) => {
            const finalPrice = Math.round(prod.price * (1 - prod.discount / 100));

            return (
              <div 
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#D4A373]/20 hover:border-[#D4A373]/40 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={prod.images[0]}
                    referrerPolicy="no-referrer"
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  {prod.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-[#8B9D83] text-white text-[9px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      -{prod.discount}% Cut
                    </span>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-[#D4A373]">{prod.category}</span>
                    <h4 className="text-sm font-semibold text-[#2D302D] mt-1 leading-snug group-hover:text-[#8B9D83] transition-colors">{prod.name}</h4>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-md font-serif italic font-semibold text-[#2D302D]">₹{finalPrice}</span>
                    <button
                      onClick={() => setCurrentTab("shop")}
                      className="text-xs text-[#8B9D83] hover:text-[#6B705C] font-semibold uppercase tracking-wider"
                    >
                      Configure &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WORKSHOPS PROMOTIONAL AND CORPORATE GIFT SPLIT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creative Workshop card */}
        <div className="bg-[#2D302D] text-[#FAF9F6] rounded-2xl p-8 flex flex-col justify-between space-y-6 border border-[#D4A373]/20 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B9D83]/10 rounded-full blur-2xl"></div>
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] text-[#D4A373] font-mono uppercase tracking-[0.2em] font-medium block">Coaster casting masters</span>
            <h3 className="text-white text-2xl font-serif italic">In-Person & Zoom Workshops</h3>
            <p className="text-xs text-[#FAF9F6]/75 leading-relaxed pt-1">
              Order individual ticket passes. Our logistics manager (Naveen) ships premium physical raw supply boxes containing Jesmonite mixes, silicone trays, and organic gold foils directly to your address prior to Zoom broadcast schedules!
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("workshops")}
            className="self-start py-2.5 px-6 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-semibold rounded-full text-xs uppercase tracking-widest transition-colors cursor-pointer text-center shadow-xs"
          >
            Book Slabs Workshop
          </button>
        </div>

        {/* Corporate crate gifting card */}
        <div className="bg-white/50 border border-[#D4A373]/30 rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-xs relative">
          <div className="space-y-2">
            <span className="text-[10px] text-[#8B9D83] uppercase tracking-[0.2em] font-bold block">Client & Wedding Hamper Crates</span>
            <h3 className="text-[#2D302D] text-2xl font-serif italic">Empowered Gifting Campaigns</h3>
            <p className="text-xs text-[#6B705C] leading-relaxed pt-1">
              Elevate corporate relationships or bridesmaid parties. Customize handpainted terracotta matka candles wrapped in screen-printed burlap carry sacks, adding custom company branding labels. Contact Lokeswari for curated options.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("corporate")}
            className="self-start py-2.5 px-6 bg-[#2D302D] hover:bg-[#8B9D83] text-white font-semibold rounded-full text-xs uppercase tracking-widest transition-colors cursor-pointer text-center shadow-xs"
          >
            Corporate Solutions
          </button>
        </div>
      </section>

      {/* 5. CUSTOMER REVIEWS PORT AREA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-4">
        <div className="text-center space-y-1">
          <h2 className="text-3xl font-serif italic text-[#2D302D]">Vouched by Hearts</h2>
          <p className="text-xs text-[#6B705C]">Read honest experiences shared by botanical preservation patrons.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white/50 rounded-2xl border border-[#D4A373]/15 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-1 text-[#D4A373]">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-[#6B705C] italic leading-relaxed">
                "{rev.text}"
              </p>
              <div className="flex justify-between items-baseline gap-2 pt-3 border-t border-[#D4A373]/10 text-[10px] font-sans font-semibold tracking-wider uppercase text-[#6B705C]/70">
                <span>{rev.name}</span>
                <span className="font-mono text-[9px] text-[#D4A373]">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FLOATING WHATSAPP CTA COMMERCE BUBBLE */}
      <a
        href="https://wa.me/918123445678?text=Hi%20VartU%20Creations!%20I'm%20visiting%20your%20awesome%20boutique%20website%20and%20would%20love%20to%20consult%20Lokeswari%20on%20preserving%20some%20family%20wedding%20flowers."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#8B9D83] hover:bg-[#6B705C] text-white p-3.5 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/20"
        title="Inquire directly on WhatsApp"
      >
        <MessageCircle className="w-4.5 h-4.5 fill-current" />
        <span className="text-[11px] uppercase tracking-widest font-bold hidden sm:inline">WhatsApp Custom</span>
      </a>
    </div>
  );
};
