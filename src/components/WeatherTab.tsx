import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CloudSun, Sun, Cloud, CloudRain, CloudFog, CloudLightning, Snowflake,
  Drop, Wind, Thermometer, MapPin, MapPinLine, ArrowRight, Calendar, Sparkle, Gauge,
} from "@phosphor-icons/react";
import { supabase } from "../integrations/supabase/client";
import { useApp } from "../context/AppContext";
import { STATE_WEATHER, NIGERIAN_STATES } from "../constants";

/* ─── State → Coordinates (Open-Meteo) ─── */
const STATE_COORDS: Record<string, { lat: number; lon: number }> = {
  "Lagos": { lat: 6.5244, lon: 3.3792 },
  "Abuja": { lat: 9.0765, lon: 7.3986 },
  "Kano": { lat: 12.0022, lon: 8.5920 },
  "Rivers": { lat: 4.8156, lon: 7.0498 },
  "Oyo": { lat: 7.3775, lon: 3.9470 },
  "Kaduna": { lat: 10.5264, lon: 7.4388 },
  "Benue": { lat: 7.7337, lon: 8.5376 },
  "Delta": { lat: 5.8980, lon: 5.6759 },
  "Ogun": { lat: 7.1587, lon: 3.3487 },
  "Enugu": { lat: 6.4403, lon: 7.4943 },
  "Plateau": { lat: 9.2182, lon: 9.5179 },
  "Borno": { lat: 11.8333, lon: 13.1500 },
  "Edo": { lat: 6.3176, lon: 5.6145 },
  "Kwara": { lat: 8.4799, lon: 4.5418 },
  "Niger": { lat: 9.5833, lon: 6.5500 },
  "Kebbi": { lat: 12.4500, lon: 4.2000 },
  "Sokoto": { lat: 13.0059, lon: 5.2476 },
  "Anambra": { lat: 6.2100, lon: 6.9500 },
  "Akwa Ibom": { lat: 5.0500, lon: 7.9333 },
  "Cross River": { lat: 5.7500, lon: 8.5000 },
  "Gombe": { lat: 10.2833, lon: 11.1667 },
  "Taraba": { lat: 8.0000, lon: 10.5000 },
  "Yobe": { lat: 12.0000, lon: 11.5000 },
  "Zamfara": { lat: 12.1667, lon: 6.6500 },
  "Kogi": { lat: 7.8000, lon: 6.7333 },
  "Ekiti": { lat: 7.6167, lon: 5.2167 },
  "Osun": { lat: 7.7667, lon: 4.5667 },
  "Ondo": { lat: 7.2500, lon: 5.2000 },
  "Bauchi": { lat: 10.3100, lon: 9.8400 },
  "Jigawa": { lat: 11.8000, lon: 9.3500 },
  "Katsina": { lat: 12.2500, lon: 7.5167 },
  "Adamawa": { lat: 9.3333, lon: 12.5000 },
  "Bayelsa": { lat: 4.7500, lon: 6.0000 },
  "Ebonyi": { lat: 6.2500, lon: 8.1000 },
  "Imo": { lat: 5.4833, lon: 7.0333 },
  "Nasarawa": { lat: 8.5500, lon: 7.7000 },
  "Abia": { lat: 5.5333, lon: 7.4833 },
  "FCT (Abuja)": { lat: 9.0765, lon: 7.3986 },
};

/* ─── Weather code → icon + label ─── */
function weatherFromCode(code: number): { icon: React.ElementType; label: string } {
  if (code === 0) return { icon: Sun, label: "Clear Sky" };
  if (code <= 2) return { icon: CloudSun, label: "Partly Cloudy" };
  if (code === 3) return { icon: Cloud, label: "Overcast" };
  if (code >= 45 && code <= 48) return { icon: CloudFog, label: "Foggy" };
  if (code >= 51 && code <= 57) return { icon: CloudRain, label: "Drizzle" };
  if (code >= 61 && code <= 67) return { icon: CloudRain, label: "Rain" };
  if (code >= 71 && code <= 77) return { icon: Snowflake, label: "Snow" };
  if (code >= 80 && code <= 82) return { icon: CloudRain, label: "Rain Showers" };
  if (code >= 95) return { icon: CloudLightning, label: "Thunderstorm" };
  return { icon: CloudSun, label: "Unknown" };
}

