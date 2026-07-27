import Link from "next/link";

export default function NotFound() {
    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                background: "linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)",
                color: "var(--white)",
            }}
        >
            <div
                style={{
                    maxWidth: "580px",
                    width: "100%",
                    textAlign: "center",
                    padding: "3rem",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.06)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <p
                    style={{
                        marginBottom: "0.75rem",
                        color: "var(--primary)",
                        fontWeight: 700,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        fontSize: "0.85rem",
                    }}
                >
                    404 Error
                </p>
                <h1 style={{ fontSize: "3rem", marginBottom: "1rem", fontWeight: 700, lineHeight: 1.1 }}>
                    Page Not Found
                </h1>
                <p
                    style={{
                        fontSize: "1rem",
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.8)",
                        marginBottom: "2rem",
                    }}
                >
                    The page you’re looking for does not exist or may have been moved. Let’s get you back on track.
                </p>
                <Link
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0.95rem 1.8rem",
                        borderRadius: "999px",
                        background: "var(--primary)",
                        color: "var(--white)",
                        fontWeight: 700,
                        textDecoration: "none",
                        boxShadow: "0 10px 24px rgba(255, 90, 54, 0.25)",
                    }}
                >
                    Go Back Home
                </Link>
            </div>
        </main>
    );
}
