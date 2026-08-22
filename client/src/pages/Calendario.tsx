/*
 * Calendario — KimnGenero
 * Design: Hero con gradiente azul/morado + iframe de Google Calendar
 */

import PageHeader from "@/components/PageHeader";
import React from "react";

export default function Calendario() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        breadcrumb={[{ label: "Calendario" }]}
        title="Calendario de actualizaciones"
        subtitle="El calendario de actualización de indicadores de género es una herramienta estratégica de comunicación que permite a la Universidad Católica de Temuco informar oportunamente a personas e instituciones interesadas sobre las fechas y procesos de actualización de estos indicadores. Facilita la planificación, el seguimiento y la toma de decisiones con enfoque de género, promoviendo la transparencia, la coordinación interinstitucional y el acceso equitativo a información clave a nivel nacional."
      />

      {/* ─── CALENDAR CONTENT ─── */}
      <section className="flex w-full flex-col items-center px-4 py-8 sm:py-12">
        <div className="mb-6 w-full max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <iframe 
              src="https://calendar.google.com/calendar/embed?src=c_7aa6cfd290f787a674e8f2bed624e22ee309900e32135a3c9c3678eafa5e9a63%40group.calendar.google.com&ctz=America%2FSantiago" 
              style={{ border: "0" }} 
              width="100%" 
              height="720" 
              frameBorder="0" 
              scrolling="yes"
              title="Calendario de actualizaciones"
              className="h-[72vh] min-h-[620px] w-full"
            ></iframe>
        </div>

        {/* Add Calendar Button */}
        <div className="flex w-full max-w-7xl justify-center">
          <a 
            href="https://calendar.google.com/calendar/u/0?cid=c_7aa6cfd290f787a674e8f2bed624e22ee309900e32135a3c9c3678eafa5e9a63%40group.calendar.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[#0176DE] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0165c0] sm:w-auto"
          >
            Añadir Calendario
          </a>
        </div>
      </section>
    </div>
  );
}
