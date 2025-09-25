import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";

export type Language = "en" | "ar";
export type OrderSource = "dine-in" | "takeaway" | "talabat" | "snoonu";

export interface CartItem {
  itemId: string;
  name: { en: string; ar: string };
  price: number;
  quantity: number;
  sizeId: string | null;
  sizeName: { en: string; ar: string } | null;
  modifiers: Array<{
    id: string;
    name: { en: string; ar: string };
    price: number;
  }>;
}

export interface POSState {
  language: Language;
  orderSource: OrderSource;
  tableNumber: number | null;
  cartItems: CartItem[];
}

type POSAction =
  | { type: "SET_LANGUAGE"; payload: Language }
  | { type: "SET_ORDER_SOURCE"; payload: OrderSource }
  | { type: "SET_TABLE_NUMBER"; payload: number | null }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "UPDATE_CART_ITEM_QUANTITY"; payload: { index: number; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "CLEAR_CART" };

// Get saved language preference or default to "en"
const getSavedLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferred-language');
    if (saved === 'en' || saved === 'ar') {
      return saved as Language;
    }
  }
  return 'en';
};

const initialState: POSState = {
  language: getSavedLanguage(),
  orderSource: "dine-in", 
  tableNumber: null,
  cartItems: [],
};

function posReducer(state: POSState, action: POSAction): POSState {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
      
    case "SET_ORDER_SOURCE":
      return { ...state, orderSource: action.payload };
      
    case "SET_TABLE_NUMBER":
      return { ...state, tableNumber: action.payload };
      
    case "ADD_TO_CART":
      return { ...state, cartItems: [...state.cartItems, action.payload] };
      
    case "UPDATE_CART_ITEM_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item, index) =>
          index === action.payload.index
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cartItems: state.cartItems.filter((_, index) => index !== action.payload),
      };
      
    case "CLEAR_CART":
      return { ...state, cartItems: [] };
      
    default:
      return state;
  }
}

const POSContext = createContext<{
  state: POSState;
  dispatch: React.Dispatch<POSAction>;
} | null>(null);

export function POSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(posReducer, initialState);

  // Set initial document direction and language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = state.language;
    }
  }, []);

  return React.createElement(
    POSContext.Provider,
    { value: { state, dispatch } },
    children
  );
}

export function usePOS() {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error("usePOS must be used within a POSProvider");
  }

  const { state, dispatch } = context;

  // Computed values
  const subtotal = state.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = subtotal * 0.1; // 10% service charge
  const total = subtotal + serviceCharge;

  // Actions
  const setLanguage = (language: Language) => {
    dispatch({ type: "SET_LANGUAGE", payload: language });
    // Store preference in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
    // Update document direction for RTL
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  };

  const setOrderSource = (source: OrderSource) => {
    dispatch({ type: "SET_ORDER_SOURCE", payload: source });
  };

  const setTableNumber = (tableNumber: number | null) => {
    dispatch({ type: "SET_TABLE_NUMBER", payload: tableNumber });
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const updateCartItemQuantity = (index: number, quantity: number) => {
    dispatch({ type: "UPDATE_CART_ITEM_QUANTITY", payload: { index, quantity } });
  };

  const removeFromCart = (index: number) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: index });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return {
    // State
    language: state.language,
    orderSource: state.orderSource,
    tableNumber: state.tableNumber,
    cartItems: state.cartItems,
    
    // Computed values
    subtotal,
    serviceCharge,
    total,
    
    // Actions
    setLanguage,
    setOrderSource,
    setTableNumber,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  };
}