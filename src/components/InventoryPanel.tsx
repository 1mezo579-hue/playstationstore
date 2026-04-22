"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, X } from "lucide-react";
import { getInventoryItems, addInventoryItem, deleteInventoryItem } from "@/app/actions/inventory";

export default function InventoryPanel() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "أجهزة",
    condition: "جديد",
    quantity: 1,
    buyPrice: 0,
    sellPrice: 0,
    serialNumber: "",
    barcode: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    const data = await getInventoryItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الصنف؟")) {
      await deleteInventoryItem(id);
      fetchItems();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await addInventoryItem(formData);
    setSubmitting(false);
    
    if (res.success) {
      setIsModalOpen(false);
      setFormData({
        name: "", category: "أجهزة", condition: "جديد", 
        quantity: 1, buyPrice: 0, sellPrice: 0, serialNumber: "", barcode: ""
      });
      fetchItems();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="panel-container">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">إدارة المخزون</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>عرض وإدارة جميع الأصناف في الفرع الحالي.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          إضافة صنف جديد
        </button>
      </div>

      <div className="card">
        {/* Filters and Search */}
        <div className="flex-between" style={{ marginBottom: "24px", gap: "16px" }}>
          <div className="header-search" style={{ width: "300px", margin: 0, backgroundColor: "rgba(2, 6, 23, 0.5)" }}>
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="ابحث باسم الصنف، الباركود، السيريال..." className="search-input" />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            {["الكل", "أجهزة", "دراعات", "إكسسوارات", "قطع غيار"].map(cat => (
              <button 
                key={cat} 
                className={`btn ${activeCategory === cat || (activeCategory === "all" && cat === "الكل") ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 16px", fontSize: "0.9rem" }}
                onClick={() => setActiveCategory(cat === "الكل" ? "all" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>اسم الصنف</th>
                <th>التصنيف</th>
                <th>الحالة</th>
                <th>الكمية</th>
                <th>سعر البيع</th>
                <th>السيريال/الباركود</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{textAlign: "center", padding: "40px"}}>جاري تحميل المخزون...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign: "center", padding: "40px"}}>لا توجد أصناف في المخزن حالياً.</td></tr>
              ) : items
                .filter(item => activeCategory === "all" || item.category === activeCategory)
                .map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</td>
                  <td><span className="badge-tag">{item.category}</span></td>
                  <td>
                    <span className={`badge-tag ${item.condition === "جديد" ? "badge-success" : "badge-warning"}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: "bold", color: item.quantity < 10 ? "var(--accent-warning)" : "inherit" }}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>EGP {item.sellPrice}</td>
                  <td style={{ fontFamily: "monospace", color: "var(--text-muted)" }}>{item.serialNumber || item.barcode || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="icon-btn-small delete" title="حذف" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div className="card" style={{ width: "500px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex-between" style={{ marginBottom: "24px" }}>
              <h2>إضافة صنف جديد</h2>
              <button className="icon-btn-small" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label className="label">اسم الصنف</label>
                <input required type="text" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label className="label">التصنيف</label>
                  <select className="input-field" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="أجهزة">أجهزة</option>
                    <option value="دراعات">دراعات</option>
                    <option value="إكسسوارات">إكسسوارات</option>
                    <option value="قطع غيار">قطع غيار</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">الحالة</label>
                  <select className="input-field" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                    <option value="جديد">جديد</option>
                    <option value="مستعمل">مستعمل</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label className="label">سعر الشراء</label>
                  <input required type="number" className="input-field" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">سعر البيع</label>
                  <input required type="number" className="input-field" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: Number(e.target.value)})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">الكمية</label>
                  <input required type="number" className="input-field" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                </div>
              </div>

              <div>
                <label className="label">السيريال (للأجهزة)</label>
                <input type="text" className="input-field" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "16px" }} disabled={submitting}>
                {submitting ? "جاري الإضافة..." : "حفظ الصنف"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
