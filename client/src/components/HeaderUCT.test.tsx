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
    expect(screen.getAllByText('KIMNIA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SOBRE EL MODELO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CALENDARIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('GLOSARIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTACTO').length).toBeGreaterThan(0);
  });

  it('renderiza los links del encabezado principal', () => {
    render(<HeaderUCT />);
    
    expect(screen.getAllByText('INDICADORES').length).toBeGreaterThan(0);
    expect(screen.getAllByText('KIMNIA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTACTO').length).toBeGreaterThan(0);
  });

  it('renderiza la barra institucional de referencia con sus enlaces oficiales', () => {
    render(<HeaderUCT />);

    expect(screen.getAllByText('CONECTA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('UCT AL DÍA').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TEC-UCT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('DIRECTORIO').length).toBeGreaterThan(0);
    expect(screen.getAllByText('WEBMAIL').length).toBeGreaterThan(0);
    expect(screen.getAllByText('TVUCT').length).toBeGreaterThan(0);
    expect(screen.getAllByText('UCT RADIO').length).toBeGreaterThan(0);

    expect(screen.getAllByRole('link', { name: 'CONECTA' })[0]).toHaveAttribute('href', 'https://conecta.uct.cl/');
    expect(screen.getAllByRole('link', { name: 'DIRECTORIO' })[0]).toHaveAttribute('href', 'https://directorio.uct.cl/');
  });

  it('los links del encabezado principal apuntan a las rutas internas correctas', () => {
    render(<HeaderUCT />);
    
    const interno = screen.getAllByRole('link').find(a => a.getAttribute('href') === '/indicadores');
    expect(interno).toBeTruthy();
    
    const contacto = screen.getAllByRole('link').find(a => a.getAttribute('href') === '/contacto');
    expect(contacto).toBeTruthy();
  });

  it('renderiza los iconos de redes sociales UCT con URLs correctas', () => {
    render(<HeaderUCT />);
    
    const rrssLinks = screen.getAllByRole('link').filter(el =>
      el.getAttribute('href')?.includes('facebook.com') ||
      el.getAttribute('href')?.includes('instagram.com') ||
      el.getAttribute('href')?.includes('youtube.com')
    );
    expect(rrssLinks.length).toBeGreaterThanOrEqual(3);
    
    const fb = rrssLinks.find(el => el.getAttribute('href')?.includes('facebook.com'));
    expect(fb).toBeTruthy();
    
    const yt = rrssLinks.find(el => el.getAttribute('href')?.includes('youtube.com'));
    expect(yt).toBeTruthy();
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
