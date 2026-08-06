import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartLineUp, MagnifyingGlass, TrendUp, TrendDown,
  ArrowUp, ArrowDown, Grains, Drop, CurrencyNgn,
  MapPinLine, Funnel, CaretDown, CaretUp,
  Fire, Basket, CookingPot, GasPump, ChartBar,
  ListBullets, Clock, SealCheck, Star,
} from "@phosphor-icons/react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { cn } from "../lib/utils";
import { NE_COMMODITIES, STATE_PRICES_2022, COMMODITY_COLORS } from "../constants";

/* ─── Types ─── */
type CommodityKey = "Rice (Local)" | "Beans" | "Vegetable Oil" | "Maize (White)" | "Bread" | "Fuel (Petrol)";
type Category = "All" | "Grains" | "Oils" | "Bakery" | "Energy";
type TimeRange = "1M" | "3M" | "6M" | "1Y";

interface CommodityInfo {
  key: CommodityKey;
  label: string;
  icon: React.ElementType;
  category: Category;
  color: string;
  currentPrice: number;
  changePct: number;
  unit: string;
}

const COMMODITIES: CommodityInfo[] = [
  { key: "Rice (Local)", label: "Rice (Local)", icon: Grains, category: "Grains", color: "#1b4332", currentPrice: 2520, changePct: 20.0, unit: "kg" },
  { key: "Beans", label: "Beans", icon: Drop, category: "Grains", color: "#e07a5f", currentPrice: 1700, changePct: 21.4, unit: "kg" },
  { key: "Vegetable Oil", label: "Vegetable Oil", icon: CookingPot, category: "Oils", color: "#f4a261", currentPrice: 1900, changePct: 18.8, unit: "litre" },
  { key: "Maize (White)", label: "Maize (White)", icon: Grains, category: "Grains", color: "#e9c46a", currentPrice: 1300, changePct: 23.8, unit: "kg" },
  { key: "Bread", label: "Bread", icon: Basket, category: "Bakery", color: "#a8dadc", currentPrice: 1150, changePct: 25.0, unit: "loaf" },
  { key: "Fuel (Petrol)", label: "Fuel (Petrol)", icon: GasPump, category: "Energy", color: "#e63946", currentPrice: 1050, changePct: 23.5, unit: "litre" },
];

const CATEGORIES: { key: Category; label: string; icon: React.ElementType }[] = [
  { key: "All", label: "All", icon: ChartLineUp },
  { key: "Grains", label: "Grains", icon: Grains },
  { key: "Oils", label: "Oils", icon: CookingPot },
  { key: "Bakery", label: "Bakery", icon: Basket },
  { key: "Energy", label: "Energy", icon: Fire },
];

const TIME_RANGES: TimeRange[] = ["1M", "3M", "6M", "1Y"];
const NGN = (v: number) => `₦${v.toLocaleString()}`;

/* ─── Commodity Card ─── */
function CommodityCard({ commodity, index }: { commodity: CommodityInfo; index: number }) {
  const isUp = commodity.changePct >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-lg border border-stone-100 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: `${commodity.color}20`, color: commodity.color }}
        >
          <commodity.icon className="w-5 h-5" weight="fill" />
        </div>
        <span
          className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
            isUp ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
          )}
        >
          {isUp ? <ArrowUp className="w-3 h-3" weight="bold" /> : <ArrowDown className="w-3 h-3" weight="bold" />}
          {Math.abs(commodity.changePct).toFixed(1)}%
        </span>
      </div>
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{commodity.label}</p>
      <p className="text-2xl font-bold text-stone-900 mt-1">{NGN(commodity.currentPrice)}</p>
      <p className="text-xs text-stone-400 mt-1">per {commodity.unit}</p>
    </motion.div>
  );
}

