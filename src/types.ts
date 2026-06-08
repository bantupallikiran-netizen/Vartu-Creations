export enum ProductCategory {
  RESIN_ART = "Resin Art",
  JEWELLERY = "Jewellery",
  HOME_DECOR = "Home Décor",
  CANDLES = "Candles",
  FESTIVE_COLLECTION = "Festive Collection",
  PERSONALIZED_GIFTS = "Personalized Gifts",
  CROCHET_PRODUCTS = "Crochet Products"
}

export enum OrderStatus {
  NEW = "New",
  CONFIRMED = "Confirmed",
  IN_PRODUCTION = "In Production",
  PACKED = "Packed",
  SHIPPED = "Shipped",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

export enum CustomOrderStatus {
  REQUESTED = "Requested",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  COMPLETED = "Completed"
}

export enum LeadSource {
  INSTAGRAM = "Instagram",
  FACEBOOK = "Facebook",
  WHATSAPP = "WhatsApp",
  EXPO = "Expo",
  WEBSITE = "Website"
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  price: number;
  discount: number; // Percentage
  images: string[];
  video?: string;
  stock: number;
  weight: number; // Grams
  description: string;
  materials: string[];
  customization: boolean;
  reviews: Review[];
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  customText?: string;
  imageAsset?: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  discountCode?: string;
  giftWrap: boolean;
  shippingCharges: number;
  status: OrderStatus;
  orderNotes?: string;
  customerDetails: CustomerDetails;
  paymentStatus: "Pending" | "Paid" | "Failed";
  createdAt: string;
  updatedAt: string;
}

export interface CustomOrder {
  id: string;
  userId: string;
  productType: string;
  customizationDetails: string;
  quantity: number;
  inspirationImage?: string; // Base64 or URL
  status: CustomOrderStatus;
  quotedPrice?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  category: "Resin" | "Pigments" | "MDF" | "Concrete Mix" | "Wax" | "Fragrance Oils" | "Packaging" | "Thread" | "Clay" | "Other";
  stockCount: number;
  unit: string; // e.g. "g", "ml", "pcs", "kg"
  lowStockThreshold: number;
  lastReplenished: string;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string; // YYYY-MM-DD
  anniversary?: string; // YYYY-MM-DD
  leadSource: LeadSource;
  purchaseCount: number;
  totalSpent: number;
  notes?: string;
  createdAt: string;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  date: string;
  price: number;
  image: string;
  attendees: {
    name: string;
    email: string;
    phone: string;
    tickets: number;
    paid: boolean;
  }[];
}

export interface SocialCalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  channel: "Instagram" | "Facebook" | "WhatsApp";
  theme: string;
  caption?: string;
  hashtags?: string;
  reelIdea?: string;
  status: "Planned" | "Posted";
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
  validUntil: string;
}
