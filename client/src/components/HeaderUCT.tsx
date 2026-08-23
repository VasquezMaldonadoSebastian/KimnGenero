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
    { label: "Facebook", href: "https://www.facebook.com/canaluctemuco", abbr: "FB" },
    { label: "Instagram", href: "https://www.instagram.com/uctemuco/", abbr: "IG" },
    { label: "YouTube", href: "https://www.youtube.com/user/canaluctemuco", abbr: "YT" },
    { label: "LinkedIn", href: "https://www.linkedin.com/school/uctemuco", abbr: "LN" },
    { label: "Twitter", href: "https://twitter.com/UC_Temuco", abbr: "TW" },
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
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white transition-colors hover:bg-white/35"
              >
                {s.abbr}
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
