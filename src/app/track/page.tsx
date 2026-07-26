"use client";

import React, { useState, useEffect } from "react";
import styles from "./track.module.css";
import dynamic from "next/dynamic";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";
import { API_BASE_URL } from "../../config";

const RealMap = dynamic(() => import("../components/RealMap"), { ssr: false });

interface ShipmentData {
  trackingId: string;
  status: string;
  isMoving: boolean;
  currentLocation: string;
  origin: string;
  destination: string;
  latestUpdate: string;
  expectedDelivery: string;
  receiver: { name: string; phone: string; email: string; address: string; };
  sender: { name: string; phone: string; email: string; address: string; };
  shipment: {
    origin: string; destination: string; package: string; carrier: string;
    type: string; mode: string; referenceNo: string; product: string;
    quantity: number; paymentMode: string; totalFreight: string; totalWeight: string;
  };
  timeline: Array<{ status: string; location: string; date: string; done: boolean; active: boolean; }>;
}

function Barcode({ value }: { value: string }) {
  const bars = value.split("").map((c) => c.charCodeAt(0) % 4);
  return (
    <div className={styles.barcodeWrapper}>
      <div className={styles.barcodeStripes}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className={styles.barLine} style={{ width: (bars[i % bars.length] + 1) * 1.5 + "px" }} />
        ))}
      </div>
      <p className={styles.barcodeText}>{value}</p>
    </div>
  );
}

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      triggerSearch(id);
    }
  }, []);

  const triggerSearch = async (id: string) => {
    setError("");
    setIsProcessing(true);
    setShipment(null);
    try {
      const res = await fetch(`${API_BASE_URL}/public/track/${id.trim()}/`);
      if (res.status === 404 || !res.ok) {
        const data = await res.json();
        setError(data?.detail || "No Shipment matches the given query.");
      } else {
        const data = await res.json();
        const contact = data.delivery_contacts?.[0] || {};
        const movementLocations = data.movement_locations || [];
        const currentLoc = (data.info.current_location || "").toLowerCase().trim();

        // Find the index of the active (current) stop by matching current_location
        let currentIdx = movementLocations.findIndex(
          (loc: any) => loc.location.toLowerCase().trim() === currentLoc
        );
        // If not found by name, default to last stop
        if (currentIdx === -1) currentIdx = movementLocations.length - 1;

        // Build timeline:
        // idx < currentIdx  → done (✓)
        // idx === currentIdx → active (pulse, no ✓)
        // idx > currentIdx  → pending (no mark)
        const timeline = movementLocations.map((loc: any, idx: number) => ({
          status: loc.status,
          location: loc.location,
          date: new Date(loc.timestamp).toLocaleString(),
          done: idx < currentIdx,
          active: idx === currentIdx,
        }));

        const mapped: ShipmentData = {
          trackingId: data.tracking_id,
          status: data.info.status,
          isMoving: data.info.movement_status === "Moving",
          currentLocation: data.info.current_location || "",
          origin: data.origin || "",
          destination: data.destination || "",
          latestUpdate: data.info.latest_message || "No updates available.",
          expectedDelivery: data.info.expected_delivery_date || "-",
          receiver: {
            name: contact.contact_name || "-",
            phone: contact.contact_phone || "-",
            email: contact.contact_email || "-",
            address: contact.contact_address || "-",
          },
          sender: {
            name: contact.sender_name || "-",
            phone: contact.sender_phone || "-",
            email: contact.sender_email || "-",
            address: contact.sender_address || "-",
          },
          shipment: {
            origin: data.origin || "-",
            destination: data.destination || "-",
            package: data.package_type || "-",
            carrier: data.carrier || "-",
            type: data.shipment_type || "-",
            mode: data.shipment_mode || "-",
            referenceNo: data.info.reference || "-",
            product: data.product || "-",
            quantity: data.quantity || 1,
            paymentMode: data.payment_mode || "-",
            totalFreight: data.total_freight || "-",
            totalWeight: data.total_weight || "-",
          },
          timeline,
        };
        setShipment(mapped);
      }
    } catch {
      setError("An error occurred while tracking the shipment.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError("Please enter a tracking number."); return; }
    const url = new URL(window.location.href);
    url.searchParams.set("id", trackingId.trim());
    window.history.pushState({}, "", url);
    triggerSearch(trackingId.trim());
  };

  const activeIndex = shipment?.timeline.findIndex((t) => t.active) ?? -1;
  const progressPercent = shipment
    ? ((activeIndex < 0 ? shipment.timeline.length - 1 : activeIndex) / Math.max(shipment.timeline.length - 1, 1)) * 100
    : 0;

  return (
    <div className={styles.container}>
      <Navbar />

      <section className={styles.trackSection}>
        <div className={styles.trackHeader}>
          <div className={styles.heroOverlay}></div>
          <img src="/cargo2.jpg" alt="Track background" className={styles.heroBg} />
          <div className={styles.heroContent}>
            <h1>Track Order</h1>
            <p>Enter your tracking number to get real-time updates on your shipment&apos;s location, status, and expected delivery.</p>
          </div>
        </div>

        <div className={styles.searchContainer}>
          <form onSubmit={handleTrack} className={styles.searchForm}>
            <input
              type="text"
              placeholder="Enter order / tracking number (e.g. EXSD-000001)"
              value={trackingId}
              onChange={(e) => { setTrackingId(e.target.value); setShipment(null); setError(""); }}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.trackBtn} disabled={isProcessing}>
              {isProcessing ? "Searching..." : "Track order"}
            </button>
          </form>
          {error && <p className={styles.errorMsg}>{error}</p>}
        </div>

        {!shipment && !isProcessing && !error && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📦</div>
            <h3>Enter your tracking number above</h3>
            <p>Your full shipment info, timeline, and delivery details will appear here.</p>
          </div>
        )}

        {isProcessing && (
          <div className={styles.emptyState}>
            <div className={`${styles.emptyIcon} ${styles.spin}`}>🔄</div>
            <h3>Locating your shipment…</h3>
          </div>
        )}

        {shipment && (
          <div className={styles.resultWrapper}>
            {/* Status Banner */}
            <div className={styles.statusBanner}>
              <div className={styles.statusLeft}>
                <span className={`${styles.statusPill} ${shipment.isMoving ? styles.statusPillMoving : styles.statusPillStationary}`}>
                  {shipment.isMoving ? "🚛 " : "⏸ "}{shipment.status}
                </span>
                <div>
                  <p className={styles.statusLabel}>Latest Update</p>
                  <p className={styles.statusMsg}>{shipment.latestUpdate}</p>
                </div>
              </div>
              <div className={styles.statusRight}>
                <p className={styles.statusLabel}>Expected Delivery</p>
                <p className={styles.statusDate}>{shipment.expectedDelivery}</p>
                {shipment.currentLocation && (
                  <>
                    <p className={styles.statusLabel} style={{ marginTop: "1rem" }}>Current Location</p>
                    <p className={styles.statusDate} style={{ fontSize: "1rem" }}>{shipment.currentLocation}</p>
                  </>
                )}
              </div>
            </div>

            {/* Map Tracker */}
            <div className={styles.infoCard + " " + styles.mapCard}>
              <RealMap
                origin={shipment.origin}
                destination={shipment.destination}
                timeline={shipment.timeline.map(t => ({ location: t.location, status: t.status, active: t.active, done: t.done }))}
                currentLocation={shipment.currentLocation}
                isMoving={shipment.isMoving}
              />

            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
                {shipment.timeline.map((step, i) => (
                  <div
                    key={i}
                    className={`${styles.progressNode} ${step.done || step.active ? styles.progressNodeDone : ""} ${step.active ? styles.progressNodeActive : ""}`}
                    style={{ left: `${(i / Math.max(shipment.timeline.length - 1, 1)) * 100}%` }}
                  >
                    <div className={styles.progressDot}>
                      {step.done && <span>✓</span>}
                      {step.active && (
                        <span className={shipment.isMoving ? styles.activePulse : styles.activePulseStatic}></span>
                      )}
                    </div>
                    <div className={styles.progressLabel}>
                      <strong>{step.status}</strong>
                      {step.location && <span>{step.location}</span>}
                      {step.date && <span className={styles.progressDate}>{step.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline + Receiver/Sender */}
            <div className={styles.infoGrid}>
              <div className={styles.timelineCard}>
                <h3 className={styles.cardTitle}>Shipment Timeline</h3>
                {/* Movement status badge */}
                <div className={`${styles.movementBadge} ${shipment.isMoving ? styles.movementBadgeMoving : styles.movementBadgeStationary}`}>
                  {shipment.isMoving ? "🚛 Package is moving" : "⏸ Package is stationary"}
                </div>
                <div className={styles.timeline}>
                  {shipment.timeline.map((step, i) => (
                    <div key={i} className={`${styles.tStep} ${step.active ? styles.tStepActive : ""} ${step.done ? styles.tStepDone : ""}`}>
                      <div className={styles.tDotWrap}>
                        <div className={styles.tDot}>
                          {step.done && <span>✓</span>}
                          {step.active && (
                            <span className={shipment.isMoving ? styles.activePulseSmall : styles.activePulseSmallStatic}></span>
                          )}
                        </div>
                        {i < shipment.timeline.length - 1 && <div className={styles.tLine}></div>}
                      </div>
                      <div className={styles.tContent}>
                        <p className={styles.tStatus}>{step.status}</p>
                        {step.location && <p className={styles.tLocation}>{step.location}</p>}
                        {step.date && <p className={styles.tDate}>({step.date})</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.detailsColumn}>
                <div className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Receiver Information</h3>
                  <div className={styles.infoRow}><span>Name</span><strong>{shipment.receiver.name}</strong></div>
                  <div className={styles.infoRow}><span>Phone</span><strong>{shipment.receiver.phone}</strong></div>
                  <div className={styles.infoRow}><span>Email</span><strong>{shipment.receiver.email}</strong></div>
                  <div className={styles.infoRow}><span>Shipping Address</span><strong>{shipment.receiver.address}</strong></div>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Sender Information</h3>
                  <div className={styles.infoRow}><span>Name</span><strong>{shipment.sender.name}</strong></div>
                  <div className={styles.infoRow}><span>Phone</span><strong>{shipment.sender.phone}</strong></div>
                  <div className={styles.infoRow}><span>Email</span><strong>{shipment.sender.email}</strong></div>
                  <div className={styles.infoRow}><span>Address</span><strong>{shipment.sender.address}</strong></div>
                </div>
              </div>
            </div>

            {/* Shipment Info */}
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>Shipment Information</h3>
              <div className={styles.shipGrid}>
                <div className={styles.infoRow}><span>Origin</span><strong>{shipment.shipment.origin}</strong></div>
                <div className={styles.infoRow}><span>Destination</span><strong>{shipment.shipment.destination}</strong></div>
                <div className={styles.infoRow}><span>Package</span><strong>{shipment.shipment.package}</strong></div>
                <div className={styles.infoRow}><span>Carrier</span><strong>{shipment.shipment.carrier}</strong></div>
                <div className={styles.infoRow}><span>Shipment Type</span><strong>{shipment.shipment.type}</strong></div>
                <div className={styles.infoRow}><span>Shipment Mode</span><strong>{shipment.shipment.mode}</strong></div>
                <div className={styles.infoRow}><span>Reference No</span><strong>{shipment.shipment.referenceNo}</strong></div>
                <div className={styles.infoRow}><span>Product</span><strong>{shipment.shipment.product}</strong></div>
                <div className={styles.infoRow}><span>Quantity</span><strong>{shipment.shipment.quantity}</strong></div>
                <div className={styles.infoRow}><span>Payment Mode</span><strong>{shipment.shipment.paymentMode}</strong></div>
                <div className={styles.infoRow}><span>Total Freight</span><strong>{shipment.shipment.totalFreight}</strong></div>
                <div className={styles.infoRow}><span>Total Weight</span><strong>{shipment.shipment.totalWeight}</strong></div>
              </div>
            </div>

            <div className={styles.barcodeCard}>
              <Barcode value={shipment.trackingId} />
              <p className={styles.barcodeHint}>Scan this barcode at any ExpressShipDel service centre</p>
            </div>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
