"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import styles from "../../eshipcont/admin.module.css";
import { LayoutDashboard, Package, LogOut, Menu, X, Search } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("eshipcont_auth");
      if (!auth) {
        router.push("/eshipcont");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  if (!isAuthenticated) {
    return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f4f7fe" }}>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem("eshipcont_auth");
    router.push("/eshipcont");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/eshipcont/dashboard" },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarLogo}>
          <img src="/noship.png" alt="ExpressShipDel" />
          <button className={styles.closeBtn} onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className={styles.sidebarMenu}>
          {menuItems.map(item => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/eshipcont/dashboard");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                onClick={() => setIsMobileOpen(false)}
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "2rem" }}>
          <button
            onClick={handleLogout}
            className={styles.menuItem}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", color: "#ff3b30", justifyContent: "flex-start" }}
          >
            <span className={styles.menuIcon}><LogOut size={20} /></span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className={styles.mainContent}>
        <header className={styles.topBar}>
          <div className={styles.hamburgerWrap}>
            <button className={styles.hamburgerBtn} onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          <div className={styles.topSearch}>
            <Search size={18} color="#8f9bba" />
            <input placeholder="Search shipments, tracking IDs..." />
          </div>
          <div className={styles.topProfile}>
            <div className={styles.profileInfo}>
              <p>Admin</p>
              <span>ExpressShipDelivery</span>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
              A
            </div>
          </div>
        </header>
        <div className={styles.dashboardArea}>
          {children}
        </div>
      </div>
    </div>
  );
}
