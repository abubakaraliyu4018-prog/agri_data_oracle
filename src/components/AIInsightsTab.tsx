import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Lightbulb, Clock, Warning, Drop, Calendar, Sparkle, ChartBar,
  TrendUp, TrendDown, Check, X, ArrowUp, ArrowDown,
  Horse, Plant, Funnel,
} from "@phosphor-icons/react";
import { supabase } from "../integrations/supabase/client";
import { formatCurrency } from "../context/AppContext";
import type { CropRecord, LivestockRecord } from "../types";

/* ──── Types ──── */
type InsightCategory = "all" | "harvest" | "health" | "irrigation";

interface Insight {
  id: string;
  category: InsightCategory;
  severity: "high" | "medium" | "low";
  title: string;
  detail: string;
  action: string;
  date: string;
  icon: React.ElementType;
}

/* ──── Helpers ──── */
function daysBetween(from: string, to: string): number {
  const a = new Date(from);
  const b = new Date(to);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function daysFromNow(dateStr: string): number {
  return daysBetween(new Date().toISOString().split("T")[0], dateStr);
}

/* ──── Insight Engine ──── */
function generateInsights(crops: CropRecord[], livestock: LivestockRecord[]): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString().split("T")[0];

  /* ── Harvest Timing ── */
  for (const c of crops) {
    if (c.harvest_date) {
      const days = daysFromNow(c.harvest_date);
      if (days <= 0) {
        insights.push({
          id: `harvest-ready-${c.id}`,
          category: "harvest",
          severity: "high",
          title: `${c.crop_type} ready for harvest`,
          detail: `${c.crop_type}${c.variety ? ` (${c.variety})` : ""} reached its harvest date.`,
          action: "Schedule harvest crew and prepare storage facilities.",
          date: c.harvest_date,
          icon: Check,
        });
      } else if (days <= 14) {
        insights.push({
          id: `harvest-soon-${c.id}`,
          category: "harvest",
          severity: "high",
          title: `${c.crop_type} harvest window opens in ${days} days`,
          detail: `${c.crop_type}${c.variety ? ` (${c.variety})` : ""} planted at ${c.farm_location || "your farm"} is approaching harvest.`,
          action: "Prepare harvesting equipment and arrange transport logistics.",
          date: c.harvest_date,
          icon: Clock,
        });
      } else if (days <= 45) {
        insights.push({
          id: `harvest-track-${c.id}`,
          category: "harvest",
          severity: "low",
          title: `${c.crop_type} harvest in ${days} days`,
          detail: `${c.crop_type}${c.variety ? ` (${c.variety})` : ""} expected harvest in ${days} days. Current status: ${c.status}.`,
          action: "Monitor crop maturity and plan pre-harvest activities.",
          date: c.harvest_date,
          icon: Calendar,
        });
      }
    }
    if (c.planting_date && c.status === "Growing") {
      const daysSincePlanting = daysBetween(c.planting_date, now);
      if (daysSincePlanting > 90 && !c.harvest_date) {
        insights.push({
          id: `harvest-due-${c.id}`,
          category: "harvest",
          severity: "medium",
          title: `${c.crop_type} may be overdue for harvest`,
          detail: `${c.crop_type} has been growing for ${daysSincePlanting} days without a harvest date set.`,
          action: "Inspect the crop and set an expected harvest date.",
          date: c.planting_date,
          icon: Warning,
        });
      }
    }
  }

  /* ── Health Alerts ── */
  for (const l of livestock) {
    if (l.health_status && ["Poor", "Critical", "Sick", "Needs Attention"].includes(l.health_status)) {
      insights.push({
        id: `livestock-health-${l.id}`,
        category: "health",
        severity: "high",
        title: `${l.animal_type} health concern`,
        detail: `${l.name || l.animal_type} (tag: ${l.tag_number || "N/A"}) has a health status of "${l.health_status}".`,
        action: "Schedule a veterinary checkup immediately. Isolate from herd if contagious.",
        date: l.updated_at || now,
        icon: Warning,
      });
    }
    if (l.vaccination_status && l.vaccination_status !== "Up-to-date" && l.vaccination_status !== "Excellent") {
      insights.push({
        id: `livestock-vacc-${l.id}`,
        category: "health",
        severity: "medium",
        title: `${l.animal_type} vaccination due`,
        detail: `${l.name || l.animal_type} vaccination status: "${l.vaccination_status}". May need a booster.`,
        action: "Check vaccination records and schedule a vet visit.",
        date: l.updated_at || now,
        icon: Calendar,
      });
    }
  }

  for (const c of crops) {
    if (c.status === "Failed") {
      insights.push({
        id: `crop-failed-${c.id}`,
        category: "health",
        severity: "high",
        title: `${c.crop_type} crop failed`,
        detail: `${c.crop_type}${c.variety ? ` (${c.variety})` : ""} at ${c.farm_location || "your farm"} has been marked as failed.`,
        action: "Investigate cause (pests, disease, weather) and plan replanting with resistant varieties.",
        date: now,
        icon: X,
      });
    }
  }

  /* ── Irrigation Suggestions ── */
  for (const c of crops) {
    if (c.status === "Growing" || c.status === "Planted") {
      if (c.planting_date) {
        const daysSincePlanting = daysBetween(c.planting_date, now);
        if (daysSincePlanting > 7 && daysSincePlanting < 90) {
          insights.push({
            id: `irrigation-${c.id}`,
            category: "irrigation",
            severity: "low",
            title: `Irrigation check for ${c.crop_type}`,
            detail: `${c.crop_type} (${c.status}) planted ${daysSincePlanting} days ago at ${c.farm_location || "your farm"}. Monitor soil moisture regularly.`,
            action: "Check soil moisture levels. Irrigate if top 5cm of soil is dry. Best done early morning.",
            date: now,
            icon: Drop,
          });
        }
      }
    }
  }

  if (crops.some((c) => c.status === "Growing" || c.status === "Planted")) {
    const growingCrops = crops.filter((c) => c.status === "Growing" || c.status === "Planted").length;
    if (growingCrops > 0) {
      insights.push({
        id: "irrigation-general",
        category: "irrigation",
        severity: "low",
        title: `General irrigation advisory for ${growingCrops} active crop(s)`,
        detail: `${growingCrops} crop(s) in active growth phase. Establish a consistent watering schedule.`,
        action: "Use drip irrigation where possible to reduce water usage by 30-50%. Water early morning.",
        date: now,
        icon: Drop,
      });
    }
  }

  return insights;
}

