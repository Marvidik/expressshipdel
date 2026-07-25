"use client";

import React, { useState, useEffect } from "react";
import styles from "./track.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";

const RealMap = dynamic(() => import("../components/RealMap"), { ssr: false });

interface ShipmentData {
  trackingId: string;
  status: string;
  latestUpdate: string;
  expectedDelivery: string;
  receiver: { name: string; email: string; address: string; };
  sender: { name: string; email: string; address: string; };
  shipment: {
    origin: string; destination: string; package: string; carrier: string;
    type: string; mode: string; referenceNo: string; product: string;
    quantity: number; paymentMode: string; totalFreight: string; totalWeight: string;
  };
  timeline: Array<{ status: string; location: string; date: string; done: boolean; active: boolean; }>;
}

function getMockShipment(id: string): ShipmentData {
  return {
    trackingId: id,
    status: "Out For Delivery",
    latestUpdate: "Package is out for delivery, waiting for confirmations before being delivered at customer address.",
    expectedDelivery: "25 October 2025 at 8:30 am",
    receiver: { name: "Chayna Eller", email: "chaynamoody@gmail.com", address: "813 W Robertson Blvd Chowchilla, California 93610" },
    sender: { name: "John Osei", email: "john.osei@damascocorp.sy", address: "15 Al Qaimariyya St, Damascus, Syria" },
    shipment: {
      origin: "Damascus, Syria", destination: "United States", package: "Special",
      carrier: "CargoNest Logistics", type: "Freight", mode: "Flight",
      referenceNo: "30737BY3", product: "Parcel", quantity: 1,
      paymentMode: "Cash", totalFreight: "$--", totalWeight: "2,220 kg",
    },
    timeline: [
      { status: "Label Created", location: "Damascus, Syria", date: "August 20, 2025 | 4:50 AM", done: true, active: false },
      { status: "Picked Up", location: "Damascus, Syria", date: "August 20, 2025 | 9:51 AM", done: true, active: false },
      { status: "In Transit", location: "Istanbul, Turkey", date: "September 28, 2025 | 2:00 PM", done: true, active: false },
      { status: "Out For Delivery", location: "Québec, Canada", date: "October 25, 2025 | 9:00 AM", done: false, active: true },
      { status: "Delivered", location: "", date: "", done: false, active: false },
    ],
  };
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
    // Check for ID in URL
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get("id");
    if (id) {
      setTrackingId(id);
      triggerSearch(id);
    }
  }, []);

  const triggerSearch = (id: string) => {
    setError("");
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShipment(getMockShipment(id.trim()));
    }, 1500);
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) { setError("Please enter a tracking number."); return; }

    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set("id", trackingId.trim());
    window.history.pushState({}, "", url);

    triggerSearch(trackingId.trim());
  };

  const activeIndex = shipment?.timeline.findIndex((t) => t.active) ?? -1;
  const progressPercent = shipment ? ((activeIndex) / (shipment.timeline.length - 1)) * 100 : 0;

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
              placeholder="Enter order / tracking number (e.g. 30737BY3)"
              value={trackingId}
              onChange={(e) => { setTrackingId(e.target.value); setShipment(null); }}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.trackBtn} disabled={isProcessing}>
              {isProcessing ? "Searching..." : "Track order"}
            </button>
          </form>
          {error && <p className={styles.errorMsg}>{error}</p>}
        </div>

        {!shipment && !isProcessing && (
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
            <div className={styles.statusBanner}>
              <div className={styles.statusLeft}>
                <span className={styles.statusPill}>{shipment.status}</span>
                <div>
                  <p className={styles.statusLabel}>Latest Update</p>
                  <p className={styles.statusMsg}>{shipment.latestUpdate}</p>
                </div>
              </div>
              <div className={styles.statusRight}>
                <p className={styles.statusLabel}>Expected Delivery</p>
                <p className={styles.statusDate}>{shipment.expectedDelivery}</p>
              </div>
            </div>

            {/* Map Tracker */}
            <div className={styles.infoCard + " " + styles.mapCard}>
              <RealMap />
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
                {shipment.timeline.map((step, i) => (
                  <div
                    key={i}
                    className={`${styles.progressNode} ${step.done || step.active ? styles.progressNodeDone : ""} ${step.active ? styles.progressNodeActive : ""}`}
                    style={{ left: `${(i / (shipment.timeline.length - 1)) * 100}%` }}
                  >
                    <div className={styles.progressDot}>
                      {step.done && <span>✓</span>}
                      {step.active && <span className={styles.activePulse}></span>}
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

            <div className={styles.infoGrid}>
              <div className={styles.timelineCard}>
                <h3 className={styles.cardTitle}>Shipment Timeline</h3>
                <div className={styles.timeline}>
                  {shipment.timeline.map((step, i) => (
                    <div key={i} className={`${styles.tStep} ${step.active ? styles.tStepActive : ""} ${step.done ? styles.tStepDone : ""}`}>
                      <div className={styles.tDotWrap}>
                        <div className={styles.tDot}>
                          {step.done && <span>✓</span>}
                          {step.active && <span className={styles.activePulseSmall}></span>}
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
                  <div className={styles.infoRow}><span>Email</span><strong>{shipment.receiver.email}</strong></div>
                  <div className={styles.infoRow}><span>Shipping Address</span><strong>{shipment.receiver.address}</strong></div>
                </div>
                <div className={styles.infoCard}>
                  <h3 className={styles.cardTitle}>Sender Information</h3>
                  <div className={styles.infoRow}><span>Name</span><strong>{shipment.sender.name}</strong></div>
                  <div className={styles.infoRow}><span>Email</span><strong>{shipment.sender.email}</strong></div>
                  <div className={styles.infoRow}><span>Address</span><strong>{shipment.sender.address}</strong></div>
                </div>
              </div>
            </div>

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
