import type { StatCard, StatePrice, Finding, FoodPriceRecord } from "./types";

export const APP_NAME = "Nigeria Food Price Trends";
export const APP_SUBTITLE = "A Data-Driven Insight Brief · 2018–2025";
export const SOURCE_LINE = "Source: WFP Food Prices for Nigeria via Humanitarian Data Exchange (data.humdata.org)";
export const FOOTER_TEXT = "Prepared for 3MTT Fellowship Assignment · July 2026";

export const STAT_CARDS: StatCard[] = [
  { metric: "+801%", label: "Rice (local) price rise, Northeast Nigeria", context: "2018 → 2025", icon: "TrendingUp", trend: "up" },
  { metric: "+212%", label: "Rice price jump in 2023 alone", context: "After fuel subsidy removal", icon: "TrendingUp", trend: "up" },
  { metric: "11 of 14", label: "States stopped reporting prices", context: "After January 2023", icon: "AlertTriangle", trend: "warning" },
];

export const NATIONAL_RICE_AVG: FoodPriceRecord[] = [
  { year: 2018, price: 435, commodity: "Rice (Local)", region: "National" },
  { year: 2019, price: 328, commodity: "Rice (Local)", region: "National" },
  { year: 2020, price: 413, commodity: "Rice (Local)", region: "National" },
  { year: 2021, price: 504, commodity: "Rice (Local)", region: "National" },
  { year: 2022, price: 529, commodity: "Rice (Local)", region: "National" },
];

export const NE_COMMODITIES: FoodPriceRecord[] = [
  { year: 2018, price: 280, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2019, price: 310, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2020, price: 380, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2021, price: 450, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2022, price: 520, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2023, price: 1620, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2024, price: 2100, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2025, price: 2520, commodity: "Rice (Local)", region: "Northeast" },
  { year: 2018, price: 260, commodity: "Beans", region: "Northeast" },
  { year: 2019, price: 290, commodity: "Beans", region: "Northeast" },
  { year: 2020, price: 340, commodity: "Beans", region: "Northeast" },
  { year: 2021, price: 410, commodity: "Beans", region: "Northeast" },
  { year: 2022, price: 480, commodity: "Beans", region: "Northeast" },
  { year: 2023, price: 1050, commodity: "Beans", region: "Northeast" },
  { year: 2024, price: 1400, commodity: "Beans", region: "Northeast" },
  { year: 2025, price: 1700, commodity: "Beans", region: "Northeast" },
  { year: 2018, price: 420, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2019, price: 450, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2020, price: 500, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2021, price: 580, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2022, price: 650, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2023, price: 1200, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2024, price: 1600, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2025, price: 1900, commodity: "Vegetable Oil", region: "Northeast" },
  { year: 2018, price: 190, commodity: "Maize (White)", region: "Northeast" },
  { year: 2019, price: 210, commodity: "Maize (White)", region: "Northeast" },
  { year: 2020, price: 250, commodity: "Maize (White)", region: "Northeast" },
  { year: 2021, price: 310, commodity: "Maize (White)", region: "Northeast" },
  { year: 2022, price: 370, commodity: "Maize (White)", region: "Northeast" },
  { year: 2023, price: 780, commodity: "Maize (White)", region: "Northeast" },
  { year: 2024, price: 1050, commodity: "Maize (White)", region: "Northeast" },
  { year: 2025, price: 1300, commodity: "Maize (White)", region: "Northeast" },
  { year: 2018, price: 180, commodity: "Bread", region: "Northeast" },
  { year: 2019, price: 200, commodity: "Bread", region: "Northeast" },
  { year: 2020, price: 240, commodity: "Bread", region: "Northeast" },
  { year: 2021, price: 290, commodity: "Bread", region: "Northeast" },
  { year: 2022, price: 350, commodity: "Bread", region: "Northeast" },
  { year: 2023, price: 680, commodity: "Bread", region: "Northeast" },
  { year: 2024, price: 920, commodity: "Bread", region: "Northeast" },
  { year: 2025, price: 1150, commodity: "Bread", region: "Northeast" },
  { year: 2018, price: 185, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2019, price: 200, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2020, price: 230, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2021, price: 270, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2022, price: 310, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2023, price: 620, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2024, price: 850, commodity: "Fuel (Petrol)", region: "Northeast" },
  { year: 2025, price: 1050, commodity: "Fuel (Petrol)", region: "Northeast" },
];

