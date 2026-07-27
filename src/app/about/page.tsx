import styles from "./about.module.css";
import Link from "next/link";
import SiteFooter from "../components/SiteFooter";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <img src="/cargo2.jpg" alt="About us" className={styles.heroBg} />
        <div className={styles.heroContent}>
          <p className={styles.heroSub}>OUR STORY</p>
          <h1>About <span>ExpressShipDelivery</span></h1>
          <p>Delivering trust and speed across the globe for over 23 years.</p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.missionSection}>
        <div className={styles.missionLeft}>
          <div className={styles.sectionBadge}>WHO WE ARE</div>
          <h2>A Logistics Company<br /><span>Built on Trust</span></h2>
          <p>ExpressShipDelivery is a leading global logistics and express delivery company dedicated to providing seamless, fast, and secure transportation solutions. With state-of-the-art tracking systems and a robust international network, we guarantee the safety of your packages from dispatch to delivery.</p>
          <p>Since our founding in 2001, we have grown from a small local courier service into a trusted name in international freight and logistics, serving over 12,000 clients across 80+ countries.</p>
          <div className={styles.statsRow}>
            <div className={styles.stat}><h3>23+</h3><p>Years Experience</p></div>
            <div className={styles.stat}><h3>12K</h3><p>Happy Clients</p></div>
            <div className={styles.stat}><h3>80+</h3><p>Countries</p></div>
          </div>
        </div>
        <div className={styles.missionRight}>
          <img src="/man3.jpg" alt="Our team" className={styles.missionImg} />
          <div className={styles.missionBadge}>
            <span>🏆</span>
            <div>
              <h4>Award Winning</h4>
              <p>Best Logistics Company 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionBadge}>OUR CORE VALUES</div>
        <h2 className={styles.valuesTitle}>What Drives <span>Everything We Do</span></h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>⚡</div>
            <h3>Speed</h3>
            <p>We execute every delivery with a sense of urgency, because your time matters.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🔒</div>
            <h3>Security</h3>
            <p>Every shipment is tracked and insured end-to-end for your complete peace of mind.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🌍</div>
            <h3>Global Reach</h3>
            <p>Our network spans 80+ countries, ensuring no destination is too far.</p>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🤝</div>
            <h3>Integrity</h3>
            <p>We are transparent in our pricing and honest in every customer interaction.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <div className={styles.ctaLeft}>
            <p className={styles.ctaBadge}>GET STARTED TODAY</p>
            <h2>Ready to Ship with <span>Confidence?</span></h2>
            <p className={styles.ctaDesc}>Join thousands of satisfied businesses and individuals who trust ExpressShipDel for fast, secure, and affordable delivery solutions worldwide.</p>
          </div>
          <div className={styles.ctaBtns}>
            <Link href="/contact" className={styles.ctaPrimary}>Contact Us &rarr;</Link>
            <Link href="/track" className={styles.ctaSecondary}>Track Shipment</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
