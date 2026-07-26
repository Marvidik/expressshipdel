"use client";

import { useState, useEffect } from "react";
import styles from "../../admin.module.css";

type RouteStop = { location: string; date: string; status: string };

const EMPTY_FORM = {
  trackingId: "",
  status: "In Transit",
  isMoving: true,
  latestUpdate: "",
  expectedDelivery: "",
  // Receiver
  receiverName: "",
  receiverEmail: "",
  receiverPhone: "",
  receiverAddress: "",
  // Sender
  senderName: "",
  senderEmail: "",
  senderPhone: "",
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

import { Save, Plus, X, Package, MapPin, User, Send, Truck, CheckCircle, Loader2 } from "lucide-react";

import { API_BASE_URL } from "../../../../config";
import { useSearchParams } from "next/navigation";

export default function TrackingAdminPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [form, setForm] = useState(EMPTY_FORM);
  const [route, setRoute] = useState<RouteStop[]>([
    { location: "", date: "", status: "Label Created" },
  ]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (editId) {
      fetch(`${API_BASE_URL}/public/administrator/admin/shipments/${editId}/`, {
        headers: { "Authorization": `Token ${localStorage.getItem("eshipcont_token")}` }
      })
      .then(res => res.json())
      .then(data => {
        if(data && data.info) {
          const contact = data.delivery_contacts?.[0] || {};
          setForm({
            trackingId: data.tracking_id || "",
            status: data.info.status || "In Transit",
            isMoving: data.info.movement_status === "Moving",
            latestUpdate: data.info.latest_message || "",
            expectedDelivery: data.info.expected_delivery_date || "",
            receiverName: contact.contact_name || "",
            receiverEmail: contact.contact_email || "",
            receiverPhone: contact.contact_phone || "",
            receiverAddress: contact.contact_address || "",
            senderName: contact.sender_name || "",
            senderEmail: contact.sender_email || "",
            senderPhone: contact.sender_phone || "",
            senderAddress: contact.sender_address || "",
            origin: data.origin || "",
            destination: data.destination || "",
            currentLocation: data.info.current_location || "",
            package: data.package_type || "Standard",
            carrier: data.carrier || "",
            type: data.shipment_type || "Freight",
            mode: data.shipment_mode || "Flight",
            referenceNo: data.info.reference || "",
            product: data.product || "",
            quantity: data.quantity?.toString() || "1",
            paymentMode: data.payment_mode || "Cash",
            totalFreight: data.total_freight || "",
            totalWeight: data.total_weight || "",
          });
          
          if (data.movement_locations && data.movement_locations.length > 0) {
            setRoute(data.movement_locations.map((loc: any) => {
              // Convert ISO timestamp to datetime-local format (YYYY-MM-DDTHH:mm)
              let dateVal = "";
              if (loc.timestamp) {
                try {
                  const d = new Date(loc.timestamp);
                  dateVal = d.toISOString().slice(0, 16); // "2026-07-26T09:30"
                } catch { dateVal = loc.timestamp; }
              }
              return { location: loc.location, date: dateVal, status: loc.status };
            }));
          }
        }
      })
      .catch(err => console.error("Failed to fetch shipment", err));
    }
  }, [editId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRouteChange = (idx: number, field: keyof RouteStop, value: string) => {
    setRoute(prev => prev.map((stop, i) => i === idx ? { ...stop, [field]: value } : stop));
  };

  const addStop = () => setRoute(prev => [...prev, { location: "", date: "", status: "In Transit" }]);
  const removeStop = (idx: number) => setRoute(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct payload
    const payload: any = {
      ...(form.trackingId ? { tracking_id: form.trackingId } : {}),
      origin: form.origin,
      destination: form.destination,
      carrier: form.carrier,
      package_type: form.package,
      shipment_type: form.type,
      shipment_mode: form.mode,
      product: form.product,
      quantity: parseInt(form.quantity),
      payment_mode: form.paymentMode,
      total_freight: form.totalFreight,
      total_weight: form.totalWeight,
      info: {
        status: form.status,
        latest_message: form.latestUpdate,
        movement_status: form.isMoving ? "Moving" : "Stationary",
        current_location: form.currentLocation,
        expected_delivery_date: form.expectedDelivery,
        reference: form.referenceNo || "-"
      },
      delivery_contacts: [{
        contact_name: form.receiverName || "-",
        contact_email: form.receiverEmail || "-",
        contact_phone: form.receiverPhone || "-",
        contact_address: form.receiverAddress || "-",
        sender_name: form.senderName || "-",
        sender_email: form.senderEmail || "-",
        sender_phone: form.senderPhone || "-",
        sender_address: form.senderAddress || "-"
      }],

      movement_locations: route.map(r => ({
        location: r.location,
        timestamp: r.date, // Needs ISO if API expects it
        status: r.status
      }))
    };

    const url = editId 
      ? `${API_BASE_URL}/public/administrator/admin/shipments/${editId}/` 
      : `${API_BASE_URL}/public/administrator/admin/shipments/`;
      
    const method = editId ? "PATCH" : "POST";

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Token ${localStorage.getItem("eshipcont_token")}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const text = await res.text();
        try {
          const errObj = JSON.parse(text);
          setSaveError(JSON.stringify(errObj, null, 2));
        } catch {
          setSaveError(text || "Failed to save shipment.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setSaveError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tracking Manager</h1>
        <button type="submit" disabled={isSaving} className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? <Loader2 size={18} className={styles.spin} /> : saved ? <CheckCircle size={18} /> : <Save size={18} />} 
          {isSaving ? "Saving..." : saved ? "Saved!" : "Save Shipment"}
        </button>
      </div>

      {/* Core Info */}
      <div className={styles.formSection}>
        <h3><Package size={20} className={styles.pIcon} /> Shipment Identifiers</h3>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>Tracking ID</label>
            <input 
              name="trackingId" 
              value={form.trackingId} 
              readOnly 
              disabled 
              placeholder="Auto-generated by system" 
              style={{ backgroundColor: "#f0f2f5", color: "#888", cursor: "not-allowed" }}
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Reference Number</label>
            <input name="referenceNo" value={form.referenceNo} onChange={handleChange} placeholder="Internal reference" />
          </div>
          <div className={styles.inputGroup}>
            <label>Expected Delivery Date</label>
            <input type="date" name="expectedDelivery" value={form.expectedDelivery} onChange={handleChange} />
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
              <input type="datetime-local" value={stop.date} onChange={e => handleRouteChange(idx, "date", e.target.value)} />
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
      <div className={styles.grid2Col}>
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
            <label>Phone Number</label>
            <input name="receiverPhone" value={form.receiverPhone} onChange={handleChange} placeholder="+1 234 567 8900" />
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
            <label>Phone Number</label>
            <input name="senderPhone" value={form.senderPhone} onChange={handleChange} placeholder="+1 234 567 8900" />
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
      {saveError && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          backgroundColor: "#ffebee",
          color: "#d32f2f",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          border: "1px solid #ffcdd2",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "400px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
            <strong>Error Saving Shipment</strong>
            <button type="button" onClick={() => setSaveError(null)} style={{ background: "none", border: "none", color: "#d32f2f", cursor: "pointer", padding: "0", marginLeft: "1rem" }}>
              <X size={16} />
            </button>
          </div>
          <pre style={{ margin: "0", whiteSpace: "pre-wrap", fontSize: "0.85rem", fontFamily: "inherit", maxHeight: "200px", overflowY: "auto" }}>
            {saveError}
          </pre>
        </div>
      )}

      <button type="submit" disabled={isSaving} className={styles.saveBtn} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", opacity: isSaving ? 0.7 : 1 }}>
        {isSaving ? <Loader2 size={20} className={styles.spin} /> : saved ? <CheckCircle size={20} /> : <Save size={20} />} 
        {isSaving ? "Saving Shipment Data..." : saved ? "Shipment Saved Successfully!" : "Save Shipment Data"}
      </button>
    </form>
  );
}
