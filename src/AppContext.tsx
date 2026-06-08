import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Product, ProductCategory, Order, OrderStatus, CustomOrder, CustomOrderStatus, 
  RawMaterial, CRMLead, LeadSource, Workshop, SocialCalendarEvent, OrderItem, CustomerDetails, Coupon 
} from "./types";
import { 
  initialProducts, initialRawMaterials, initialCRMLeads, initialWorkshops, 
  initialSocialCalendar, initialOrders 
} from "./seedData";
import { db, auth, useFirebase } from "./firebase";
import { 
  collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, addDoc, serverTimestamp 
} from "firebase/firestore";
import { 
  User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged 
} from "firebase/auth";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

// Global Firestore Error Handler
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  customOrders: CustomOrder[];
  rawMaterials: RawMaterial[];
  crmLeads: CRMLead[];
  workshops: Workshop[];
  socialCalendar: SocialCalendarEvent[];
  coupons: Coupon[];
  cart: OrderItem[];
  wishlist: string[];
  isFirebaseActive: boolean;
  currentUserRole: "Customer" | "Super Admin" | "Operations" | "Inventory Manager" | "Marketing";
  setCurrentUserRole: (role: "Customer" | "Super Admin" | "Operations" | "Inventory Manager" | "Marketing") => void;
  isLoading: boolean;
  firebaseUser: User | null;
  googleSignIn: () => Promise<void>;
  googleSignOut: () => Promise<void>;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number, customText?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Checkout & Order Actions
  placeOrder: (customerDetails: CustomerDetails, discountCode?: string, giftWrap?: boolean, notes?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  // Custom Order Quotes
  submitCustomOrder: (productType: string, details: string, qty: number, imageBase64?: string) => Promise<void>;
  respondToCustomOrder: (id: string, status: CustomOrderStatus, price?: number, adminNotes?: string) => Promise<void>;
  
  // Product Operations
  saveProduct: (product: Product) => Promise<void>;
  deleteProductById: (id: string) => Promise<void>;
  
  // Inventory Control
  saveRawMaterial: (material: RawMaterial) => Promise<void>;
  replenishMaterial: (id: string, count: number) => Promise<void>;
  
  // CRM Lead Registration
  registerNewLead: (lead: Omit<CRMLead, "id" | "createdAt">) => Promise<void>;
  saveLeadProfile: (lead: CRMLead) => Promise<void>;
  
  // Workshop Bookings
  bookWorkshopTicket: (workshopId: string, attendeeName: string, email: string, phone: string, ticketsCount: number) => Promise<void>;
  
  // Social Posting Actions
  saveSocialCalendarEvent: (event: SocialCalendarEvent) => Promise<void>;
  deleteSocialEvent: (id: string) => Promise<void>;
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const local = localStorage.getItem("vartu_products");
    return local ? JSON.parse(local) : initialProducts;
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const local = localStorage.getItem("vartu_orders");
    return local ? JSON.parse(local) : initialOrders;
  });

  const [customOrders, setCustomOrders] = useState<CustomOrder[]>(() => {
    const local = localStorage.getItem("vartu_custom_orders");
    return local ? JSON.parse(local) : [];
  });

  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>(() => {
    const local = localStorage.getItem("vartu_raw_materials");
    return local ? JSON.parse(local) : initialRawMaterials;
  });

  const [crmLeads, setCrmLeads] = useState<CRMLead[]>(() => {
    const local = localStorage.getItem("vartu_crm_leads");
    return local ? JSON.parse(local) : initialCRMLeads;
  });

  const [workshops, setWorkshops] = useState<Workshop[]>(() => {
    const local = localStorage.getItem("vartu_workshops");
    return local ? JSON.parse(local) : initialWorkshops;
  });

  const [socialCalendar, setSocialCalendar] = useState<SocialCalendarEvent[]>(() => {
    const local = localStorage.getItem("vartu_social_calendar");
    return local ? JSON.parse(local) : initialSocialCalendar;
  });

  const [coupons] = useState<Coupon[]>([
    { code: "WELCOME10", discountPercentage: 10, description: "10% Off on your first craft order!", validUntil: "2026-12-31" },
    { code: "FESTIVE20", discountPercentage: 20, description: "20% Off on Festive Collection!", validUntil: "2026-07-31" },
    { code: "HANDMADE", discountPercentage: 15, description: "Celebrating May 2024 Founding Anniversary", validUntil: "2026-06-30" }
  ]);

  const [cart, setCart] = useState<OrderItem[]>(() => {
    const local = localStorage.getItem("vartu_cart");
    return local ? JSON.parse(local) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const local = localStorage.getItem("vartu_wishlist");
    return local ? JSON.parse(local) : [];
  });

  const [currentUserRole, setCurrentUserRole] = useState<"Customer" | "Super Admin" | "Operations" | "Inventory Manager" | "Marketing">("Super Admin");
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  // Auto detect user state changes & automatically promote admin email to Super Admin role
  useEffect(() => {
    if (!useFirebase || !auth) return;
    return onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user?.email === "bantupallikiran@gmail.com") {
        setCurrentUserRole("Super Admin");
      }
    });
  }, []);

  const googleSignIn = async () => {
    if (!useFirebase || !auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign-in error: ", err);
    }
  };

  const googleSignOut = async () => {
    if (!useFirebase || !auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error: ", err);
    }
  };

  // Sync to localStorage as local mirror
  useEffect(() => {
    localStorage.setItem("vartu_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("vartu_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("vartu_custom_orders", JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem("vartu_raw_materials", JSON.stringify(rawMaterials));
  }, [rawMaterials]);

  useEffect(() => {
    localStorage.setItem("vartu_crm_leads", JSON.stringify(crmLeads));
  }, [crmLeads]);

  useEffect(() => {
    localStorage.setItem("vartu_workshops", JSON.stringify(workshops));
  }, [workshops]);

  useEffect(() => {
    localStorage.setItem("vartu_social_calendar", JSON.stringify(socialCalendar));
  }, [socialCalendar]);

  useEffect(() => {
    localStorage.setItem("vartu_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vartu_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Firebase Live Sync (On Snapshot) when db is initialized
  useEffect(() => {
    if (!useFirebase || !db) return;
    
    setIsLoading(true);
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const liveProducts: Product[] = [];
      snapshot.forEach(doc => liveProducts.push({ id: doc.id, ...doc.data() } as Product));
      if (liveProducts.length > 0) setProducts(liveProducts);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "products");
    });

    let unsubOrders = () => {};
    let unsubCustom = () => {};

    // Only subscribe to orders and custom orders in Firestore if the user is authenticated!
    if (firebaseUser) {
      unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
        const liveOrders: Order[] = [];
        snapshot.forEach(doc => liveOrders.push(doc.data() as Order));
        if (liveOrders.length > 0) setOrders(liveOrders);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, "orders");
      });

      unsubCustom = onSnapshot(collection(db, "customOrders"), (snapshot) => {
        const liveCustom: CustomOrder[] = [];
        snapshot.forEach(doc => liveCustom.push(doc.data() as CustomOrder));
        if (liveCustom.length > 0) setCustomOrders(liveCustom);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, "customOrders");
      });
    } else {
      // If oflline or guest, keep existing/simulated Local Storage states
      console.log("ℹ️ Guest mode: utilizing local storage caching for orders & custom quote requests.");
    }

    return () => {
      unsubProducts();
      unsubOrders();
      unsubCustom();
    };
  }, [firebaseUser]);

  // CART ACTIONS
  const addToCart = (product: Product, quantity = 1, customText?: string) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.productId === product.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        if (customText) copy[existingIdx].customText = customText;
        return copy;
      } else {
        return [...prev, {
          productId: product.id,
          name: product.name,
          price: Math.round(product.price * (1 - product.discount / 100)),
          quantity,
          customText
        }];
      }
    });

    // Mirror to CRM leads as interest
    setCrmLeads(prev => prev.map(lead => {
      if (lead.email === "sneha.r@gmail.com") { // Default simulation user
        return { ...lead, notes: `${lead.notes || ""}\n- Added "${product.name}" to cart.` };
      }
      return lead;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
    }
  };

  const clearCart = () => setCart([]);

  // CHECKOUT & PLACE ORDER
  const placeOrder = async (customerDetails: CustomerDetails, discountCode?: string, giftWrap = false, notes?: string): Promise<Order> => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const couponObj = coupons.find(c => c.code.toUpperCase() === discountCode?.toUpperCase());
    const discountAmount = couponObj ? (subtotal * couponObj.discountPercentage / 100) : 0;
    const shipping = subtotal > 1500 ? 0 : 70;
    const wrapping = giftWrap ? 50 : 0;
    const finalTotal = Math.round(subtotal - discountAmount + shipping + wrapping);

    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: auth?.currentUser?.uid || "guest-customer",
      items: [...cart],
      total: finalTotal,
      discountCode,
      giftWrap,
      shippingCharges: shipping,
      status: OrderStatus.NEW,
      orderNotes: notes,
      customerDetails,
      paymentStatus: "Paid", // Simulated instant Checkout trigger
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update Local Registry
    setOrders(prev => [newOrder, ...prev]);

    // Firestore Integration if online
    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "orders", newOrder.id), newOrder);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `orders/${newOrder.id}`);
      }
    }

    // Deduct stock of products bought & decrease material counts slightly
    setProducts(prev => {
      return prev.map(prod => {
        const cartItem = cart.find(item => item.productId === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      });
    });

    // Deduct stock of Raw Materials to represent crafting depletion
    setRawMaterials(prev => {
      return prev.map(material => {
        // Resin products deplete resin, wax products deplete wax
        let depletion = 0;
        cart.forEach(item => {
          const itemCategory = item.name.toLowerCase();
          if (itemCategory.includes("resin") || itemCategory.includes("pendant")) {
            if (material.category === "Resin") depletion += (200 * item.quantity);
          } else if (itemCategory.includes("candle") || itemCategory.includes("wax")) {
            if (material.category === "Wax") depletion += (250 * item.quantity);
          }
        });
        if (depletion > 0) {
          return { ...material, stockCount: Math.max(0, material.stockCount - depletion) };
        }
        return material;
      });
    });

    // Append to CRM history
    setCrmLeads(prev => {
      const match = prev.find(l => l.email === customerDetails.email);
      if (match) {
        return prev.map(l => l.email === customerDetails.email ? {
          ...l,
          purchaseCount: l.purchaseCount + 1,
          totalSpent: l.totalSpent + finalTotal,
          notes: `${l.notes || ""}\n- Placed Order ${newOrder.id} (${newOrder.items.length} items)`
        } : l);
      } else {
        const newLead: CRMLead = {
          id: `lead-${Math.floor(Math.random() * 10000)}`,
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          leadSource: LeadSource.WEBSITE,
          purchaseCount: 1,
          totalSpent: finalTotal,
          notes: `First order placement. Address: ${customerDetails.address}`,
          createdAt: new Date().toISOString()
        };
        return [...prev, newLead];
      }
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    
    if (useFirebase && db) {
      try {
        await updateDoc(doc(db, "orders", orderId), { 
          status, 
          updatedAt: new Date().toISOString() 
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    }
  };

  // CUSTOM ORDERS MODULE
  const submitCustomOrder = async (productType: string, details: string, qty: number, imageBase64?: string) => {
    const newRequest: CustomOrder = {
      id: `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: auth?.currentUser?.uid || "guest",
      productType,
      customizationDetails: details,
      quantity: qty,
      inspirationImage: imageBase64 || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300",
      status: CustomOrderStatus.REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setCustomOrders(prev => [newRequest, ...prev]);

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "customOrders", newRequest.id), newRequest);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `customOrders/${newRequest.id}`);
      }
    }

    // Capture customized request as a lead profiling interest
    setCrmLeads(prev => {
      return prev.map(lead => {
        if (lead.email === "sneha.r@gmail.com") {
          return {
            ...lead,
            notes: `${lead.notes || ""}\n- Requested Custom Quote: ${productType} x ${qty} pcs`
          };
        }
        return lead;
      });
    });
  };

  const respondToCustomOrder = async (id: string, status: CustomOrderStatus, price?: number, adminNotes?: string) => {
    setCustomOrders(prev => prev.map(o => o.id === id ? { 
      ...o, 
      status, 
      quotedPrice: price, 
      notes: adminNotes, 
      updatedAt: new Date().toISOString() 
    } : o));

    if (useFirebase && db) {
      try {
        await updateDoc(doc(db, "customOrders", id), {
          status,
          quotedPrice: price,
          notes: adminNotes,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `customOrders/${id}`);
      }
    }
  };

  // PRODUCT MANAGEMENT
  const saveProduct = async (product: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      } else {
        return [product, ...prev];
      }
    });

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "products", product.id), product);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `products/${product.id}`);
      }
    }
  };

  const deleteProductById = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    
    if (useFirebase && db) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
      }
    }
  };

  // INVENTORY OPERATIONS
  const saveRawMaterial = async (material: RawMaterial) => {
    setRawMaterials(prev => {
      const idx = prev.findIndex(m => m.id === material.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = material;
        return copy;
      } else {
        return [...prev, material];
      }
    });

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "rawMaterials", material.id), material);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `rawMaterials/${material.id}`);
      }
    }
  };

  const replenishMaterial = async (id: string, count: number) => {
    setRawMaterials(prev => prev.map(m => m.id === id ? { 
      ...m, 
      stockCount: m.stockCount + count, 
      lastReplenished: new Date().toISOString().split("T")[0] 
    } : m));

    if (useFirebase && db) {
      try {
        await updateDoc(doc(db, "rawMaterials", id), {
          stockCount: serverTimestamp(), // Represents a remote update in real-time
          lastReplenished: new Date().toISOString().split("T")[0]
        });
      } catch (err) {
        console.warn("replenish material online bypassed, using local memory update");
      }
    }
  };

  // CRM LEAD RECORDING
  const registerNewLead = async (lead: Omit<CRMLead, "id" | "createdAt">) => {
    const fullLead: CRMLead = {
      ...lead,
      id: `lead-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setCrmLeads(prev => [...prev, fullLead]);

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "crmLeads", fullLead.id), fullLead);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `crmLeads/${fullLead.id}`);
      }
    }
  };

  const saveLeadProfile = async (lead: CRMLead) => {
    setCrmLeads(prev => prev.map(l => l.id === lead.id ? lead : l));

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "crmLeads", lead.id), lead);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `crmLeads/${lead.id}`);
      }
    }
  };

  // WORKSHOPS BOOKING
  const bookWorkshopTicket = async (workshopId: string, attendeeName: string, email: string, phone: string, ticketsCount: number) => {
    setWorkshops(prev => prev.map(ws => {
      if (ws.id === workshopId) {
        return {
          ...ws,
          attendees: [...ws.attendees, { name: attendeeName, email, phone, tickets: ticketsCount, paid: true }]
        };
      }
      return ws;
    }));

    // Register active attendee as an marketing lead
    setCrmLeads(prev => {
      const match = prev.find(l => l.email === email);
      if (match) {
        return prev.map(l => l.email === email ? {
          ...l,
          notes: `${l.notes || ""}\n- Booked ${ticketsCount} ticket(s) for Workshop [${workshopId}]`
        } : l);
      } else {
        return [...prev, {
          id: `lead-${Math.floor(Math.random() * 10000)}`,
          name: attendeeName,
          email,
          phone,
          leadSource: LeadSource.WEBSITE,
          purchaseCount: 0,
          totalSpent: 0,
          notes: `Registered for Workshop in-person.`,
          createdAt: new Date().toISOString()
        }];
      }
    });

    if (useFirebase && db) {
      try {
        const item = workshops.find(w => w.id === workshopId);
        if (item) {
          await setDoc(doc(db, "workshops", workshopId), {
            ...item,
            attendees: [...item.attendees, { name: attendeeName, email, phone, tickets: ticketsCount, paid: true }]
          });
        }
      } catch (err) {
        console.warn("Workshop sync bypassed online, utilizing LocalStorage sync state.");
      }
    }
  };

  // SOCIAL MEDIA POST CALENDAR
  const saveSocialCalendarEvent = async (event: SocialCalendarEvent) => {
    setSocialCalendar(prev => {
      const idx = prev.findIndex(item => item.id === event.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = event;
        return copy;
      } else {
        return [...prev, event];
      }
    });

    if (useFirebase && db) {
      try {
        await setDoc(doc(db, "socialCalendar", event.id), event);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `socialCalendar/${event.id}`);
      }
    }
  };

  const deleteSocialEvent = async (id: string) => {
    setSocialCalendar(prev => prev.filter(item => item.id !== id));
    
    if (useFirebase && db) {
      try {
        await deleteDoc(doc(db, "socialCalendar", id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `socialCalendar/${id}`);
      }
    }
  };

  // WISHLIST TOGGLE
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  return (
    <AppContext.Provider value={{
      products, orders, customOrders, rawMaterials, crmLeads, workshops, socialCalendar, coupons, cart, wishlist,
      isFirebaseActive: useFirebase,
      currentUserRole, setCurrentUserRole, isLoading,
      firebaseUser, googleSignIn, googleSignOut,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus,
      submitCustomOrder, respondToCustomOrder,
      saveProduct, deleteProductById,
      saveRawMaterial, replenishMaterial,
      registerNewLead, saveLeadProfile,
      bookWorkshopTicket,
      saveSocialCalendarEvent, deleteSocialEvent,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside an AppProvider context block");
  }
  return context;
};
