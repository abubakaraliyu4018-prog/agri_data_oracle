import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { supabase } from "./integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import { AppProvider, useApp } from "./context/AppContext";
import { NationalRiceAreaChart, NortheastMultiLineChart, StateRiceBarChart } from "./components/DashboardCharts";
import { StatCards, DataAlert, KeyFindings } from "./components/StatCardsAndNotice";
import { CropsTab } from "./components/TabPanels";
import { ReportsTab } from "./components/ReportsTab";
import AIInsightsTab from "./components/AIInsightsTab";
import MarketPricesTab from "./components/MarketPricesTab";
import LivestockTab from "./components/LivestockTab";
import FinancesTab from "./components/FinancesTab";
import WeatherTab from "./components/WeatherTab";
import ProfileTab from "./components/ProfileTab";
import AboutTab from "./components/AboutTab";
import { motion } from "framer-motion";

function MainContent() {
  const { activeTab } = useApp();

  return (
    <main className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <StatCards />
            <DataAlert />
            <KeyFindings />
            <NationalRiceAreaChart />
            <NortheastMultiLineChart />
            <StateRiceBarChart />
          </div>
        )}
        {activeTab === "crops" && <CropsTab />}
        {activeTab === "livestock" && <LivestockTab />}
        {activeTab === "reports" && <ReportsTab />}
        {activeTab === "finances" && <FinancesTab />}
        {activeTab === "weather" && <WeatherTab />}
        {activeTab === "market-prices" && <MarketPricesTab />}
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "insights" && <AIInsightsTab />}
        {activeTab === "about" && <AboutTab />}
      </motion.div>
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <AuthPage />
        <Toaster position="top-right" richColors />
      </>
    );
  }

  return (
    <AppProvider session={session}>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <Toaster position="top-right" richColors />
        <Navbar />
        <MainContent />
      </div>
    </AppProvider>
  );
}