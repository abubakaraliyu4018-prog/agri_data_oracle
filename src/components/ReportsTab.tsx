import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plant, Warning, Check, ArrowUp, ArrowDown, SquaresFour,
  ChartBar, PiggyBank, HandCoins, CurrencyNgn, FileText, Clock, Download, TrendUp,
} from "@phosphor-icons/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line,
} from "recharts";
import { cn } from "../lib/utils";
import { useApp, formatCurrency } from "../context/AppContext";

/* ─────── StatCard ─────── */
function StatCard({ icon: Icon, label, value, sub, color = "emerald", delay = 0 }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string; delay?: number;
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
      </div>
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </motion.div>
  );
}

/* ─────── StatusBadge ─────── */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Planted: "bg-amber-100 text-amber-700",
    Growing: "bg-blue-100 text-blue-700",
    Harvested: "bg-emerald-100 text-emerald-700",
    Failed: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${styles[status] || "bg-stone-100 text-stone-600"}`}>
      {status}
    </span>
  );
}

/* ─────── ReportsTab ─────── */
export function ReportsTab() {
  const { state, currency } = useApp();
  const crops = state?.crops || [];
  const livestocks = state?.livestock || [];
  const transactions = state?.transactions || [];
  const [activeReport, setActiveReport] = useState<string>("overview");

  // Compute financial stats from live transactions
  const totalCrops = crops.length;
  const totalLivestock = livestocks.length;
  const harvested = crops.filter((c) => c.status === "Harvested").length;
  const active = crops.filter((c) => c.status === "Growing" || c.status === "Planted").length;
  const failed = crops.filter((c) => c.status === "Failed").length;

  const totalRevenue = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const totalCost = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const profit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  // Monthly trends derived from transactions
  const monthlyTrends = Array.from({ length: 12 }, (_, i) => {
    const revenue = transactions
      .filter((t) => t.type === "income" && new Date(t.date).getMonth() === i)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const cost = transactions
      .filter((t) => t.type === "expense" && new Date(t.date).getMonth() === i)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return { month: new Date(0, i).toLocaleString("en", { month: "short" }), revenue, cost };
  });

  // Activity log derived from live transactions
  const activities = transactions.map((t) => ({
    id: t.id ?? String(Math.random()),
    type: t.type === "income" ? "Income" : "Expense",
    notes: t.description || t.category || "Transaction",
    date: t.date,
  }));

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
                <StatCard icon={Check} label="Total Livestock" value={String(totalLivestock)} sub="Head tracked" color="blue" />
                <StatCard icon={Check} label="Harvested" value={String(harvested)} sub="Completed" color="emerald" />
                <StatCard icon={Warning} label="Failed" value={String(failed)} sub="Lost crops" color="rose" />
              </div>

              {/* Quick financial summary */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Financial Snapshot</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Total Revenue</p>
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(totalRevenue, currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Total Cost</p>
                    <p className="text-lg font-bold text-red-500">{formatCurrency(totalCost, currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Profit</p>
                    <p className="text-lg font-bold text-stone-800">{formatCurrency(profit, currency)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-stone-400">Margin</p>
                    <p className="text-lg font-bold text-stone-800">{profitMargin}%</p>
                  </div>
                </div>
                {profit > 0 ? (
                  <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
                    <ArrowUp size={14} weight="bold" />
                    Profitable operation
                  </div>
                ) : profit < 0 ? (
                  <div className="mt-3 flex items-center gap-1 text-xs text-red-500">
                    <ArrowDown size={14} weight="bold" />
                    Operating at a loss
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1 text-xs text-stone-400">
                    No revenue recorded yet
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
                <StatCard icon={HandCoins} label="Revenue" value={formatCurrency(totalRevenue, currency)} sub="YTD" color="emerald" />
                <StatCard icon={CurrencyNgn} label="Costs" value={formatCurrency(totalCost, currency)} sub="YTD" color="rose" />
                <StatCard icon={PiggyBank} label="Profit" value={formatCurrency(profit, currency)} sub={`${profitMargin}% margin`} color="emerald" />
                <StatCard icon={TrendUp} label="Avg/Crop" value={formatCurrency(totalCrops > 0 ? Math.round(totalRevenue / totalCrops) : 0, currency)} sub="Revenue per crop" color="blue" />
              </div>

              {/* Revenue vs Cost chart */}
              <div className="bg-white rounded-2xl border border-stone-200 p-5">
                <h3 className="text-sm font-semibold text-stone-700 mb-4">Revenue vs Cost</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Revenue", value: totalRevenue, fill: "#059669" },
                      { name: "Costs", value: totalCost, fill: "#ef4444" },
                      { name: "Profit", value: Math.max(profit, 0), fill: "#3b82f6" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#a8a29e" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4" }} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {[{ name: "Revenue", value: totalRevenue, fill: "#059669" },
                          { name: "Costs", value: totalCost, fill: "#ef4444" },
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
                    <LineChart data={monthlyTrends}>
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
                            <p className="text-sm font-medium text-stone-800">{crop.crop_type || crop.name}</p>
                            <p className="text-xs text-stone-400">{crop.variety || crop.field || "—"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={crop.status} />
                          <span className="text-xs text-stone-400">
                            {crop.harvest_date || crop.expectedHarvest ? new Date(crop.harvest_date || crop.expectedHarvest).toLocaleDateString() : "—"}
                          </span>
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