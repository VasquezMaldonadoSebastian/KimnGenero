import React from 'react';
import { ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HeaderUCT() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const topLinks = [
    { label: "Inicio", href: "/" },
    { label: "Indicadores", href: "/indicadores" },
    { label: "Vista General", href: "/estado-agrupado" },
    { label: "KimnIA", href: "/kimnia" },
    { label: "Modelo", href: "/metodologia" },
    { label: "Calendario", href: "/calendario" },
    { label: "Glosario", href: "/glosario" },
    { label: "Contacto", href: "/contacto" },
  ];

  const socialLinks = [
    { label: "Facebook", href: "https://www.facebook.com/canaluctemuco", viewBox: "0 0 24 24", d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { label: "Instagram", href: "https://www.instagram.com/uctemuco/", viewBox: "0 0 24 24", d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
    { label: "YouTube", href: "https://www.youtube.com/user/canaluctemuco", viewBox: "0 0 24 24", d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
    { label: "LinkedIn", href: "https://www.linkedin.com/school/uctemuco", viewBox: "0 0 24 24", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { label: "Twitter", href: "https://twitter.com/UC_Temuco", viewBox: "0 0 24 24", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  ];

  const externalLinks = [
    { label: "CENTRO DE AYUDA", href: "https://www.uct.cl/centro-de-ayuda" },
    { label: "PORTAL DE PAGOS", href: "https://pagosweb.uct.cl" },
  ];

  const mainNavLinks = [
    { label: "INICIO", href: "/" },
    { label: "INDICADORES", href: "/indicadores" },
    { label: "VISTA GENERAL", href: "/estado-agrupado" },
    { label: "KimnIA", href: "/kimnia" },
    { label: "SOBRE EL MODELO", href: "/metodologia" },
    { label: "CALENDARIO", href: "/calendario" },
    { label: "GLOSARIO", href: "/glosario" },
    { label: "CONTACTO", href: "/contacto" },
  ];

  const isActiveLink = (href: string) => location === href || (href !== "/" && location.startsWith(`${href}/`));

  return (
    <>
      {/* Top bar UCT style — gradiente azul #048fd4→#0086ca, 35px, Roboto 13px */}
      <div
        className="text-white"
        style={{ background: "linear-gradient(128.19deg, #048fd4 15.7%, #0086ca 74.26%)" }}
      >
        <div className="mx-auto flex h-[35px] max-w-7xl items-center justify-end px-4 lg:px-12">
          <ul
            className="flex h-full items-center gap-0 list-none overflow-x-auto m-0 p-0 scrollbar-none"
            style={{ fontFamily: "Roboto, sans-serif", fontSize: 13, fontWeight: 400 }}
          >
            {topLinks.map((link, idx) => (
              <li
                key={link.label}
                className="flex items-center shrink-0 px-2.5 lg:px-5"
                style={{
                  height: 15,
                  borderRight: idx < topLinks.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                }}
              >
                <a
                  href={link.href}
                  className="text-xs uppercase tracking-normal text-white no-underline whitespace-nowrap hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-4 flex items-center gap-2.5 shrink-0">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/35"
              >
                <svg viewBox={s.viewBox} className="h-3 w-3 fill-current" aria-hidden="true">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-6">
          <div className="flex min-w-0 items-center justify-between gap-1.5 sm:gap-3 lg:gap-6">
            <Link href="/">
              <div className="flex min-w-0 flex-1 items-center transition-opacity hover:opacity-90">
                <img
                  src="/assets/logo_KIMN_gris-scaled.webp"
                  alt="Logo KIMN"
                  className="h-8 w-auto max-w-[64vw] object-contain sm:h-10 sm:max-w-[72vw] md:h-12 md:max-w-none lg:h-14"
                />
              </div>
            </Link>

            <nav className="hidden items-center gap-5 xl:flex">
              {mainNavLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                    className={`border-b-2 pb-1 text-xs font-bold transition-colors ${
                      isActiveLink(link.href)
                        ? "border-[var(--color-header-blue)] text-[var(--color-header-blue)]"
                        : "border-transparent text-gray-700 hover:border-[var(--color-header-blue)] hover:text-[var(--color-header-blue)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:hidden">
              <button
                className="inline-flex items-center justify-center rounded-full bg-white p-2.5 text-[var(--color-header-blue)] ring-1 ring-inset ring-gray-200 transition-colors hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <DialogContent
          showCloseButton={false}
          id="mobile-navigation"
          className="!fixed !inset-0 !h-dvh !max-w-none !translate-x-0 !translate-y-0 !rounded-none !border-0 !p-0 shadow-none"
        >
          <div className="flex h-full flex-col bg-white">
            <div
              className="text-white"
              style={{ background: "linear-gradient(128.19deg, #048fd4 15.7%, #0086ca 74.26%)" }}
            >
              <ul
                className="flex h-[35px] items-center gap-0 list-none overflow-x-auto m-0 px-4 scrollbar-none"
                style={{ fontFamily: "Roboto, sans-serif", fontSize: 13, fontWeight: 400 }}
              >
                {topLinks.map((link, idx) => (
                  <li
                    key={link.label}
                    className="flex items-center shrink-0 px-2.5"
                    style={{
                      height: 15,
                      borderRight: idx < topLinks.length - 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                    }}
                  >
                    <a
                      href={link.href}
                      className="text-xs uppercase tracking-normal text-white no-underline whitespace-nowrap hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <DialogHeader className="border-b border-gray-100 px-4 py-4 text-left sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <Link href="/">
                  <div className="flex items-center transition-opacity hover:opacity-90">
                    <img src="/assets/logo_KIMN_gris-scaled.webp" alt="Logo KIMN" className="h-10 w-auto object-contain" />
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200"
                    aria-label="Cerrar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              <DialogTitle className="sr-only">Navegacion principal</DialogTitle>
              <nav className="grid gap-2" aria-label="Navegacion principal movil">
                {mainNavLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a
                      aria-current={isActiveLink(link.href) ? "page" : undefined}
                      className={`flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                        isActiveLink(link.href)
                          ? "border-[var(--color-header-blue)]/30 bg-[var(--color-header-blue)]/5 text-[var(--color-header-blue)]"
                          : "border-gray-200 bg-gray-50 text-gray-800 hover:border-[var(--color-header-blue)]/20 hover:bg-white hover:text-[var(--color-header-blue)]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </a>
                  </Link>
                ))}
              </nav>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Accesos institucionales
                </p>
                <div className="mt-3 grid gap-2">
                  {externalLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="flex min-h-11 items-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-[var(--color-header-blue)]/20 hover:bg-gray-50 hover:text-[var(--color-header-blue)]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
