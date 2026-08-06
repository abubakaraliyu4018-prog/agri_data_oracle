import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  PawPrint,
  Plus,
  Trash,
  PencilSimple,
  X,
  Check,
  MagnifyingGlass,
  Syringe,
  Heartbeat,
  ShieldCheck,
  DotsThreeVertical,
  MapPin,
  Calendar,
  Coin,
  Scales,
  Tag,
} from "@phosphor-icons/react";
import { supabase } from "../integrations/supabase/client";
import type { LivestockRecord } from "../types";

const LIVESTOCK_TABLE = "livestock" as const;

/* ───── Types ───── */
interface FormState {
  animal_type: string;
  breed: string;
  tag_number: string;
  name: string;
  birth_date: string;
  weight: string;
  health_status: string;
  vaccination_status: string;
  feeding_schedule: string;
  purchase_price: string;
  current_market_value: string;
  notes: string;
  location: string;
  status: string;
}

const EMPTY_FORM: FormState = {
  animal_type: "Cattle",
  breed: "",
  tag_number: "",
  name: "",
  birth_date: "",
  weight: "",
  health_status: "Good",
  vaccination_status: "Up to Date",
  feeding_schedule: "Daily",
  purchase_price: "",
  current_market_value: "",
  notes: "",
  location: "",
  status: "Active",
};

const SPECIES_OPTIONS = [
  "Cattle",
  "Goats",
  "Sheep",
  "Pigs",
  "Poultry",
  "Fish",
  "Rabbits",
  "Horses",
  "Donkeys",
  "Camels",
  "Bees",
  "Other",
];

const HEALTH_OPTIONS = ["Excellent", "Good", "Fair", "Poor", "Critical"];
const SCHEDULE_OPTIONS = ["Daily", "Twice Daily", "Weekly", "Bi-Weekly", "Monthly", "Free Range", "Pasture"];
const STATUS_OPTIONS = ["Active", "Sold", "Deceased", "Breeding", "Quarantine", "Transferred"];

/* ───── Colour helpers ───── */
const healthColor = (status: string) => {
  switch (status) {
    case "Excellent":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Good":
      return "bg-green-100 text-green-700 border-green-200";
    case "Fair":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Poor":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Critical":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
};

const vaxColor = (status: string) => {
  return status === "Up to Date"
    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
    : "bg-amber-50 text-amber-600 border-amber-200";
};

const statusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 border-green-200";
    case "Sold":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Deceased":
      return "bg-red-100 text-red-700 border-red-200";
    case "Breeding":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Quarantine":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Transferred":
      return "bg-stone-100 text-stone-700 border-stone-200";
    default:
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
};

/* ───── Row animation variants ───── */
const rowVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: (i: number) =>
    ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.03, duration: 0.25, ease: "easeOut" },
    }) as const,
  exit: { opacity: 0, x: -60, transition: { duration: 0.2 } },
};

