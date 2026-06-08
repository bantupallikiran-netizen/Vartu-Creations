import React from "react";
import { Sparkles, Calendar, BookOpen, Clock } from "lucide-react";

export const BlogView: React.FC = () => {
  const articles = [
    {
      title: "Preserving Floral Memories: How to Avoid Pedal Fading",
      host: "Lokeswari, Botanical Crafts Lead",
      date: "May 18, 2024",
      minutes: "4 min read",
      excerpt: "Fresh flowers contain excess moisture. Encapsulating raw petals in resin triggers mold or yellow rotting. Learn how to dehydrate flowers using silica gel beads before your final epoxy pours.",
      content: "Epoxy resin is a chemical polymer that cures through an exothermic reaction, generating natural heat. If fresh flowers are cast directly into resin, this heat accelerates the organic decomposition inside the air-tight block. To prevent yellow fading, dry your bridal roses entirely inside granular silica sand blocks for 5-7 days. Then, spray with an acrylic sealer to establish a moisture barrier before pouring clear UV resins.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500"
    },
    {
      title: "Scented Soy Wax Care: Maximize Burn Hours and Aroma Throw",
      host: "Dharani, Creative Developer",
      date: "Oct 12, 2024",
      minutes: "3 min read",
      excerpt: "Your luxury Matka clay candle burns differently than paraffin. Read our guides on 'Wick Tunneling' and candle trims to prevent excess smoke soot.",
      content: "First-burn configurations are crucial for soy wax. Always allow the candle pool to melt completely to the edges of your clay Matka container on the first burn (usually takes 2-3 hours) to prevent structural wick tunneling. Trim raw wooden wicks to 1/4 inch before re-lighting to ensure a clean flame throw and avoid heavy black carbon buildup.",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Intro header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif italic text-[#2D302D]">Art Care Journals</h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#6B705C] leading-relaxed">
          Aesthetic guides and behind-the-scenes diaries written by our studio team in Hyderabad.
        </p>
      </div>

      {/* Article cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {articles.map((art, idx) => (
          <article 
            key={idx}
            className="bg-white rounded-2xl overflow-hidden border border-[#D4A373]/20 hover:border-[#D4A373]/40 shadow-xs transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 bg-[#FAF9F6]">
              <img
                src={art.image}
                referrerPolicy="no-referrer"
                alt={art.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#D4A373]/15 text-[10px] font-semibold text-[#8B9D83] flex items-center gap-1">
                <Clock className="w-3 h-3" /> {art.minutes}
              </div>
            </div>

            <div className="p-6 space-y-3.5 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6B705C] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#D4A373]" /> Published {art.date}
                </span>
                
                <h3 className="text-lg font-serif italic text-[#2D302D] leading-snug">{art.title}</h3>
                <p className="text-xs text-[#8B9D83] italic">By {art.host}</p>
                <p className="text-xs text-[#6B705C] leading-relaxed pt-1">{art.excerpt}</p>
                
                <p className="text-xs text-[#6B705C] bg-[#FAF9F6] p-4 border border-[#D4A373]/15 rounded-xl leading-relaxed mt-2.5">
                  {art.content}
                </p>
              </div>

              <div className="pt-4 border-t border-[#D4A373]/10 flex justify-between items-center text-[9px] uppercase tracking-wider text-[#6B705C]/75 font-semibold">
                <span>VartU Care Guides</span>
                <span>Copyright &copy;</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