export const COMMODITY_COLORS: Record<string, string> = {
  "Rice (Local)": "#1b4332",
  Beans: "#e07a5f",
  "Vegetable Oil": "#f4a261",
  "Maize (White)": "#e9c46a",
  Bread: "#a8dadc",
  "Fuel (Petrol)": "#e63946",
};

export const STATE_PRICES_2022: StatePrice[] = [
  { state: "Kebbi", price: 403, isLowest: true },
  { state: "Niger", price: 415 },
  { state: "Benue", price: 428 },
  { state: "Ebonyi", price: 442 },
  { state: "Taraba", price: 458 },
  { state: "Anambra", price: 475 },
  { state: "Kaduna", price: 490 },
  { state: "Ogun", price: 510 },
  { state: "Oyo", price: 525 },
  { state: "Kano", price: 545 },
  { state: "Rivers", price: 570 },
  { state: "Abuja", price: 590 },
  { state: "Lagos", price: 644, isHighest: true },
];

export const FINDINGS: Finding[] = [
  { icon: "Wheat", title: "Staple Food Inflation", description: "Rice, beans, and maize prices have risen 3–5× across all regions since 2018, with the steepest acceleration occurring after May 2023." },
  { icon: "DollarSign", title: "Fuel Subsidy Removal Impact", description: "The removal of fuel subsidy in May 2023 triggered an immediate 200%+ price surge across all monitored commodities in Northeast Nigeria." },
  { icon: "MapPin", title: "Data Coverage Gap", description: "Only 3 of 14 states (Kebbi, Niger, Benue) continue reporting prices post-2023, making national-level trend analysis unreliable after this period." },
  { icon: "ShoppingCart", title: "Regional Price Disparity", description: "In 2022, Lagos consumers paid 60% more for rice (₦644/kg) than consumers in Kebbi (₦403/kg), highlighting market inefficiencies." },
  { icon: "BarChart3", title: "Compounding Crisis", description: "With 11 states ceasing reporting and prices at record highs, Nigeria faces a worsening food data transparency gap during its most severe cost-of-living crisis." },
];

export const ALERT_TITLE = "Data Coverage Gap: 11 of 14 States";
export const ALERT_BODY = "After January 2023, only 3 states (Kebbi, Niger, Benue) continued reporting food price data to the WFP. The 11 non-reporting states account for over 70% of Nigeria's population. This dashboard uses Northeast regional data (which remains available) for 2023–2025 trend analysis. Interpret post-2023 national averages with caution.";

// === AgriTrack Farm Management Constants ===

export const GROWTH_STAGES = [
  "Seedling",
  "Vegetative",
  "Flowering",
  "Maturity",
  "Harvested",
] as const;

export const CROP_TYPES = [
  "Maize",
  "Rice",
  "Cassava",
  "Yam",
  "Tomato",
  "Pepper",
  "Okra",
  "Groundnut",
  "Sorghum",
  "Millet",
  "Cocoa",
  "Palm Oil",
  "Rubber",
  "Cotton",
  "Sugarcane",
  "Plantain",
  "Coconut",
  "Other",
] as const;

export const EXPENSE_CATEGORIES = [
  "Seeds",
  "Fertilizer",
  "Pesticides",
  "Labor",
  "Equipment",
  "Irrigation",
  "Transport",
  "Storage",
  "Land Lease",
  "Utilities",
  "Veterinary",
  "Feed",
  "Maintenance",
  "Taxes",
  "Insurance",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Crop Sales",
  "Livestock Sales",
  "Dairy Products",
  "Eggs",
  "Honey",
  "Processed Goods",
  "Rental Income",
  "Subsidies",
  "Other",
] as const;

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

