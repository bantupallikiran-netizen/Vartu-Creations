import React, { useState } from "react";
import { useApp } from "../AppContext";
import { Product, ProductCategory } from "../types";
import { Search, Heart, Star, Eye, MessageCircle, X, ShoppingBag, Gift } from "lucide-react";

interface ShopViewProps {
  onOpenCart: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ onOpenCart }) => {
  const { products, addToCart, wishlist, toggleWishlist, saveProduct } = useApp();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);
  
  // Quick View State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customText, setCustomText] = useState("");
  const [buyQuantity, setBuyQuantity] = useState(1);

  // Review form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Filter Categories list
  const categories = ["All", ...Object.values(ProductCategory)];

  // Filter Products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesWishlist = !showOnlyWishlist || wishlist.includes(product.id);
    return matchesSearch && matchesCategory && matchesWishlist;
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const finalPriceA = a.price * (1 - a.discount / 100);
    const finalPriceB = b.price * (1 - b.discount / 100);

    if (sortBy === "price-low") return finalPriceA - finalPriceB;
    if (sortBy === "price-high") return finalPriceB - finalPriceA;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    return 0; // Default
  });

  const handleOpenQuickView = (prod: Product) => {
    setSelectedProduct(prod);
    setCustomText("");
    setBuyQuantity(1);
    setReviewRating(5);
    setReviewAuthor("");
    setReviewComment("");
    setReviewSuccessMsg("");
  };

  const handleAddToCart = (prod: Product) => {
    addToCart(prod, buyQuantity, customText || undefined);
    setSelectedProduct(null);
  };

  const handleBuyNow = (prod: Product) => {
    addToCart(prod, buyQuantity, customText || undefined);
    setSelectedProduct(null);
    onOpenCart(); // Trigger Checkout drawer
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim() || "Anonymous Buyer",
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    const updatedProduct = {
      ...selectedProduct,
      reviews: [...(selectedProduct.reviews || []), newReview]
    };

    try {
      await saveProduct(updatedProduct);
      setSelectedProduct(updatedProduct);
      setReviewAuthor("");
      setReviewComment("");
      setReviewRating(5);
      setReviewSuccessMsg("Thank you! Review saved, growing trust for VartU Creations.");
      setTimeout(() => {
        setReviewSuccessMsg("");
      }, 4000);
    } catch (err) {
      console.error("Error saving review", err);
    }
  };

  const calculateRatingAverage = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 4.8;
    const total = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all">
      {/* Category header intro */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-3xl font-serif italic text-[#2D302D]">Our Artisanal Collections</h1>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#6B705C] leading-relaxed">
          Aesthetic pieces mindfully created by Lokeswari & Dharani. Preserving weddings, floral memories, and handmade decor for every heart.
        </p>
      </div>

      {/* Filter and Shop controls bar */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-[#D4A373]/30 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B705C]" />
          <input
            type="text"
            placeholder="Search custom gifts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#D4A373]/20 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B9D83] transition-all bg-[#FAF9F6]/50 text-[#2D302D]"
          />
        </div>

        {/* Sort select */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Wishlist filter toggle */}
          <button
            onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl border transition-colors cursor-pointer ${
              showOnlyWishlist 
                ? "bg-[#8B9D83]/10 border-[#8B9D83] text-[#8B9D83]" 
                : "border-[#D4A373]/20 text-[#6B705C] bg-white hover:bg-[#FAF9F6]"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#8B9D83]" />
            <span>Favorites Only ({wishlist.length})</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold py-2 px-3 border border-[#D4A373]/20 rounded-xl focus:outline-none bg-white text-[#6B705C] cursor-pointer"
          >
            <option value="default">Sort: Recommend</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Alphabet: A to Z</option>
          </select>
        </div>
      </div>

      {/* Categories Horizontal pills Row */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-8 no-scrollbar scroll-smooth">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap transition-all border cursor-pointer ${
              selectedCategory === cat
                ? "bg-[#8B9D83] text-white border-[#8B9D83] shadow-xs select-none"
                : "bg-white text-[#6B705C] border-[#D4A373]/20 hover:border-[#8B9D83] hover:text-[#2D302D]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Product Cards */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/40 rounded-2xl border border-dashed border-[#D4A373]/30">
          <Heart className="w-12 h-12 text-[#6B705C]/30 mx-auto mb-3" />
          <p className="text-[#6B705C] text-sm font-medium">No handmade creations fit your current query.</p>
          <button 
            onClick={() => { setSelectedCategory("All"); setSearchTerm(""); setShowOnlyWishlist(false); }}
            className="mt-3 text-xs text-[#8B9D83] font-semibold hover:underline"
          >
            Clear current filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((prod) => {
            const hasDiscount = prod.discount > 0;
            const finalPrice = Math.round(prod.price * (1 - prod.discount / 100));
            const isWishlisted = wishlist.includes(prod.id);

            return (
              <div 
                key={prod.id} 
                className="bg-white rounded-2xl overflow-hidden border border-[#D4A373]/20 hover:shadow-xs transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative aspect-square overflow-hidden bg-[#FAF9F6]">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />

                  {/* Absolute Pill Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {hasDiscount && (
                      <span className="bg-[#8B9D83] text-white text-[9px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        -{prod.discount}% Off
                      </span>
                    )}
                    {prod.customization && (
                      <span className="bg-[#2D302D] text-[#FAF9F6] text-[9px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 border border-[#D4A373]/10">
                        <Gift className="w-3 h-3 text-[#D4A373]" /> Customizable
                      </span>
                    )}
                  </div>

                  {/* Top Right Wishlist Toggle */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm transition-transform active:scale-90 hover:bg-white text-gray-600 hover:text-red-500"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-[#8B9D83] text-[#8B9D83]" : ""}`} />
                  </button>

                  {/* Quick look hovering shade overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleOpenQuickView(prod)}
                      className="px-4 py-2 bg-white text-[#2D302D] border border-[#D4A373]/20 rounded-full text-xs font-semibold shadow hover:bg-[#8B9D83] hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details / Add</span>
                    </button>
                  </div>
                </div>

                {/* Info Text Area */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-white space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6B705C] font-mono">
                      {prod.category}
                    </span>
                    <h2 
                      onClick={() => handleOpenQuickView(prod)}
                      className="text-sm font-semibold text-[#2D302D] hover:text-[#8B9D83] cursor-pointer mt-0.5 line-clamp-1 transition-colors"
                    >
                      {prod.name}
                    </h2>
                    
                    {/* Stars review rating */}
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-[#D4A373] text-[#D4A373]" />
                      <span className="text-[11px] font-medium text-[#6B705C]">
                        {calculateRatingAverage(prod.reviews)}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        ({prod.reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      {hasDiscount ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[#2D302D] font-serif italic font-semibold text-sm">₹{finalPrice}</span>
                          <span className="text-xs text-gray-400 line-through">₹{prod.price}</span>
                        </div>
                      ) : (
                        <span className="text-[#2D302D] font-serif italic text-sm font-semibold">₹{prod.price}</span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleOpenQuickView(prod)}
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
      )}

      {/* QUICK VIEW / PRODUCT PANEL DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl relative border border-[#D4A373]/30 flex flex-col md:flex-row max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible">
            {/* Close button absolutely positioned */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white text-[#2D302D] border border-[#D4A373]/10 hover:bg-gray-100 z-10 transition-transform active:scale-95 shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Product Image Panel (Left) */}
            <div className="w-full md:w-1/2 relative bg-[#FAF9F6]">
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover pointer-events-none md:max-h-[500px]"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-md p-3 rounded-xl border border-white/20 select-none">
                <span className="text-[10px] text-[#6B705C] uppercase tracking-widest font-mono font-bold">Weight Specifications</span>
                <p className="text-xs font-semibold text-[#2D302D] italic mt-0.5">Approx {selectedProduct.weight} grams</p>
              </div>
            </div>

            {/* Product description & Interactive triggers (Right) */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between max-h-[520px] overflow-y-auto space-y-4">
              <div className="space-y-3">
                <span className="text-[10px] text-[#D4A373] uppercase tracking-wider font-mono font-bold block">
                  {selectedProduct.category}
                </span>
                <h2 className="text-xl font-serif italic text-[#2D302D] leading-snug">
                  {selectedProduct.name}
                </h2>
                
                {/* Cost specifications */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-serif italic font-semibold text-[#2D302D]">
                    ₹{Math.round(selectedProduct.price * (1 - selectedProduct.discount / 100))}
                  </span>
                  {selectedProduct.discount > 0 && (
                    <span className="text-xs text-gray-400 line-through">₹{selectedProduct.price}</span>
                  )}
                  <span className="text-[10px] text-[#6B705C]"> (Inclusive of GST)</span>
                </div>

                <p className="text-xs text-[#6B705C] leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Materials Bullet listing */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#2D302D] font-bold uppercase tracking-wider block">Premium Artisan Materials:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedProduct.materials.map((mat, i) => (
                      <span key={i} className="text-[9px] uppercase bg-white border border-[#D4A373]/20 text-[#6B705C] px-2.5 py-0.5 rounded-full font-medium">
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Custom text entry input if customizable product */}
                {selectedProduct.customization && (
                  <div className="p-3 bg-white/60 rounded-xl border border-[#D4A373]/20 shadow-xs space-y-1.5">
                    <label className="block text-[10px] text-[#2D302D] font-bold uppercase tracking-wider">
                      Personalization / Custom Engraving Detail:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Enter initials 'S & K' or name 'Sneha'"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white"
                    />
                    <span className="text-[9px] text-[#6B705C] block">Specify flower petal colors, leaf selections or name alphabets here.</span>
                  </div>
                )}

                {/* Quantity Control selector */}
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-[#2D302D] font-bold uppercase tracking-wide">Quantity:</span>
                  <div className="flex items-center border border-[#D4A373]/20 rounded-lg bg-white">
                    <button 
                      onClick={() => setBuyQuantity(q => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-xs select-none text-[#6B705C] transition-colors hover:bg-gray-50 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-[#2D302D]">{buyQuantity}</span>
                    <button 
                      onClick={() => setBuyQuantity(q => q + 1)}
                      className="px-2.5 py-1 text-xs select-none text-[#6B705C] transition-colors hover:bg-gray-50 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION TOGGLES FOOTER */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  {/* Add to Cart */}
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="flex-1 bg-white hover:bg-[#8B9D83]/10 text-[#8B9D83] border border-[#D4A373]/30 font-semibold py-2.5 px-4 rounded-full text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  {/* Buy Now checkout */}
                  <button
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="flex-1 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-semibold py-2.5 px-4 rounded-full text-xs uppercase tracking-widest transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Pay</span>
                  </button>
                </div>

                {/* WhatsApp Inquiry Link */}
                <a
                  href={`https://wa.me/918123445678?text=Hi%20VartU%20Creations!%20I'm%20very%20interested%20in%20inquiring%20about%20ordering%20${encodeURIComponent(selectedProduct.name)}%20(SKU:%20${selectedProduct.sku}).%20Can%20you%20guide%20me%20on%20designing%20with%20custom%20flower%20elements?`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#FAF9F6] text-[#2D302D] border border-[#d4a373]/30 hover:bg-[#8B9D83]/10 font-medium py-2 px-4 rounded-full text-xs transition-colors text-center flex items-center justify-center gap-1.5 uppercase tracking-wider animate-hover"
                >
                  <MessageCircle className="w-4 h-4 text-[#8B9D83]" />
                  <span>Consult directly on WhatsApp</span>
                </a>
              </div>

              {/* CUSTOMER REVIEWS & RATINGS SECTION */}
              <div className="border-t border-[#D4A373]/20 pt-5 mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D302D] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]" />
                    <span>Customer Trust & Reviews</span>
                  </h3>
                  <span className="text-[10px] bg-[#E9EDC9] text-[#6B705C] px-2.5 py-0.5 rounded-full font-mono font-medium">
                    {selectedProduct.reviews?.length || 0} reviews
                  </span>
                </div>

                {/* Rating Breakdown Dashboard card */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-[#D4A373]/10">
                  <div className="sm:col-span-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-[#D4A373]/10 pb-3 sm:pb-0 sm:pr-3 text-center">
                    <span className="text-3xl font-serif italic font-bold text-[#2D302D]">
                      {calculateRatingAverage(selectedProduct.reviews)}
                    </span>
                    <div className="flex gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const avg = Number(calculateRatingAverage(selectedProduct.reviews));
                        return (
                          <Star 
                            key={s} 
                            className={`w-3.5 h-3.5 ${s <= Math.round(avg) ? "fill-[#D4A373] text-[#D4A373]" : "text-gray-200"}`} 
                          />
                        );
                      })}
                    </div>
                    <span className="text-[9px] text-[#6B705C] font-mono">Out of 5 stars</span>
                  </div>

                  <div className="sm:col-span-8 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const totalReviews = selectedProduct.reviews?.length || 0;
                      const count = selectedProduct.reviews?.filter(r => Math.round(r.rating) === stars).length || 0;
                      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-[10px]">
                          <span className="w-10 shrink-0 font-mono text-[#6B705C] text-left">{stars} star</span>
                          <div className="flex-grow h-1.5 bg-[#FAF9F6] border border-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4A373] rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono text-[#6B705C]">{percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Existing Customer Reviews List */}
                <div className="space-y-3">
                  <span className="text-[10px] text-[#2D302D] font-bold uppercase tracking-wider block">Customer Experiences</span>
                  
                  {!selectedProduct.reviews || selectedProduct.reviews.length === 0 ? (
                    <div className="text-center py-6 bg-white/40 rounded-xl border border-dashed border-[#D4A373]/25 p-4">
                      <Star className="w-6 h-6 text-[#D4A373]/30 mx-auto mb-1.5" />
                      <p className="text-[11px] text-[#6B705C] italic">No reviews posted yet. Be the first to share your experience with this artisan piece!</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
                      {selectedProduct.reviews.map((rev) => (
                        <div key={rev.id} className="bg-white p-3 rounded-xl border border-[#D4A373]/15 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[#2D302D]">{rev.author}</span>
                              <span className="bg-[#E9EDC9] text-[#8B9D83] text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                Verified Buyer
                              </span>
                            </div>
                            <span className="text-[9px] text-[#6B705C] font-mono">{rev.date}</span>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={`w-3 h-3 ${s <= rev.rating ? "fill-[#D4A373] text-[#D4A373]" : "text-gray-200"}`} 
                              />
                            ))}
                          </div>
                          <p className="text-[#6B705C] text-[11px] leading-relaxed italic pr-2">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit New Review Form */}
                <form onSubmit={handleReviewSubmit} className="bg-white/60 p-4 rounded-xl border border-[#D4A373]/20 space-y-3 mt-4">
                  <span className="text-[10px] text-[#2D302D] font-bold uppercase tracking-wider block">
                    Write a Product Review
                  </span>
                  
                  {reviewSuccessMsg && (
                    <div className="p-2.5 bg-[#E9EDC9] text-[#6B705C] text-[10px] font-semibold rounded-lg border border-[#8B9D83] animate-pulse">
                      {reviewSuccessMsg}
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#6B705C] font-mono tracking-wider uppercase font-bold">Your Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-5 h-5 ${star <= reviewRating ? "fill-[#D4A373] text-[#D4A373]" : "text-gray-300"}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#6B705C] font-mono tracking-wider uppercase font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white text-[#2D302D]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] text-[#6B705C] font-mono tracking-wider uppercase font-bold">Your Comments</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Share your feedback about resin finish, flower selection or shipping experience..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8B9D83] bg-white text-[#2D302D]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-[#8B9D83] hover:bg-[#6B705C] text-white font-bold rounded-lg text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-xs active:scale-99"
                  >
                    Post Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
