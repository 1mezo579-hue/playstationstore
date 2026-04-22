"use client";

import React, { useState, useEffect } from "react";
import { 
  Wrench, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  Smartphone,
  X,
  MoreVertical
} from "lucide-react";
import { getMaintenanceTickets, createMaintenanceTicket, updateTicketStatus } from "@/app/actions/maintenance";

export default function MaintenancePanel() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deviceType: "PS4",
    issue: "",
    estimatedCost: 0
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    const data = await getMaintenanceTickets();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createMaintenanceTicket(formData);
    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      setFormData({
        customerName: "",
        customerPhone: "",
        deviceType: "PS4",
        issue: "",
        estimatedCost: 0
      });
      fetchTickets();
    } else {
      alert(res.error);
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    const res = await updateTicketStatus(ticketId, newStatus);
    if (res.success) {
      fetchTickets();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED": return "var(--text-muted)";
      case "DIAGNOSING": return "var(--accent-warning)";
      case "WAITING_PARTS": return "#8B5CF6"; // Purple
      case "REPAIRED": return "var(--accent-success)";
      case "DELIVERED": return "var(--primary-light)";
      default: return "var(--text-primary)";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "RECEIVED": return "تم الاستلام";
      case "DIAGNOSING": return "فحص وتشخيص";
      case "WAITING_PARTS": return "انتظار قطع غيار";
      case "REPAIRED": return "تم الإصلاح";
      case "DELIVERED": return "تم التسليم";
      default: return status;
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.customer.name.includes(searchTerm) || 
    t.customer.phone.includes(searchTerm) ||
    t.deviceType.includes(searchTerm)
  );

  return (
    <div className="panel-container">
      <div className="flex-between page-header">
        <div>
          <h1 className="page-title">قسم الصيانة</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>تتبع أعطال الأجهزة وتذاكر الصيانة للعملاء.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          فتح تذكرة صيانة
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid-cards" style={{ marginBottom: "32px" }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--accent-warning)" }}>
            <Clock size={24} />
          </div>
          <div>
            <span className="stat-label">قيد الانتظار/الفحص</span>
            <span className="stat-value">{tickets.filter(t => ["RECEIVED", "DIAGNOSING"].includes(t.status)).length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-success)" }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="stat-label">تم إصلاحها</span>
            <span className="stat-value">{tickets.filter(t => t.status === "REPAIRED").length}</span>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(156, 163, 175, 0.1)", color: "var(--text-primary)" }}>
            <Wrench size={24} />
          </div>
          <div>
            <span className="stat-label">إجمالي التذاكر النشطة</span>
            <span className="stat-value">{tickets.filter(t => t.status !== "DELIVERED").length}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex-between" style={{ marginBottom: "24px" }}>
          <div className="header-search" style={{ width: "350px", margin: 0, backgroundColor: "rgba(2, 6, 23, 0.5)" }}>
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="ابحث باسم العميل، الهاتف، أو الجهاز..." 
              className="search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم التذكرة</th>
                <th>العميل</th>
                <th>الجهاز والعطل</th>
                <th>الحالة</th>
                <th>التكلفة التقديرية</th>
                <th>التاريخ</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{textAlign: "center", padding: "40px"}}>جاري تحميل التذاكر...</td></tr>
              ) : filteredTickets.length === 0 ? (
                <tr><td colSpan={7} style={{textAlign: "center", padding: "40px"}}>لا توجد تذاكر صيانة حالياً.</td></tr>
              ) : filteredTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td style={{ fontWeight: 700, color: "var(--text-muted)" }}>#{ticket.id}</td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600 }}>{ticket.customer.name}</span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{ticket.customer.phone}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        <Smartphone size={14} /> {ticket.deviceType}
                      </span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ticket.issue}
                      </span>
                    </div>
                  </td>
                  <td>
                    <select 
                      value={ticket.status} 
                      onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                      style={{ 
                        backgroundColor: "rgba(255,255,255,0.05)", 
                        color: getStatusColor(ticket.status),
                        border: `1px solid ${getStatusColor(ticket.status)}`,
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      <option value="RECEIVED">تم الاستلام</option>
                      <option value="DIAGNOSING">فحص وتشخيص</option>
                      <option value="WAITING_PARTS">انتظار قطع غيار</option>
                      <option value="REPAIRED">تم الإصلاح</option>
                      <option value="DELIVERED">تم التسليم</option>
                    </select>
                  </td>
                  <td style={{ fontWeight: 600 }}>EGP {ticket.cost}</td>
                  <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(ticket.createdAt).toLocaleDateString('ar-EG')}
                  </td>
                  <td>
                    <button className="icon-btn-small"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)"
        }}>
          <div className="card" style={{ width: "550px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <div className="flex-between" style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ padding: "8px", background: "var(--primary)", borderRadius: "8px" }}>
                  <Wrench size={24} color="white" />
                </div>
                <h2 style={{ margin: 0 }}>تذكرة صيانة جديدة</h2>
              </div>
              <button className="icon-btn-small" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateTicket} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="label">اسم العميل</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", right: "12px", top: "14px", color: "var(--text-muted)" }} />
                    <input 
                      required 
                      type="text" 
                      className="input-field" 
                      style={{ paddingRight: "40px" }}
                      value={formData.customerName} 
                      onChange={e => setFormData({...formData, customerName: e.target.value})} 
                    />
                  </div>
                </div>
                <div>
                  <label className="label">رقم الهاتف</label>
                  <div style={{ position: "relative" }}>
                    <Phone size={16} style={{ position: "absolute", right: "12px", top: "14px", color: "var(--text-muted)" }} />
                    <input 
                      required 
                      type="text" 
                      className="input-field" 
                      style={{ paddingRight: "40px" }}
                      value={formData.customerPhone} 
                      onChange={e => setFormData({...formData, customerPhone: e.target.value})} 
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="label">نوع الجهاز</label>
                  <select 
                    className="input-field" 
                    value={formData.deviceType} 
                    onChange={e => setFormData({...formData, deviceType: e.target.value})}
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="PS4">PlayStation 4</option>
                    <option value="PS3">PlayStation 3</option>
                    <option value="DualSense">Controller (PS5)</option>
                    <option value="DualShock 4">Controller (PS4)</option>
                    <option value="PC">PC / Laptop</option>
                    <option value="Other">آخر</option>
                  </select>
                </div>
                <div>
                  <label className="label">التكلفة التقديرية</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={formData.estimatedCost} 
                    onChange={e => setFormData({...formData, estimatedCost: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div>
                <label className="label">وصف المشكلة / العطل</label>
                <textarea 
                  required 
                  className="input-field" 
                  style={{ minHeight: "100px", resize: "vertical" }}
                  value={formData.issue} 
                  onChange={e => setFormData({...formData, issue: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: "12px", height: "50px" }} disabled={submitting}>
                {submitting ? "جاري الحفظ..." : "تأكيد وإنشاء التذكرة"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
