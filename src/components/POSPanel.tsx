"use client";

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Tag, Plus, Minus } from "lucide-react";
import { getPOSItems, processSale } from "@/app/actions/pos";

export default function POSPanel() {
  const [items, setItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tradeInAmount, setTradeInAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getPOSItems();
      setItems(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.quantity) {
          alert("الكمية المطلوبة غير متوفرة في المخزن!");
          return prev;
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number, max: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= max) {
          return { ...item, quantity: newQty };
        }
      }
      return item;
    }));
  };

  const subTotal = cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
  const finalTotal = Math.max(0, subTotal - tradeInAmount);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("سلة المشتريات فارغة!");
    
    setProcessing(true);
    
    const saleData = {
      branchId: 1,
      items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.sellPrice })),
      totalAmount: finalTotal,
      tradeInAmount: tradeInAmount
    };

    const result = await processSale(saleData);
    setProcessing(false);

    if (result.success) {
      alert("تم إتمام عملية البيع بنجاح!");
      setCart([]);
      setTradeInAmount(0);
      // Reload items to update stock
      const data = await getPOSItems();
      setItems(data);
    } else {
      alert(result.error);
    }
  };

  const filteredItems = items.filter(item => 
    (activeCategory === "all" || item.category === activeCategory) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.barcode?.includes(searchTerm) || 
     item.serialNumber?.includes(searchTerm))
  );

  return (
    <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 120px)" }}>
      {/* Products Section (Right) */}
      <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Search & Filters */}
        <div className="card" style={{ padding: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
          <div className="header-search" style={{ flex: 1 }}>
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="ابحث بالاسم، الباركود..." 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {["الكل", "أجهزة", "دراعات", "إكسسوارات"].map(cat => (
              <button 
                key={cat} 
                className={`btn ${activeCategory === cat || (activeCategory === "all" && cat === "الكل") ? "btn-primary" : "btn-secondary"}`}
                style={{ padding: "8px 16px" }}
                onClick={() => setActiveCategory(cat === "الكل" ? "all" : cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="card" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px", color: "var(--text-secondary)" }}>جاري التحميل...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  style={{ 
                    border: "1px solid var(--border-color)", 
                    borderRadius: "12px", 
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: "var(--bg-dark)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                  onClick={() => addToCart(item)}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--primary-light)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                >
                  <div className="flex-between">
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "10px" }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: item.quantity < 3 ? "var(--accent-warning)" : "var(--accent-success)" }}>
                      متاح: {item.quantity}
                    </span>
                  </div>
                  <h4 style={{ fontSize: "1.1rem", margin: 0, color: "var(--text-primary)" }}>{item.name}</h4>
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>EGP {item.sellPrice}</span>
                    <button className="icon-btn-small" style={{ background: "var(--primary)", color: "white", borderRadius: "8px", width: "32px", height: "32px" }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Section (Left) */}
      <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border-color)", background: "rgba(255,255,255,0.02)" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
            <ShoppingCart size={24} color="var(--primary-light)" />
            سلة المبيعات
          </h2>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--text-muted)" }}>
              <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
              <p>السلة فارغة، قم بالبحث أو الضغط على منتج لإضافته.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px dashed var(--border-color)" }}>
                <div>
                  <h4 style={{ margin: "0 0 4px 0" }}>{item.name}</h4>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>EGP {item.sellPrice}</span>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "var(--bg-dark)", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
                    <button onClick={() => updateQuantity(item.id, -1, item.quantity)} style={{ padding: "8px", color: "var(--text-primary)" }}><Minus size={14} /></button>
                    <span style={{ width: "30px", textAlign: "center", fontWeight: "bold" }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1, items.find(i=>i.id===item.id)?.quantity || 0)} style={{ padding: "8px", color: "var(--text-primary)" }}><Plus size={14} /></button>
                  </div>
                  
                  <span style={{ fontWeight: "bold", width: "80px", textAlign: "left" }}>
                    EGP {item.sellPrice * item.quantity}
                  </span>
                  
                  <button onClick={() => removeFromCart(item.id)} style={{ color: "var(--accent-danger)", padding: "4px" }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        <div style={{ padding: "24px", background: "rgba(0,0,0,0.2)", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div className="flex-between">
            <span style={{ color: "var(--text-secondary)" }}>المجموع الفرعي:</span>
            <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>EGP {subTotal}</span>
          </div>

          <div className="flex-between" style={{ alignItems: "center" }}>
            <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Tag size={16} /> سعر الاستبدال (Trade-in):
            </span>
            <input 
              type="number" 
              className="input-field" 
              style={{ width: "120px", padding: "8px", textAlign: "left", background: "var(--bg-dark)" }} 
              value={tradeInAmount || ""}
              onChange={(e) => setTradeInAmount(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <hr style={{ border: "none", borderTop: "1px dashed var(--border-color)", margin: "8px 0" }} />

          <div className="flex-between">
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>الإجمالي النهائي:</span>
            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--accent-success)" }}>EGP {finalTotal}</span>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 2, padding: "16px", fontSize: "1.1rem" }}
              onClick={handleCheckout}
              disabled={processing || cart.length === 0}
            >
              <Banknote size={20} />
              {processing ? "جاري الدفع..." : "الدفع كاش (CASH)"}
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} disabled={cart.length === 0}>
              <CreditCard size={20} />
              فيزا
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
