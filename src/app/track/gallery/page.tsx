"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import SiteFooter from "../../components/SiteFooter";
import { API_BASE_URL } from "../../../config";
import styles from "../track.module.css";

interface GalleryShipment {
    trackingId: string;
    goodsImages: string[];
}

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

export default function TrackGalleryPage() {
    return (
        <Suspense fallback={<div className={styles.container}><Navbar /><section className={styles.trackSection}><div className={styles.emptyState}><h3>Loading gallery…</h3></div></section><SiteFooter /></div>}>
            <TrackGalleryPageContent />
        </Suspense>
    );
}

function TrackGalleryPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const trackingId = searchParams.get("id") || "";
    const [shipment, setShipment] = useState<GalleryShipment | null>(null);
    const [error, setError] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!trackingId) {
            setError("No tracking ID was provided.");
            return;
        }

        const loadShipment = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/public/track/${trackingId}/`);
                if (!res.ok) {
                    const data = await res.json();
                    setError(data?.detail || "Shipment was not found.");
                    return;
                }

                const data = await res.json();
                setShipment({
                    trackingId: data.tracking_id || trackingId,
                    goodsImages: normalizeGoodsImages(data.goods_image),
                });
            } catch {
                setError("An error occurred while loading the shipment images.");
            }
        };

        loadShipment();
    }, [trackingId]);

    return (
        <div className={styles.container}>
            <Navbar />
            <section className={styles.trackSection}>
                <div className={styles.galleryPageHeader}>
                    <button type="button" className={styles.backButton} onClick={() => router.push(`/track?id=${encodeURIComponent(trackingId)}`)}>
                        ← Back to tracking
                    </button>
                    <div>
                        <h1 className={styles.galleryTitle}>Shipment Images</h1>
                        <p className={styles.gallerySubtitle}>Browse the full image album for this shipment.</p>
                    </div>
                </div>

                {error && <div className={styles.emptyState}><h3>{error}</h3></div>}

                {shipment && shipment.goodsImages.length > 0 && (
                    <div className={styles.galleryPageContent}>
                        <div className={styles.galleryMainImageWrap}>
                            <img src={shipment.goodsImages[activeIndex]} alt="Shipment gallery item" className={styles.galleryMainImage} />
                        </div>
                        <div className={styles.galleryControls}>
                            <button type="button" className={styles.modalNavBtn} onClick={() => setActiveIndex((prev) => (prev === 0 ? shipment.goodsImages.length - 1 : prev - 1))}>
                                ←
                            </button>
                            <div className={styles.galleryThumbs}>
                                {shipment.goodsImages.map((image, idx) => (
                                    <button
                                        key={`${image}-${idx}`}
                                        type="button"
                                        className={`${styles.thumbnailButton} ${idx === activeIndex ? styles.thumbnailButtonActive : ""}`}
                                        onClick={() => setActiveIndex(idx)}
                                    >
                                        <img src={image} alt={`Shipment image ${idx + 1}`} className={styles.thumbnailImage} />
                                    </button>
                                ))}
                            </div>
                            <button type="button" className={styles.modalNavBtn} onClick={() => setActiveIndex((prev) => (prev === shipment.goodsImages.length - 1 ? 0 : prev + 1))}>
                                →
                            </button>
                        </div>
                    </div>
                )}

                {shipment && shipment.goodsImages.length === 0 && (
                    <div className={styles.emptyState}>
                        <h3>No images are available for this shipment yet.</h3>
                    </div>
                )}
            </section>
            <SiteFooter />
        </div>
    );
}
