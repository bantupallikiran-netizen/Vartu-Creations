import { Product, ProductCategory, RawMaterial, CRMLead, LeadSource, Workshop, SocialCalendarEvent, Order, OrderStatus } from "./types";

export const initialProducts: Product[] = [
  {
    id: "r-01",
    name: "Pressed Bridal Bloom Resin Tray",
    sku: "VAR-RES-TRY-001",
    category: ProductCategory.RESIN_ART,
    price: 3499,
    discount: 10,
    images: [
      "https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80"
    ],
    video: "",
    stock: 4,
    weight: 850,
    description: "Keep wedding bouquet memories alive forever. Beautiful, custom hand-poured high-gloss crystal resin tray, featuring real pressed country hydrangeas, eucalyptus, and delicate gold flakes. Bound in a polished raw wood border frame.",
    materials: ["Premium Epoxy Resin", "Bridal Pressed Flowers", "Gold Leafing", "MDF Wood Base Frame"],
    customization: true,
    reviews: [
      { id: "rev-1", author: "Sneha Reddy", rating: 5, comment: "Absolutely breathtaking! The flowers look so vibrant beneath the glass-like finish. Excellent craft by Lokeswari!", date: "2026-05-18" },
      { id: "rev-2", author: "Aman Sharma", rating: 4, comment: "Beautiful anniversary gift. Took a week but the packaging is safe and premium", date: "2026-06-01" }
    ]
  },
  {
    id: "r-02",
    name: "Golden Meadows Pressed Flower Pendant",
    sku: "VAR-RES-PEN-002",
    category: ProductCategory.JEWELLERY,
    price: 499,
    discount: 0,
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80"
    ],
    stock: 12,
    weight: 15,
    description: "An elegant teardrop bezel necklace encapsulating real dried mini daisies and baby's breath. Paired with a delicate 18k gold-plated chain to bring a breath of nature wherever you go.",
    materials: ["UV Resin", "Dried Daisy", "Teardrop Brass Bezel", "18k Gold Plated Chain"],
    customization: false,
    reviews: [
      { id: "rev-3", author: "Pritha Das", rating: 5, comment: "So tiny, delicate, and lovely! Got several compliments when wearing it.", date: "2026-05-24" }
    ]
  },
  {
    id: "r-03",
    name: "Personalized Resin Letter Bookmark",
    sku: "VAR-RES-BMK-003",
    category: ProductCategory.PERSONALIZED_GIFTS,
    price: 349,
    discount: 15,
    images: [
      "https://images.unsplash.com/photo-1601056639387-f5869487f16a?w=600&auto=format&fit=crop&q=80"
    ],
    stock: 25,
    weight: 45,
    description: "A gorgeous, custom-molded alphabet or monogram resin bookmark. Preserved with local Indian flora, shimmering sparkles, and accented with a beautiful rustic cream tassel.",
    materials: ["Epoxy Resin", "Pressed Forget-Me-Nots", "Glitter", "Silk Tassel"],
    customization: true,
    reviews: []
  },
  {
    id: "d-01",
    name: "Ribbed Terrazzo Trinket Tray",
    sku: "VAR-DEC-TRY-004",
    category: ProductCategory.HOME_DECOR,
    price: 799,
    discount: 5,
    images: [
      "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?w=600&auto=format&fit=crop&q=80"
    ],
    stock: 8,
    weight: 400,
    description: "Handcrafted from Jesmonite, this sculptural ribbed oval tray features colorful crushed mineral chips. Perfect for organising jewellery or displaying favorite perfumes.",
    materials: ["Jesmonite Base", "Mineral Coloring Oxides", "Water-resistant Sealer"],
    customization: true,
    reviews: [
      { id: "rev-4", author: "Dhivya Naidu", rating: 5, comment: "Heavy and feels super premium. Colors are very beautiful and minimalist.", date: "2026-06-03" }
    ]
  },
  {
    id: "c-01",
    name: "Matka Lavender Scented Wax Candle",
    sku: "VAR-CAN-MAT-005",
    category: ProductCategory.CANDLES,
    price: 549,
    discount: 0,
    images: [
      "https://images.unsplash.com/photo-1603006905393-01646df4f202?w=600&auto=format&fit=crop&q=80"
    ],
    stock: 15,
    weight: 250,
    description: "Hand-poured 100% natural organic soy wax inside a hand-painted terracotta Matka pot. Scented with calming pure French lavender essential oil and decorated with dried lavender sprigs.",
    materials: ["Organic Soy Wax", "French Lavender Essential Oil", "Natural Terracotta Pot", "Wooden Wick"],
    customization: false,
    reviews: []
  },
  {
    id: "f-01",
    name: "Artisanal Diya Return Gift Hamper",
    sku: "VAR-FES-HAM-006",
    category: ProductCategory.FESTIVE_COLLECTION,
    price: 1299,
    discount: 20,
    images: [
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?w=600&auto=format&fit=crop&q=80"
    ],
    stock: 30,
    weight: 1200,
    description: "An elegant festive return-gift hamper containing 4 beautiful hand-cast concrete tealight diyas, a micro Matka candle, and 2 mini dried-flower resin keychains. Ideal for housewarmings and Deepavali gifts.",
    materials: ["Concrete Mix", "Metallic Gold Accents", "Soy Wax", "Custom Gift Box Packaging"],
    customization: true,
    reviews: [
      { id: "rev-5", author: "Rajesh Kannan", rating: 5, comment: "Bought 10 hampers for our housewarming return gifts. The packaging Naveen did was fantastic and robust! All guests loved them.", date: "2026-05-30" }
    ]
  }
];

