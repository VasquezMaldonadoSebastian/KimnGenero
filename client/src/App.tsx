/*
 * App — Observatorio de Indicadores de Género
 * Design: Global layout with sticky Header + main content + Footer
 * Routes: /, /indicadores, /metodologia, /glosario, /contacto
 */

import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { IndicatorsProvider } from "./contexts/IndicatorsContext";
import HeaderUCT from "./components/HeaderUCT";
import FooterUCT from "./components/FooterUCT";

const Home = lazy(() => import("./pages/Home"));
const Indicadores = lazy(() => import("./features/indicadores/pages/Indicadores"));
const IndicadorPage = lazy(() => import("./features/indicadores/pages/IndicadorPage"));
const Metodologia = lazy(() => import("./pages/Metodologia"));
const Glosario = lazy(() => import("./pages/Glosario"));
const Contacto = lazy(() => import("./pages/Contacto"));
const Calendario = lazy(() => import("./pages/Calendario"));
const EstadoAgrupado = lazy(() => import("./pages/EstadoAgrupado"));
const KimnIA = lazy(() => import("./pages/NotebooksLMS"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/indicadores" component={Indicadores} />
      <Route path="/indicador/:id" component={IndicadorPage} />
      <Route path="/metodologia" component={Metodologia} />
      <Route path="/glosario" component={Glosario} />
      <Route path="/contacto" component={Contacto} />
      <Route path="/calendario" component={Calendario} />
      <Route path="/estado-agrupado" component={EstadoAgrupado} />
      <Route path="/kimnia" component={KimnIA} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <IndicatorsProvider>
          <TooltipProvider>
            <Toaster position="bottom-center" />
            <div className="flex flex-col min-h-screen">
              <HeaderUCT />
              <main className="flex-1">
                <Suspense
                  fallback={
                    <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
                      Cargando...
                    </div>
                  }
                >
                  <Router />
                </Suspense>
              </main>
              <FooterUCT />
            </div>
          </TooltipProvider>
        </IndicatorsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