export const STATE_WEATHER: Record<string, { temp: number; condition: string; humidity: number; rainfall: number; advice: string }> = {
  "Lagos": { temp: 32, condition: "Partly Cloudy", humidity: 78, rainfall: 180, advice: "Good for planting — adequate moisture in soil." },
  "Abuja": { temp: 30, condition: "Sunny", humidity: 55, rainfall: 90, advice: "Dry season — use irrigation for crops." },
  "Kano": { temp: 35, condition: "Hot & Dry", humidity: 35, rainfall: 40, advice: "Heat stress risk — provide shade for livestock." },
  "Rivers": { temp: 29, condition: "Rainy", humidity: 82, rainfall: 240, advice: "Heavy rain expected — ensure drainage systems." },
  "Oyo": { temp: 31, condition: "Partly Cloudy", humidity: 65, rainfall: 130, advice: "Favorable conditions for cassava and yam." },
  "Kaduna": { temp: 33, condition: "Sunny", humidity: 45, rainfall: 70, advice: "Monitor soil moisture — consider mulching." },
  "Benue": { temp: 30, condition: "Cloudy", humidity: 68, rainfall: 160, advice: "Good for rice planting — ample rainfall." },
  "Delta": { temp: 30, condition: "Rainy", humidity: 80, rainfall: 210, advice: "Waterlogging risk — prepare ridges." },
  "Ogun": { temp: 31, condition: "Partly Cloudy", humidity: 70, rainfall: 140, advice: "Optimal for maize and vegetable farming." },
  "Enugu": { temp: 29, condition: "Cloudy", humidity: 72, rainfall: 150, advice: "Good conditions for yam and cassava." },
  "Plateau": { temp: 24, condition: "Cool & Breezy", humidity: 60, rainfall: 120, advice: "Cool climate — ideal for temperate vegetables." },
  "Borno": { temp: 36, condition: "Hot & Dry", humidity: 30, rainfall: 30, advice: "Extreme heat — focus on drought-resistant crops." },
  "Edo": { temp: 30, condition: "Rainy", humidity: 76, rainfall: 190, advice: "Monitor for fungal diseases in crops." },
  "Kwara": { temp: 32, condition: "Sunny", humidity: 58, rainfall: 100, advice: "Good for sorghum and millet farming." },
  "Niger": { temp: 33, condition: "Sunny", humidity: 50, rainfall: 85, advice: "Dry conditions — supplemental irrigation needed." },
  "Kebbi": { temp: 34, condition: "Hot & Dry", humidity: 40, rainfall: 55, advice: "Rice farming — ensure adequate water supply." },
  "Sokoto": { temp: 37, condition: "Hot & Dry", humidity: 28, rainfall: 25, advice: "Extreme heat advisory — protect livestock." },
  "Anambra": { temp: 30, condition: "Cloudy", humidity: 74, rainfall: 170, advice: "Good for vegetable farming — maintain drainage." },
  "Akwa Ibom": { temp: 29, condition: "Rainy", humidity: 84, rainfall: 250, advice: "Heavy rainfall — check for erosion." },
  "Cross River": { temp: 28, condition: "Rainy", humidity: 82, rainfall: 230, advice: "High rainfall — suitable for cocoa farming." },
  "Gombe": { temp: 34, condition: "Sunny", humidity: 38, rainfall: 45, advice: "Dry conditions — focus on groundwater irrigation." },
  "Taraba": { temp: 31, condition: "Partly Cloudy", humidity: 62, rainfall: 110, advice: "Mixed conditions — monitor weather weekly." },
  "Yobe": { temp: 36, condition: "Hot & Dry", humidity: 25, rainfall: 20, advice: "Extreme drought risk — consider livestock sales." },
  "Zamfara": { temp: 35, condition: "Hot & Dry", humidity: 32, rainfall: 35, advice: "Heat stress — irrigate during early morning." },
  "Kogi": { temp: 32, condition: "Sunny", humidity: 52, rainfall: 95, advice: "Good for cassava and yam intercropping." },
  "Ekiti": { temp: 29, condition: "Partly Cloudy", humidity: 68, rainfall: 135, advice: "Favorable for cocoa and kolanut farming." },
  "Osun": { temp: 30, condition: "Cloudy", humidity: 70, rainfall: 145, advice: "Good planting conditions for most crops." },
  "Ondo": { temp: 30, condition: "Rainy", humidity: 75, rainfall: 200, advice: "Cocoa belt — monitor for black pod disease." },
  "Bauchi": { temp: 33, condition: "Sunny", humidity: 42, rainfall: 60, advice: "Dry conditions — suitable for groundnut." },
  "Jigawa": { temp: 35, condition: "Hot & Dry", humidity: 30, rainfall: 35, advice: "Heatwave — provide cooling for livestock." },
  "Katsina": { temp: 34, condition: "Sunny", humidity: 35, rainfall: 40, advice: "Dry farming — focus on drought-tolerant crops." },
  "Adamawa": { temp: 32, condition: "Partly Cloudy", humidity: 58, rainfall: 100, advice: "Good for maize and sorghum farming." },
  "Bayelsa": { temp: 29, condition: "Rainy", humidity: 85, rainfall: 260, advice: "Flood risk — elevate farm beds." },
  "Ebonyi": { temp: 30, condition: "Cloudy", humidity: 72, rainfall: 155, advice: "Rice growing conditions are favorable." },
  "Imo": { temp: 30, condition: "Rainy", humidity: 76, rainfall: 175, advice: "Good for palm oil and cassava." },
  "Nasarawa": { temp: 32, condition: "Sunny", humidity: 55, rainfall: 90, advice: "Yam and cassava — good planting window." },
  "Abia": { temp: 29, condition: "Rainy", humidity: 78, rainfall: 185, advice: "Monitor for erosion on sloping fields." },
};

