import { createContext, useContext, useEffect, useState } from "react";
import { Warning, Info, Question } from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";
import { supabase } from "../integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { CropRecord, LivestockRecord } from "../types";
import { loadState } from "../constants";

export type Currency = "NGN" | "USD";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppState = any;
type Tab = "dashboard" | "crops" | "livestock" | "finances" | "market-prices" | "weather" | "reports" | "insights" | "profile" | "about";

export interface DashboardMetrics {
  totalCrops: number;
  totalLivestock: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  unreadNotifications: number;
  activeAlerts: number;
  farmHealthScore: number;
}

const DEFAULT_METRICS: DashboardMetrics = {
  totalCrops: 0,
  totalLivestock: 0,
  totalIncome: 0,
  totalExpenses: 0,
  netProfit: 0,
  unreadNotifications: 0,
  activeAlerts: 0,
  farmHealthScore: 0,
};

interface AppCtx {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  session: Session | null;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  dashboardMetrics: DashboardMetrics;
  metricsLoading: boolean;
}

export const AppContext = createContext<AppCtx>(null!);
export const useApp = () => useContext(AppContext);
export type { Tab, AppCtx };

/* ──── Dashboard Data Fetching Hook ──── */
export function useDashboardMetrics(session: Session | null): [DashboardMetrics, boolean] {
  const [metrics, setMetrics] = useState<DashboardMetrics>(DEFAULT_METRICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      setMetrics(DEFAULT_METRICS);
      setLoading(false);
      return;
    }
    const userId = session.user.id;

    async function fetchAll() {
      try {
        const [cropsRes, livestockRes, financesRes, notificationsRes] = await Promise.all([
          supabase.from("crops").select("*", { count: "exact", head: true }).eq("user_id", userId),
          supabase.from("livestock").select("*", { count: "exact", head: true }).eq("user_id", userId),
          supabase.from("financial_transactions").select("type, amount").eq("user_id", userId),
          supabase.from("notifications").select("read, type").eq("user_id", userId),
        ]);

        const totalCrops = cropsRes.count ?? 0;
        const totalLivestock = livestockRes.count ?? 0;
        const transactions = financesRes.data || [];
        const totalIncome = transactions.filter((t: any) => t.type === "income").reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
        const totalExpenses = transactions.filter((t: any) => t.type === "expense").reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
        const netProfit = totalIncome - totalExpenses;
        const notifications = notificationsRes.data || [];
        const unreadNotifications = notifications.filter((n: any) => !n.read).length;
        const activeAlerts = notifications.filter((n: any) => n.type === "alert" && !n.read).length;

        const hasCrops = totalCrops > 0 ? 1 : 0;
        const hasLivestock = totalLivestock > 0 ? 1 : 0;
        const profitRatio = totalIncome > 0 ? Math.min(totalIncome / (totalExpenses || 1), 3) / 3 : 0;
        const farmHealthScore = Math.round((hasCrops * 25 + hasLivestock * 25 + profitRatio * 50) * 100) / 100;

        setMetrics({
          totalCrops,
          totalLivestock,
          totalIncome,
          totalExpenses,
          netProfit,
          unreadNotifications,
          activeAlerts,
          farmHealthScore: Math.min(100, Math.max(0, Math.round(farmHealthScore))),
        });
      } catch {
        // Silently fall back to defaults
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, [session?.user?.id]);

  return [metrics, loading];
}

/* ──── Crop CRUD (Supabase) ──── */
export async function fetchCrops(): Promise<CropRecord[]> {
  const { data, error } = await supabase.from("crops").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as CropRecord[];
}

export async function addCrop(crop: Omit<CropRecord, "id" | "created_at" | "profit" | "profit_margin">): Promise<CropRecord> {
  const { data, error } = await supabase.from("crops").insert(crop).select().single();
  if (error) throw error;
  return data as CropRecord;
}

export async function updateCrop(id: string, updates: Partial<Omit<CropRecord, "profit" | "profit_margin">>): Promise<CropRecord> {
  const { data, error } = await supabase.from("crops").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as CropRecord;
}

export async function deleteCrop(id: string): Promise<void> {
  const { error } = await supabase.from("crops").delete().eq("id", id);
  if (error) throw error;
}

/* ──────── Livestock CRUD (Supabase) ──────── */
export async function fetchLivestock(): Promise<LivestockRecord[]> {
  const { data, error } = await supabase.from("livestock").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as LivestockRecord[];
}

export async function addLivestock(record: Omit<LivestockRecord, "id" | "created_at">): Promise<LivestockRecord> {
  const { data, error } = await supabase.from("livestock").insert(record).select().single();
  if (error) throw error;
  return data as LivestockRecord;
}

export async function updateLivestock(id: string, updates: Partial<LivestockRecord>): Promise<LivestockRecord> {
  const { data, error } = await supabase.from("livestock").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as LivestockRecord;
}

export async function deleteLivestock(id: string): Promise<void> {
  const { error } = await supabase.from("livestock").delete().eq("id", id);
  if (error) throw error;
}

export const SPECIES_OPTIONS = [
  "Cattle", "Goat", "Sheep", "Poultry", "Pig", "Fish", "Other",
] as const;

export const HEALTH_STATUS_OPTIONS = [
  "Excellent", "Good", "Fair", "Poor", "Critical",
] as const;

export const formatCurrency = (n: number, currency: "NGN" | "USD" = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(n);

export const genId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const growthColor = (stage: string) => {
  const map: Record<string, string> = {
    Seedling: "bg-amber-100 text-amber-800 border-amber-300",
    Vegetative: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Flowering: "bg-purple-100 text-purple-800 border-purple-300",
    Maturity: "bg-blue-100 text-blue-800 border-blue-300",
    Harvested: "bg-stone-100 text-stone-800 border-stone-300",
  };
  return map[stage] || "bg-gray-100 text-gray-800";
};

export const healthColor = (status: string) => {
  const map: Record<string, string> = {
    Excellent: "text-emerald-600",
    Good: "text-blue-600",
    Fair: "text-amber-600",
    Poor: "text-red-600",
  };
  return map[status] || "text-gray-600";
};

export const SeverityIcon = ({ severity, size = 18, className, weight }: { severity: string; size?: number; className?: string; weight?: IconWeight }) => {
  const Icon = severity === "Critical" ? Warning : severity === "Warning" ? Info : Question;
  return <Icon size={size} className={className} weight={weight} />;
};

export const severityColor = (severity: string) => {
  const map: Record<string, string> = {
    Critical: "bg-red-50 border-red-200 text-red-800",
    Warning: "bg-amber-50 border-amber-200 text-amber-800",
    Info: "bg-blue-50 border-blue-200 text-blue-800",
  };
  return map[severity] || "bg-gray-50 border-gray-200";
};

export const growthProgress = (stage: string, stages: readonly string[]): number => {
  const idx = stages.indexOf(stage);
  return idx >= 0 ? ((idx + 1) / stages.length) * 100 : 0;
};

/* ──────── AppProvider (wires session + metrics into context) ──────── */
export function AppProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AppState>(loadState());
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [dashboardMetrics, metricsLoading] = useDashboardMetrics(session);

  const value: AppCtx = {
    state,
    setState,
    activeTab,
    setActiveTab,
    session,
    currency,
    setCurrency,
    dashboardMetrics,
    metricsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}