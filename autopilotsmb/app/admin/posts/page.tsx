"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  featured: boolean;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  category: { id: string; name: string; slug: string } | null;
  tags: { id: string; name: string }[];
  author: { id: string; name: string | null };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const limit = 15;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        published: "all",
        ...(search ? { q: search } : {}),
      });
      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.pagination.total);
      setPages(data.pagination.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function togglePublish(post: Post) {
    setTogglingId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      await fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setTogglingId(null);
    }
  }

  async function deletePost(post: Post) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setDeletingId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      await fetchPosts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-zinc-400 text-sm mt-1">{total} posts total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* ── Search ── */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search posts…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="text-zinc-400 hover:text-white px-3 py-2 text-sm transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-lg font-medium text-zinc-400 mb-1">No posts found</p>
            <p className="text-sm">
              {search ? `No results for "${search}"` : "Create your first post to get started."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3 font-medium">Title</th>
                <th className="text-left px-6 py-3 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 font-medium hidden lg:table-cell">Status</th>
                <th className="text-right px-6 py-3 font-medium hidden lg:table-cell">Views</th>
                <th className="text-left px-6 py-3 font-medium hidden xl:table-cell">Date</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-800/50 transition-colors group">
                  {/* Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {post.featured && (
                        <Star className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                      )}
                      <div>
                        <p className="text-white text-sm font-medium line-clamp-1 max-w-xs">
                          {post.title}
                        </p>
                        <p className="text-zinc-500 text-xs mt-0.5 font-mono">/{post.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    {post.category ? (
                      <span className="text-xs bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded-full">
                        {post.category.name}
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-xs">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        post.published
                          ? "bg-green-900/30 text-green-400 border-green-800/50"
                          : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>

                  {/* Views */}
                  <td className="px-6 py-4 hidden lg:table-cell text-right">
                    <span className="text-zinc-400 text-sm tabular-nums">
                      {post.views.toLocaleString()}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <span className="text-zinc-500 text-xs">
                      {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Preview */}
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-700 transition-colors"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      {/* Toggle publish */}
                      <button
                        onClick={() => togglePublish(post)}
                        disabled={togglingId === post.id}
                        className="p-1.5 text-zinc-500 hover:text-blue-400 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {togglingId === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : post.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-1.5 text-zinc-500 hover:text-white rounded-md hover:bg-zinc-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => deletePost(post)}
                        disabled={deletingId === post.id}
                        className="p-1.5 text-zinc-500 hover:text-red-400 rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === post.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-medium tabular-nums">
              {page} / {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-1.5 rounded-md hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
