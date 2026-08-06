import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plant, Cow, Warning, Calendar, Plus, Trash, X, Check,
  ArrowUp, ArrowDown, Sparkle,
  SquaresFour,
  Info, Question, Pencil,
  ChartBar, ChartLine, ChartPie, PiggyBank,
  MagnifyingGlass, ArrowUpRight,
  TrendUp, TrendDown, Gauge, Bell, Swap, Funnel, ChartBarHorizontal,
  CirclesFour, List, Eye, EyeSlash, PencilSimple,
  Tractor, PlusCircle, HandCoins, CurrencyNgn, ShoppingCart,
  Clock, ArrowCircleRight, ListBullets, Needle,
  Cloud, Sun, Drop, Wind,
  FileText, Download,
} from "@phosphor-icons/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, ReferenceLine,
} from "recharts";
import { cn } from "../lib/utils";
import { useApp, formatCurrency, genId, growthColor, healthColor, SeverityIcon, severityColor, growthProgress, fetchCrops, addCrop, updateCrop, deleteCrop } from "../context/AppContext";
import { NIGERIAN_FARM_DATA, MONTHLY_FINANCIALS, formatMoney } from "../constants";
import type { IconWeight } from "@phosphor-icons/react";
import type { CropRecord } from "../types";

/* ─── StatCard ─── */
function StatCard({ icon: Icon, label, value, sub, trend, color = "emerald", delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trend?: { dir: "up" | "down"; pct: string }; color?: string; delay?: number;
}) {
  const colorMap: Record<string, string> = {
    emerald: "from-emerald-500 to-emerald-600",
    blue: "from-blue-500 to-blue-600",
    amber: "from-amber-500 to-amber-600",
    violet: "from-violet-500 to-violet-600",
    rose: "from-rose-500 to-rose-600",
    cyan: "from-cyan-500 to-cyan-600",
    orange: "from-orange-500 to-orange-600",
  };
  const shadowMap: Record<string, string> = {
    emerald: "shadow-emerald-200/50",
    blue: "shadow-blue-200/50",
    amber: "shadow-amber-200/50",
    violet: "shadow-violet-200/50",
    rose: "shadow-rose-200/50",
    cyan: "shadow-cyan-200/50",
    orange: "shadow-orange-200/50",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg",
        "border border-stone-100 hover:shadow-xl transition-shadow duration-300",
        shadowMap[color] || "shadow-stone-200/50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl",
          `bg-${color}-50 text-${color}-600`
        )}>
          <Icon className="w-5 h-5" weight="fill" />
        </div>
        {trend && (
          <span className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
            trend.dir === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trend.dir === "up" ? <ArrowUp className="w-3 h-3" weight="bold" /> : <ArrowDown className="w-3 h-3" weight="bold" />}
            {trend.pct}
          </span>
        )}
      </div>
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

/* ─── Health Gauge ─── */
function HealthGauge({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const status = score >= 80 ? "Optimal" : score >= 60 ? "Fair" : "Critical";
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e7e5e4" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center mt-2">
        <span className="text-3xl font-bold text-stone-900">{score}</span>
        <span className="text-xs font-medium" style={{ color }}>/100</span>
      </div>
      <span className="mt-1 text-sm font-semibold" style={{ color }}>
        {status}
      </span>
    </div>
  );
}

/* ─── AI Alert Card ─── */
function AIAlertCard({ alert, delay = 0 }: {
  alert: { id: string; severity: string; title: string; detail: string; date: string };
  delay?: number;
}) {
  const severityStyles: Record<string, { dot: string; bg: string; label: string; icon: React.ElementType }> = {
    high: { dot: "bg-rose-500", bg: "bg-rose-50 border-rose-100", label: "High", icon: Warning },
    medium: { dot: "bg-amber-500", bg: "bg-amber-50 border-amber-100", label: "Medium", icon: Warning },
    info: { dot: "bg-blue-500", bg: "bg-blue-50 border-blue-100", label: "Info", icon: Info },
  };
  const s = severityStyles[alert.severity] || severityStyles.info;
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className={cn("flex gap-3 p-3 rounded-xl border", s.bg)}
    >
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", s.bg)}>
        <Icon className={cn("w-4 h-4", s.dot.replace("bg-", "text-"))} weight="fill" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: s.dot.replace("bg-", "#") }}>
            {s.label}
          </span>
          <span className="text-xs text-stone-400 ml-auto">{alert.date}</span>
        </div>
        <p className="text-sm font-semibold text-stone-800 mt-1">{alert.title}</p>
        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{alert.detail}</p>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard Tab ─── */
