import { motion } from "framer-motion";
import {
  BookmarkSimple,
  ChartLineUp,
  Sparkle,
  Leaf,
  Tractor,
  Coins,
  CloudSun,
  TrendUp,
  Target,
  CheckCircle,
} from "@phosphor-icons/react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const ease = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    icon: BookmarkSimple,
    title: "Digital Records",
    subtitle: "Every detail, one place",
    description:
      "Streamlined tracking of crops, livestock, financial transactions, and daily operational logs. Keep your whole farm organized without the paper trail.",
    tags: ["Crops", "Livestock", "Finances", "Weather"],
    accent: "from-emerald-600 to-green-500",
    chip: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ChartLineUp,
    title: "Performance Insights",
    subtitle: "Know what works",
    description:
      "Real-time analytics, revenue and cost charts, market price comparisons, and yield projections that turn raw numbers into clear next steps.",
    tags: ["Trends", "Revenue", "Yield", "Markets"],
    accent: "from-blue-600 to-cyan-500",
    chip: "bg-blue-50 text-blue-700",
  },
  {
    icon: Sparkle,
    title: "AI Farming Tips",
    subtitle: "Smarter guidance, on time",
    description:
      "Intelligent, data-driven recommendations for harvest timing, crop health alerts, and irrigation schedules so you can act at the right moment.",
    tags: ["Harvest", "Health", "Irrigation"],
    accent: "from-amber-500 to-orange-500",
    chip: "bg-amber-50 text-amber-700",
  },
];

const IMPACT = [
  { icon: Target, value: "90%+", label: "Data-driven yields" },
  { icon: Leaf, value: "100%", label: "Localized Nigerian commodity tracking" },
  { icon: Sparkle, value: "24/7", label: "Smart AI farm assistant" },
];

export default function AboutTab() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-green-300/20 blur-2xl" />
        <motion.span
          {...fadeUp}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur"
        >
          <Leaf size={14} weight="fill" />
          AgriTrack AI
        </motion.span>
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl"
        >
          Your farm data, working for you.
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.12, ease }}
          className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-emerald-50 sm:text-base"
        >
          AgriTrack AI helps Nigerian farmers capture, understand, and act on
          everything happening across the farm. From planting to market, we
          turn field data into better decisions.
        </motion.p>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-3xl text-center">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, ease }}
          className="text-sm font-semibold uppercase tracking-widest text-emerald-600"
        >
          Our mission
        </motion.p>
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.05, ease }}
          className="mt-4 text-3xl font-bold leading-tight tracking-tight text-stone-900 sm:text-4xl"
        >
          Turning Farm Data into{" "}
          <span className="text-emerald-600">Better Decisions</span>
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-4 text-base leading-relaxed text-stone-500"
        >
          Every record you keep should earn its place. We make it effortless to
          log what matters, read the signals, and act with confidence.
        </motion.p>
      </section>

      {/* Key Features */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              whileHover={{ y: -6 }}
              className="group flex flex-col rounded-2xl border border-stone-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-xl"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feat.accent} text-white shadow-md`}
              >
                <Icon size={24} weight="fill" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">{feat.title}</h3>
              <p className="mt-0.5 text-sm font-medium text-emerald-600">
                {feat.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-stone-500">
                {feat.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {feat.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${feat.chip}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Impact stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {IMPACT.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease }}
              className="flex items-center gap-4 rounded-2xl border border-stone-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon size={22} weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{item.value}</p>
                <p className="text-xs text-stone-500">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Why it matters */}
      <motion.section
        {...fadeUp}
        transition={{ duration: 0.6, ease }}
        className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-8 sm:p-10"
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <TrendUp size={28} weight="fill" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              Built for the way farmers actually work
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Simple on the surface, powerful underneath. Track it once, get
              insights everywhere, and let AI point you to the next best move
              on your farm.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {["Digital-first records", "Local market awareness", "AI where you need it"].map(
            (point) => (
              <span
                key={point}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm"
              >
                <CheckCircle size={14} weight="fill" />
                {point}
              </span>
            )
          )}
        </div>
      </motion.section>
    </div>
  );
}