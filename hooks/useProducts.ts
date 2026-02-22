"use client";

import { useState, useEffect, useCallback } from "react";
import { Category, Product } from "@/types";
import { getItem, setItem, KEYS } from "@/lib/storage";
import { DEFAULT_CATEGORIES, SEED_PRODUCTS } from "@/lib/seedData";
import { generateId } from "@/lib/utils";

function initializeData() {
  const seeded = getItem<boolean>(KEYS.SEEDED);
  if (!seeded) {
    setItem(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    const products: Product[] = SEED_PRODUCTS.map((p) => ({
      ...p,
      orderFrequency: 0,
    }));
    setItem(KEYS.PRODUCTS, products);
    setItem(KEYS.SEEDED, true);
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeData();
    const storedProducts = getItem<Product[]>(KEYS.PRODUCTS) ?? [];
    const storedCategories = getItem<Category[]>(KEYS.CATEGORIES) ?? [];
    setProducts(storedProducts);
    setCategories(storedCategories);
    setInitialized(true);
  }, []);

  const saveProducts = useCallback((updated: Product[]) => {
    setItem(KEYS.PRODUCTS, updated);
    setProducts(updated);
  }, []);

  const saveCategories = useCallback((updated: Category[]) => {
    setItem(KEYS.CATEGORIES, updated);
    setCategories(updated);
  }, []);

  const addProduct = useCallback(
    (data: Omit<Product, "id" | "orderFrequency">) => {
      const newProduct: Product = {
        ...data,
        id: generateId(),
        orderFrequency: 0,
      };
      const updated = [...products, newProduct];
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  const updateProduct = useCallback(
    (id: string, data: Partial<Omit<Product, "id">>) => {
      const updated = products.map((p) =>
        p.id === id ? { ...p, ...data } : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  const toggleActive = useCallback(
    (id: string) => {
      const updated = products.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  const incrementFrequency = useCallback(
    (productIds: string[]) => {
      const updated = products.map((p) =>
        productIds.includes(p.id)
          ? { ...p, orderFrequency: p.orderFrequency + 1 }
          : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  const addCategory = useCallback(
    (name: string) => {
      const id = name.toLowerCase().replace(/\s+/g, "-");
      if (categories.some((c) => c.id === id)) return;
      const newCat: Category = { id, name };
      const updated = [...categories, newCat];
      saveCategories(updated);
    },
    [categories, saveCategories]
  );

  const getProductsByCategory = useCallback(
    (categoryId: string) => {
      return products
        .filter((p) => p.categoryId === categoryId && p.active)
        .sort((a, b) => b.orderFrequency - a.orderFrequency);
    },
    [products]
  );

  return {
    products,
    categories,
    initialized,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
    incrementFrequency,
    addCategory,
    getProductsByCategory,
  };
}
