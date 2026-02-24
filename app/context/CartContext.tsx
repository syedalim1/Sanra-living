"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

/* ── TYPES ───────────────────────────────────────────────────── */
export interface CartItem {
    id: number;
    title: string;
    subtitle: string;
    finish: string;
    price: number;
    image: string;
    qty: number;
    stockQty: number;
}

interface CartState {
    items: CartItem[];
}

type CartAction =
    | { type: "ADD"; payload: CartItem }
    | { type: "REMOVE"; payload: { id: number; finish: string } }
    | { type: "UPDATE_QTY"; payload: { id: number; finish: string; qty: number } }
    | { type: "CLEAR" };

/* ── REDUCER ─────────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD": {
            const key = `${action.payload.id}-${action.payload.finish}`;
            const exists = state.items.find(
                (i) => `${i.id}-${i.finish}` === key
            );
            if (exists) {
                return {
                    items: state.items.map((i) =>
                        `${i.id}-${i.finish}` === key
                            ? { ...i, qty: Math.min(i.qty + action.payload.qty, i.stockQty) }
                            : i
                    ),
                };
            }
            return { items: [...state.items, action.payload] };
        }
        case "REMOVE":
            return {
                items: state.items.filter(
                    (i) => !(i.id === action.payload.id && i.finish === action.payload.finish)
                ),
            };
        case "UPDATE_QTY":
            return {
                items: state.items.map((i) =>
                    i.id === action.payload.id && i.finish === action.payload.finish
                        ? { ...i, qty: Math.max(1, Math.min(action.payload.qty, i.stockQty)) }
                        : i
                ),
            };
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}

/* ── CONTEXT ─────────────────────────────────────────────────── */
interface CartContextValue {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "sl_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
        if (typeof window === "undefined") return initial;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as CartState) : initial;
        } catch {
            return initial;
        }
    });

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

    return (
        <CartContext.Provider value={{ items: state.items, totalItems, subtotal, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
