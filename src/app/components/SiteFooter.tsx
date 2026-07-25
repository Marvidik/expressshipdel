import Link from "next/link";
import styles from "./footer.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerLogo}>
          <img src="/shiplogo.png" alt="ExpressShipDel" style={{ height: '40px', objectFit: 'contain' }} />
        </div>
      </div>
      <div className={styles.footerGrid}>
        <div className={styles.footerCol}>
          <h4>Company</h4>
          <Link href="/">Product</Link>
          <Link href="/">Why us?</Link>
          <Link href="/about">About us</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Services</h4>
          <Link href="#">Skateboard delivery</Link>
          <Link href="#">Bicycle delivery</Link>
          <Link href="#">Motor bike delivery</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Legal</h4>
          <Link href="#">Terms of use</Link>
          <Link href="#">Privacy policy</Link>
        </div>
        <div className={styles.footerCol}>
          <h4>Support</h4>
          <Link href="/contact">Contact us</Link>
          <Link href="#">FAQ</Link>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerContact}>
            <span>+234 819 815 7158</span> | <span>hello@expressshipdel.com</span>
          </div>
          <p><strong>Nigeria</strong></p>
          <p>Office 9796<br />182 Nwaiba road<br />Uyo<br />Akwa Ibom State<br />E6 2JA</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>English (United Kingdom) ⌄ &nbsp;&nbsp;&nbsp; © ExpressShipDel, LLC.</p>
        <div className={styles.footerSocials}>
          <a href="#">in</a>
          <a href="#">f</a>
          <a href="#">x</a>
          <a href="#">ig</a>
        </div>
      </div>
    </footer>
  );
}
