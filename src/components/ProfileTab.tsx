import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "../integrations/supabase/client";
import { useApp } from "../context/AppContext";
import {
  User,
  MapPin,
  Ruler,
  Tractor,
  Envelope,
  PencilSimple,
  FloppyDisk,
  X,
  Check,
  Leaf,
} from "@phosphor-icons/react";

interface ProfileData {
  id: string;
  full_name: string;
  farm_name: string | null;
  email: string | null;
  location: string | null;
  farm_size: string | null;
  farm_type: string | null;
}

const FARM_TYPE_OPTIONS = [
  "Crop Farming",
  "Livestock",
  "Mixed Farming",
  "Poultry",
  "Aquaculture",
  "Horticulture",
];

export default function ProfileTab() {
  const { session } = useApp();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Editable form fields
  const [formData, setFormData] = useState({
    full_name: "",
    farm_name: "",
    location: "",
    farm_size: "",
    farm_type: "",
  });

  useEffect(() => {
    if (!session?.user?.id) return;
    fetchProfile();
  }, [session?.user?.id]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, farm_name, email, location, farm_size, farm_type")
        .eq("id", session!.user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data as ProfileData);
        setFormData({
          full_name: data.full_name || "",
          farm_name: data.farm_name || "",
          location: data.location || "",
          farm_size: data.farm_size || "",
          farm_type: data.farm_type || "",
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load profile";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!session?.user?.id) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          farm_name: formData.farm_name,
          location: formData.location,
          farm_size: formData.farm_size,
          farm_type: formData.farm_type,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);

      if (error) throw error;

      setProfile((prev) =>
        prev ? { ...prev, ...formData } : null
      );
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        farm_name: profile.farm_name || "",
        location: profile.location || "",
        farm_size: profile.farm_size || "",
        farm_type: profile.farm_type || "",
      });
    }
    setEditing(false);
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-100 bg-white/70 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 animate-pulse rounded-full bg-emerald-100" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-48 animate-pulse rounded bg-emerald-100" />
              <div className="h-4 w-32 animate-pulse rounded bg-emerald-50" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-emerald-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <User size={28} className="text-amber-600" weight="fill" />
        </div>
        <h2 className="text-lg font-semibold text-emerald-900">Profile Not Found</h2>
        <p className="mt-1 text-sm text-emerald-600">
          Could not load your profile data. Try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Profile Header Card */}
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-green-500 text-lg font-bold text-white shadow-sm">
              {getInitials(profile.full_name || "U")}
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-900">
                {profile.full_name || "User"}
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-emerald-600">
                <Leaf size={14} weight="fill" />
                <span>{profile.farm_name || "No farm set"}</span>
              </div>
              {profile.email && (
                <p className="mt-0.5 text-xs text-emerald-500">{profile.email}</p>
              )}
            </div>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <PencilSimple size={16} weight="bold" />
              Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50 active:scale-[0.98]"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <FloppyDisk size={16} weight="bold" />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Fields Card */}
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-6 backdrop-blur-sm shadow-sm">
        <h2 className="mb-5 text-base font-semibold text-emerald-900">
          {editing ? "Edit Your Information" : "Farm Information"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <User size={15} weight="fill" />
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {profile.full_name || "—"}
              </p>
            )}
          </div>

          {/* Farm Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Leaf size={15} weight="fill" />
              Farm Name
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.farm_name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, farm_name: e.target.value }))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your farm name"
              />
            ) : (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {profile.farm_name || "—"}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Envelope size={15} weight="fill" />
              Email
            </label>
            <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
              {profile.email || "—"}
            </p>
            <p className="mt-1 text-[11px] text-emerald-500">
              Email is managed via your account settings
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <MapPin size={15} weight="fill" />
              Location
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Kano State, Nigeria"
              />
            ) : (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {profile.location || "—"}
              </p>
            )}
          </div>

          {/* Farm Size */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Ruler size={15} weight="fill" />
              Farm Size
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.farm_size}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, farm_size: e.target.value }))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-900 placeholder-emerald-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. 15 Hectares"
              />
            ) : (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {profile.farm_size || "—"}
              </p>
            )}
          </div>

          {/* Farm Type */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
              <Tractor size={15} weight="fill" />
              Farm Type
            </label>
            {editing ? (
              <select
                value={formData.farm_type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, farm_type: e.target.value }))
                }
                className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm text-emerald-900 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select farm type</option>
                {FARM_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {profile.farm_type || "—"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Save/Cancel buttons at bottom when editing */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end gap-3"
        >
          <button
            onClick={handleCancel}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-all hover:bg-stone-50 active:scale-[0.98]"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check size={16} weight="bold" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}