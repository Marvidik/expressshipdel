"use client";

import { FormEvent, useState } from "react";
import styles from "./contact.module.css";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xdaqbjna";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <img src="/cargo2.jpg" alt="Contact background" className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>GET IN TOUCH</p>
          <h1>Contact <span>ExpressShipDelivery</span></h1>
          <p>Have a question, need a quote, or want to schedule a pickup? Our team is available 24/7 and ready to help.</p>
        </div>
      </section>

      {/* Contact content */}
      <section className={styles.contactSection}>
        <div className={styles.contactGrid}>
          {/* Form */}
          <div className={styles.formCard}>
            <h2>Send Us a Message</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    className={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Shipment Enquiry"
                  className={styles.input}
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className={styles.input}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send Message →"}
              </button>
              {status === "success" && <p style={{ color: "#2e7d32", marginTop: "0.75rem" }}>Thanks! Your message was sent successfully.</p>}
              {status === "error" && <p style={{ color: "#c62828", marginTop: "0.75rem" }}>Something went wrong. Please try again later.</p>}
            </form>
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✉️</div>
              <h4>Email Us</h4>
              <p>contact@expreshipdeliv.com</p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📍</div>
              <h4>Visit Us</h4>
              <p>Canada</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
