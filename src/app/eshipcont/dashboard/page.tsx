"use client";

import styles from "../admin.module.css";
import Link from "next/link";
import { Package, Truck, CheckCircle, AlertCircle, Plus } from "lucide-react";

const mockShipments = [
  { id: "30737BY3", receiver: "Chayna Eller", origin: "Damascus, Syria", dest: "United States", status: "Out For Delivery", mode: "Flight" },
  { id: "48291KX7", receiver: "Marcus Obi", origin: "Lagos, Nigeria", dest: "United Kingdom", status: "In Transit", mode: "Sea Freight" },
  { id: "77142AZ9", receiver: "Priya Sharma", origin: "Mumbai, India", dest: "Canada", status: "Delivered", mode: "Flight" },
  { id: "33902PQ1", receiver: "Felix Müller", origin: "Berlin, Germany", dest: "Australia", status: "Stationary", mode: "Sea Freight" },
];

const statusStyle = (status: string) => {
  switch (status) {
    case "Delivered": return styles.statusActive;
    case "Out For Delivery": return styles.statusPending;
    case "Stationary": return styles.statusStationary;
    default: return styles.statusPending;
  }
};

export default function DashboardPage() {
  const counts = {
    total: mockShipments.length,
    inTransit: mockShipments.filter(s => s.status === "In Transit" || s.status === "Out For Delivery").length,
    delivered: mockShipments.filter(s => s.status === "Delivered").length,
    stationary: mockShipments.filter(s => s.status === "Stationary").length,
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <Link href="/eshipcont/dashboard/tracking">
          <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Shipment
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
        {[
          { label: "Total Shipments", value: counts.total, icon: <Package size={32} strokeWidth={1.5} />, color: "var(--primary)" },
          { label: "In Transit", value: counts.inTransit, icon: <Truck size={32} strokeWidth={1.5} />, color: "#5e5ce6" },
          { label: "Delivered", value: counts.delivered, icon: <CheckCircle size={32} strokeWidth={1.5} />, color: "#34c759" },
          { label: "Stationary", value: counts.stationary, icon: <AlertCircle size={32} strokeWidth={1.5} />, color: "#ff3b30" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: "1.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.04)" }}>
            <div style={{ marginBottom: "0.5rem", color: stat.color }}>{stat.icon}</div>
            <p style={{ fontSize: "0.85rem", color: "#8f9bba", marginBottom: "0.5rem" }}>{stat.label}</p>
            <p style={{ fontSize: "2rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Shipments Table */}
      <div className={styles.tableCard}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ color: "var(--foreground)" }}>Recent Shipments</h3>
          <Link href="/eshipcont/dashboard/shipments" style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem" }}>
            View All →
          </Link>
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockShipments.map(s => (
              <tr key={s.id}>
                <td><strong style={{ fontFamily: "monospace" }}>{s.id}</strong></td>
                <td>{s.receiver}</td>
                <td>{s.origin}</td>
                <td>{s.dest}</td>
                <td>{s.mode}</td>
                <td><span className={`${styles.statusBadge} ${statusStyle(s.status)}`}>{s.status}</span></td>
                <td>
                  <Link href={`/eshipcont/dashboard/tracking?id=${s.id}`}>
                    <button style={{ background: "var(--secondary)", color: "white", border: "none", padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}>
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
