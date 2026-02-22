import { Category, Product } from "@/types";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "starters", name: "Starters", isDefault: true },
  { id: "burger", name: "Burger", isDefault: true },
  { id: "hot", name: "Hot", isDefault: true },
  { id: "snacks", name: "Snacks", isDefault: true },
  { id: "fresh-cakes", name: "Fresh Cakes", isDefault: true },
  { id: "exotic-falooda", name: "Exotic Falooda", isDefault: true },
  { id: "asthanas-items", name: "Asthanas Items", isDefault: true },
  { id: "monster-shake", name: "Monster Shake", isDefault: true },
];

export const SEED_PRODUCTS: Omit<Product, "orderFrequency">[] = [
  // Starters
  { id: "p001", name: "French Fries", categoryId: "starters", price: 90, active: true },
  { id: "p002", name: "Chicken Nugget", categoryId: "starters", price: 120, active: true },
  { id: "p003", name: "Chicken Hot Dog", categoryId: "starters", price: 140, active: true },

  // Burger
  { id: "p004", name: "Chicken Burger", categoryId: "burger", price: 100, active: true },
  { id: "p005", name: "Veg Burger", categoryId: "burger", price: 80, active: true },
  { id: "p006", name: "Zinger Burger", categoryId: "burger", price: 100, active: true },
  { id: "p007", name: "French Fries Burger", categoryId: "burger", price: 80, active: true },
  { id: "p008", name: "Chicken 65 Burger", categoryId: "burger", price: 90, active: true },
  { id: "p009", name: "Double Chicken Burger", categoryId: "burger", price: 150, active: true },
  { id: "p010", name: "Chees Burger", categoryId: "burger", price: 80, active: true },
  { id: "p011", name: "Mega Zinger Burger", categoryId: "burger", price: 160, active: true },
  { id: "p012", name: "Nugget Burger", categoryId: "burger", price: 80, active: true },

  // Hot
  { id: "p013", name: "Tea", categoryId: "hot", price: 15, active: true },
  { id: "p014", name: "Coffee", categoryId: "hot", price: 20, active: true },
  { id: "p015", name: "Black Tea", categoryId: "hot", price: 10, active: true },
  { id: "p016", name: "Lemon Tea", categoryId: "hot", price: 15, active: true },
  { id: "p017", name: "Black Coffee", categoryId: "hot", price: 15, active: true },
  { id: "p018", name: "Boost", categoryId: "hot", price: 25, active: true },
  { id: "p019", name: "Horlicks", categoryId: "hot", price: 25, active: true },
  { id: "p020", name: "Masala Tea", categoryId: "hot", price: 25, active: true },
  { id: "p021", name: "Ginger Tea", categoryId: "hot", price: 25, active: true },
  { id: "p022", name: "Badam Milk", categoryId: "hot", price: 25, active: true },

  // Snacks
  { id: "p023", name: "Egg Puffs", categoryId: "snacks", price: 20, active: true },
  { id: "p024", name: "Veg Puffs", categoryId: "snacks", price: 15, active: true },
  { id: "p025", name: "Mashroom Puffs", categoryId: "snacks", price: 20, active: true },
  { id: "p026", name: "Chicken Roll", categoryId: "snacks", price: 25, active: true },
  { id: "p027", name: "Veg Roll", categoryId: "snacks", price: 20, active: true },
  { id: "p028", name: "Samosa", categoryId: "snacks", price: 15, active: true },

  // Fresh Cakes
  { id: "p029", name: "Black Forest", categoryId: "fresh-cakes", price: 49, active: true },
  { id: "p030", name: "White Forest", categoryId: "fresh-cakes", price: 49, active: true },
  { id: "p031", name: "Red Velvet", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p032", name: "Blueberry", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p033", name: "Butterscotch", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p034", name: "Choco Truffle", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p035", name: "Mango", categoryId: "fresh-cakes", price: 49, active: true },
  { id: "p036", name: "Cheese Mango", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p037", name: "Cheese Black Forest", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p038", name: "Cheese Red Velvet", categoryId: "fresh-cakes", price: 59, active: true },
  { id: "p039", name: "Cup Black Forest", categoryId: "fresh-cakes", price: 39, active: true },
  { id: "p040", name: "Cup Red Velvet", categoryId: "fresh-cakes", price: 49, active: true },
  { id: "p041", name: "Brownie", categoryId: "fresh-cakes", price: 29, active: true },

  // Exotic Falooda
  { id: "p042", name: "Normal Falooda", categoryId: "exotic-falooda", price: 100, active: true },
  { id: "p043", name: "Shalimar Falooda", categoryId: "exotic-falooda", price: 110, active: true },
  { id: "p044", name: "Volcano Falooda", categoryId: "exotic-falooda", price: 120, active: true },
  { id: "p045", name: "Chocolate Falooda", categoryId: "exotic-falooda", price: 130, active: true },
  { id: "p046", name: "Costel Falooda", categoryId: "exotic-falooda", price: 120, active: true },
  { id: "p047", name: "Mango Falooda", categoryId: "exotic-falooda", price: 110, active: true },
  { id: "p048", name: "Strawberry Falooda", categoryId: "exotic-falooda", price: 120, active: true },
  { id: "p049", name: "Fancy Falooda", categoryId: "exotic-falooda", price: 160, active: true },
  { id: "p050", name: "Burj Falooda", categoryId: "exotic-falooda", price: 150, active: true },
  { id: "p051", name: "Spl Thalassery Falooda", categoryId: "exotic-falooda", price: 220, active: true },

  // Asthanas Items
  { id: "p052", name: "Mexican Coffice Hake", categoryId: "asthanas-items", price: 110, active: true },
  { id: "p053", name: "Banan Strawboty", categoryId: "asthanas-items", price: 120, active: true },
  { id: "p054", name: "Avacado Milkth Nuts", categoryId: "asthanas-items", price: 120, active: true },
  { id: "p055", name: "Strawberry M With Nuts", categoryId: "asthanas-items", price: 120, active: true },
  { id: "p056", name: "Mazbooth", categoryId: "asthanas-items", price: 90, active: true },
  { id: "p057", name: "Abood", categoryId: "asthanas-items", price: 80, active: true },

  // Monster Shake
  { id: "p058", name: "Chocolate Monster", categoryId: "monster-shake", price: 160, active: true },
  { id: "p059", name: "Boost Mocha", categoryId: "monster-shake", price: 160, active: true },
  { id: "p060", name: "American Magic", categoryId: "monster-shake", price: 160, active: true },
  { id: "p061", name: "Italian Delight", categoryId: "monster-shake", price: 160, active: true },
  { id: "p062", name: "Oreo Monster", categoryId: "monster-shake", price: 160, active: true },
  { id: "p063", name: "Royal Red", categoryId: "monster-shake", price: 160, active: true },
  { id: "p064", name: "Kiwi Special", categoryId: "monster-shake", price: 160, active: true },
];
