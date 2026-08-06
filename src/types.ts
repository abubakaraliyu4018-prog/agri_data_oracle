export interface FoodPriceRecord {
  year: number;
  price: number;
  commodity: string;
  region: string;
}

export interface StatCard {
  metric: string;
  label: string;
  context: string;
  icon: string;
  trend: "up" | "down" | "warning";
}

export interface StatePrice {
  state: string;
  price: number;
  isLowest?: boolean;
  isHighest?: boolean;
}

export interface Finding {
  icon: string;
  title: string;
  description: string;
}

export interface CropField {
  id: string;
  farmId: string;
  name: string;
  cropType: string;
  acreage: number;
  plantedDate: string;
  expectedHarvest: string;
  growthStage: string;
  healthStatus: string;
  waterNeeds: string;
  notes: string;
  cost?: number;
  revenue?: number;
}

export interface Livestock {
  id: string;
  farmId: string;
  type: "Cattle" | "Sheep" | "Goat" | "Poultry" | "Swine" | "Fish" | "Other";
  breed: string;
  tagNumber: string;
  name: string;
  birthDate: string;
  weight: number;
  healthStatus: string;
  vaccinationStatus: string;
  feedSchedule: string;
  notes: string;
}

export interface Transaction {
  id: string;
  farmId: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface AIInsight {
  id: string;
  farmId: string;
  title: string;
  description: string;
  type: "Recommendation" | "Alert" | "Tip" | "Forecast";
  severity: "Critical" | "Warning" | "Info";
  date: string;
  read: boolean;
}

export interface Farm {
  id: string;
  name: string;
  acreage: number;
  soilType: string;
  climate: string;
  primaryCrops: string[];
  machines: string[];
}

export interface FarmProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  activeFarmId: string;
  farms: Farm[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "reminder" | "weather" | "alert" | "info";
  date: string;
  read: boolean;
}

export interface WeatherData {
  state: string;
  temperature: number;
  condition: string;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  advice: string;
}

export interface FoodPriceItem {
  commodity: string;
  nationalAvg: number;
  stateData: { state: string; price: number }[];
  trend: "up" | "down" | "stable";
}

export interface AppState {
  crops: CropField[];
  livestock: Livestock[];
  transactions: Transaction[];
  insights: AIInsight[];
  notifications: Notification[];
  weather: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    soilMoisture: number;
  };
  profile: FarmProfile;
  currency: "NGN" | "USD";
}

export type Tab = "dashboard" | "crops" | "livestock" | "finances" | "insights" | "profile" | "market-prices" | "reports" | "weather" | "about";

export interface LivestockRecord {
  id: string;
  user_id: string | null;
  animal_type: string;
  breed: string;
  tag_number: string;
  name: string;
  birth_date: string | null;
  weight: number | null;
  health_status: string;
  vaccination_status: string;
  feeding_schedule: string;
  purchase_price: number | null;
  current_market_value: number | null;
  notes: string;
  location: string;
  status: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface CropRecord {
  id: string;
  crop_type: string;
  variety: string;
  planting_date: string | null;
  harvest_date: string | null;
  production_cost: number;
  selling_price: number;
  harvest_quantity: number;
  farm_location: string;
  status: string;
  created_at: string;
  profit?: number;
  profit_margin?: number;
}