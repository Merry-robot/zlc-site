"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useRef } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setSubmenuOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeout.current = setTimeout(() => setSubmenuOpen(false), 200);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-stone-900 px-6 py-4 shadow-md">
          <div className="text-white text-2xl font-bold">ZLC ARTCC</div>
          <div className="relative inline-block text-left">
             <a
              href="/"
              className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors"
            >

              Home
            </a>
            <a
              href="/events"
              className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors"
            >
              Events
            </a>
            <a
              href="/roster"
              className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors"
            >
              Roster
            </a>
            <a
              href="/resources"
              className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors"
            >
              Resources
            </a>
            <a
              href="/staff"
              className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors"
            >
              Facility Staff
            </a>
            <div
              className="group inline-block relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onFocus={handleMouseEnter}
              onBlur={handleMouseLeave}
              tabIndex={0}
            >
              <button className="text-white hover:bg-stone-700 px-4 py-2 rounded transition-colors focus:outline-none">
                Staff Menu
                <svg
                  className="w-4 h-4 inline ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`absolute right-0 mt-2 w-40 rounded shadow-lg z-10 bg-white text-gray-800 transition-all duration-200 ease-in-out
                  ${
                    submenuOpen
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
              >
                <li>
                  <a
                    href="/staff-menu/certs"
                    className="block px-4 py-2 hover:bg-stone-200"
                  >
                    Certifications
                  </a>
                </li>
                <li>
                  <a
                    href="/stff-menu/activity"
                    className="block px-4 py-2 hover:bg-stone-200"
                  >
                    Activity
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <footer className="mt-16 py-8 text-center text-stone-500 text-xs border-t border-stone-800 bg-stone-950">
          <div className="mb-2">Dates and times will always be presented in your local time unless otherwise indicated.</div>
          <div className="mb-2">This site is not affiliated with the Federal Aviation Administration or any governing aviation body. All content contained herein is approved only for use on the VATSIM network.</div>
          <div>Copyright © 2025 by Salt Lake City ARTCC. Privacy Policy.</div>
        </footer>
      </body>

    </html>
  );
}
