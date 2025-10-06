"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  link: string;
};

export default function AppNavbar() {
  const navItems: NavItem[] = [
    { name: "Trading", link: "/trading" },
    { name: "Markets", link: "#markets" },
    { name: "Security", link: "#security" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full pt-6 md:pt-8">
      <Navbar>
        <NavBody>
          <Link href="/" aria-label="TradePrime home">
            <NavbarLogo />
          </Link>
          <NavItems items={navItems} />
          <div className="flex items-center gap-3">
            <Link href="/signin" aria-label="Sign in">
              <Button className="bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-600">
                Sign in
              </Button>
            </Link>
            <Link href="/signup" aria-label="Create account">
              <Button className="bg-black text-white hover:bg-neutral-900 focus-visible:ring-neutral-600">
                Create account
              </Button>
            </Link>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" aria-label="TradePrime home">
              <NavbarLogo />
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
                aria-label={item.name}
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}

            <div className="flex w-full flex-col gap-4">
              <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100 focus-visible:ring-neutral-600">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-black text-white hover:bg-neutral-900 focus-visible:ring-neutral-600">
                  Create account
                </Button>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}