export const initialRawMaterials: RawMaterial[] = [
  { id: "m-1", name: "Premium Epoxy Resin", category: "Resin", stockCount: 1200, unit: "g", lowStockThreshold: 1500, lastReplenished: "2026-05-10" },
  { id: "m-2", name: "Floral Hardener Fluid", category: "Resin", stockCount: 1100, unit: "ml", lowStockThreshold: 1500, lastReplenished: "2026-05-10" },
  { id: "m-3", name: "Natural Organic Soy Wax Flakes", category: "Wax", stockCount: 4500, unit: "g", lowStockThreshold: 2000, lastReplenished: "2026-05-25" },
  { id: "m-4", name: "Jesmonite AC100 Composite Powder", category: "Concrete Mix", stockCount: 5000, unit: "g", lowStockThreshold: 3000, lastReplenished: "2026-05-15" },
  { id: "m-5", name: "Lavender & Bergamot Fragrance Oils", category: "Fragrance Oils", stockCount: 150, unit: "ml", lowStockThreshold: 200, lastReplenished: "2026-04-20" },
  { id: "m-6", name: "Artisanal Terracotta Matka Pots", category: "Packaging", stockCount: 18, unit: "pcs", lowStockThreshold: 25, lastReplenished: "2026-05-02" },
  { id: "m-7", name: "Gold Foil & Gilding Flakes", category: "Pigments", stockCount: 8, unit: "pcs", lowStockThreshold: 5, lastReplenished: "2026-05-12" },
  { id: "m-8", name: "Custom Rigid Gift Hampers Box", category: "Packaging", stockCount: 32, unit: "pcs", lowStockThreshold: 15, lastReplenished: "2026-05-22" }
];

export const initialCRMLeads: CRMLead[] = [
  {
    id: "l-1",
    name: "Sneha Reddy",
    email: "sneha.r@gmail.com",
    phone: "+91 98450 12345",
    birthday: "1994-08-12",
    anniversary: "2022-11-20",
    leadSource: LeadSource.INSTAGRAM,
    purchaseCount: 2,
    totalSpent: 4798,
    notes: "Prefers resin flower preservation. Keeps track of our reel guides closely.",
    createdAt: "2024-06-12"
  },
  {
    id: "l-2",
    name: "Rajesh Kannan",
    email: "rajesh.kan@yahoo.com",
    phone: "+91 81234 45678",
    birthday: "1988-04-15",
    leadSource: LeadSource.EXPO,
    purchaseCount: 1,
    totalSpent: 1299,
    notes: "Purchased bulk festive return gift hampers. Looking forward to corporate branding options.",
    createdAt: "2024-10-18"
  },
  {
    id: "l-3",
    name: "Komal Kapur",
    email: "komal.kap@gmail.com",
    phone: "+91 99001 22334",
    birthday: "1997-12-05",
    leadSource: LeadSource.WHATSAPP,
    purchaseCount: 0,
    totalSpent: 0,
    notes: "Inquired on custom resin pendants for wedding preserve. Potential hot lead.",
    createdAt: "2026-06-03"
  },
  {
    id: "l-4",
    name: "Shyam Jethwani",
    email: "s.jethwani@corporatesync.com",
    phone: "+91 97765 89012",
    leadSource: LeadSource.WEBSITE,
    purchaseCount: 3,
    totalSpent: 15400,
    notes: "Corporate accounts manager. Inquired on 150 customised wax candles for client hampers.",
    createdAt: "2025-01-20"
  }
];

