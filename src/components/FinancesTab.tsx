import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { useApp, formatCurrency } from "../context/AppContext";
import {
  Coins, TrendUp, TrendDown, PiggyBank, Plus, PencilSimple, Trash,
  MagnifyingGlass, Funnel, X, Calendar, Check, ArrowRight, Wallet,
} from "@phosphor-icons/react";
import type { Database } from "../integrations/supabase/types";

type Transaction = Database["public"]["Tables"]["financial_transactions"]["Row"];
type TransactionInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];

const CATEGORIES_INCOME = ["Crop Sales", "Livestock Sales", "Dairy Products", "Eggs", "Honey", "Processed Goods", "Rental Income", "Subsidies", "Other Income"];
const CATEGORIES_EXPENSE = ["Seeds", "Fertilizer", "Pesticides", "Labor", "Equipment", "Irrigation", "Transport", "Storage", "Land Lease", "Utilities", "Veterinary", "Feed", "Maintenance", "Taxes", "Insurance", "Other Expense"];

export default function FinancesTab() {
  const { currency, session } = useApp();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [dateFilter, setDateFilter] = useState<"all" | "month" | "year">("all");
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ type: "income", amount: 0, category: "", transaction_date: "", description: "" });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let query = supabase.from("financial_transactions").select("*").order("transaction_date", { ascending: false });
      if (session?.user?.id) query = query.eq("user_id", session.user.id);
      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, [session?.user?.id]);

  const resetForm = () => setForm({ type: "income", amount: 0, category: "", transaction_date: new Date().toISOString().split("T")[0], description: "" });

  const openAdd = () => { resetForm(); setEditTx(null); setShowModal(true); };
  const openEdit = (tx: Transaction) => {
    setEditTx(tx);
    setForm({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      transaction_date: tx.transaction_date,
      description: tx.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.amount || form.amount <= 0) { toast.error("Amount must be greater than 0"); return; }
    if (!form.category.trim()) { toast.error("Please select a category"); return; }
    try {
      const payload: TransactionInsert = {
        type: form.type,
        amount: form.amount,
        category: form.category,
        transaction_date: form.transaction_date || new Date().toISOString().split("T")[0],
        description: form.description || null,
        user_id: session?.user?.id || null,
      };

      if (editTx) {
        const { data, error } = await supabase.from("financial_transactions").update(payload).eq("id", editTx.id).select().single();
        if (error) throw error;
        setTransactions(prev => prev.map(t => t.id === editTx.id ? data : t));
        toast.success("Transaction updated");
      } else {
        const { data, error } = await supabase.from("financial_transactions").insert(payload).select().single();
        if (error) throw error;
        setTransactions(prev => [data, ...prev]);
        toast.success("Transaction added");
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { error } = await supabase.from("financial_transactions").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setTransactions(prev => prev.filter(t => t.id !== deleteTarget.id));
      toast.success("Transaction deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const filtered = useMemo(() => {
    let list = transactions;
    if (typeFilter !== "all") list = list.filter(t => t.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.category.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q));
    }
    if (dateFilter === "month") {
      const now = new Date();
      list = list.filter(t => {
        const d = new Date(t.transaction_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (dateFilter === "year") {
      const year = new Date().getFullYear();
      list = list.filter(t => new Date(t.transaction_date).getFullYear() === year);
    }
    return list;
  }, [transactions, typeFilter, search, dateFilter]);

  const summary = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
    return { totalIncome: income, totalExpenses: expense, netProfit: income - expense };
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Coins size={22} weight="fill" className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Finance Management</h2>
            <p className="text-sm text-stone-500">{transactions.length} transactions tracked</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus size={18} weight="bold" />
          Add Transaction
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={TrendUp}
          label="Total Income"
          value={formatCurrency(summary.totalIncome, currency)}
          sub="All transactions"
          color="emerald"
          delay={0}
        />
        <SummaryCard
          icon={TrendDown}
          label="Total Expenses"
          value={formatCurrency(summary.totalExpenses, currency)}
          sub="All transactions"
          color="rose"
          delay={0.05}
        />
        <SummaryCard
          icon={PiggyBank}
          label="Net Profit"
          value={formatCurrency(summary.netProfit, currency)}
          sub={summary.totalIncome > 0 ? `${((summary.netProfit / summary.totalIncome) * 100).toFixed(1)}% margin` : "No income yet"}
          color={summary.netProfit >= 0 ? "emerald" : "rose"}
          delay={0.1}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by category or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-9 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
          />
        </div>
        <div className="flex gap-1.5 rounded-xl bg-stone-100 p-1">
          {(["all", "income", "expense"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                typeFilter === t ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {t === "all" ? "All" : t === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>
        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value as any)}
          className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-stone-100" />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-200 bg-white py-16 text-center"
        >
          <Wallet size={48} weight="thin" className="mx-auto mb-3 text-stone-300" />
          <p className="font-medium text-stone-500">
            {search || typeFilter !== "all" || dateFilter !== "all"
              ? "No matching transactions found"
              : "No transactions yet. Add your first one!"}
          </p>
          {!search && typeFilter === "all" && dateFilter === "all" && (
            <button onClick={openAdd} className="mt-3 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              + Add Transaction
            </button>
          )}
        </motion.div>
      )}

      {/* Table */}
      {!loading && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-stone-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-600">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-600">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-stone-600">Description</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-600">Amount</th>
                  <th className="px-4 py-3 text-right font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02, duration: 0.2 }}
                    className="border-b border-stone-50 transition-colors hover:bg-stone-50/50"
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                        tx.type === "income"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}>
                        {tx.type === "income" ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                        {tx.type === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-800">{tx.category}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-stone-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-stone-400" />
                        {new Date(tx.transaction_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-stone-500">{tx.description || "—"}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${
                      tx.type === "income" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      {formatCurrency(Number(tx.amount), currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(tx)}
                          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                          title="Edit"
                        >
                          <PencilSimple size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
                <h3 className="text-base font-bold text-stone-800">{editTx ? "Edit Transaction" : "Add Transaction"}</h3>
                <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-stone-400 hover:bg-stone-100">
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
                {/* Type toggle */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Type</label>
                  <div className="flex gap-1.5 rounded-xl bg-stone-100 p-1">
                    {(["income", "expense"] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setForm(p => ({ ...p, type: t, category: "" }))}
                        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                          form.type === t
                            ? t === "income"
                              ? "bg-emerald-500 text-white shadow-sm"
                              : "bg-rose-500 text-white shadow-sm"
                            : "text-stone-500 hover:text-stone-700"
                        }`}
                      >
                        {t === "income" ? "Income" : "Expense"}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  >
                    <option value="">Select a category</option>
                    {(form.type === "income" ? CATEGORIES_INCOME : CATEGORIES_EXPENSE).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                {/* Amount */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Amount *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount || ""}
                    onChange={e => setForm(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Date</label>
                  <input
                    type="date"
                    value={form.transaction_date}
                    onChange={e => setForm(p => ({ ...p, transaction_date: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-stone-500">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Optional notes..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-stone-100 bg-stone-50/50 px-5 py-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
                >
                  {editTx ? "Save Changes" : "Add Transaction"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash size={24} className="text-red-500" />
              </div>
              <h3 className="mb-1 text-lg font-bold text-stone-800">Delete Transaction?</h3>
              <p className="mb-6 text-sm text-stone-500">
                Are you sure you want to delete this <span className="font-semibold text-stone-700">{deleteTarget.category}</span> transaction? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-sm font-medium text-stone-600 transition-colors hover:text-stone-800"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── SummaryCard ─── */
function SummaryCard({ icon: Icon, label, value, sub, color, delay }: {
  icon: React.ElementType; label: string; value: string; sub: string; color: string; delay: number;
}) {
  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    rose: "from-rose-500 to-rose-600",
  };
  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    rose: "bg-rose-100 text-rose-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl border border-stone-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className={`absolute right-0 top-0 h-20 w-20 translate-x-4 -translate-y-4 rounded-full bg-gradient-to-br ${colorMap[color] || colorMap.emerald} opacity-10`} />
      <div className="flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bgMap[color] || bgMap.emerald}`}>
          <Icon className="h-5 w-5" weight="fill" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-extrabold tracking-tight text-stone-900">{value}</div>
        <div className="mt-1 text-sm font-semibold text-stone-700">{label}</div>
        <div className="mt-0.5 text-xs text-stone-400">{sub}</div>
      </div>
    </motion.div>
  );
}