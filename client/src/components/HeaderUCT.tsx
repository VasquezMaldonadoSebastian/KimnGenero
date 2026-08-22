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
      <div className="bg-[var(--color-header-blue)] text-white">
        <div className="mx-auto hidden h-10 max-w-7xl items-center justify-between gap-4 px-4 lg:flex">
          <div className="flex min-w-0 items-center overflow-hidden text-xs font-semibold tracking-wider">
            {topLinks.map((link, idx) => (
              <div key={link.label} className="flex items-center whitespace-nowrap">
                <a href={link.href} className="px-3 transition-colors hover:text-gray-200">
                  {link.label}
                </a>
                {idx < topLinks.length - 1 && <span className="text-white/40">|</span>}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Redes sociales removidas temporalmente hasta obtener URLs reales */}
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
            <div className="bg-[var(--color-header-blue)] text-white">
              <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 text-xs font-semibold tracking-wider scrollbar-none">
                {topLinks.map((link, idx) => (
                  <div key={link.label} className="flex items-center">
                    <a href={link.href} className="shrink-0 px-2 transition-colors hover:text-gray-200">
                      {link.label}
                    </a>
                    {idx < topLinks.length - 1 && <span className="text-white/40">|</span>}
                  </div>
                ))}
              </div>
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
                  {topLinks.map((link) => (
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
