"use client";

import { useEffect, useState } from "react";
import styles from "../admin.module.css";
import Link from "next/link";
import { Plus, Loader } from "lucide-react";
import { API_BASE_URL } from "../../../config";

const statusStyle = (status: string) => {
  switch (status) {
    case "Delivered": return styles.statusActive;
    case "Out For Delivery": return styles.statusPending;
    case "Stationary": return styles.statusStationary;
    default: return styles.statusPending;
  }
};

export default function DashboardPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/public/administrator/admin/shipments/`, {
        headers: {
          "Authorization": `Token ${localStorage.getItem("eshipcont_token")}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setShipments(data);
      } else {
        setError("Failed to fetch shipments.");
      }
    } catch (err) {
      setError("An error occurred while fetching shipments.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Shipments</h1>
        <Link href="/eshipcont/dashboard/tracking">
          <button className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> New Shipment
          </button>
        </Link>
      </div>

      <div className={styles.tableCard}>
        {error && <p style={{ color: "#ff3b30", marginBottom: "1rem" }}>{error}</p>}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <Loader size={32} className={styles.spin} />
          </div>
        ) : (
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
              {shipments.map(s => {
                const receiverName = s.delivery_contacts?.[0]?.contact_name || "-";
                const status = s.info?.status || "-";
                
                return (
                  <tr key={s.id}>
                    <td><strong style={{ fontFamily: "monospace" }}>{s.tracking_id || s.id}</strong></td>
                    <td>{receiverName}</td>
                    <td>{s.origin || "-"}</td>
                    <td>{s.destination || "-"}</td>
                    <td>{s.shipment_mode || "-"}</td>
                    <td><span className={`${styles.statusBadge} ${statusStyle(status)}`}>{status}</span></td>
                    <td>
                      <Link href={`/eshipcont/dashboard/tracking?id=${s.id}`}>
                        <button style={{ background: "var(--secondary)", color: "white", border: "none", padding: "0.4rem 1rem", borderRadius: 6, cursor: "pointer", fontSize: "0.85rem" }}>
                          Edit
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {shipments.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
