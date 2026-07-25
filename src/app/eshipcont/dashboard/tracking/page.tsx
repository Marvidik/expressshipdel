"use client";

import { useState, useEffect } from "react";
import styles from "../../admin.module.css";

type RouteStop = { location: string; date: string; status: string };

const EMPTY_FORM = {
  trackingId: "",
  status: "In Transit",
  isMoving: true,
  stationaryReason: "",
  stationaryRequirement: "",
  latestUpdate: "",
  expectedDelivery: "",
  // Receiver
  receiverName: "",
  receiverEmail: "",
  receiverAddress: "",
  // Sender
  senderName: "",
  senderEmail: "",
  senderAddress: "",
  // Shipment
  origin: "",
  destination: "",
  currentLocation: "",
  package: "Standard",
  carrier: "",
  type: "Freight",
  mode: "Flight",
  referenceNo: "",
  product: "",
  quantity: "1",
  paymentMode: "Cash",
  totalFreight: "",
  totalWeight: "",
};

import { Save, Plus, X, Package, MapPin, User, Send, Truck, CheckCircle } from "lucide-react";

export default function TrackingAdminPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [route, setRoute] = useState<RouteStop[]>([
    { location: "", date: "", status: "Label Created" },
  ]);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRouteChange = (idx: number, field: keyof RouteStop, value: string) => {
    setRoute(prev => prev.map((stop, i) => i === idx ? { ...stop, [field]: value } : stop));
  };

  const addStop = () => setRoute(prev => [...prev, { location: "", date: "", status: "In Transit" }]);
  const removeStop = (idx: number) => setRoute(prev => prev.filter((_, i) => i !== idx));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to API
    console.log("Saving shipment:", { form, route });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tracking Manager</h1>
        <button type="submit" className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {saved ? <CheckCircle size={18} /> : <Save size={18} />} {saved ? "Saved!" : "Save Shipment"}
        </button>
      </div>

      {/* Core Info */}
      <div className={styles.formSection}>
        <h3><Package size={20} className={styles.pIcon} /> Shipment Identifiers</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tracking ID</label>
            <input name="trackingId" value={form.trackingId} onChange={handleChange} placeholder="e.g. 30737BY3" required />
          </div>
          <div className={styles.inputGroup}>
            <label>Reference Number</label>
            <input name="referenceNo" value={form.referenceNo} onChange={handleChange} placeholder="Internal reference" />
          </div>
          <div className={styles.inputGroup}>
            <label>Expected Delivery</label>
            <input type="text" name="expectedDelivery" value={form.expectedDelivery} onChange={handleChange} placeholder="25 October 2025 at 8:30 am" />
          </div>
          <div className={styles.inputGroup}>
            <label>Overall Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Label Created</option>
              <option>Picked Up</option>
              <option>In Transit</option>
              <option>Out For Delivery</option>
              <option>Delivered</option>
              <option>Stationary</option>
              <option>Customs Hold</option>
            </select>
          </div>
        </div>
        <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
          <label>Latest Update Message</label>
          <textarea name="latestUpdate" value={form.latestUpdate} onChange={handleChange} placeholder="e.g. Package is out for delivery, waiting for confirmations..." rows={3} />
        </div>
      </div>

      {/* Movement Status */}
      <div className={styles.formSection}>
        <h3><MapPin size={20} className={styles.pIcon} /> Movement & Current Location</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Current Location</label>
            <input name="currentLocation" value={form.currentLocation} onChange={handleChange} placeholder="e.g. Québec, Canada" />
          </div>
          <div className={styles.inputGroup}>
            <label>Movement Status</label>
            <select
              value={form.isMoving ? "moving" : "stationary"}
              onChange={e => setForm(prev => ({ ...prev, isMoving: e.target.value === "moving" }))}
            >
              <option value="moving">Moving</option>
              <option value="stationary">Stationary</option>
            </select>
          </div>
        </div>
        {!form.isMoving && (
          <div className={styles.formGrid} style={{ marginTop: "1rem" }}>
            <div className={styles.inputGroup}>
              <label>Reason for Delay / Stoppage</label>
              <textarea name="stationaryReason" value={form.stationaryReason} onChange={handleChange} placeholder="e.g. Package held at customs for documentation review." rows={3} />
            </div>
            <div className={styles.inputGroup}>
              <label>What is Required to Move It</label>
              <textarea name="stationaryRequirement" value={form.stationaryRequirement} onChange={handleChange} placeholder="e.g. Receiver must provide import permit within 5 business days." rows={3} />
            </div>
          </div>
        )}
      </div>

      {/* Route Timeline */}
      <div className={styles.formSection}>
        <h3><MapPin size={20} className={styles.pIcon} /> Shipment Route</h3>
        <p style={{ color: "#8f9bba", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Add each stop in the shipment&apos;s journey. The last entry is treated as the current location.
        </p>
        {route.map((stop, idx) => (
          <div key={idx} className={styles.formRow} style={{ alignItems: "flex-end", background: "#f8f9ff", borderRadius: 10, padding: "1rem", marginBottom: "0.8rem" }}>
            <div style={{ flex: 1 }} className={styles.inputGroup}>
              <label>Location</label>
              <input value={stop.location} onChange={e => handleRouteChange(idx, "location", e.target.value)} placeholder="e.g. Istanbul, Turkey" />
            </div>
            <div style={{ flex: 1 }} className={styles.inputGroup}>
              <label>Date & Time</label>
              <input value={stop.date} onChange={e => handleRouteChange(idx, "date", e.target.value)} placeholder="e.g. September 28, 2025 | 2:00 PM" />
            </div>
            <div style={{ flex: 1 }} className={styles.inputGroup}>
              <label>Status at this stop</label>
              <select value={stop.status} onChange={e => handleRouteChange(idx, "status", e.target.value)}>
                <option>Label Created</option>
                <option>Picked Up</option>
                <option>In Transit</option>
                <option>Out For Delivery</option>
                <option>Delivered</option>
                <option>Stationary</option>
                <option>Customs Hold</option>
              </select>
            </div>
            {route.length > 1 && (
              <button type="button" className={styles.removeBtn} onClick={() => removeStop(idx)} style={{ marginBottom: "1.5rem" }}>
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button type="button" className={styles.addBtn} onClick={addStop}>
          <Plus size={16} /> Add Route Stop
        </button>
      </div>

      {/* Receiver & Sender */}
      <div className={styles.grid2Col} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className={styles.formSection}>
          <h3><User size={20} className={styles.pIcon} /> Receiver Information</h3>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input name="receiverName" value={form.receiverName} onChange={handleChange} placeholder="e.g. Chayna Eller" />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input name="receiverEmail" value={form.receiverEmail} onChange={handleChange} placeholder="receiver@email.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Shipping Address</label>
            <textarea name="receiverAddress" value={form.receiverAddress} onChange={handleChange} placeholder="813 W Robertson Blvd, Chowchilla, CA..." rows={3} />
          </div>
        </div>
        <div className={styles.formSection}>
          <h3><Send size={20} className={styles.pIcon} /> Sender Information</h3>
          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input name="senderName" value={form.senderName} onChange={handleChange} placeholder="e.g. John Osei" />
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input name="senderEmail" value={form.senderEmail} onChange={handleChange} placeholder="sender@email.com" />
          </div>
          <div className={styles.inputGroup}>
            <label>Address</label>
            <textarea name="senderAddress" value={form.senderAddress} onChange={handleChange} placeholder="15 Al Qaimariyya St, Damascus, Syria" rows={3} />
          </div>
        </div>
      </div>

      {/* Shipment Details */}
      <div className={styles.formSection}>
        <h3><Truck size={20} className={styles.pIcon} /> Shipment Details</h3>
        <div className={styles.formGrid3}>
          <div className={styles.inputGroup}>
            <label>Origin</label>
            <input name="origin" value={form.origin} onChange={handleChange} placeholder="e.g. Damascus, Syria" />
          </div>
          <div className={styles.inputGroup}>
            <label>Destination</label>
            <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. United States" />
          </div>
          <div className={styles.inputGroup}>
            <label>Carrier</label>
            <input name="carrier" value={form.carrier} onChange={handleChange} placeholder="e.g. CargoNest Logistics" />
          </div>
          <div className={styles.inputGroup}>
            <label>Package Type</label>
            <select name="package" value={form.package} onChange={handleChange}>
              <option>Standard</option>
              <option>Special</option>
              <option>Fragile</option>
              <option>Hazardous</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Shipment Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Freight</option>
              <option>Parcel</option>
              <option>Document</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Shipment Mode</label>
            <select name="mode" value={form.mode} onChange={handleChange}>
              <option>Flight</option>
              <option>Sea Freight</option>
              <option>Road</option>
              <option>Rail</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Product</label>
            <input name="product" value={form.product} onChange={handleChange} placeholder="e.g. Parcel, Electronics" />
          </div>
          <div className={styles.inputGroup}>
            <label>Quantity</label>
            <input name="quantity" value={form.quantity} onChange={handleChange} type="number" min="1" />
          </div>
          <div className={styles.inputGroup}>
            <label>Payment Mode</label>
            <select name="paymentMode" value={form.paymentMode} onChange={handleChange}>
              <option>Cash</option>
              <option>Card</option>
              <option>Bank Transfer</option>
              <option>Crypto</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Total Freight</label>
            <input name="totalFreight" value={form.totalFreight} onChange={handleChange} placeholder="e.g. $1,250" />
          </div>
          <div className={styles.inputGroup}>
            <label>Total Weight</label>
            <input name="totalWeight" value={form.totalWeight} onChange={handleChange} placeholder="e.g. 2,220 kg" />
          </div>
        </div>
      </div>

      <button type="submit" className={styles.saveBtn}>
        {saved ? <CheckCircle size={20} /> : <Save size={20} />} 
        {saved ? "Shipment Saved Successfully!" : "Save Shipment Data"}
      </button>
    </form>
  );
}
