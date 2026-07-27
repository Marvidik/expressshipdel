"use client";

import styles from "./page.module.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SiteFooter from "./components/SiteFooter";
import Navbar from "./components/Navbar";
import { Truck, Coins, FastForward, Package, PackageOpen, Box } from "lucide-react";

const homeHeroSlides = [
  {
    image: "/cargo1.jpg",
    subtitle: "FAST & SECURE MOVE",
    title: (
      <>
        MOVING YOUR ITEMS <br />
        HAS NEVER BEEN<br />
        <span className={styles.heroHighlight}>SO EASY</span>
      </>
    ),
  },
  {
    image: "/cargo2.jpg",
    subtitle: "REAL-TIME TRACKING",
    title: (
      <>
        YOUR CARGO STAYS<br />
        IN SAFE HANDS<br />
        <span className={styles.heroHighlight}>EVERY STEP</span>
      </>
    ),
  },
];

export default function Home() {
  const router = useRouter();
  const [trackId, setTrackId] = useState("");
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  useEffect(() => {
    const heroInterval = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % homeHeroSlides.length);
    }, 3000);

    return () => window.clearInterval(heroInterval);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackId.trim()) {
      router.push(`/track?id=${encodeURIComponent(trackId.trim())}`);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <img src={homeHeroSlides[activeHeroIndex].image} alt="Cargo Background" className={styles.truckBg} />
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroSubtitle}>{homeHeroSlides[activeHeroIndex].subtitle}</div>
            <h1 className={styles.heroTitle}>{homeHeroSlides[activeHeroIndex].title}</h1>

            <button className={styles.getStartedBtn}>
              GET STARTED <div className={styles.getStartedIcon}>&gt;</div>
            </button>

            <div className={styles.trackWrapper}>
              <h3>Track your shipment</h3>
              <form className={styles.trackForm} onSubmit={handleTrack}>
                <input
                  type="text"
                  placeholder="Enter tracking number"
                  className={styles.trackInput}
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                />
                <button type="submit" className={styles.trackBtn}>Track</button>
              </form>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <h4>RELOCATION</h4>
                <p>80<span>+</span></p>
              </div>
              <div className={styles.statItem}>
                <h4>CLIENT</h4>
                <p>12<span>K</span></p>
              </div>
              <div className={styles.statItem}>
                <h4>MOVING HOUSE</h4>
                <p>150<span>+</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.heroBottomShape}></div>
      </section>

      {/* About Us (Transport & Logistics) */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutImageWrapper}>
          <img src="/man1.jpg" alt="About us" className={styles.aboutImage} />
          <div className={styles.experienceBadge}>
            <h2>23</h2>
            <p>YEARS<br />OF<br />EXPERIENCE</p>
          </div>
        </div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutSubtitle}>ABOUT US</div>
          <h2 className={styles.aboutTitle}>TRANSPORT &<br /><span>LOGISTICS</span></h2>
          <p className={styles.aboutText}>We are a leading global logistics and express delivery company dedicated to providing seamless, fast, and secure transportation solutions. With state-of-the-art tracking systems and a robust network, we guarantee the safety of your packages from dispatch to delivery.</p>
          <p className={styles.aboutText}>Our commitment to excellence has driven us to innovate constantly, ensuring that both businesses and individuals can rely on us for their most critical shipping needs.</p>
          {/* <div className={styles.socialIcons}>
            <a href="#">t</a>
            <a href="#">f</a>
            <a href="#">in</a>
          </div> */}
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.servicesInner}>
          <div className={styles.servicesHeader}>
            <div className={styles.badge}>What we do</div>
            <h2 className={styles.servicesTitle}>Safe & Reliable<br />Delivery Solutions</h2>
          </div>
          <div className={styles.servicesGrid}>
            <ServiceCard
              icon={<ShipIcon />}
              title="Ship & Delivery"
              desc="Fast, secure dispatch for parcels, documents, and urgent cargo across cities and borders."
            />
            <ServiceCard
              icon={<WarehouseIcon />}
              title="Warehousing & Storage"
              desc="Safe short-term and long-term storage solutions for goods that need to stay protected."
            />
            <ServiceCard
              icon={<AirplaneIcon />}
              title="Air Freight"
              desc="Priority air cargo handling for time-sensitive shipments that must arrive quickly."
            />
            <ServiceCard
              icon={<TruckIcon />}
              title="Local Distribution"
              desc="Reliable same-day and scheduled deliveries for homes, businesses, and retail outlets."
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.whyChooseSection}>
        <div className={styles.whySubtitle}>WHY CHOOSE US</div>
        <h2 className={styles.whyTitle}>THE <span>BEST</span> MOVERS AROUND</h2>

        <div className={styles.whyContent}>
          <div className={styles.whySideLeft + " " + styles.whySide}>
            <div className={styles.whyItem}>
              <div className={styles.whyIcon}>
                <ProfessionalIcon />
              </div>
              <div className={styles.whyText}>
                <h4>PROFFESSIONAL SERVICE</h4>
                <p>Our trained experts handle every parcel with utmost care and ensure safe transit.</p>
              </div>
            </div>
            <div className={styles.whyItem}>
              <div className={styles.whyIcon}>
                <TimeIcon />
              </div>
              <div className={styles.whyText}>
                <h4>ALWAYS ON TIME</h4>
                <p>We pride ourselves on our punctuality and commitment to meeting delivery deadlines.</p>
              </div>
            </div>
          </div>

          <div className={styles.whyCenter}>
            <img src="/man4.jpg" alt="Best Movers" className={styles.whyImage} />
          </div>

          <div className={styles.whySideRight + " " + styles.whySide}>
            <div className={styles.whyItem}>
              <div className={styles.whyIcon + " " + styles.active}>
                <EmergencyIcon />
              </div>
              <div className={styles.whyText}>
                <h4>24 HOURS EMERGENCY SERVICE</h4>
                <p>Round-the-clock support and dispatch teams ready for your urgent shipments.</p>
              </div>
            </div>
            <div className={styles.whyItem}>
              <div className={styles.whyIcon}>
                <FeesIcon />
              </div>
              <div className={styles.whyText}>
                <h4>FLAT RATE FEES</h4>
                <p>Transparent and affordable pricing with no hidden charges for all requirements.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Service / Special Care */}
      <section className={styles.premiumSection}>
        <div className={styles.premiumContent}>
          <div className={styles.premiumBadge}>Premium Service</div>
          <h2 className={styles.premiumTitle}>Special Care Packages,<br />Delivered with Precision</h2>
          <p className={styles.premiumText}>At ExpressShipDelivery, we understand the importance of handling special care packages with extra attention and precision. Whether it&apos;s fragile, high-value, or time-sensitive, our team ensures secure, on-time delivery with top-notch tracking and support.</p>

          <div className={styles.premiumGrid}>
            <div className={styles.pItem}>
              <span className={styles.pIcon}>📦</span>
              <span>Fragile Item Protection</span>
            </div>
            <div className={styles.pItem}>
              <span className={styles.pIcon}>🌡️</span>
              <span>Temperature-Controlled Transport</span>
            </div>
            <div className={styles.pItem}>
              <span className={styles.pIcon}>⭐</span>
              <span>Full Insurance Coverage</span>
            </div>
            <div className={styles.pItem}>
              <span className={styles.pIcon}>⏱️</span>
              <span>Priority Handling</span>
            </div>
          </div>

          <button className={styles.premiumBtn}>Learn More &rarr;</button>

          <div className={styles.premiumChecks}>
            <span><span className={styles.pCheck}>✔</span> Insured Shipping</span>
            <span><span className={styles.pCheck}>✔</span> Real-time Tracking</span>
            <span><span className={styles.pCheck}>✔</span> 24/7 Support</span>
          </div>
        </div>
        <div className={styles.premiumImageWrapper}>
          <img src="/man5.jpg" alt="Premium Care" className={styles.premiumImg} />
          <div className={styles.premiumFloatingTop}>
            <span>⭐ Premium Care</span>
          </div>
          <div className={styles.premiumFloatingBottom}>
            <span className={styles.pIcon}>🛡️</span>
            <div>
              <h4>99.9%</h4>
              <p>Safe Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testiGrid}>
          <div className={`${styles.testiCard} ${styles.testiCardDark}`}>
            <div className={styles.testiHeader}>
              <div className={styles.testiUser}>
                <img src="/profile3.jpg" alt="User" className={styles.testiPic} />
                <div>
                  <p className={styles.testiName}>Amina Yusuf</p>
                  <p className={styles.testiRole}>Retail Business Owner</p>
                </div>
              </div>
              <div className={styles.quoteIcon}>"</div>
            </div>
            <p className={styles.testiText}>The process was smooth from pickup to delivery, and our customers noticed the difference. It has made our operations feel much more reliable.</p>
            <div className={styles.stars}>★★★★★</div>
          </div>

          <div className={`${styles.testiCard} ${styles.testiCardLight}`}>
            <div className={styles.testiHeader}>
              <div className={styles.testiUser}>
                <img src="/profile1.jpg" alt="User" className={styles.testiPic} />
                <div>
                  <p className={styles.testiName}>Kathleen Smith</p>
                  <p className={styles.testiRole}>Fuel Company</p>
                </div>
              </div>
              <div className={styles.quoteIcon}>"</div>
            </div>
            <p className={styles.testiText}>We needed a dependable logistics partner for recurring deliveries, and they delivered every time. Their tracking made planning much easier.</p>
            <div className={styles.stars}>★★★★★</div>
          </div>

          <div className={`${styles.testiCard} ${styles.testiCardDark}`}>
            <div className={styles.testiHeader}>
              <div className={styles.testiUser}>
                <img src="/profile2.jpg" alt="User" className={styles.testiPic} />
                <div>
                  <p className={styles.testiName}>John Martin</p>
                  <p className={styles.testiRole}>Restoration Company</p>
                </div>
              </div>
              <div className={styles.quoteIcon}>"</div>
            </div>
            <p className={styles.testiText}>Their innovative approach to logistics management has helped us reduce delivery times by 40%. Highly recommended for any business looking to streamline operations.</p>
            <div className={styles.stars}>★★★★★</div>
          </div>
        </div>

        <button className={styles.testiBtn}>Get started</button>
      </section>

      {/* Commitment Section */}
      <section className={styles.commitSection}>
        <div className={styles.commitHeader}>
          <h2 className={styles.commitTitle}>Our Commitment to Seamless Logistics</h2>
          <p className={styles.commitSubtitle}>Delivering efficiency, security, and reliability—tailored to your needs.</p>
        </div>

        <div className={styles.commitGrid}>
          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><Truck size={32} /></div>
            <h3>Express Last-Mile Delivery</h3>
            <p>Distance is never a challenge. We pick up directly from your location and ensure safe, timely delivery anywhere you need. From urgent documents to large shipments, our dedicated fleet is ready for same-day deliveries.</p>
          </div>

          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><Coins size={32} /></div>
            <h3>ExpressShipDelivery Partner Program</h3>
            <p>Join our network and turn your vehicle into a steady source of income. Whether you have a bike, van, or truck, ExpressShipDelivery connects you with delivery requests while ensuring fair earnings.</p>
          </div>

          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><FastForward size={32} /></div>
            <h3>Priority Freight Services</h3>
            <p>Need your shipment to arrive on time, every time? Our priority shipping ensures your package is handled with urgency and care, making timely delivery a guarantee, not a possibility.</p>
          </div>

          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><Package size={32} /></div>
            <h3>Secure Storage Solutions</h3>
            <p>Whether you need short-term warehousing or long-term storage, ExpressShipDelivery offers secure, climate-controlled facilities to keep your goods safe until they're ready for transport.</p>
          </div>

          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><PackageOpen size={32} /></div>
            <h3>E-Commerce Fulfillment</h3>
            <p>Sell online? We handle inventory storage, order processing, and nationwide delivery—so you can focus on growing your business while we take care of logistics.</p>
          </div>

          <div className={styles.commitCard}>
            <div className={styles.commitIcon}><Box size={32} /></div>
            <h3>Specialized Cargo Handling</h3>
            <p>From medical equipment to high-tech devices, we specialize in handling delicate and valuable shipments with precision and care, ensuring they arrive in perfect condition.</p>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <div className={styles.faqHeader}>
          <h2 className={styles.faqTitle}>Frequently Asked<br />Questions</h2>
        </div>
        <div className={styles.faqContent}>
          <div className={styles.faqLeft}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How can I track my shipment?</p>
              <p className={styles.faqAnswer}>You can easily track your shipment by entering your tracking number in the track page or the hero section above.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>What are your delivery hours?</p>
              <p className={styles.faqAnswer}>We operate 24/7. Our emergency service ensures your packages are delivered at any time of the day.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Are there any hidden fees?</p>
              <p className={styles.faqAnswer}>No, we pride ourselves on flat rate fees. What you see is what you pay.</p>
            </div>
          </div>
          <div className={styles.faqRight}>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Do you offer international shipping?</p>
              <p className={styles.faqAnswer}>Yes, we deliver worldwide with reliable customs clearance processes to ensure smooth transit.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>How do I file a claim for a lost package?</p>
              <p className={styles.faqAnswer}>You can file a claim through our contact page by providing your tracking number and shipment details.</p>
            </div>
            <div className={styles.faqItem}>
              <p className={styles.faqQuestion}>Can I change my delivery address?</p>
              <p className={styles.faqAnswer}>Address changes can be requested before the package is out for delivery through customer support.</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// Icons for Services
function ServiceCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className={styles.serviceCard}>
      <div className={styles.serviceIcon}>{icon}</div>
      <div className={styles.serviceInfo}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function ShipIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12l2-4h16l2 4M2 12v6h20v-6M6 8V4h12v4M9 4v4M15 4v4" />
      <path className="highlight" d="M12 4v4" />
      <path className="highlight" d="M4 14l16 2" />
    </svg>
  );
}

function WarehouseIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22V6l6-4 6 4v16M4 22h12M16 22v-8l6-3v11H16" />
      <path className="highlight" d="M8 12v4h4v-4H8z" />
      <rect className="highlight" x="18" y="14" width="2" height="4" />
    </svg>
  );
}

function AirplaneIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L14 19v-5.5l8 2.5z" />
      <path className="highlight" d="M3 20h10" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 16H2V6h14v10M16 8h4l3 4v4h-2M6 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm11 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      <path className="highlight" d="M16 12h5" />
    </svg>
  );
}

function ProfessionalIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z" />
      <path d="M16 8h4v8h-4z" />
    </svg>
  );
}

function TimeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M19 8l-4 4h3c0 3.3-2.7 6-6 6-1 0-2-.3-2.8-.8l-1.5 1.5c1.2.9 2.7 1.3 4.3 1.3 4.4 0 8-3.6 8-8h3l-4-4zM6 12c0-3.3 2.7-6 6-6 1 0 2 .3 2.8.8l1.5-1.5C15.1 4.4 13.6 4 12 4 7.6 4 4 7.6 4 12H1l4 4 4-4H6z" />
    </svg>
  );
}

function EmergencyIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" />
      <path d="M18 4h3v4h-3zM3 4h3v4H3z" />
    </svg>
  );
}

function FeesIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z" />
    </svg>
  );
}