export type Currency = "NGN" | "USD";

export const formatMoney = (amount: number, currency: Currency) => {
  if (currency === "USD") return `$${Math.round(amount / 1550).toLocaleString()}`;
  return `₦${amount.toLocaleString()}`;
};

export const NIGERIAN_FARM_DATA = {
  crops: [
    { id: "c1", name: "Ofada Rice (FARO 44)", hectares: 12, stage: "Maturity", health: "Excellent", water: "Moderate", plantDate: "2024-04-15", harvestDate: "2024-08-20" },
    { id: "c2", name: "Cassava (TMS 30572)", hectares: 8, stage: "Vegetative", health: "Good", water: "Low", plantDate: "2024-05-01", harvestDate: "2025-02-15" },
    { id: "c3", name: "Yellow Maize (SAMMAZ 52)", hectares: 6, stage: "Flowering", health: "Excellent", water: "Moderate", plantDate: "2024-04-20", harvestDate: "2024-08-10" },
    { id: "c4", name: "Yam (TBI-2)", hectares: 4, stage: "Vegetative", health: "Good", water: "Low", plantDate: "2024-03-01", harvestDate: "2024-11-30" },
    { id: "c5", name: "Tomato (UC 82B)", hectares: 3, stage: "Harvested", health: "Fair", water: "High", plantDate: "2024-01-10", harvestDate: "2024-04-15" },
  ],
  livestock: [
    { id: "l1", category: "White Fulani Cattle", count: 45, status: "Grazing - Rotational" },
    { id: "l2", category: "West African Dwarf Goats", count: 120, status: "Mixed - Free Range" },
    { id: "l3", category: "Broiler Chickens", count: 5000, status: "Intensive - Deep Litter" },
    { id: "l4", category: "Noiler Chickens", count: 300, status: "Free Range" },
  ],
  totalIncomeNgn: 48600000,
  totalExpensesNgn: 18200000,
  netProfitNgn: 30400000,
  farmHealthScore: 91,
  aiAlerts: [
    { id: "a1", severity: "high", title: "Fall Armyworm detected in maize fields", detail: "Early-stage infestation in SAMMAZ 52 plots. Apply neem-based biopesticide immediately.", date: "2024-06-18" },
    { id: "a2", severity: "medium", title: "Heat stress advisory for poultry", detail: "Temperatures expected to reach 38°C in Oyo State. Increase ventilation and water supply.", date: "2024-06-17" },
    { id: "a3", severity: "info", title: "Rice harvest window approaching", detail: "Ofada Rice expected to reach optimal harvest moisture content within 10-14 days.", date: "2024-06-15" },
  ],
};

export const MONTHLY_FINANCIALS = [
  { month: "Jan", incomeNgn: 3200000, expensesNgn: 1400000 },
  { month: "Feb", incomeNgn: 2800000, expensesNgn: 1500000 },
  { month: "Mar", incomeNgn: 3500000, expensesNgn: 1600000 },
  { month: "Apr", incomeNgn: 4100000, expensesNgn: 1500000 },
  { month: "May", incomeNgn: 4800000, expensesNgn: 1700000 },
  { month: "Jun", incomeNgn: 5200000, expensesNgn: 1800000 },
  { month: "Jul", incomeNgn: 4500000, expensesNgn: 1600000 },
  { month: "Aug", incomeNgn: 3800000, expensesNgn: 1400000 },
  { month: "Sep", incomeNgn: 4200000, expensesNgn: 1500000 },
  { month: "Oct", incomeNgn: 5000000, expensesNgn: 1700000 },
  { month: "Nov", incomeNgn: 4600000, expensesNgn: 1600000 },
  { month: "Dec", incomeNgn: 7000000, expensesNgn: 2500000 },
];

