"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Package,
  DollarSign,
  Loader2,
  AlertTriangle,
  BookOpen,
  FileText,
  GraduationCap,
  Wrench,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  title: string;
  description: string;
  type: "EBOOK" | "TEMPLATE" | "COURSE" | "TOOLKIT";
  price: number;
  currency: string;
  coverImage: string | null;
  stripeProductId: string | null;
  stripePriceId: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
  _count?: { orders: number };
}

const TYPE_ICONS = {
  EBOOK: BookOpen,
  TEMPLATE: FileText,
  COURSE: GraduationCap,
  TOOLKIT: Wrench,
};

const TYPE_LABELS = {
  EBOOK: "eBook",
  TEMPLATE: "Template",
  COURSE: "Course",
  TOOLKIT: "Toolkit",
};

// ─── New Product Modal ────────────────────────────────────────────────────────

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Partial<Product> | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const isEdit = !!product?.id;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: product?.title ?? "",
    description: product?.description ?? "",
    type: product?.type ?? "EBOOK",
    price: product?.price ? (product.price / 100).toFixed(2) : "0.00",
    currency: product?.currency ?? "usd",
    coverImage: product?.coverImage ?? "",
    stripeProductId: product?.stripeProductId ?? "",
    stripePriceId: product?.stripePriceId ?? "",
    published: product?.published ?? false,
    featured: product?.featured ?? false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = {
      ...form,
      price: Math.round(parseFloat(form.price) * 100),
    };

    try {
      const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Failed to save");
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? "Edit Product" : "New Product"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as Product["type"] })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Price (USD)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={form.coverImage}
              onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
              placeholder="https://..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Stripe Product ID</label>
            <input
              type="text"
              value={form.stripeProductId}
              onChange={(e) => setForm({ ...form, stripeProductId: e.target.value })}
              placeholder="prod_..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Stripe Price ID</label>
            <input
              type="text"
              value={form.stripePriceId}
              onChange={(e) => setForm({ ...form, stripePriceId: e.target.value })}
              placeholder="price_..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="rounded border-zinc-600"
              />
              <span className="text-sm text-zinc-300">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-zinc-600"
              />
              <span className="text-sm text-zinc-300">Featured</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Partial<Product> | null | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.title}"?`)) return;
    setDeletingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Modal */}
      {modal !== undefined && (
        <ProductModal
          product={modal}
          onClose={() => setModal(undefined)}
          onSave={fetchProducts}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Digital Products</h1>
            <p className="text-zinc-400 text-sm mt-1">{products.length} products</p>
          </div>
          <button
            onClick={() => setModal(null)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Product
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl">
            <Package className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 font-medium">No products yet</p>
            <p className="text-zinc-600 text-sm mt-1">Create your first digital product to start selling.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => {
              const Icon = TYPE_ICONS[product.type];
              return (
                <div
                  key={product.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <span className="text-xs text-blue-400 font-medium">
                        {TYPE_LABELS[product.type]}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        product.published
                          ? "bg-green-900/30 text-green-400 border-green-800/50"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {product.published ? "Live" : "Draft"}
                    </span>
                  </div>

                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white font-bold">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span>{(product.price / 100).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {product.stripeProductId && (
                        <a
                          href={`https://dashboard.stripe.com/products/${product.stripeProductId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-700 transition-colors"
                          title="View in Stripe"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setModal(product)}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        disabled={deletingId === product.id}
                        className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === product.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