export function DashboardTab() {
  const { currency, setCurrency, setActiveTab } = useApp();
  const data = NIGERIAN_FARM_DATA;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalCrops = data.crops?.length || 0;
  const totalHectares = data.crops?.reduce((a: number, c: any) => a + (c.hectares || 0), 0) || 0;
  const totalLivestock = data.livestock?.reduce((a: number, l: any) => a + (l.count || 0), 0) || 0;

  const income = formatMoney(data.totalIncomeNgn || 0, currency);
  const expenses = formatMoney(data.totalExpensesNgn || 0, currency);
  const netProfit = formatMoney(data.netProfitNgn || 0, currency);
  const netPct = data.totalIncomeNgn && data.totalExpensesNgn
    ? (((data.netProfitNgn || 0) / data.totalExpensesNgn) * 100).toFixed(1)
    : "0";

  const monthlyData = MONTHLY_FINANCIALS?.map((m: any) => ({
    month: m.month,
    income: currency === "USD" ? Math.round(m.incomeNgn / 1550) : m.incomeNgn,
    expenses: currency === "USD" ? Math.round(m.expensesNgn / 1550) : m.expensesNgn,
  })) || [];

  const cropData = data.crops?.map((c: any) => ({ name: c.name.split("(")[0].trim(), hectares: c.hectares })) || [];
  const CROP_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* ─── Header Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-emerald-500" weight="fill" />
            AgriTrack AI Dashboard
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Nigeria · Oyo/Ogun Model Farm — Real-time farm intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-stone-200">
          <button
            onClick={() => setCurrency("NGN")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              currency === "NGN"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            ₦ NGN
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              currency === "USD"
                ? "bg-blue-500 text-white shadow-md shadow-blue-200"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            $ USD
          </button>
          <Swap className="w-4 h-4 text-stone-400 mx-1" weight="bold" />
        </div>
      </motion.div>

      {/* ─── Quick Action Bar ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" as const }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {([
          { icon: PlusCircle, label: "Add Crop", tab: "crops" as const, color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
          { icon: Cow, label: "Add Livestock", tab: "crops" as const, color: "text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200" },
          { icon: HandCoins, label: "Record Income", tab: "crops" as const, color: "text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200" },
          { icon: Warning, label: "Record Expense", tab: "crops" as const, color: "text-rose-600 bg-rose-50 hover:bg-rose-100 border-rose-200" },
        ] as const).map((action, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(action.tab)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border ${action.color} transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md`}
          >
            <action.icon className="w-5 h-5 flex-shrink-0" weight="fill" />
            <span>{action.label}</span>
          </button>
        ))}
      </motion.div>

      {/* ─── Stat Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={Plant} label="Total Crops" value={`${totalCrops} Varieties`} sub={`${totalHectares} Hectares`} color="emerald" delay={0} />
        <StatCard icon={Cow} label="Total Livestock" value={`${totalLivestock.toLocaleString()} Head`} sub="4 Production Units" color="blue" delay={0.05} />
        <StatCard icon={TrendUp} label="Total Income" value={income} sub="Year to Date" trend={{ dir: "up", pct: "+14.2%" }} color="emerald" delay={0.1} />
        <StatCard icon={TrendDown} label="Total Expenses" value={expenses} sub="Feed, Fertilizer, Labor, Transport" color="rose" delay={0.15} />
        <StatCard icon={PiggyBank} label="Net Profit" value={netProfit} sub={`+${netPct}% ROI Margin`} trend={{ dir: "up", pct: `+${netPct}%` }} color="violet" delay={0.2} />
        <StatCard icon={Gauge} label="Farm Health" value="91/100" sub="Optimal · Crop & Livestock" color="cyan" delay={0.25} />
        <StatCard icon={Bell} label="AI Alerts" value="3 Active" sub="Pest, Heat, Market" color="amber" delay={0.3} />
        <StatCard icon={Calendar} label="Next Harvest" value="Ofada Rice" sub="~45 Days · Ogun State" color="orange" delay={0.35} />
      </div>

      {/* ─── Charts & Health Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Financial Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-lg border border-stone-100"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <ChartLine className="w-4 h-4 text-emerald-500" weight="fill" />
            Monthly Revenue vs Expenses ({currency === "NGN" ? "₦ NGN" : "$ USD"})
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#78716c" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  formatter={(val: number) => [currency === "NGN" ? `₦${val.toLocaleString()}` : `$${val.toLocaleString()}`, undefined]}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Farm Health Score + Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100 flex flex-col items-center"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2 self-start">
            <Gauge className="w-4 h-4 text-cyan-500" weight="fill" />
            Farm Health Score
          </h3>
          <div className="relative flex items-center justify-center py-2">
            <HealthGauge score={data.farmHealthScore || 91} />
          </div>
          <div className="w-full mt-2 space-y-2">
            {[
              { label: "Crop Vigor Index", val: "94%", color: "bg-emerald-500" },
              { label: "Vaccination Coverage", val: "88%", color: "bg-blue-500" },
              { label: "Soil Moisture", val: "85%", color: "bg-cyan-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-stone-500">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: item.val }} />
                  </div>
                  <span className="font-semibold text-stone-700 w-8 text-right">{item.val}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Crop Distribution & Livestock ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <ChartPie className="w-4 h-4 text-emerald-500" weight="fill" />
            Crop Distribution by Hectare
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cropData} dataKey="hectares" nameKey="name" cx="50%" cy="50%" innerRadius={36} outerRadius={64} paddingAngle={3}>
                    {cropData.map((_: any, i: number) => (
                      <Cell key={i} fill={CROP_COLORS[i % CROP_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }}
                    formatter={(val: number) => [`${val} ha`, undefined]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {cropData.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CROP_COLORS[i % CROP_COLORS.length] }} />
                    <span className="text-stone-600">{c.name}</span>
                  </div>
                  <span className="font-semibold text-stone-800">{c.hectares} ha</span>
                </div>
              ))}
              <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-800">
                <span>Total</span>
                <span>{totalHectares} ha</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Livestock Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <Cow className="w-4 h-4 text-blue-500" weight="fill" />
            Livestock Breakdown
          </h3>
          <div className="space-y-3">
            {(data.livestock || []).map((l: any, i: number) => {
              const pct = totalLivestock > 0 ? ((l.count / totalLivestock) * 100).toFixed(0) : "0";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={mounted ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05, ease: "easeOut" }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-stone-50"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Cow className="w-5 h-5 text-blue-600" weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">{l.category}</p>
                    <p className="text-xs text-stone-500">{l.status}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-stone-900">{l.count.toLocaleString()}</p>
                    <p className="text-xs text-stone-400">{pct}%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ─── AI Alerts Panel ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
        className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
            <Sparkle className="w-4 h-4 text-amber-500" weight="fill" />
            AI-Powered Alerts & Intelligence
          </h3>
          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
            {data.aiAlerts?.length || 0} Active
          </span>
        </div>
        <div className="space-y-3">
          {(data.aiAlerts || []).map((alert: any, i: number) => (
            <AIAlertCard key={alert.id} alert={alert} delay={0.5 + i * 0.08} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── CropsTab ─── */
export function CropsTab() {
  const { currency } = useApp();
  const [crops, setCrops] = useState<CropRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editCrop, setEditCrop] = useState<CropRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CropRecord | null>(null);
  const [form, setForm] = useState({
    crop_type: "",
    variety: "",
    planting_date: "",
    harvest_date: "",
    production_cost: 0,
    selling_price: 0,
    harvest_quantity: 0,
    farm_location: "",
    status: "Planted",
  });

  const loadCrops = async () => {
    setLoading(true);
    try {
      const data = await fetchCrops();
      setCrops(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCrops(); }, []);

  const resetForm = () => setForm({
    crop_type: "", variety: "", planting_date: "", harvest_date: "",
    production_cost: 0, selling_price: 0, harvest_quantity: 0,
    farm_location: "", status: "Planted",
  });

  const openAdd = () => { resetForm(); setEditCrop(null); setShowModal(true); };
  const openEdit = (c: CropRecord) => {
    setEditCrop(c);
    setForm({
      crop_type: c.crop_type,
      variety: c.variety || "",
      planting_date: c.planting_date || "",
      harvest_date: c.harvest_date || "",
      production_cost: c.production_cost,
      selling_price: c.selling_price,
      harvest_quantity: c.harvest_quantity,
      farm_location: c.farm_location || "",
      status: c.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.crop_type.trim()) { toast.error("Crop type is required"); return; }
    try {
      if (editCrop) {
        const updated = await updateCrop(editCrop.id, { ...form, variety: form.variety || null, planting_date: form.planting_date || null, harvest_date: form.harvest_date || null, farm_location: form.farm_location || null });
        setCrops(prev => prev.map(c => c.id === editCrop.id ? updated : c));
        toast.success("Crop updated");
      } else {
        const created = await addCrop({ ...form, variety: form.variety || null, planting_date: form.planting_date || null, harvest_date: form.harvest_date || null, farm_location: form.farm_location || null });
        setCrops(prev => [created, ...prev]);
        toast.success("Crop added");
      }
      setShowModal(false);
    } catch (err: any) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCrop(deleteTarget.id);
      setCrops(prev => prev.filter(c => c.id !== deleteTarget.id));
      toast.success("Crop deleted");
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const statuses = ["all", "Planted", "Growing", "Harvested", "Failed"];
  const filtered = crops.filter(c => {
    const matchSearch = !search || c.crop_type.toLowerCase().includes(search.toLowerCase()) || c.variety?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalInvestment = crops.reduce((s, c) => s + c.production_cost * c.harvest_quantity, 0);
  const totalRevenue = crops.reduce((s, c) => s + c.selling_price * c.harvest_quantity, 0);
  const avgProfitMargin = totalRevenue > 0 ? ((totalRevenue - totalInvestment) / totalRevenue * 100).toFixed(1) : "0.0";
  const harvestedCount = crops.filter(c => c.status === "Harvested").length;
  const failedCount = crops.filter(c => c.status === "Failed").length;

  /* Chart data: profit per crop type */
  const chartData = Object.entries(
    crops.reduce<Record<string, { cost: number; revenue: number; qty: number }>>((acc, c) => {
      if (!acc[c.crop_type]) acc[c.crop_type] = { cost: 0, revenue: 0, qty: 0 };
      acc[c.crop_type].cost += c.production_cost * c.harvest_quantity;
      acc[c.crop_type].revenue += c.selling_price * c.harvest_quantity;
      acc[c.crop_type].qty += c.harvest_quantity;
      return acc;
    }, {})
  ).map(([crop, v]) => ({ crop, cost: v.cost, revenue: v.revenue, profit: v.revenue - v.cost, margin: v.revenue > 0 ? ((v.revenue - v.cost) / v.revenue * 100) : 0 }));

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
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Plant size={22} weight="fill" className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Crop Management</h2>
            <p className="text-sm text-stone-500">{crops.length} crops tracked</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium text-sm shadow-sm hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} weight="bold" />
          Add New Crop
        </motion.button>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <KPICard icon={Plant} label="Total Crops" value={crops.length.toString()} sub={`${crops.filter(c => c.status === "Growing").length} growing`} color="emerald" />
          <KPICard icon={TrendUp} label="Total Investment" value={formatMoney(totalInvestment, currency)} sub={`${crops.length} entries`} color="blue" />
          <KPICard icon={TrendDown} label="Profit Margin" value={`${avgProfitMargin}%`} sub={totalRevenue > 0 ? `${formatMoney(totalRevenue - totalInvestment, currency)} net` : "No sales"} color="amber" />
          <KPICard icon={Check} label="Harvested" value={harvestedCount.toString()} sub={failedCount > 0 ? `${failedCount} failed` : "All good"} color="green" />
        </motion.div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search crops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-shadow"
          />
        </div>
        <div className="flex gap-1.5 bg-stone-100 rounded-xl p-1">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm"
        >
          <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
            <ChartBar size={18} className="text-emerald-500" />
            Production Cost vs Revenue
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
              <XAxis dataKey="crop" tick={{ fontSize: 12 }} stroke="#a8a29e" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a8a29e" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 13 }}
                formatter={(val: number) => [formatMoney(val, currency), undefined]}
              />
              <Bar dataKey="cost" name="Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-xl bg-stone-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-2xl border border-dashed border-stone-200"
        >
          <Plant size={48} weight="thin" className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-500 font-medium">{search || statusFilter !== "all" ? "No matching crops found" : "No crops yet. Add your first crop!"}</p>
          {!search && statusFilter === "all" && (
            <button onClick={openAdd} className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium">+ Add Crop</button>
          )}
        </motion.div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Crop</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-600">Cost</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-600">Price</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-600">Qty</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-600">Profit</th>
                  <th className="text-right px-4 py-3 font-semibold text-stone-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((crop, i) => {
                  const profit = crop.selling_price * crop.harvest_quantity - crop.production_cost * crop.harvest_quantity;
                  const profitMargin = crop.selling_price > 0 ? ((crop.selling_price - crop.production_cost) / crop.selling_price * 100).toFixed(1) : "0";
                  return (
                    <motion.tr
                      key={crop.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.25 }}
                      className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-800">{crop.crop_type}</div>
                        {crop.variety && <div className="text-xs text-stone-400">{crop.variety}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={crop.status} />
                      </td>
                      <td className="px-4 py-3 text-right text-stone-600">{formatMoney(crop.production_cost, currency)}</td>
                      <td className="px-4 py-3 text-right text-stone-600">{formatMoney(crop.selling_price, currency)}</td>
                      <td className="px-4 py-3 text-right text-stone-600">{crop.harvest_quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={profit >= 0 ? "text-emerald-600" : "text-red-500"}>{formatMoney(profit, currency)}</span>
                        <span className="text-xs text-stone-400 ml-1">({profitMargin}%)</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(crop)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                            title="Edit"
                          >
                            <PencilSimple size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(crop)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <h3 className="text-base font-bold text-stone-800">{editCrop ? "Edit Crop" : "Add New Crop"}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-400">
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-stone-500 mb-1">Crop Type *</label>
                    <input value={form.crop_type} onChange={e => setForm(p => ({ ...p, crop_type: e.target.value }))} placeholder="e.g. Maize" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-medium text-stone-500 mb-1">Variety</label>
                    <input value={form.variety} onChange={e => setForm(p => ({ ...p, variety: e.target.value }))} placeholder="e.g. TZESR-W" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Planting Date</label>
                    <input type="date" value={form.planting_date} onChange={e => setForm(p => ({ ...p, planting_date: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Harvest Date</label>
                    <input type="date" value={form.harvest_date} onChange={e => setForm(p => ({ ...p, harvest_date: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Production Cost (per unit)</label>
                    <input type="number" min="0" step="0.01" value={form.production_cost || ""} onChange={e => setForm(p => ({ ...p, production_cost: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Selling Price (per unit)</label>
                    <input type="number" min="0" step="0.01" value={form.selling_price || ""} onChange={e => setForm(p => ({ ...p, selling_price: parseFloat(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Harvest Quantity</label>
                    <input type="number" min="0" value={form.harvest_quantity || ""} onChange={e => setForm(p => ({ ...p, harvest_quantity: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1">Farm Location</label>
                    <input value={form.farm_location} onChange={e => setForm(p => ({ ...p, farm_location: e.target.value }))} placeholder="e.g. Kaduna" className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-stone-500 mb-1">Status</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/40 bg-white">
                      <option value="Planted">Planted</option>
                      <option value="Growing">Growing</option>
                      <option value="Harvested">Harvested</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-stone-100 bg-stone-50/50">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors">Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors"
                >
                  {editCrop ? "Save Changes" : "Add Crop"}
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Trash size={24} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-1">Delete Crop?</h3>
              <p className="text-sm text-stone-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-stone-700">{deleteTarget.crop_type}</span>?
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors">Cancel</button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDelete}
                  className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium shadow-sm hover:bg-red-700 transition-colors"
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

/* ─── KPICard ─── */
function KPICard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    blue: "bg-blue-100 text-blue-600",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
  };
  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color] || colorMap.emerald}`}>
          <Icon size={16} weight="fill" />
        </div>
      </div>
      <div className="text-xl font-bold text-stone-800">{value}</div>
      <div className="text-xs text-stone-400 mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── StatusBadge ─── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Planted: "bg-amber-100 text-amber-700",
    Growing: "bg-blue-100 text-blue-700",
    Harvested: "bg-emerald-100 text-emerald-700",
    Failed: "bg-red-100 text-red-700",
  };
  const icons: Record<string, any> = {
    Planted: Calendar,
    Growing: TrendUp,
    Harvested: Check,
    Failed: X,
  };
  const Icon = icons[status] || Calendar;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${styles[status] || "bg-stone-100 text-stone-600"}`}>
      <Icon size={12} weight="bold" />
      {status}
    </span>
  );
}

/* ───── ReportsTab ───── */
export function ReportsTab() {
  const { state } = useApp();
  const crops = state?.crops || [];
  const transactions = state?.transactions || [];
  const [activeReport, setActiveReport] = useState<string>("overview");

  // Compute financial stats from the data
  const totalCrops = crops.length;
  const harvested = crops.filter((c) => c.status === "Harvested").length;
  const active = crops.filter((c) => c.status === "Growing" || c.status === "Planted").length;
  const failed = crops.filter((c) => c.status === "Failed").length;

  // Estimated revenue from harvested crops (simulated)
  const estimatedRevenue = harvested * 450000;
  const estimatedCost = totalCrops * 250000;
  const profit = estimatedRevenue - estimatedCost;
  const profitMargin = estimatedRevenue > 0 ? Math.round((profit / estimatedRevenue) * 100) : 0;

  // Sample activity/event log data
  const activities = [
    { id: "1", type: "Planting", notes: "Planted 50 cassava stems", date: "2024-10-12" },
    { id: "2", type: "Irrigation", notes: "Drip irrigation setup completed", date: "2024-10-15" },
    { id: "3", type: "Fertilization", notes: "Applied organic fertilizer", date: "2024-10-18" },
    { id: "4", type: "Harvesting", notes: "Harvested 200kg of maize", date: "2024-10-22" },
    { id: "5", type: "Pest Control", notes: "Applied neem oil spray", date: "2024-10-25" },
  ];

  const reportTabs = [
    { id: "overview", label: "Overview", icon: ChartBar },
    { id: "financial", label: "Financial", icon: CurrencyNgn },
    { id: "crops", label: "Crop Report", icon: Plant },
    { id: "activities", label: "Activity Log", icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <ChartBar size={22} className="text-emerald-600" weight="fill" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-800">Farm Reports</h2>
            <p className="text-sm text-stone-400">Insights & performance summaries</p>
          </div>
        </div>
        <button
          onClick={() => toast.success("Report exported as PDF")}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Download size={16} weight="bold" />
          Export
        </button>
      </div>

      {/* Report type tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {reportTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                activeReport === tab.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                  : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
              )}
            >
              <Icon size={16} weight={activeReport === tab.id ? "fill" : "regular"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Report Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeReport}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {activeReport === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Plant} label="Total Crops" value={String(totalCrops)} sub="All time" color="emerald" />
                <StatCard icon={TrendUp} label="Active" value={String(active)} sub="Growing / Planted" color="blue" />
                <StatCard icon={Check} label="Harvested" value={String(harvested)} sub="Completed" color="emerald" />
                <StatCard icon={Warning} label="Failed" value={String(failed)} sub="Lost crops" color="red" />
              </div>

              {/* Quick financial summary */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Financial Snapshot</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Est. Revenue</p>
                    <p className="text-lg font-bold text-emerald-600">{formatMoney(estimatedRevenue, "NGN")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Est. Cost</p>
                    <p className="text-lg font-bold text-red-500">{formatMoney(estimatedCost, "NGN")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Profit</p>
                    <p className="text-lg font-bold text-stone-800">{formatMoney(profit, "NGN")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Margin</p>
                    <p className="text-lg font-bold text-stone-800">{profitMargin}%</p>
                  </div>
                </div>
                {profitMargin > 0 ? (
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUp size={14} weight="bold" />
                    Profitable operation
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1 text-xs text-red-500">
                    <ArrowDown size={14} weight="bold" />
                    Operating at a loss
                  </div>
                )}
              </div>

              {/* Crop status breakdown */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Crop Status Breakdown</h3>
                {crops.length > 0 ? (
                  <div className="space-y-3">
                    {["Growing", "Planted", "Harvested", "Failed"].map((status) => {
                      const count = crops.filter((c) => c.status === status).length;
                      const pct = totalCrops > 0 ? Math.round((count / totalCrops) * 100) : 0;
                      return (
                        <div key={status} className="flex items-center gap-3">
                          <StatusBadge status={status} />
                          <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                status === "Growing" && "bg-blue-400",
                                status === "Planted" && "bg-amber-400",
                                status === "Harvested" && "bg-emerald-400",
                                status === "Failed" && "bg-red-400"
                              )}
                            />
                          </div>
                          <span className="text-xs font-medium text-stone-500 w-12 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No crop data available.</p>
                )}
              </div>
            </div>
          )}

          {activeReport === "financial" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={HandCoins} label="Revenue" value={formatMoney(estimatedRevenue, "NGN")} sub="YTD" color="emerald" />
                <StatCard icon={CurrencyNgn} label="Costs" value={formatMoney(estimatedCost, "NGN")} sub="YTD" color="red" />
                <StatCard icon={PiggyBank} label="Profit" value={formatMoney(profit, "NGN")} sub={`${profitMargin}% margin`} color="emerald" />
                <StatCard icon={TrendUp} label="Avg/Crop" value={formatMoney(totalCrops > 0 ? Math.round(estimatedRevenue / totalCrops) : 0, "NGN")} sub="Revenue per crop" color="blue" />
              </div>

              {/* Revenue vs Cost chart */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Revenue vs Cost</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Revenue", value: estimatedRevenue, fill: "#059669" },
                      { name: "Costs", value: estimatedCost, fill: "#ef4444" },
                      { name: "Profit", value: Math.max(profit, 0), fill: "#3b82f6" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {[{ name: "Revenue", value: estimatedRevenue, fill: "#059669" },
                          { name: "Costs", value: estimatedCost, fill: "#ef4444" },
                          { name: "Profit", value: Math.max(profit, 0), fill: "#3b82f6" },
                        ].map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly trends */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Monthly Trends</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: "Jan", revenue: 180000, cost: 120000 },
                      { month: "Feb", revenue: 220000, cost: 140000 },
                      { month: "Mar", revenue: 280000, cost: 160000 },
                      { month: "Apr", revenue: 350000, cost: 190000 },
                      { month: "May", revenue: 420000, cost: 220000 },
                      { month: "Jun", revenue: 450000, cost: 250000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                      <Line type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeReport === "crops" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={Plant} label="Total Crops" value={String(totalCrops)} sub="All entries" color="emerald" />
                <StatCard icon={SquaresFour} label="Harvest Rate" value={totalCrops > 0 ? `${Math.round((harvested / totalCrops) * 100)}%` : "0%"} sub={`${harvested} of ${totalCrops} harvested`} color="emerald" />
              </div>

              {/* Crop list */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Crop Inventory</h3>
                {crops.length > 0 ? (
                  <div className="space-y-2">
                    {crops.map((crop) => (
                      <div key={crop.id} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Plant size={16} className="text-emerald-600" weight="fill" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-800">{crop.name}</p>
                            <p className="text-xs text-stone-400">{crop.field || crop.variety || "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={crop.status} />
                          <span className="text-xs text-stone-400">{crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString() : "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-stone-400">No crops recorded yet.</p>
                )}
              </div>
            </div>
          )}

          {activeReport === "activities" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <StatCard icon={FileText} label="Total Activities" value={String(activities.length)} sub="All time" color="blue" />
                <StatCard icon={Clock} label="This Month" value={String(activities.filter((a) => {
                  const d = new Date(a.date);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length)} sub="Recent" color="emerald" />
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Activity Log</h3>
                {activities.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {activities.slice().reverse().slice(0, 20).map((act) => (
                      <div key={act.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-800">{act.type}</p>
                          <p className="text-xs text-stone-400 truncate">{act.notes || "No details"}</p>
                        </div>
                        <span className="text-xs text-stone-400 flex-shrink-0">{new Date(act.date).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileText size={32} className="mx-auto text-stone-300 mb-2" />
                    <p className="text-sm text-stone-400">No activities recorded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}