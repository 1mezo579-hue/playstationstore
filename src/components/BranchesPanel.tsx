"use client";

import React, { useState, useEffect } from "react";
import { Store, Plus, MapPin, Package, ShoppingCart, Wrench, X } from "lucide-react";
import { getBranches, createBranch } from "@/app/actions/branches";

export default function BranchesPanel() {
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchBranches = async () => {
    setLoading(true);
    const data = await getBranches();
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createBranch(formData.name, formData.location);
    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ name: "", location: "" });
      fetchBranches();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="panel-container">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">إدارة الفروع</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>إضافة وإدارة فروع متجر 2M في مختلف المناطق.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          إضافة فرع جديد
        </button>
      </div>

      <div className="grid-cards">
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px", gridColumn: "1/-1" }}>جاري تحميل الفروع...</div>
        ) : branches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "50px", gridColumn: "1/-1" }}>لا توجد فروع مسجلة حالياً.</div>
        ) : branches.map(branch => (
          <div key={branch.id} className="card" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="flex-between">
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                  <Store size={24} color="var(--primary-light)" />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{branch.name}</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={14} /> {branch.location || "غير محدد"}
                  </span>
                </div>
              </div>
              <span className="badge-tag badge-success">نشط</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-dark)", borderRadius: "8px" }}>
                <Package size={18} style={{ marginBottom: "4px", opacity: 0.7 }} />
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{branch.itemCount || 0}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>صنف</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-dark)", borderRadius: "8px" }}>
                <ShoppingCart size={18} style={{ marginBottom: "4px", opacity: 0.7 }} />
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{branch.saleCount || 0}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>عملية بيع</div>
              </div>
              <div style={{ textAlign: "center", padding: "12px", background: "var(--bg-dark)", borderRadius: "8px" }}>
                <Wrench size={18} style={{ marginBottom: "4px", opacity: 0.7 }} />
                <div style={{ fontSize: "1.1rem", fontWeight: "700" }}>{branch.ticketCount || 0}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>تذكرة صيانة</div>
              </div>
            </div>

            <button className="btn btn-secondary" style={{ width: "100%" }}>إدارة الفرع</button>
          </div>
        ))}
      </div>

      {/* New Branch Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)"
        }}>
          <div className="card" style={{ width: "450px", padding: "32px" }}>
            <div className="flex-between" style={{ marginBottom: "32px" }}>
              <h2 style={{ margin: 0 }}>إضافة فرع جديد</h2>
              <button className="icon-btn-small" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddBranch} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="label">اسم الفرع</label>
                <input 
                  required 
                  type="text" 
                  className="input-field" 
                  placeholder="مثال: فرع وسط البلد"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="label">الموقع / العنوان</label>
                <input 
                  required 
                  type="text" 
                  className="input-field" 
                  placeholder="مثال: القاهرة، شارع طلعت حرب"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "12px", height: "50px" }} disabled={submitting}>
                {submitting ? "جاري الإضافة..." : "حفظ الفرع الجديد"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
