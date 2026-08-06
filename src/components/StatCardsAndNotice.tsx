import { motion } from "framer-motion";
import { Plant, Cow, PiggyBank, BellRinging, ChartLineUp, Wallet, WarningOctagon, Warehouse, TrendUp, TrendDown } from "@phosphor-icons/react";
import { useApp, formatCurrency } from "../context/AppContext";
import { useMemo } from "react";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeInOut" as const },
  }),
};

/* ─────── Key Stat Cards ─────── */
export function StatCards() {
  const { dashboardMetrics, metricsLoading, session } = useApp();

  const cards = useMemo(() => {
    if (!dashboardMetrics || metricsLoading) return [];
    const m = dashboardMetrics;
    return [
      {
        icon: Plant,
        label: "Total Crops",
        value: `${m.totalCrops}`,
        sub: "Active crops",
        trend: "up" as const,
      },
      {
        icon: Cow,
        label: "Total Livestock",
        value: `${m.totalLivestock.toLocaleString()} Head`,
        sub: "All animals",
        trend: "up" as const,
      },
      {
        icon: PiggyBank,
        label: "Total Income",
        value: `₦${m.totalIncome.toLocaleString()}`,
        sub: "Year to Date",
        trend: "up" as const,
      },
      {
        icon: Wallet,
        label: "Total Expenses",
        value: `₦${m.totalExpenses.toLocaleString()}`,
        sub: "Operations",
        trend: "warning" as const,
      },
    ];
  }, [dashboardMetrics, metricsLoading]);

  if (metricsLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-stone-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-2xl border border-[#d8f3dc] bg-white p-6 text-center">
        <p className="text-sm text-stone-500">Sign in to view your farm metrics.</p>
      </div>
    );
  }

  if (!dashboardMetrics) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-200 bg-white p-6 text-center">
        <Plant size={36} className="mx-auto text-stone-300 mb-2" />
        <p className="text-sm text-stone-500">No farm data yet. Add crops or livestock to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-[#d8f3dc] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute right-0 top-0 h-20 w-20 translate-x-4 -translate-y-4 rounded-full bg-[#d8f3dc]/40" />
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d8f3dc] text-[#1b4332]">
              <card.icon className="h-5 w-5" weight="fill" />
            </div>
            {card.trend === "warning" && (
              <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                <WarningOctagon className="h-3 w-3" />
                Active
              </span>
            )}
            {card.trend === "up" && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                <ChartLineUp className="h-3 w-3" />
                Active
              </span>
            )}
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold tracking-tight text-[#1b4332]">
              {card.value}
            </div>
            <div className="mt-1 text-sm font-semibold text-[#2d6a4f]">{card.label}</div>
            <div className="mt-0.5 text-xs text-[#52b788]">{card.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─────── Data Coverage Alert ─────── */
export function DataAlert() {
  const { dashboardMetrics, metricsLoading, session } = useApp();

  if (metricsLoading || !session) return null;

  const hasData = dashboardMetrics && (
    dashboardMetrics.totalCrops > 0 ||
    dashboardMetrics.totalLivestock > 0 ||
    dashboardMetrics.totalIncome > 0
  );

  if (hasData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeInOut" as const }}
      className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <BellRinging className="h-5 w-5" weight="fill" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-800 sm:text-base">
            Start Tracking Your Farm
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-amber-700 sm:text-sm">
            Add your first crop or livestock record to see live dashboard metrics, financial summaries, and AI-powered insights.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────── Key Findings ─────── */
export function KeyFindings() {
  const { dashboardMetrics, metricsLoading, session } = useApp();

  const findings = useMemo(() => {
    if (!dashboardMetrics || metricsLoading) return [];
    const m = dashboardMetrics;
    const items = [];
    if (m.totalCrops > 0) {
      items.push({
        icon: Plant,
        title: `${m.totalCrops} Crops Tracked`,
        description: `Active crops currently being managed on your farm.`,
      });
    }
    if (m.totalLivestock > 0) {
      items.push({
        icon: Cow,
        title: `${m.totalLivestock} Livestock`,
        description: `All animals currently tracked in your farm records.`,
      });
    }
    if (m.totalIncome > 0 || m.totalExpenses > 0) {
      const netProfit = m.totalIncome - m.totalExpenses;
      const margin = m.totalIncome > 0 ? ((netProfit / m.totalIncome) * 100).toFixed(1) : "0";
      items.push({
        icon: PiggyBank,
        title: `Net Profit: ₦${netProfit.toLocaleString()}`,
        description: `${margin}% margin on ₦${m.totalIncome.toLocaleString()} revenue.`,
      });
    }
    if (m.unreadNotifications > 0) {
      items.push({
        icon: BellRinging,
        title: `${m.unreadNotifications} Unread Alerts`,
        description: `You have ${m.unreadNotifications} pending notifications requiring attention.`,
      });
    }
    return items;
  }, [dashboardMetrics, metricsLoading]);

  if (metricsLoading) {
    return (
      <div className="rounded-2xl border border-[#d8f3dc] bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-base font-bold text-[#1b4332] sm:text-lg">Key Findings</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-stone-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!session || findings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeInOut" as const }}
      className="rounded-2xl border border-[#d8f3dc] bg-white p-5 shadow-sm sm:p-6"
    >
      <h3 className="mb-4 text-base font-bold text-[#1b4332] sm:text-lg">
        Key Findings
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {findings.map((finding, i) => (
          <motion.div
            key={finding.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: "easeInOut" as const }}
            className="flex gap-3 rounded-xl border border-[#d8f3dc]/60 bg-[#f8f9fa] p-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d8f3dc] text-[#1b4332]">
              <finding.icon className="h-4 w-4" weight="fill" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-[#1b4332]">{finding.title}</h4>
              <p className="mt-0.5 text-xs leading-relaxed text-[#52b788]">
                {finding.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}