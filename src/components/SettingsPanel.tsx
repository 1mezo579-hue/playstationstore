"use client";

import React from "react";
import { Settings, User, Bell, Database, Shield, Monitor } from "lucide-react";

export default function SettingsPanel() {
  return (
    <div className="panel-container animate-fade-in">
      <div className="panel-header">
        <div className="header-title">
          <Settings className="header-icon" />
          <div>
            <h2>الإعدادات</h2>
            <p>تخصيص النظام وتفضيلات الحساب</p>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-section card">
          <h3><User size={20} /> إعدادات الملف الشخصي</h3>
          <div className="settings-items">
            <div className="setting-item">
              <label>تغيير اسم العرض</label>
              <input type="text" className="input-field" placeholder="إسلام" />
            </div>
            <button className="btn-primary">حفظ التغييرات</button>
          </div>
        </div>

        <div className="settings-section card">
          <h3><Monitor size={20} /> المظهر والنظام</h3>
          <div className="settings-items">
            <div className="setting-toggle">
              <span>الوضع الداكن (Dark Mode)</span>
              <div className="toggle-switch active"></div>
            </div>
            <div className="setting-item">
              <label>لغة النظام</label>
              <select className="input-field">
                <option>العربية (Arabic)</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section card">
          <h3><Database size={20} /> قاعدة البيانات والنسخ الاحتياطي</h3>
          <div className="settings-items">
            <button className="btn-secondary">تصدير قاعدة البيانات (Backup)</button>
            <button className="btn-secondary" style={{color: "var(--accent-danger)"}}>مسح كافة البيانات</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        .settings-section h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          color: var(--primary-light);
        }
        .settings-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .setting-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: rgba(255,255,255,0.03);
          border-radius: 8px;
        }
        .toggle-switch {
          width: 40px;
          height: 20px;
          background: #444;
          border-radius: 10px;
          position: relative;
        }
        .toggle-switch.active {
          background: var(--primary);
        }
        .toggle-switch.active::after {
          content: '';
          position: absolute;
          right: 2px;
          top: 2px;
          width: 16px;
          height: 16px;
          background: white;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}
