import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  NATIONAL_RICE_AVG,
  NE_COMMODITIES,
  STATE_PRICES_2022,
  COMMODITY_COLORS,
} from "../constants";

const formatNGN = (value: number) => `₦${value.toLocaleString()}`;

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" as const } },
};

/* ─── Chart #1: National Avg Rice Price (Area) ─── */
export function NationalRiceAreaChart() {
  return (
    <motion.div
      variants={fadeSlideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border border-[#d8f3dc] bg-white p-4 shadow-sm sm:p-6"
    >
      <h3 className="mb-1 text-sm font-semibold text-[#1b4332] sm:text-base">
        National Average Rice (Local) Price, 2018–2022
      </h3>
      <p className="mb-4 text-xs text-[#52b788]">NGN per kilogram</p>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={NATIONAL_RICE_AVG} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="riceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2d6a4f" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8f3dc" />
          <XAxis dataKey="year" tick={{ fill: "#52b788", fontSize: 12 }} />
          <YAxis tickFormatter={formatNGN} tick={{ fill: "#52b788", fontSize: 12 }} width={60} />
          <Tooltip
            formatter={(value: number) => [formatNGN(value), "Price"]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d8f3dc",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#2d6a4f"
            strokeWidth={3}
            fill="url(#riceGradient)"
            dot={{ fill: "#1b4332", stroke: "#d8f3dc", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#1b4332", stroke: "#fff", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ─── Chart #2: NE Multi-Commodity Line Chart ─── */
const ALL_COMMODITIES = [...new Set(NE_COMMODITIES.map((d) => d.commodity))];

export function NortheastMultiLineChart() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (commodity: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(commodity)) next.delete(commodity);
      else next.add(commodity);
      return next;
    });
  };

  const chartData = useMemo(() => {
    const years = [...new Set(NE_COMMODITIES.map((d) => d.year))].sort();
    return years.map((year) => {
      const row: Record<string, number | string> = { year };
      ALL_COMMODITIES.forEach((c) => {
        const entry = NE_COMMODITIES.find((d) => d.year === year && d.commodity === c);
        if (entry) row[c] = entry.price;
      });
      return row;
    });
  }, []);

  return (
    <motion.div
      variants={fadeSlideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border border-[#d8f3dc] bg-white p-4 shadow-sm sm:p-6"
    >
      <h3 className="mb-1 text-sm font-semibold text-[#1b4332] sm:text-base">
        Northeast Nigeria Price Trends by Commodity, 2018–2025
      </h3>
      <p className="mb-4 text-xs text-[#52b788]">NGN per kilogram (Fuel: NGN/Litre)</p>

      {/* Legend Toggles */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ALL_COMMODITIES.map((commodity) => {
          const active = !hidden.has(commodity);
          return (
            <button
              key={commodity}
              onClick={() => toggle(commodity)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                active
                  ? "bg-[#d8f3dc] text-[#1b4332]"
                  : "bg-gray-100 text-gray-400 line-through"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: COMMODITY_COLORS[commodity] }}
              />
              {commodity}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8f3dc" />
          <XAxis dataKey="year" tick={{ fill: "#52b788", fontSize: 12 }} />
          <YAxis tickFormatter={formatNGN} tick={{ fill: "#52b788", fontSize: 12 }} width={60} />
          <Tooltip
            formatter={(value: number) => [formatNGN(value), "Price"]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d8f3dc",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          {ALL_COMMODITIES.map((commodity) => {
            if (hidden.has(commodity)) return null;
            return (
              <Line
                key={commodity}
                type="monotone"
                dataKey={commodity}
                stroke={COMMODITY_COLORS[commodity]}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COMMODITY_COLORS[commodity] }}
                activeDot={{ r: 5 }}
                connectNulls
              />
            );
          })}
          <ReferenceLine x={2023} stroke="#e63946" strokeWidth={2} strokeDasharray="6 4">
            <Label
              value="Fuel subsidy removed (May 2023)"
              position="insideTopRight"
              fill="#e63946"
              fontSize={11}
              fontWeight={600}
              offset={10}
            />
          </ReferenceLine>
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* ─── Chart #3: Horizontal Bar Chart (State Prices 2022) ─── */
const sortedStates = [...STATE_PRICES_2022].sort((a, b) => a.price - b.price);

export function StateRiceBarChart() {
  return (
    <motion.div
      variants={fadeSlideUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border border-[#d8f3dc] bg-white p-4 shadow-sm sm:p-6"
    >
      <h3 className="mb-1 text-sm font-semibold text-[#1b4332] sm:text-base">
        Average Retail Price of Rice (Local) by State, 2022
      </h3>
      <p className="mb-4 text-xs text-[#52b788]">NGN per kilogram — sorted ascending</p>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={sortedStates}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          barCategoryGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#d8f3dc" horizontal={false} />
          <XAxis type="number" tickFormatter={formatNGN} tick={{ fill: "#52b788", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="state"
            tick={{ fill: "#1b4332", fontSize: 12, fontWeight: 500 }}
            width={70}
          />
          <Tooltip
            formatter={(value: number) => [formatNGN(value), "Price"]}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #d8f3dc",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          />
          <Bar dataKey="price" radius={[0, 6, 6, 0]} maxBarSize={20}>
            {sortedStates.map((entry, index) => {
              let fill = "#52b788";
              if (entry.isLowest) fill = "#2d6a4f";
              if (entry.isHighest) fill = "#e63946";
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}