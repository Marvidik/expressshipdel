"use client";

import { useState } from "react";
import styles from "../../admin.module.css";
import Link from "next/link";

const SHIPMENTS = [
  { id: "30737BY3", receiver: "Chayna Eller", origin: "Damascus, Syria", dest: "United States", status: "Out For Delivery", mode: "Flight", carrier: "CargoNest Logistics" },
  { id: "48291KX7", receiver: "Marcus Obi", origin: "Lagos, Nigeria", dest: "United Kingdom", status: "In Transit", mode: "Sea Freight", carrier: "OceanWave Ltd" },
  { id: "77142AZ9", receiver: "Priya Sharma", origin: "Mumbai, India", dest: "Canada", status: "Delivered", mode: "Flight", carrier: "AirDash Express" },
  { id: "33902PQ1", receiver: "Felix Müller", origin: "Berlin, Germany", dest: "Australia", status: "Stationary", mode: "Sea Freight", carrier: "GlobalFreight Co" },
];

const statusStyle = (status: string) => {
  switch (status) {
    case "Delivered": return "statusActive";
    case "Out For Delivery": return "statusPending";
    case "Stationary": return "statusStationary";
    default: return "statusPending";
  }
};

export default function ShipmentsPage() {
  const [search, setSearch] = useState("");
  const filtered = SHIPMENTS.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.receiver.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Shipments</h1>
        <Link href="/eshipcont/dashboard/tracking">
          <button className={styles.actionBtn}>+ Add Shipment</button>
        </Link>
      </div>

      <div className={styles.tableCard}>
        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Search by tracking ID or receiver name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: "0.8rem 1.2rem", borderRadius: 8, border: "1.5px solid #e8e8e8", width: "320px", fontSize: "0.9rem", outline: "none" }}
          />
        </div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Receiver</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Carrier</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id}>
                <td><strong style={{ fontFamily: "monospace", color: "var(--primary)" }}>{s.id}</strong></td>
                <td>{s.receiver}</td>
                <td>{s.origin}</td>
                <td>{s.dest}</td>
                <td>{s.carrier}</td>
                <td>{s.mode}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[statusStyle(s.status)]}`}>
                    {s.status}
                  </span>
                </td>
                <td style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/eshipcont/dashboard/tracking?id=${s.id}`}>
                    <button style={{ background: "var(--primary)", color: "white", border: "none", padding: "0.4rem 0.9rem", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>
                      Edit
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", padding: "3rem", color: "#aaa" }}>No shipments found.</p>
        )}
      </div>
    </>
  );
}
