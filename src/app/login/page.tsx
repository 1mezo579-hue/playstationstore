"use client";

import React, { useState } from "react";
import { Gamepad2, Lock, User, ArrowLeft } from "lucide-react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

import { authenticateAdmin } from "@/app/actions/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await authenticateAdmin(username, password);
    
    setLoading(false);
    if (res.success) {
      router.push("/");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.brandHeader}>
          <div className={styles.logoCircle}>
            <Gamepad2 size={48} color="#0070D1" />
          </div>
          <h1 className={styles.brandName}>2M Store</h1>
          <p className={styles.brandSub}>تسجيل الدخول للوحة الإدارة</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>اسم المستخدم</label>
            <div className={styles.inputWrapper}>
              <User size={20} className={styles.inputIcon} />
              <input 
                type="text" 
                className={styles.inputField} 
                placeholder="أدخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>كلمة المرور</label>
            <div className={styles.inputWrapper}>
              <Lock size={20} className={styles.inputIcon} />
              <input 
                type="password" 
                className={styles.inputField} 
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.formOptions}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>تذكرني</span>
            </label>
            <a href="#" className={styles.forgotPassword}>نسيت كلمة المرور؟</a>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "دخول النظام"}
            {!loading && <ArrowLeft size={20} />}
          </button>
        </form>
      </div>
      
      <div className={styles.backgroundEffects}>
        <div className={styles.glowCircle1}></div>
        <div className={styles.glowCircle2}></div>
      </div>
    </div>
  );
}