function dayName(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

/* ─── Open-Meteo API types ─── */
interface OpenMeteoCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  wind_speed_10m: number;
}
interface OpenMeteoDaily {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weather_code: number[];
  precipitation_sum: number[];
  wind_speed_10m_max: number[];
}
interface OpenMeteoResponse {
  current: OpenMeteoCurrent;
  daily: OpenMeteoDaily;
}

/* ─── WeatherTab ─── */
export default function WeatherTab() {
  const { session, setActiveTab } = useApp();
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [fallback, setFallback] = useState<typeof STATE_WEATHER["Lagos"] | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* ── Fetch user's state from profiles ── */
  useEffect(() => {
    if (!session?.user?.id) { setProfileLoading(false); return; }
    (async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("state")
        .eq("id", session.user.id)
        .single();
      if (error) {
        console.warn("Profile fetch error:", error.message);
      }
      if (profile?.state) {
        setLocation(profile.state);
      } else {
        setLocation("");
      }
      setProfileLoading(false);
    })();
  }, [session?.user?.id]);

  /* ── Fetch weather data ── */
  const fetchWeather = useCallback(async (state: string) => {
    setLoading(true);
    const coords = STATE_COORDS[state] || { lat: 6.5244, lon: 3.3792 };
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max` +
        `&timezone=auto&forecast_days=7`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: OpenMeteoResponse = await res.json();
      setData(json);
      setFallback(null);
    } catch (err: any) {
      console.warn("Open-Meteo fetch failed, using fallback data", err.message);
      setData(null);
      const fb = STATE_WEATHER[state] || STATE_WEATHER["Lagos"];
      setFallback(fb);
      if (state) toast.error("Live weather unavailable, showing typical data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profileLoading) {
      const state = location || "Lagos";
      fetchWeather(state);
    }
  }, [profileLoading, location, fetchWeather]);

  /* ── Derived state display ── */
  const stateName = location || "Lagos";
  const fb = STATE_WEATHER[stateName] || STATE_WEATHER["Lagos"];

  /* ── Stats from live or fallback ── */
  const currentTemp = data ? Math.round(data.current.temperature_2m) : fb.temp;
  const currentHumidity = data ? data.current.relative_humidity_2m : fb.humidity;
  const currentRainfall = data ? Math.round(data.current.rain || data.current.precipitation) : fb.rainfall;
  const currentWind = data ? Math.round(data.current.wind_speed_10m) : 12;
  const currentIcon = data ? weatherFromCode(data.current.weather_code) : { icon: CloudSun, label: fb.condition };
  const CurrentIcon = currentIcon.icon;
  const advice = fb.advice;

  const dailyData = data?.daily;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <CloudSun size={22} weight="fill" className="text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Weather & Climate</h2>
            <p className="text-sm text-stone-500">Real-time conditions for your farm</p>
          </div>
        </div>
        {location && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 text-xs font-medium text-stone-600">
            <MapPinLine size={14} weight="fill" />
            {location}
          </div>
        )}
      </div>

      {/* ── Location prompt ── */}
      {!profileLoading && !location && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <MapPin size={20} className="text-amber-600" weight="fill" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-amber-800">Farm Location Not Set</h3>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Set your farm location in the Profile page to get accurate weather data for your area.
              Showing Lagos weather by default.
            </p>
            <button
              onClick={() => setActiveTab("profile")}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
            >
              <ArrowRight size={14} weight="bold" />
              Go to Profile
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div className="space-y-4">
          <div className="h-48 rounded-2xl bg-stone-100 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-stone-100 animate-pulse" />)}
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* ── Current Conditions Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="relative overflow-hidden bg-gradient-to-br from-sky-500 to-sky-700 rounded-2xl p-6 text-white shadow-xl"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Temp + Icon */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <CurrentIcon size={44} weight="fill" />
                </div>
                <div>
                  <div className="flex items-start">
                    <span className="text-5xl font-bold tracking-tight">{currentTemp}</span>
                    <span className="text-2xl font-bold mt-1">°C</span>
                  </div>
                  <p className="text-sm font-medium text-white/80 mt-0.5">{currentIcon.label}</p>
                </div>
              </div>
              {/* Right: Quick stats */}
              <div className="grid grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <Drop size={20} weight="fill" className="mx-auto text-white/80" />
                  <p className="text-lg font-bold mt-1">{currentHumidity}%</p>
                  <p className="text-xs text-white/60">Humidity</p>
                </div>
                <div className="text-center">
                  <CloudRain size={20} weight="fill" className="mx-auto text-white/80" />
                  <p className="text-lg font-bold mt-1">{currentRainfall}mm</p>
                  <p className="text-xs text-white/60">Rainfall</p>
                </div>
                <div className="text-center">
                  <Wind size={20} weight="fill" className="mx-auto text-white/80" />
                  <p className="text-lg font-bold mt-1">{currentWind}km/h</p>
                  <p className="text-xs text-white/60">Wind</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Farming Advice Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3"
          >
            <Sparkle size={20} weight="fill" className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Farming Advisory</p>
              <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{advice}</p>
            </div>
          </motion.div>

          {/* ── 7-Day Forecast ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-stone-100 shadow-lg p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} weight="fill" className="text-sky-500" />
              <h3 className="text-sm font-semibold text-stone-700">7-Day Forecast</h3>
            </div>
            {dailyData ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {dailyData.time.map((date, i) => {
                  const { icon: DayIcon, label } = weatherFromCode(dailyData.weather_code[i]);
                  return (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={mounted ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.3, delay: 0.35 + i * 0.05, ease: "easeOut" }}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
                    >
                      <span className="text-xs font-semibold text-stone-500">{dayName(date)}</span>
                      <DayIcon size={22} weight="fill" className="text-sky-500" />
                      <div className="flex items-center gap-1 text-xs">
                        <span className="font-bold text-stone-800">{Math.round(dailyData.temperature_2m_max[i])}°</span>
                        <span className="text-stone-400">{Math.round(dailyData.temperature_2m_min[i])}°</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{Math.round(dailyData.precipitation_sum[i])}mm</span>
                    </motion.div>
                  );
                })}
              </div>
            ) : fallback ? (
              <div className="text-center py-6 text-stone-400 text-sm">
                <Gauge size={32} weight="thin" className="mx-auto mb-2 text-stone-300" />
                Forecast unavailable — showing typical seasonal data
              </div>
            ) : null}
          </motion.div>

          {/* ── Additional Stats Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Thermometer, label: "Feels Like", value: `${currentTemp}°C`, color: "rose" },
              { icon: Drop, label: "Soil Moisture", value: `${Math.min(100, currentHumidity + 10)}%`, color: "cyan" },
              { icon: Wind, label: "Wind Gust", value: `${currentWind + 5}km/h`, color: "blue" },
              { icon: CloudRain, label: "Rain Chance", value: `${Math.min(100, currentRainfall * 2)}%`, color: "indigo" },
            ].map((stat, i) => {
              const colorMap: Record<string, string> = {
                rose: "bg-rose-50 text-rose-600",
                cyan: "bg-cyan-50 text-cyan-600",
                blue: "bg-blue-50 text-blue-600",
                indigo: "bg-indigo-50 text-indigo-600",
              };
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={mounted ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.4 + i * 0.06, ease: "easeOut" }}
                  className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[stat.color]}`}>
                      <stat.icon size={16} weight="fill" />
                    </div>
                  </div>
                  <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-stone-800 mt-0.5">{stat.value}</p>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}