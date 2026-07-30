"use client";

import { useState, useEffect } from "react";
import styles from "../../admin.module.css";

type RouteStop = { location: string; date: string; status: string; latitude: number | null; longitude: number | null };

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
  goodsImage: "",
};

function normalizeGoodsImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim() !== "");
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function roundCoordinate(value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value)) {
    return null;
  }

  return Number(value.toFixed(6));
}

function formatMovementTimestamp(value: string): string | null {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

import { Save, Plus, X, Package, MapPin, User, Send, Truck, CheckCircle, Loader2 } from "lucide-react";

import { API_BASE_URL } from "../../../../config";
import { useSearchParams } from "next/navigation";
import LocationPicker from "../../../components/LocationPicker";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "oyo6pxwg";
const CLOUDINARY_UNSIGNED_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || "expressship";

async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UNSIGNED_PRESET);
  formData.append("folder", "expressship");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Image upload failed.");
  }

  const data = await response.json();
  return data.secure_url as string;
}

export default function TrackingAdminPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const [form, setForm] = useState(EMPTY_FORM);
  const [route, setRoute] = useState<RouteStop[]>([
    { location: "", date: "", status: "Label Created", latitude: null, longitude: null },
  ]);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [goodsImageEntries, setGoodsImageEntries] = useState<string[]>([]);
  const [goodsImageUrlInput, setGoodsImageUrlInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentLocationValue, setCurrentLocationValue] = useState({ location: "", latitude: null as number | null, longitude: null as number | null });
  const [movementLocationValue, setMovementLocationValue] = useState({ location: "", latitude: null as number | null, longitude: null as number | null });
  const [originValue, setOriginValue] = useState({ location: "", latitude: null as number | null, longitude: null as number | null });
  const [destinationValue, setDestinationValue] = useState({ location: "", latitude: null as number | null, longitude: null as number | null });
  const [mapMovement, setMapMovement] = useState("active");

  useEffect(() => {
    if (editId) {
      fetch(`${API_BASE_URL}/public/administrator/admin/shipments/${editId}/`, {
        headers: { "Authorization": `Token ${localStorage.getItem("eshipcont_token")}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.info) {
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
              goodsImage: "",
            });
            setGoodsImageEntries(normalizeGoodsImages(data.goods_image));
            setCurrentLocationValue({
              location: data.info.current_location || "",
              latitude: coerceNumber(data.info.current_location_latitude),
              longitude: coerceNumber(data.info.current_location_longitude),
            });
            setOriginValue({
              location: data.origin || "",
              latitude: coerceNumber(data.origin_latitude),
              longitude: coerceNumber(data.origin_longitude),
            });
            setDestinationValue({
              location: data.destination || "",
              latitude: coerceNumber(data.destination_latitude),
              longitude: coerceNumber(data.destination_longitude),
            });
            // Read map_movement from backend
            setMapMovement(data.map_movement === true ? "realtime" : "active");

            if (data.movement_locations && data.movement_locations.length > 0) {
              const normalizedRoute = data.movement_locations.map((loc: any) => {
                let dateVal = "";
                if (loc.timestamp) {
                  try {
                    const d = new Date(loc.timestamp);
                    dateVal = d.toISOString().slice(0, 16);
                  } catch {
                    dateVal = loc.timestamp;
                  }
                }
                return { location: loc.location, date: dateVal, status: loc.status, latitude: coerceNumber(loc.latitude), longitude: coerceNumber(loc.longitude) };
              });
              setRoute(normalizedRoute);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(prev => {
      const existing = new Set(prev.map(file => `${file.name}-${file.size}-${file.lastModified}`));
      const merged = [...prev, ...files.filter(file => !existing.has(`${file.name}-${file.size}-${file.lastModified}`))];
      return merged;
    });

    e.target.value = "";
  };

  const addGoodsImageUrl = () => {
    const trimmedUrl = goodsImageUrlInput.trim();
    if (!trimmedUrl) return;

    setGoodsImageEntries(prev => (prev.includes(trimmedUrl) ? prev : [...prev, trimmedUrl]));
    setGoodsImageUrlInput("");
  };

  const removeGoodsImageEntry = (url: string) => {
    setGoodsImageEntries(prev => prev.filter(item => item !== url));
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const clearAllGoodsImages = () => {
    setGoodsImageEntries([]);
    setSelectedFiles([]);
  };

  const handleRouteChange = (idx: number, field: keyof RouteStop, value: string) => {
    setRoute(prev => prev.map((stop, i) => i === idx ? { ...stop, [field]: value } : stop));
  };

  const handleRouteLocationChange = (idx: number, value: { location: string; latitude: number | null; longitude: number | null }) => {
    setRoute(prev => prev.map((stop, i) => i === idx ? { ...stop, location: value.location, latitude: value.latitude, longitude: value.longitude } : stop));
  };

  const addStop = () => setRoute(prev => [...prev, { location: "", date: "", status: "In Transit", latitude: null, longitude: null }]);
  const removeStop = (idx: number) => setRoute(prev => prev.filter((_, i) => i !== idx));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentLocationError = !currentLocationValue.location || currentLocationValue.latitude == null || currentLocationValue.longitude == null
      ? "Please choose a current location from the dropdown and confirm the map marker."
      : null;

    const movementLocationError = route.some((stop) => stop.location.trim() && (stop.latitude == null || stop.longitude == null))
      ? "Please choose a location from the dropdown for each movement stop that has a name."
      : null;

    if (currentLocationError || movementLocationError) {
      setSaveError(currentLocationError || movementLocationError || "Please complete the location details.");
      return;
    }

    const parsedGoodsImages = goodsImageEntries.filter(Boolean);
    const uploadedGoodsImages: string[] = [];

    if (selectedFiles.length > 0) {
      setIsUploading(true);
      try {
        for (const file of selectedFiles) {
          const uploadedUrl = await uploadToCloudinary(file);
          uploadedGoodsImages.push(uploadedUrl);
        }
      } catch (err: any) {
        setSaveError(err.message || "Image upload failed.");
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const finalGoodsImages = [...parsedGoodsImages, ...uploadedGoodsImages].filter(Boolean);

    // Construct payload
    const payload: any = {
      ...(form.trackingId ? { tracking_id: form.trackingId } : {}),
      origin: originValue.location || form.origin,
      destination: destinationValue.location || form.destination,
      ...(roundCoordinate(originValue.latitude) != null ? { origin_latitude: roundCoordinate(originValue.latitude) } : {}),
      ...(roundCoordinate(originValue.longitude) != null ? { origin_longitude: roundCoordinate(originValue.longitude) } : {}),
      ...(roundCoordinate(destinationValue.latitude) != null ? { destination_latitude: roundCoordinate(destinationValue.latitude) } : {}),
      ...(roundCoordinate(destinationValue.longitude) != null ? { destination_longitude: roundCoordinate(destinationValue.longitude) } : {}),
      carrier: form.carrier,
      package_type: form.package,
      shipment_type: form.type,
      shipment_mode: form.mode,
      product: form.product,
      quantity: parseInt(form.quantity),
      payment_mode: form.paymentMode,
      total_freight: form.totalFreight,
      total_weight: form.totalWeight,
      goods_image: finalGoodsImages,
      info: {
        status: form.status,
        latest_message: form.latestUpdate,
        movement_status: form.isMoving ? "Moving" : "Stationary",
        current_location: currentLocationValue.location || form.currentLocation,
        current_location_latitude: roundCoordinate(currentLocationValue.latitude),
        current_location_longitude: roundCoordinate(currentLocationValue.longitude),
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

      movement_locations: route
        .filter(r => r.location.trim() || r.date || r.status)
        .map(r => {
          const timestamp = formatMovementTimestamp(r.date);
          return {
            location: r.location,
            ...(timestamp ? { timestamp } : {}),
            status: r.status,
            ...(roundCoordinate(r.latitude) != null ? { latitude: roundCoordinate(r.latitude) } : {}),
            ...(roundCoordinate(r.longitude) != null ? { longitude: roundCoordinate(r.longitude) } : {})
          };
        }),
      map_movement: mapMovement === "realtime"
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
        setGoodsImageEntries(finalGoodsImages);
        setSelectedFiles([]);
        setGoodsImageUrlInput("");
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
        <button type="submit" disabled={isSaving || isUploading} className={styles.actionBtn} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving || isUploading ? 0.7 : 1 }}>
          {isSaving || isUploading ? <Loader2 size={18} className={styles.spin} /> : saved ? <CheckCircle size={18} /> : <Save size={18} />}
          {isSaving ? "Saving..." : isUploading ? "Uploading..." : saved ? "Saved!" : "Save Shipment"}
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
            <label>Goods Images</label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                value={goodsImageUrlInput}
                onChange={(e) => setGoodsImageUrlInput(e.target.value)}
                placeholder="Paste an image URL"
                style={{ flex: 1, minWidth: "220px" }}
              />
              <button type="button" className={styles.addBtn} onClick={addGoodsImageUrl}>
                <Plus size={16} /> Add URL
              </button>
            </div>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} style={{ marginTop: "0.75rem" }} />
            {(goodsImageEntries.length > 0 || selectedFiles.length > 0) && (
              <div style={{ marginTop: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
                  <button type="button" onClick={clearAllGoodsImages} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0, fontSize: "0.85rem" }}>
                    Clear all images
                  </button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {goodsImageEntries.map((image, idx) => (
                    <div key={`${image}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.6rem", background: "#f8f9ff", borderRadius: "999px", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.85rem", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{image}</span>
                      <button type="button" onClick={() => removeGoodsImageEntry(image)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }} aria-label="Remove image">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {selectedFiles.map((file, idx) => (
                    <div key={`${file.name}-${idx}`} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.6rem", background: "#f8f9ff", borderRadius: "999px", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "0.85rem", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                      <button type="button" onClick={() => removeSelectedFile(idx)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: 0 }} aria-label="Remove selected file">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#8f9bba" }}>
              Add as many images as you need, then remove any item before saving if you change your mind.
            </p>
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
            <LocationPicker
              value={currentLocationValue}
              onChange={(value) => {
                setCurrentLocationValue(value);
                setForm(prev => ({ ...prev, currentLocation: value.location }));
              }}
              label="Current Location"
              placeholder="Search location..."
            />
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
          <div key={idx} className={styles.routeRow}>
            <div className={`${styles.inputGroup} ${styles.routeFieldGroup}`}>
              <LocationPicker
                value={{ location: stop.location, latitude: stop.latitude, longitude: stop.longitude }}
                onChange={(value) => handleRouteLocationChange(idx, value)}
                label={`Movement location ${idx + 1}`}
                placeholder="Search movement location..."
              />
            </div>
            <div className={`${styles.inputGroup} ${styles.routeFieldGroup}`}>
              <label>Date & Time</label>
              <input type="datetime-local" value={stop.date} onChange={e => handleRouteChange(idx, "date", e.target.value)} />
            </div>
            <div className={`${styles.inputGroup} ${styles.routeFieldGroup}`}>
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
              <div className={styles.routeActionCell}>
                <button type="button" className={styles.removeBtn} onClick={() => removeStop(idx)}>
                  <X size={16} />
                </button>
              </div>
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
            <LocationPicker
              value={originValue}
              onChange={(value) => {
                setOriginValue(value);
                setForm(prev => ({ ...prev, origin: value.location }));
              }}
              label="Origin"
              placeholder="Search origin location..."
            />
          </div>
          <div className={styles.inputGroup}>
            <LocationPicker
              value={destinationValue}
              onChange={(value) => {
                setDestinationValue(value);
                setForm(prev => ({ ...prev, destination: value.location }));
              }}
              label="Destination"
              placeholder="Search destination location..."
            />
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

      <div className={styles.formSection}>
        <h3><MapPin size={20} className={styles.pIcon} /> Map Movement Simulation</h3>
        <p style={{ color: "#8f9bba", fontSize: "0.9rem", marginBottom: "1rem" }}>
          This setting controls how the map dot behaves for viewers tracking this shipment. It does not go to the backend and is simulated on the frontend based on the timestamps of the current and next locations.
        </p>
        <div className={styles.inputGroup} style={{ maxWidth: "400px" }}>
          <select value={mapMovement} onChange={e => setMapMovement(e.target.value)}>
            <option value="active">Active Current Location</option>
            <option value="realtime">Move In Real Time</option>
          </select>
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

      <button type="submit" disabled={isSaving || isUploading} className={styles.saveBtn} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", opacity: isSaving || isUploading ? 0.7 : 1 }}>
        {isSaving || isUploading ? <Loader2 size={20} className={styles.spin} /> : saved ? <CheckCircle size={20} /> : <Save size={20} />}
        {isSaving ? "Saving Shipment Data..." : isUploading ? "Uploading Image..." : saved ? "Shipment Saved Successfully!" : "Save Shipment Data"}
      </button>
    </form>
  );
}