export const initialWorkshops: Workshop[] = [
  {
    id: "w-1",
    title: "Eco-Friendly Dried Floral Resin Coaster Workshop",
    description: "Join Creative Dev Dharani in this interactive online session. Learn the fundamentals of floral composition, air bubble elimination, and UV resin finish while customizing your own pair of flower-preserved coasters.",
    date: "2026-06-20",
    price: 1500,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80",
    attendees: [
      { name: "Suresh Hegde", email: "suresh.h@gmail.com", phone: "90492-12492", tickets: 1, paid: true },
      { name: "Pooja Pillai", email: "pooja.p@yahoo.com", phone: "99049-14241", tickets: 2, paid: true }
    ]
  },
  {
    id: "w-2",
    title: "Terracotta Wax Pot Candle Making",
    description: "Conducted live by Lokeswari. Master soy wax melting temperature guides, essential oil ratio combinations, and paint a traditional Indian 'Matka' container. All kit materials shipped directly to your mailing address.",
    date: "2026-07-11",
    price: 1800,
    image: "https://images.unsplash.com/photo-1541462608141-2f58cdaee290?w=600&auto=format&fit=crop&q=80",
    attendees: [
      { name: "Sneha Reddy", email: "sneha.r@gmail.com", phone: "98450-12345", tickets: 1, paid: true }
    ]
  }
];

export const initialSocialCalendar: SocialCalendarEvent[] = [
  {
    id: "ev-1",
    date: "2026-06-09",
    channel: "Instagram",
    theme: "Process reel of Pressed Flower Bridal Tray setting",
    caption: "A sneak-peek into our weekend pour session! Watch how Lokeswari carefully embeds delicate country lilies and hydrangeas beneath our premium resin layer. Complete memory shield active! 🌸✨ Available to customize for your own marriage bouquet preservation. Link in bio!",
    hashtags: "#vartucreations #resinartwork #weddingpreservation #bridalflowerpreservation #keepsake",
    reelIdea: "Timelapse of crystal clear resin flooding golden leaves and real white hydrangeas with soothing ambient acoustic audio.",
    status: "Planned"
  },
  {
    id: "ev-2",
    date: "2026-06-12",
    channel: "WhatsApp",
    theme: "Launch of Monogram Resin alphabet bookmarks collection",
    caption: "Perfect gift for bookworms! 📖 Add a touch of organic forest beauty to your reader journey. Choose custom letters, gold sparkles, and a silk tassel color.",
    hashtags: "",
    reelIdea: "",
    status: "Planned"
  }
];

export const initialOrders: Order[] = [
  {
    id: "ORD-92041",
    userId: "user-1",
    items: [
      { productId: "r-01", name: "Pressed Bridal Bloom Resin Tray", price: 3499, quantity: 1 }
    ],
    total: 3149,
    discountCode: "WELCOME10",
    giftWrap: true,
    shippingCharges: 100,
    status: OrderStatus.IN_PRODUCTION,
    customerDetails: {
      name: "Sneha Reddy",
      email: "sneha.r@gmail.com",
      phone: "+91 98450 12345",
      address: "Flat 402, Lotus Grandur, Gachibowli, Hyderabad, Telangana - 500032"
    },
    paymentStatus: "Paid",
    createdAt: "2026-06-04T12:00:00Z",
    updatedAt: "2026-06-05T09:30:00Z"
  },
  {
    id: "ORD-92042",
    userId: "user-2",
    items: [
      { productId: "r-02", name: "Golden Meadows Pressed Flower Pendant", price: 499, quantity: 2 },
      { productId: "d-01", name: "Ribbed Terrazzo Trinket Tray", price: 799, quantity: 1 }
    ],
    total: 1797,
    giftWrap: false,
    shippingCharges: 0,
    status: OrderStatus.PACKED,
    customerDetails: {
      name: "Rajesh Kannan",
      email: "rajesh.kan@yahoo.com",
      phone: "+91 81234 45678",
      address: "12, 1st Cross, VGP layout, Uthandi, Chennai, Tamil Nadu - 600119"
    },
    paymentStatus: "Paid",
    createdAt: "2026-06-06T15:45:00Z",
    updatedAt: "2026-06-07T11:00:00Z"
  }
];
