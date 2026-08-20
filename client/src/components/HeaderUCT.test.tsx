import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HeaderUCT from './HeaderUCT';

// Mock wouter con valores por defecto
const mockSetLocation = vi.fn();
let mockLocation = '/';

vi.mock('wouter', () => ({
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => [mockLocation, mockSetLocation],
}));

describe('HeaderUCT', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation = '/';
  });

  it('renderiza el logo KIMN', () => {
    render(<HeaderUCT />);
    const logos = screen.getAllByAltText('Logo KIMN');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('renderiza los links de navegación principales', () => {
    render(<HeaderUCT />);
    
    expect(screen.getAllByText('INICIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('INDICADORES').length).toBeGreaterThan(0);
    expect(screen.getAllByText('VISTA GENERAL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('KimnIA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SOBRE EL MODELO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CALENDARIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GLOSARIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTACTO').length).toBeGreaterThan(0);
  });

  it('renderiza los links institucionales en la barra superior', () => {
    render(<HeaderUCT />);
    
    expect(screen.getAllByText('CENTRO DE AYUDA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('PORTAL DE PAGOS').length).toBeGreaterThan(0);
  });

  it('los links institucionales tienen URLs correctas', () => {
    render(<HeaderUCT />);
    
    const centroAyudaLinks = screen.getAllByText('CENTRO DE AYUDA').map(el => el.closest('a'));
    expect(centroAyudaLinks[0]).toHaveAttribute('href', 'https://www.uct.cl/centro-de-ayuda');
    
    const portalPagosLinks = screen.getAllByText('PORTAL DE PAGOS').map(el => el.closest('a'));
    expect(portalPagosLinks[0]).toHaveAttribute('href', 'https://pagosweb.uct.cl');
  });

  it('NO renderiza íconos de redes sociales', () => {
    render(<HeaderUCT />);
    
    expect(screen.queryByLabelText('Facebook')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Twitter')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Instagram')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('LinkedIn')).not.toBeInTheDocument();
  });

  it('NO renderiza botón de búsqueda', () => {
    render(<HeaderUCT />);
    
    expect(screen.queryByLabelText('Buscar')).not.toBeInTheDocument();
  });

  it('renderiza el botón de menú móvil', () => {
    render(<HeaderUCT />);
    
    const menuButtons = screen.getAllByLabelText('Abrir menu');
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it('abre el menú móvil al hacer clic en el botón', () => {
    render(<HeaderUCT />);
    
    const menuButton = screen.getAllByLabelText('Abrir menu')[0];
    fireEvent.click(menuButton);
    
    expect(screen.getAllByLabelText('Cerrar menu').length).toBeGreaterThan(0);
  });

  it('resalta el link activo basado en la ubicación', () => {
    mockLocation = '/indicadores';
    
    render(<HeaderUCT />);
    
    const indicadoresLinks = screen.getAllByText('INDICADORES');
    const activeLink = indicadoresLinks.find(el => el.closest('a')?.getAttribute('aria-current') === 'page');
    expect(activeLink).toBeTruthy();
  });
});
