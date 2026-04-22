"use client";

import React, { useState } from "react";
import { ShoppingCart, Wrench, Package, ShieldCheck, Database } from "lucide-react";
import { setupOnlineDatabase } from "@/app/actions/db-setup";

export default function DashboardOverview() {
  const [setupStatus, setSetupStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSetup = async () => {
    setSetupStatus("loading");
    const res = await setupOnlineDatabase();
    if (res.success) {
      setSetupStatus("success");
      setMessage(res.message || "تم التفعيل بنجاح!");
    } else {
      setSetupStatus("error");
      setMessage(res.error || "حدث خطأ أثناء التفعيل");
    }
  };

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

      {/* --- MAGIC SETUP BANNER --- */}
      {setupStatus !== "success" && (
        <div className="card" style={{ 
          background: "linear-gradient(135deg, #1e3a8a 0%, #0070D1 100%)", 
          color: "white", 
          padding: "24px", 
          marginBottom: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "16px",
          boxShadow: "0 10px 25px -5px rgba(0, 112, 209, 0.4)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", padding: "12px", borderRadius: "12px" }}>
              <Database size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "4px" }}>تفعيل قاعدة البيانات أونلاين</h3>
              <p style={{ opacity: 0.9, fontSize: "0.9rem" }}>اضغط على الزر لتجهيز الجداول والمستخدمين في السيرفر السحابي فوراً.</p>
            </div>
          </div>
          <button 
            onClick={handleSetup}
            disabled={setupStatus === "loading"}
            style={{ 
              background: "white", 
              color: "#0070D1", 
              border: "none", 
              padding: "12px 24px", 
              borderRadius: "10px", 
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.2s"
            }}
          >
            {setupStatus === "loading" ? "جاري التفعيل..." : "تفعيل الآن"}
            <ShieldCheck size={20} />
          </button>
        </div>
      )}

      {message && (
        <div style={{ 
          padding: "16px", 
          borderRadius: "12px", 
          marginBottom: "24px",
          background: setupStatus === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: setupStatus === "success" ? "#10B981" : "#EF4444",
          border: `1px solid ${setupStatus === "success" ? "#10B981" : "#EF4444"}`,
          fontWeight: "bold",
          textAlign: "center"
        }}>
          {message}
        </div>
      )}

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
