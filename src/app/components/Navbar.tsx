"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <img src="/noship.png" alt="ExpressShipDel" style={{ height: '35px', objectFit: 'contain' }} />
      </Link>
      
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={`${styles.bar} ${isOpen ? styles.bar1 : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.bar2 : ""}`}></div>
        <div className={`${styles.bar} ${isOpen ? styles.bar3 : ""}`}></div>
      </div>

      <div className={`${styles.navLinks} ${isOpen ? styles.active : ""}`}>
        <Link href="/" className={pathname === "/" ? styles.navActive : ""}>Home</Link>
        <Link href="/about" className={pathname === "/about" ? styles.navActive : ""}>About Us</Link>
        <Link href="/track" className={pathname === "/track" ? styles.navActive : ""}>Track</Link>
        <Link href="/contact" className={pathname === "/contact" ? styles.navActive : ""}>Contact</Link>
      </div>
    </nav>
  );
}
