#!/usr/bin/env python3
"""Validate that the canonical guide matches routes, data and local assets."""
import json, re
from collections import Counter
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "Guia_KimnGenero.html"
DATA = ROOT / "data" / "indicadores.json"
APP = ROOT / "client" / "src" / "App.tsx"
def fail(message): raise SystemExit(f"Guide validation failed: {message}")
def main():
    guide = GUIDE.read_text(encoding="utf-8")
    app = APP.read_text(encoding="utf-8")
    indicators = json.loads(DATA.read_text(encoding="utf-8-sig"))["indicadores"]
    if "KIMNGÉNERO" not in guide: fail("official name KIMNGÉNERO is missing")
    for phrase in ("Sistema del que forma parte el observatorio", "El Markdown es la única fuente"):
        if phrase in guide: fail(f"obsolete statement remains: {phrase}")
    routes = set(re.findall(r'<Route\s+path="([^"]+)"', app))
    for route in routes:
        if f"<code>{route}</code>" not in guide: fail(f"public route is undocumented: {route}")
    states = Counter(item["estado"] for item in indicators)
    expected = f"<strong>{len(indicators)} indicadores:</strong> {states['Oficializado']} oficializados y {states['Faltante']} faltantes."
    if expected not in guide: fail("indicator totals do not match data/indicadores.json")
    ids, codes = [x["id"] for x in indicators], [x["codigo"] for x in indicators]
    if len(ids) != len(set(ids)) or len(codes) != len(set(codes)): fail("indicator ids or codes are duplicated")
    for source in re.findall(r'<img[^>]+src="([^"]+)"', guide):
        if not (GUIDE.parent / source).is_file(): fail(f"missing guide asset: {source}")
    if re.search(r"Datos actualizados al\s+31 de diciembre de 2025", guide, re.I): fail("hard-coded global cut-off date remains")
    print(f"Guide valid: {len(routes)} routes, {len(indicators)} indicators, all local assets found")
if __name__ == "__main__": main()