/* ──────────────────────── LivestockTab Component ──────────────────────── */
export default function LivestockTab() {
  const [records, setRecords] = useState<LivestockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  /* ───── Load data ───── */
  const loadData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(LIVESTOCK_TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRecords((data ?? []) as LivestockRecord[]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load livestock";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ───── Derived species list from data ───── */
  const speciesInData = useMemo(() => {
    const keys = new Set(records.map((r) => r.animal_type));
    return Array.from(keys).sort();
  }, [records]);

  /* ───── Filtered records ───── */
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const query = search.toLowerCase();
      const matchesSearch =
        !search ||
        r.animal_type.toLowerCase().includes(query) ||
        r.breed.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.tag_number.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query) ||
        r.notes.toLowerCase().includes(query);
      const matchesSpecies =
        speciesFilter === "All" || r.animal_type === speciesFilter;
      return matchesSearch && matchesSpecies;
    });
  }, [records, search, speciesFilter]);

  /* ───── Form handlers ───── */
  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (r: LivestockRecord) => {
    setForm({
      animal_type: r.animal_type,
      breed: r.breed,
      tag_number: r.tag_number,
      name: r.name,
      birth_date: r.birth_date ?? "",
      weight: r.weight?.toString() ?? "",
      health_status: r.health_status,
      vaccination_status: r.vaccination_status,
      feeding_schedule: r.feeding_schedule,
      purchase_price: r.purchase_price?.toString() ?? "",
      current_market_value: r.current_market_value?.toString() ?? "",
      notes: r.notes,
      location: r.location,
      status: r.status,
    });
    setEditingId(r.id);
    setShowForm(true);
    setMenuOpen(null);
  };

  const handleSave = async () => {
    if (!form.breed.trim()) {
      toast.error("Please enter a breed");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Please enter a name or tag identifier");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        animal_type: form.animal_type,
        breed: form.breed,
        tag_number: form.tag_number,
        name: form.name,
        birth_date: form.birth_date || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        health_status: form.health_status,
        vaccination_status: form.vaccination_status,
        feeding_schedule: form.feeding_schedule,
        purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
        current_market_value: form.current_market_value ? parseFloat(form.current_market_value) : null,
        notes: form.notes,
        location: form.location,
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      if (editingId) {
        const { data, error } = await supabase
          .from(LIVESTOCK_TABLE)
          .update(payload)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setRecords((prev) =>
          prev.map((r) => (r.id === editingId ? (data as LivestockRecord) : r))
        );
        toast.success("Livestock updated");
      } else {
        const { data, error } = await supabase
          .from(LIVESTOCK_TABLE)
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        setRecords((prev) => [data as LivestockRecord, ...prev]);
        toast.success("Livestock added");
      }
      setShowForm(false);
      setEditingId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from(LIVESTOCK_TABLE).delete().eq("id", id);
      if (error) throw error;
      setRecords((prev) => prev.filter((r) => r.id !== id));
      toast.success("Livestock record deleted");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    }
    setMenuOpen(null);
  };

  /* ───── Stats ───── */
  const totalHead = records.length;
  const healthyCount = records.filter(
    (r) => r.health_status === "Excellent" || r.health_status === "Good"
  ).length;
  const vaxCount = records.filter((r) => r.vaccination_status === "Up to Date").length;
  const totalValue = records.reduce((s, r) => s + (r.current_market_value ?? 0), 0);

  /* ──────────────────────── Render ──────────────────────── */
  return (
    <div className="space-y-6">
      {/* ──── Header ──── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-800">
            Livestock Management
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Track your animals, health, vaccinations, and market value
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
        >
          <Plus size={18} weight="bold" />
          Add Livestock
        </motion.button>
      </motion.div>

      {/* ──── Stats Cards ──── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Animals", value: totalHead, icon: PawPrint, color: "text-emerald-600 bg-emerald-50" },
          { label: "Healthy", value: healthyCount, icon: ShieldCheck, color: "text-green-600 bg-green-50" },
          { label: "Vaccinated", value: vaxCount, icon: Syringe, color: "text-sky-600 bg-sky-50" },
          { label: "Est. Value", value: `₦${totalValue.toLocaleString()}`, icon: Coin, color: "text-amber-600 bg-amber-50" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon size={20} weight="fill" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{stat.label}</p>
              <p className="text-xl font-bold text-stone-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ──── Filters ──── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlass
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            weight="bold"
          />
          <input
            type="text"
            placeholder="Search by name, species, breed, tag, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setSpeciesFilter("All")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              speciesFilter === "All"
                ? "bg-emerald-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All
          </button>
          {speciesInData.map((s) => (
            <button
              key={s}
              onClick={() => setSpeciesFilter(s)}
              className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                speciesFilter === s
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ──── Table / List ──── */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-lg bg-stone-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-stone-200" />
                  <div className="h-3 w-1/4 rounded bg-stone-100" />
                </div>
                <div className="h-8 w-20 rounded-lg bg-stone-100" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <PawPrint size={40} className="mb-3 text-stone-300" weight="light" />
            <p className="text-sm font-medium text-stone-500">
              {records.length === 0
                ? "No livestock records yet"
                : "No records match your search"}
            </p>
            {records.length === 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openAddForm}
                className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <Plus size={16} weight="bold" />
                Add Your First Livestock
              </motion.button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {/* Header row — hidden on mobile */}
            <div className="hidden items-center gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-400 sm:flex">
              <div className="flex-1 min-w-0">Name / Breed</div>
              <div className="w-24 text-center">Tag</div>
              <div className="w-20 text-center">Health</div>
              <div className="w-20 text-center">Vaccination</div>
              <div className="w-20 text-center">Status</div>
              <div className="w-10" />
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.map((record, i) => (
                <motion.div
                  key={record.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-stone-50/80 sm:flex-row sm:items-center sm:gap-3"
                >
                  {/* Mobile card layout */}
                  <div className="flex items-center gap-3 sm:flex-1 sm:min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <PawPrint size={18} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-stone-800 truncate">
                        {record.name || record.animal_type}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {record.breed}
                        {record.weight ? ` · ${record.weight}kg` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Tag number */}
                  <div className="flex items-center gap-1.5 sm:w-24 sm:justify-center">
                    <Tag size={12} className="shrink-0 text-stone-400" weight="bold" />
                    <span className="text-xs font-mono text-stone-600 truncate">
                      {record.tag_number || "—"}
                    </span>
                  </div>

                  {/* Health status */}
                  <div className="sm:w-20 sm:text-center">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${healthColor(record.health_status)}`}
                    >
                      {record.health_status}
                    </span>
                  </div>

                  {/* Vaccination status */}
                  <div className="sm:w-20 sm:text-center">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${vaxColor(record.vaccination_status)}`}
                    >
                      {record.vaccination_status}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="sm:w-20 sm:text-center">
                    <span
                      className={`inline-block rounded-md border px-2 py-0.5 text-xs font-medium ${statusColor(record.status)}`}
                    >
                      {record.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="relative flex justify-end sm:w-10">
                    <button
                      onClick={() => setMenuOpen(menuOpen === record.id ? null : record.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                    >
                      <DotsThreeVertical size={18} weight="bold" />
                    </button>
                    {menuOpen === record.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setMenuOpen(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg"
                        >
                          <button
                            onClick={() => openEditForm(record)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-stone-700 transition-colors hover:bg-emerald-50"
                          >
                            <PencilSimple size={15} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <Trash size={15} />
                            Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ──── Add / Edit Form Modal ──── */}
      <AnimatePresence>
        {showForm && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 z-40 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-stone-800">
                  {editingId ? "Edit Livestock" : "Add Livestock"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Species */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Species
                  </label>
                  <select
                    value={form.animal_type}
                    onChange={(e) => setForm((f) => ({ ...f, animal_type: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {SPECIES_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Breed */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                    placeholder="e.g. Angus, Boer, Rhode Island Red"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Name / Identifier
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Bessie, Flock A"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Tag Number */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Tag Number
                  </label>
                  <input
                    type="text"
                    value={form.tag_number}
                    onChange={(e) => setForm((f) => ({ ...f, tag_number: e.target.value }))}
                    placeholder="e.g. NG-001, EARMARK-A1"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Birth Date */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Birth Date
                  </label>
                  <input
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => setForm((f) => ({ ...f, birth_date: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={form.weight}
                    onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                    placeholder="e.g. 250"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} weight="bold" /> Location
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. North Pasture, Barn A"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Feeding Schedule */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Feeding Schedule
                  </label>
                  <select
                    value={form.feeding_schedule}
                    onChange={(e) => setForm((f) => ({ ...f, feeding_schedule: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {SCHEDULE_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Health Status */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <span className="flex items-center gap-1">
                      <Heartbeat size={12} weight="bold" /> Health Status
                    </span>
                  </label>
                  <select
                    value={form.health_status}
                    onChange={(e) => setForm((f) => ({ ...f, health_status: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {HEALTH_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Vaccination Status */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Vaccination Status
                  </label>
                  <div className="flex gap-3">
                    {["Up to Date", "Overdue"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, vaccination_status: opt }))}
                        className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                          form.vaccination_status === opt
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                            : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                        }`}
                      >
                        {opt === "Up to Date" ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Check size={14} weight="bold" />
                            Up to Date
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1.5">
                            <Syringe size={14} weight="bold" />
                            Overdue
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <span className="flex items-center gap-1">
                      <Coin size={12} weight="bold" /> Purchase Price (₦)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.purchase_price}
                    onChange={(e) => setForm((f) => ({ ...f, purchase_price: e.target.value }))}
                    placeholder="e.g. 150000"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Current Market Value */}
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    <span className="flex items-center gap-1">
                      <Coin size={12} weight="bold" /> Current Market Value (₦)
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    value={form.current_market_value}
                    onChange={(e) => setForm((f) => ({ ...f, current_market_value: e.target.value }))}
                    placeholder="e.g. 200000"
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Notes — full width */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Notes
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Medical history, breeding notes, observations..."
                    rows={3}
                    className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-stone-100 pt-4">
                <button
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check size={16} weight="bold" />
                      {editingId ? "Update" : "Save"}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}