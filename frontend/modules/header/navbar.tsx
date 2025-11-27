import React, { useState } from "react";

type NavLink = {
    label: string;
    href: string;
};

type NavbarProps = {
    logo?: string;
    links?: NavLink[];
};

const defaultLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
];

const Navbar: React.FC<NavbarProps> = ({ logo = "MyApp", links = defaultLinks }) => {
    const [open, setOpen] = useState(false);

    return (
        <header className="nav-root">
            <div className="nav-inner">
                <a className="nav-logo" href="/">
                    {logo}
                </a>

                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </button>

                <nav className={`nav-menu ${open ? "open" : ""}`} role="navigation" aria-label="Main">
                    <ul>
                        {links.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} onClick={() => setOpen(false)}>
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <style>{`
                .nav-root {
                    border-bottom: 1px solid #e6e6e6;
                    background: #fff;
                }
                .nav-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0.6rem 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .nav-logo {
                    font-weight: 600;
                    color: #111827;
                    text-decoration: none;
                    font-size: 1.05rem;
                }
                .nav-toggle {
                    display: none;
                    flex-direction: column;
                    gap: 4px;
                    background: transparent;
                    border: none;
                    padding: 6px;
                    cursor: pointer;
                }
                .nav-toggle:focus {
                    outline: 2px solid #2563eb33;
                    border-radius: 4px;
                }
                .bar {
                    width: 22px;
                    height: 2px;
                    background: #111827;
                    display: block;
                }
                .nav-menu ul {
                    list-style: none;
                    display: flex;
                    gap: 1rem;
                    margin: 0;
                    padding: 0;
                    align-items: center;
                }
                .nav-menu a {
                    text-decoration: none;
                    color: #374151;
                    padding: 8px 10px;
                    border-radius: 6px;
                }
                .nav-menu a:hover {
                    background: #f3f4f6;
                    color: #111827;
                }

                /* Responsive: collapse into hamburger on small screens */
                @media (max-width: 700px) {
                    .nav-toggle {
                        display: flex;
                    }
                    .nav-menu {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 56px;
                        background: #fff;
                        border-bottom: 1px solid #e6e6e6;
                        transform-origin: top;
                        transition: transform 180ms ease, opacity 180ms ease;
                        transform: translateY(-6px) scaleY(0.98);
                        opacity: 0;
                        pointer-events: none;
                        z-index: 40;
                    }
                    .nav-menu.open {
                        transform: translateY(0) scaleY(1);
                        opacity: 1;
                        pointer-events: auto;
                    }
                    .nav-menu ul {
                        flex-direction: column;
                        gap: 0;
                    }
                    .nav-menu li + li a {
                        border-top: 1px solid #f3f4f6;
                    }
                    .nav-inner {
                        position: relative;
                    }
                }
            `}</style>
        </header>
    );
};

export default Navbar;