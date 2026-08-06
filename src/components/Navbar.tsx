import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  X,
  Leaf,
  ChartLineUp,
  Tractor,
  CurrencyNgn,
  Lightbulb,
  User,
  GridFour,
  Coins,
  Bell,
  FileText,
  CloudSun,
  Question,
  CurrencyDollar,
} from "@phosphor-icons/react";
import { useApp, type Tab } from "../context/AppContext";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: GridFour },
  { id: "crops", label: "Crops", icon: Leaf },
  { id: "livestock", label: "Livestock", icon: Tractor },
  { id: "finances", label: "Finances", icon: Coins },
  { id: "market-prices", label: "Market Prices", icon: ChartLineUp },
  { id: "weather", label: "Weather", icon: CloudSun },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "insights", label: "AI Insights", icon: Lightbulb },
  { id: "profile", label: "Profile", icon: User },
  { id: "about", label: "About", icon: Question },
];

export default function Navbar() {
  const { activeTab, setActiveTab, currency, setCurrency, dashboardMetrics, session } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const unreadCount = dashboardMetrics.unreadNotifications;

  const toggleCurrency = () => {
    setCurrency(currency === "NGN" ? "USD" : "NGN");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-green-500 shadow-sm">
            <Leaf size={20} weight="fill" className="text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold tracking-tight text-emerald-900">
              AgriTrack
            </span>
            <span className="ml-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
              AI
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "text-emerald-700"
                    : "text-gray-500 hover:text-emerald-600"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg bg-emerald-50"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={16} weight={isActive ? "fill" : "regular"} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Side: Currency Toggle + Notifications */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleCurrency}
            className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border border-stone-200"
            title="Toggle currency"
          >
            {currency === "NGN" ? (
              <CurrencyNgn size={14} weight="bold" />
            ) : (
              <CurrencyDollar size={14} weight="bold" />
            )}
            <span>{currency}</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <Bell size={18} weight={unreadCount > 0 ? "fill" : "regular"} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
            {/* Notification Dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
                    <h3 className="text-sm font-semibold text-stone-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          );
                        }}
                        className="text-[10px] font-medium text-emerald-700 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {(notifications || []).length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell size={24} className="mx-auto text-stone-300" />
                        <p className="text-xs text-stone-500 mt-2">No notifications yet</p>
                      </div>
                    ) : (
                      (notifications || []).map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b border-stone-50 last:border-0 hover:bg-stone-50 cursor-pointer transition-colors ${
                            !n.read ? "bg-emerald-50/50" : ""
                          }`}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((no) =>
                                no.id === n.id ? { ...no, read: true } : no
                              )
                            );
                          }}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            n.type === "alert" ? "bg-red-100" : n.type === "weather" ? "bg-blue-100" : n.type === "reminder" ? "bg-amber-100" : "bg-stone-100"
                          }`}>
                            <Bell size={14} className={
                              n.type === "alert" ? "text-red-600" : n.type === "weather" ? "text-blue-600" : n.type === "reminder" ? "text-amber-600" : "text-stone-600"
                            } weight="fill" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-stone-900">{n.title}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{n.description}</p>
                            <p className="text-[9px] text-stone-400 mt-0.5">{n.date}</p>
                          </div>
                          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />}
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 md:hidden"
          >
            {mobileOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-emerald-100 bg-white md:hidden"
          >
            <div className="grid grid-cols-2 gap-1 p-3">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                    }`}
                  >
                    <Icon size={18} weight={isActive ? "fill" : "regular"} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}