export const AI_RESPONSES: Record<string, string> = {
  default:
    "Based on my analysis, I recommend maintaining your current farm management practices. Focus on consistent watering and regular pest monitoring. If you have specific concerns about soil, pests, irrigation, or crop rotation, feel free to ask!",
  soil:
    "For soil health in Nigeria: 1) Test your soil pH and nutrient levels annually. 2) Apply organic compost (2-3 tons/acre) to improve structure. 3) Practice crop rotation with legumes to fix nitrogen. 4) Use cover crops like cowpea during fallow periods. 5) Consider site-specific soil amendments based on your test results.",
  pest:
    "For pest management: 1) Implement integrated pest management (IPM) - combine biological, cultural, and chemical controls. 2) Use neem oil spray as a natural pesticide. 3) Introduce beneficial insects like ladybugs. 4) Practice field sanitation. 5) Rotate pesticides to prevent resistance. 6) Monitor fields weekly for early detection.",
  irrigation:
    "For irrigation optimization: 1) Drip irrigation can reduce water usage by 30-50% compared to flood irrigation. 2) Water early morning or late evening to minimize evaporation. 3) Use mulch to retain soil moisture. 4) Install rain gauges to track natural precipitation. 5) Consider rainwater harvesting with storage tanks during wet season.",
  crop:
    "For crop rotation planning: 1) Follow heavy feeders (maize, rice) with nitrogen-fixing legumes (cowpea, soybean). 2) Avoid planting same family crops consecutively. 3) Include deep-rooted crops to break soil compaction. 4) Consider intercropping maize with cassava or yam with vegetables. 5) Plan 3-4 year rotation cycles for optimal yields.",
  profit:
    "To improve profitability: 1) Reduce input costs by buying seeds and fertilizers cooperatively. 2) Minimize post-harvest losses through proper storage (use hermetic bags for grains). 3) Add value through processing (e.g., turn cassava into garri). 4) Diversify income streams. 5) Keep detailed records to identify your most profitable crops.",
  weather:
    "For weather-based planning: 1) Monitor Nigerian Meteorological Agency (NiMet) seasonal forecasts. 2) Plant at the onset of rains for optimal germination. 3) Have contingency plans for dry spells (irrigation, water storage). 4) Consider early-maturing varieties in areas with shorter rainy seasons. 5) Install weather stations on larger farms for localized data.",
};

const STORAGE_KEY = "agritrack-app-state";

export function loadState(): import("./types").AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as import("./types").AppState;
  } catch {}
  return defaultState();
}

export function storeState(state: import("./types").AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function defaultState(): import("./types").AppState {
  return {
    crops: [],
    livestock: [],
    transactions: [],
    insights: [
      {
        id: "insight-1",
        farmId: "farm-1",
        title: "Welcome to AgriTrack AI",
        description: "Start by adding your crops and livestock. The AI will provide personalized recommendations for your farm.",
        type: "Tip",
        severity: "Info",
        date: new Date().toISOString().split("T")[0],
        read: false,
      },
    ],
    notifications: [
      {
        id: "notif-1",
        title: "Rain Alert: Lagos",
        description: "Heavy rainfall expected in Lagos region. Check drainage systems.",
        type: "weather",
        date: new Date().toISOString().split("T")[0],
        read: false,
      },
      {
        id: "notif-2",
        title: "Fertilizer Application Reminder",
        description: "Your maize crop in North Field is due for NPK application.",
        type: "reminder",
        date: new Date().toISOString().split("T")[0],
        read: false,
      },
      {
        id: "notif-3",
        title: "Market Price Update",
        description: "Rice prices up 12% this week. Consider selling your surplus.",
        type: "info",
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        read: true,
      },
    ],
    weather: {
      temperature: 28,
      humidity: 72,
      rainfall: 120,
      windSpeed: 12,
      soilMoisture: 65,
    },
    profile: {
      name: "Chidi Okonkwo",
      email: "chidi@farm.example.com",
      role: "Farmer",
      avatar: "",
      activeFarmId: "farm-1",
      farms: [
        {
          id: "farm-1",
          name: "Green Valley Farm",
          acreage: 45,
          soilType: "Loamy",
          climate: "Tropical Wet-and-Dry",
          primaryCrops: ["Maize", "Cassava", "Yam"],
          machines: ["Tractor", "Irrigation Pump", "Plough"],
        },
      ],
    },
    currency: "NGN",
  };
}