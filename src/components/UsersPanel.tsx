"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Wrench, 
  ShoppingCart, 
  Trash2, 
  Edit2, 
  X, 
  Check,
  RefreshCw,
  MoreVertical,
  Plus
} from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser } from "@/app/actions/users";
type Role = 'OWNER' | 'MANAGER' | 'MAINTENANCE' | 'SELLER';

const roleConfig = {
  OWNER: { label: "أونر", icon: ShieldCheck, color: "#FFD700" },
  MANAGER: { label: "مدير", icon: Shield, color: "#3b82f6" },
  MAINTENANCE: { label: "مسئول صيانة", icon: Wrench, color: "#f59e0b" },
  SELLER: { label: "بائع", icon: ShoppingCart, color: "#10b981" },
};

export default function UsersPanel() {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "SELLER" as Role
  });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Fetch users error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMsg = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const res = await updateUser(editingUser.id, formData);
        if (res.success) {
          showMsg("تم تحديث المستخدم بنجاح", 'success');
          setIsModalOpen(false);
          await fetchUsers();
        } else {
          showMsg(res.error || "خطأ في التحديث", 'error');
        }
      } else {
        const res = await createUser(formData);
        if (res.success) {
          showMsg("تم إنشاء المستخدم بنجاح", 'success');
          setIsModalOpen(false);
          setFormData({ name: "", username: "", password: "", role: "SELLER" });
          await fetchUsers();
        } else {
          showMsg(res.error || "خطأ في الإنشاء", 'error');
        }
      }
    } catch (error) {
      showMsg("حدث خطأ تقني", 'error');
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password || "",
      role: user.role
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
      const res = await deleteUser(id);
      if (res.success) {
        showMsg("تم حذف المستخدم", 'success');
        await fetchUsers();
      }
    }
  };

  return (
    <div className="users-panel animate-fade-in">
      {/* Header Section */}
      <div className="panel-header">
        <div className="header-left">
          <div className="icon-box">
            <Users size={28} />
          </div>
          <div className="header-text">
            <h2>إدارة المستخدمين</h2>
            <p>{users.length} مستخدمين مسجلين في النظام</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-refresh" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw size={18} className={isLoading ? "spin" : ""} />
          </button>
          <button className="btn-add" onClick={() => {
            setEditingUser(null);
            setFormData({ name: "", username: "", password: "", role: "SELLER" });
            setIsModalOpen(true);
          }}>
            <UserPlus size={18} />
            مستخدم جديد
          </button>
        </div>
      </div>

      {/* Message Toast */}
      {message && (
        <div className={`toast ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Users Table / Grid */}
      <div className="users-content">
        {isLoading && users.length === 0 ? (
          <div className="loader-container">
            <div className="premium-loader"></div>
            <p>جاري تحميل قائمة المستخدمين...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <h3>لا يوجد مستخدمين بعد</h3>
            <p>ابدأ بإضافة أول مستخدم للنظام لإدارة الصلاحيات</p>
            <button className="btn-add-large" onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> إضافة مستخدم
            </button>
          </div>
        ) : (
          <div className="users-table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>الرتبة</th>
                  <th>اسم الدخول</th>
                  <th>تاريخ الإضافة</th>
                  <th style={{ textAlign: "center" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const config = roleConfig[user.role as Role] || roleConfig.SELLER;
                  const RoleIcon = config.icon;
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-small" style={{ backgroundColor: config.color + '20', color: config.color }}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name-cell">{user.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="role-badge" style={{ borderColor: config.color, color: config.color }}>
                          <RoleIcon size={14} />
                          {config.label}
                        </div>
                      </td>
                      <td><span className="username-cell">@{user.username}</span></td>
                      <td>{new Date(user.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn edit" title="تعديل" onClick={() => handleEdit(user)}>
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn delete" title="حذف" onClick={() => handleDelete(user.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                {editingUser ? <Edit2 size={20} /> : <UserPlus size={20} />}
                <h3>{editingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد"}</h3>
              </div>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label>الاسم الكامل</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="مثال: إسلام عبد الله"
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>اسم المستخدم</label>
                    <input 
                      type="text" 
                      required
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      placeholder="eslam_2m"
                    />
                  </div>
                  <div className="input-group">
                    <label>{editingUser ? "كلمة المرور الجديدة" : "كلمة المرور"}</label>
                    <input 
                      type="password" 
                      required={!editingUser}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>الصلاحية (الرتبة)</label>
                  <div className="role-grid">
                    {Object.entries(roleConfig).map(([key, config]) => (
                      <div 
                        key={key} 
                        className={`role-item ${formData.role === key ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, role: key as Role})}
                        style={{ '--color': config.color } as any}
                      >
                        <config.icon size={20} />
                        <span>{config.label}</span>
                        {formData.role === key && <div className="checked-dot"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>إلغاء</button>
                <button type="submit" className="btn-save">
                  {editingUser ? "تحديث البيانات" : "إنشاء المستخدم الآن"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .users-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          height: 100%;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .icon-box {
          background: var(--primary);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .header-text h2 { margin: 0; font-size: 1.5rem; }
        .header-text p { margin: 0; color: var(--text-muted); font-size: 0.9rem; }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-add {
          background: var(--primary);
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(75, 85, 99, 0.4);
        }

        .btn-refresh {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Table Styling */
        .users-table-wrapper {
          background: var(--bg-card);
          border-radius: 16px;
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .premium-table {
          width: 100%;
          border-collapse: collapse;
          text-align: right;
        }

        .premium-table th {
          background: rgba(255, 255, 255, 0.02);
          padding: 1.2rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border-color);
        }

        .premium-table td {
          padding: 1rem 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          border: 1px solid;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .username-cell {
          color: var(--text-muted);
          font-family: monospace;
        }

        .action-btns {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn.edit { color: var(--accent-blue, #3b82f6); background: rgba(59, 130, 246, 0.1); }
        .action-btn.delete { color: var(--accent-danger); background: rgba(239, 68, 68, 0.1); }

        .action-btn:hover { transform: scale(1.1); }

        /* Modal Design */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-card {
          background: var(--bg-dark);
          width: 500px;
          border-radius: 24px;
          border: 1px solid var(--border-color);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          overflow: hidden;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-title { display: flex; align-items: center; gap: 10px; color: var(--primary-light); }
        .modal-title h3 { margin: 0; }

        .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.2rem; }

        .input-group label { display: block; margin-bottom: 0.5rem; color: var(--text-secondary); font-size: 0.9rem; }
        .input-group input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: white;
          transition: all 0.2s;
        }
        .input-group input:focus { border-color: var(--primary-light); outline: none; background: rgba(255, 255, 255, 0.06); }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
        .role-item {
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: rgba(255, 255, 255, 0.02);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .role-item:hover { border-color: var(--color); background: rgba(255, 255, 255, 0.05); }
        .role-item.active { border-color: var(--color); color: var(--color); background: var(--color) 15; }
        
        .checked-dot { width: 8px; height: 8px; background: currentColor; border-radius: 50%; position: absolute; left: 10px; top: 10px; }

        .modal-footer { padding: 1.5rem; border-top: 1px solid var(--border-color); display: flex; gap: 1rem; }
        .btn-save { flex: 2; background: var(--primary); color: white; border-radius: 10px; padding: 0.8rem; font-weight: 600; }
        .btn-cancel { flex: 1; border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 10px; }

        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 2rem;
          border-radius: 10px;
          color: white;
          z-index: 2000;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          animation: slideIn 0.3s ease-out;
        }
        .toast.success { background: var(--accent-success); }
        .toast.error { background: var(--accent-danger); }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
}
