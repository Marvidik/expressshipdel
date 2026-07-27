"use client";

import styles from "./contact.module.css";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";

export default function ContactPage() {
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
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" placeholder="e.g. John Doe" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email Address</label>
                  <input type="email" placeholder="e.g. john@example.com" className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input type="tel" placeholder="Your Phone Number" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Subject</label>
                <input type="text" placeholder="e.g. Shipment Enquiry" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Message</label>
                <textarea rows={5} placeholder="Write your message here..." className={styles.input}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Send Message &rarr;</button>
            </form>
          </div>

          {/* Info */}
          <div className={styles.infoCol}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✉️</div>
              <h4>Email Us</h4>
              <p>contact@expreshipdeliv.com </p>
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
