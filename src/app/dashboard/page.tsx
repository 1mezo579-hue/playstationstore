"use client";

import React, { useState } from "react";
import { 
  Gamepad2, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wrench, 
  FileText, 
  Store,
  Settings,
  Bell,
  Search,
  Users,
  LogOut
} from "lucide-react";

import { logout } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import DashboardOverview from "@/components/DashboardOverview";
import InventoryPanel from "@/components/InventoryPanel";
import POSPanel from "@/components/POSPanel";
import MaintenancePanel from "@/components/MaintenancePanel";
import BranchesPanel from "@/components/BranchesPanel";
import UsersPanel from "@/components/UsersPanel";
import SettingsPanel from "@/components/SettingsPanel";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [user, setUser] = useState<{name: string, role: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Basic cookie parsing for user data
    const cookies = document.cookie.split(';');
    const userDataCookie = cookies.find(c => c.trim().startsWith('user_data='));
    if (userDataCookie) {
      try {
        const decoded = decodeURIComponent(userDataCookie.split('=')[1]);
        setUser(JSON.parse(decoded));
      } catch (e) {
        console.error("Error parsing user data cookie", e);
      }
    }
  }, []);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      // Force hard reload to login page
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    }
  };

  // Filter menu items based on user role
  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: <LayoutDashboard size={20} />, roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "inventory", label: "المخزون", icon: <Package size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "pos", label: "نقطة البيع (POS)", icon: <ShoppingCart size={20} />, roles: ["OWNER", "MANAGER", "SELLER"] },
    { id: "maintenance", label: "الصيانة", icon: <Wrench size={20} />, roles: ["OWNER", "MANAGER", "MAINTENANCE"] },
    { id: "reports", label: "التقارير", icon: <FileText size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "branches", label: "الفروع", icon: <Store size={20} />, roles: ["OWNER", "MANAGER"] },
    { id: "users", label: "المستخدمين", icon: <Users size={20} />, roles: ["OWNER", "MANAGER"] },
  ];

  const visibleMenuItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  useEffect(() => {
    // Set default tab based on role if current tab is unauthorized
    if (user) {
      const currentTabAuth = menuItems.find(i => i.id === activeTab)?.roles.includes(user.role);
      if (!currentTabAuth && activeTab !== "settings") {
        if (user.role === "MAINTENANCE") setActiveTab("maintenance");
        else if (user.role === "SELLER") setActiveTab("pos");
        else setActiveTab("dashboard");
      }
    }
  }, [user]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">
            <Gamepad2 size={32} color="#0070D1" />
          </div>
          <h2 className="logo-text">2M Store</h2>
        </div>

        <nav className="sidebar-nav">
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon"><Settings size={20} /></span>
              <span className="nav-label">الإعدادات</span>
            </button>
          )}
          <button className="nav-item logout" onClick={handleLogout} disabled={loggingOut} style={{ marginTop: "10px", color: "#ff4444" }}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-label">{loggingOut ? "جاري الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-search">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="ابحث عن منتج، عميل، أو تذكرة صيانة..." className="search-input" />
          </div>
          
          <div className="header-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">3</span>
            </button>
            <div className="user-profile">
              <div className="avatar">{user ? user.name.charAt(0).toUpperCase() : "E"}</div>
              <div className="user-info">
                <span className="user-name">{user ? user.name : "إسلام"}</span>
                <span className="user-role">{user ? user.role : "مدير النظام"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="content-area">
          {activeTab === "dashboard" && <DashboardOverview />}
          {activeTab === "inventory" && <InventoryPanel />}
          {activeTab === "pos" && <POSPanel />}
          {activeTab === "maintenance" && <MaintenancePanel />}
          {activeTab === "reports" && (
            <div style={{color: "var(--text-secondary)", textAlign: "center", padding: "100px"}}>
              <h2>جاري العمل على قسم التقارير...</h2>
            </div>
          )}
          {activeTab === "branches" && <BranchesPanel />}
          {activeTab === "users" && <UsersPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
  );
}