/* ─── Price Trend Chart ─── */
function PriceTrendChart({ selectedCommodity }: { selectedCommodity: CommodityKey }) {
  const data = useMemo(() => {
    return NE_COMMODITIES
      .filter(d => d.commodity === selectedCommodity)
      .sort((a, b) => a.year - b.year)
      .map(d => ({ year: d.year, price: d.price }));
  }, [selectedCommodity]);

  const color = COMMODITY_COLORS[selectedCommodity] || "#10b981";

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100">
      <h3 className="text-sm font-semibold text-stone-700 mb-1 flex items-center gap-2">
        <ChartLineUp className="w-4 h-4 text-emerald-500" weight="fill" />
        Price Trend — {selectedCommodity}
      </h3>
      <p className="text-xs text-stone-400 mb-4">NGN per unit — 2018 to 2025</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="year" tick={{ fill: "#78716c", fontSize: 12 }} />
          <YAxis tickFormatter={NGN} tick={{ fill: "#78716c", fontSize: 11 }} width={60} />
          <Tooltip
            formatter={(value: number) => [NGN(value), "Price"]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          />
          <Line
            type="monotone" dataKey="price" stroke={color} strokeWidth={3}
            dot={{ fill: color, stroke: "#fff", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Price by State Matrix ─── */
function PriceByState({ selectedCommodity }: { selectedCommodity: CommodityKey }) {
  const sortedStates = useMemo(() => {
    return [...STATE_PRICES_2022].sort((a, b) => a.price - b.price);
  }, []);

  const lowest = sortedStates[0];
  const highest = sortedStates[sortedStates.length - 1];
  const range = highest.price - lowest.price;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
          <MapPinLine className="w-4 h-4 text-emerald-500" weight="fill" />
          Price by State – {selectedCommodity} (2022)
        </h3>
        <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full">
          ₦{lowest.price.toLocaleString()} – ₦{highest.price.toLocaleString()}
        </span>
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <TrendDown className="w-4 h-4 text-emerald-600" weight="fill" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium">Lowest Price</p>
            <p className="text-sm font-bold text-emerald-800">{lowest.state} — {NGN(lowest.price)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
          <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
            <TrendUp className="w-4 h-4 text-rose-600" weight="fill" />
          </div>
          <div>
            <p className="text-xs text-rose-600 font-medium">Highest Price</p>
            <p className="text-sm font-bold text-rose-800">{highest.state} — {NGN(highest.price)}</p>
          </div>
        </div>
      </div>

      {/* State Bar Chart */}
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={sortedStates} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }} barCategoryGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
          <XAxis type="number" tickFormatter={NGN} tick={{ fill: "#78716c", fontSize: 11 }} />
          <YAxis type="category" dataKey="state" tick={{ fill: "#44403c", fontSize: 11, fontWeight: 500 }} width={65} />
          <Tooltip
            formatter={(value: number) => [NGN(value), "Price"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }}
          />
          <Bar dataKey="price" radius={[0, 6, 6, 0]} maxBarSize={18}>
            {sortedStates.map((entry, idx) => {
              const pct = (entry.price - lowest.price) / range;
              const intensity = Math.round(100 + pct * 155);
              const r = Math.min(220, Math.round(100 + pct * 120));
              const g = Math.max(60, Math.round(180 - pct * 120));
              return <Cell key={`cell-${idx}`} fill={`rgb(${r},${g},60)`} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ─── Latest Prices Table ─── */
function PricesTable() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-stone-100">
      <h3 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
        <ListBullets className="w-4 h-4 text-emerald-500" weight="fill" />
        Latest Prices Snapshot — Northeast Nigeria (2025)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              <th className="text-left px-4 py-3 font-semibold text-stone-600">Commodity</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">2018</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">2022</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">2025</th>
              <th className="text-right px-4 py-3 font-semibold text-stone-600">Change</th>
            </tr>
          </thead>
          <tbody>
            {COMMODITIES.map((c, i) => {
              const d2018 = NE_COMMODITIES.find(d => d.commodity === c.key && d.year === 2018);
              const d2022 = NE_COMMODITIES.find(d => d.commodity === c.key && d.year === 2022);
              const d2025 = NE_COMMODITIES.find(d => d.commodity === c.key && d.year === 2025);
              const pctChange = d2018 && d2025 ? ((d2025.price - d2018.price) / d2018.price * 100) : 0;
              const isUp = pctChange >= 0;
              return (
                <motion.tr
                  key={c.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                  className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-medium text-stone-800">{c.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">{d2018 ? NGN(d2018.price) : "—"}</td>
                  <td className="px-4 py-3 text-right text-stone-600">{d2022 ? NGN(d2022.price) : "—"}</td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-800">{d2025 ? NGN(d2025.price) : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", isUp ? "text-rose-600" : "text-emerald-600")}>
                      {isUp ? <ArrowUp className="w-3 h-3" weight="bold" /> : <ArrowDown className="w-3 h-3" weight="bold" />}
                      {pctChange.toFixed(0)}%
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Main Export ─── */
export default function MarketPricesTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityKey>("Rice (Local)");
  const [timeRange, setTimeRange] = useState<TimeRange>("1Y");
  const [showFilters, setShowFilters] = useState(false);
  const [mounted, setMounted] = useState(true);

  const filtered = useMemo(() => {
    return COMMODITIES.filter(c => {
      const matchSearch = !search || c.label.toLowerCase().includes(search.toLowerCase());
      const matchCategory = category === "All" || c.category === category;
      return matchSearch && matchCategory;
    });
  }, [search, category]);

  return (
    <div className="space-y-6">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <ChartLineUp className="w-6 h-6 text-emerald-500" weight="fill" />
            Market Prices
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Nigerian farm commodity prices — Northeast benchmark data
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Currency badge */}
          <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 shadow-sm border border-stone-200">
            <CurrencyNgn className="w-4 h-4 text-emerald-500" weight="bold" />
            <span className="text-sm font-semibold text-stone-700">NGN</span>
          </div>
          {/* Time range */}
          <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-stone-200">
            {TIME_RANGES.map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  timeRange === r
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Search & Filters ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
      >
        <div className="relative flex-1">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" weight="bold" />
          <input
            type="text"
            placeholder="Search commodities..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition-shadow"
          />
        </div>
        <div className="flex gap-1.5 bg-stone-100 rounded-xl p-1 overflow-x-auto">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                )}
              >
                <Icon size={14} weight={isActive ? "fill" : "regular"} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ─── Commodity Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {filtered.map((c, i) => (
          <button
            key={c.key}
            onClick={() => setSelectedCommodity(c.key)}
            className="text-left w-full"
          >
            <CommodityCard commodity={c} index={i} />
          </button>
        ))}
      </div>

      {/* ─── Charts Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceTrendChart selectedCommodity={selectedCommodity} />
        <PriceByState selectedCommodity={selectedCommodity} />
      </div>

      {/* ─── Prices Table ─── */}
      <PricesTable />
    </div>
  );
}