/* ──── Severity Config ──── */
const severityStyles: Record<string, { dot: string; bg: string; label: string; ring: string }> = {
  high: { dot: "bg-rose-500", bg: "bg-rose-50 border-rose-200", label: "High Priority", ring: "ring-rose-200" },
  medium: { dot: "bg-amber-500", bg: "bg-amber-50 border-amber-200", label: "Needs Attention", ring: "ring-amber-200" },
  low: { dot: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200", label: "Suggestion", ring: "ring-emerald-200" },
};

const categoryTabs: { id: InsightCategory; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All Insights", icon: Sparkle },
  { id: "harvest", label: "Harvest", icon: Clock },
  { id: "health", label: "Health", icon: Warning },
  { id: "irrigation", label: "Irrigation", icon: Drop },
];

/* ──── Insight Card ──── */
function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const s = severityStyles[insight.severity];
  const Icon = insight.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border ${s.bg} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
          <Icon className={`w-5 h-5 ${s.dot.replace("bg-", "text-")}`} weight="fill" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">{s.label}</span>
            <span className="text-xs text-stone-400 ml-auto">{insight.date}</span>
          </div>
          <h4 className="text-sm font-bold text-stone-800">{insight.title}</h4>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{insight.detail}</p>
          <div className="mt-3 flex items-start gap-2 text-xs">
            <ArrowUp className="w-3.5 h-3.5 text-stone-400 mt-0.5 flex-shrink-0" weight="bold" />
            <span className="text-stone-600">{insight.action}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──── Stat Card ──── */
function StatCard({ icon: Icon, label, value, sub, color = "emerald" }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm border border-stone-100">
      <div className="flex items-start justify-between mb-2">
        <div className={`flex items-center justify-center w-9 h-9 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon className="w-4.5 h-4.5" weight="fill" />
        </div>
      </div>
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{label}</p>
      <p className="text-xl font-bold text-stone-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ──── Empty State ──── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200">
        <Lightbulb className="w-10 h-10 text-emerald-400" weight="thin" />
      </div>
      <h3 className="text-lg font-bold text-stone-800 mb-2">No farm data detected yet</h3>
      <p className="text-sm text-stone-500 max-w-md leading-relaxed mb-6">
        Add your crops and livestock records to unlock personalized AI-powered insights.
        AgriTrack will analyse your data to help with harvest timing, health alerts, and irrigation suggestions.
      </p>
      <div className="flex items-center gap-3 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <Plant className="w-4 h-4 text-emerald-500" weight="fill" /> Add Crops
        </span>
        <span className="text-stone-300">|</span>
        <span className="flex items-center gap-1.5">
          <Horse className="w-4 h-4 text-blue-500" weight="fill" /> Add Livestock
        </span>
      </div>
    </motion.div>
  );
}

/* ──── Main Component ──── */
export default function AIInsightsTab() {
  const [crops, setCrops] = useState<CropRecord[]>([]);
  const [livestock, setLivestock] = useState<LivestockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<InsightCategory>("all");

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [cropsRes, livestockRes] = await Promise.all([
          supabase.from("crops").select("*").order("created_at", { ascending: false }),
          supabase.from("livestock").select("*").order("created_at", { ascending: false }),
        ]);
        if (cancelled) return;
        if (cropsRes.error) throw cropsRes.error;
        if (livestockRes.error) throw livestockRes.error;
        setCrops((cropsRes.data || []) as CropRecord[]);
        setLivestock((livestockRes.data || []) as LivestockRecord[]);
      } catch (err: any) {
        if (!cancelled) toast.error(err.message || "Failed to load farm data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const allInsights = useMemo(() => generateInsights(crops, livestock), [crops, livestock]);

  const filteredInsights = useMemo(
    () => activeCategory === "all" ? allInsights : allInsights.filter((i) => i.category === activeCategory),
    [allInsights, activeCategory]
  );

  const severityCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    for (const ins of allInsights) counts[ins.severity]++;
    return counts;
  }, [allInsights]);

  const hasData = crops.length > 0 || livestock.length > 0;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-xl bg-stone-100 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-stone-100 animate-pulse" />)}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-stone-100 animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600" weight="fill" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">AI Insights</h2>
            <p className="text-sm text-stone-500">Smart recommendations for your farm</p>
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-amber-600" weight="fill" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">AI Insights</h2>
            <p className="text-sm text-stone-500">
              {allInsights.length} {allInsights.length === 1 ? "recommendation" : "recommendations"} from your farm data
            </p>
          </div>
        </div>
        {/* Severity badges */}
        <div className="hidden sm:flex items-center gap-2">
          {severityCounts.high > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {severityCounts.high} High
            </span>
          )}
          {severityCounts.medium > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              {severityCounts.medium} Medium
            </span>
          )}
          {severityCounts.low > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {severityCounts.low} Low
            </span>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Sparkle} label="Total Insights" value={allInsights.length.toString()} sub="AI generated" color="amber" />
        <StatCard icon={Plant} label="Crops Analysed" value={crops.length.toString()} sub={`${crops.filter((c) => c.status === "Growing").length} active`} color="emerald" />
        <StatCard icon={Horse} label="Livestock Monitored" value={livestock.length.toString()} sub={`${livestock.filter((l) => l.health_status === "Excellent" || l.health_status === "Good" || l.health_status === "Healthy").length} healthy`} color="blue" />
        <StatCard icon={Drop} label="Irrigation Tips" value={allInsights.filter((i) => i.category === "irrigation").length.toString()} sub="Water management" color="cyan" />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1.5 bg-stone-100 rounded-xl p-1 overflow-x-auto">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          const count = tab.id === "all" ? allInsights.length : allInsights.filter((i) => i.category === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <Icon className="w-4 h-4" weight={isActive ? "fill" : "regular"} />
              {tab.label}
              <span className={`ml-0.5 text-xs ${isActive ? "text-stone-400" : "text-stone-400"}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* Insight Cards */}
      <AnimatePresence mode="wait">
        {filteredInsights.length === 0 ? (
          <motion.div
            key="empty-filter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <Funnel className="w-10 h-10 text-stone-300 mb-3" weight="thin" />
            <p className="text-sm font-medium text-stone-500">No insights in this category</p>
            <p className="text-xs text-stone-400 mt-1">Try selecting a different filter</p>
          </motion.div>
        ) : (
          <motion.div key={activeCategory} className="space-y-3">
            {filteredInsights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}