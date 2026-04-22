import React from "react";
import { ShoppingCart, Wrench, Package } from "lucide-react";

export default function DashboardOverview() {
  return (
    <>
      <div className="flex-between page-header">
        <h1 className="page-title">نظرة عامة</h1>
        <div className="branch-selector">
          <select className="input-field" style={{ width: "200px" }}>
            <option value="all">جميع الفروع</option>
            <option value="1">الفرع الرئيسي</option>
            <option value="2">فرع مول العرب</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid-cards" style={{ marginBottom: "32px" }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(16, 185, 129, 0.1)", color: "var(--accent-success)" }}>
            <ShoppingCart size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">مبيعات اليوم</span>
            <h3 className="stat-value">EGP 12,450</h3>
          </div>
        </div>
        
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--accent-warning)" }}>
            <Wrench size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">أجهزة في الصيانة</span>
            <h3 className="stat-value">8 أجهزة</h3>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--accent-danger)" }}>
            <Package size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">نواقص المخزن</span>
            <h3 className="stat-value">12 صنف</h3>
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="grid-cards" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>أحدث المبيعات</h3>
          <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
            لا توجد مبيعات اليوم
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: "16px" }}>تذاكر الصيانة العاجلة</h3>
          <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
            لا توجد تذاكر عاجلة
          </div>
        </div>
      </div>
    </>
  );
}
