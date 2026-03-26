"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { TableSkeleton } from "@/components/ui/Skeleton";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bookingUrl: string;
  photoUrl: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      if (res.ok) setStaff(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const deleteStaff = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    await fetch(`/api/staff/${id}`, { method: "DELETE" });
    fetchStaff();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-sm text-gray-400">
            Manage onboarding specialists and support staff
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {(editing || creating) && (
        <StaffEditor
          member={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={() => { setEditing(null); setCreating(false); fetchStaff(); }}
        />
      )}

      {loading ? (
        <TableSkeleton rows={3} />
      ) : staff.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-sm">No team members yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
          {staff.map((m) => (
            <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Mail className="w-3 h-3" /> {m.email}
                  </span>
                  {m.phone && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Phone className="w-3 h-3" /> {m.phone}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditing(m)}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteStaff(m.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StaffEditor({
  member,
  onClose,
  onSave,
}: {
  member: StaffMember | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    role: member?.role || "Onboarding Specialist",
    bookingUrl: member?.bookingUrl || "",
    photoUrl: member?.photoUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const url = member ? `/api/staff/${member.id}` : "/api/staff";
    const method = member ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {member ? "Edit Team Member" : "Add Team Member"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Onboarding Specialist</option>
                <option>Data Services</option>
                <option>Payments Specialist</option>
                <option>Product Manager</option>
                <option>Support</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking URL</label>
            <input type="url" value={form.bookingUrl} onChange={(e) => setForm({ ...form, bookingUrl: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://youcanbook.me/..." />
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : member ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
