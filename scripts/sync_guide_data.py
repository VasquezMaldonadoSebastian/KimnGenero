#!/usr/bin/env python3
"""Refresh the generated catalog summary in the canonical guide."""
import html, json, re
from collections import Counter
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
GUIDE = ROOT / "guides" / "Guia_KimnGenero.html"
items = json.loads((ROOT / "data" / "indicadores.json").read_text(encoding="utf-8-sig"))["indicadores"]
states, dimensions = Counter(x["estado"] for x in items), Counter(x["dimension"] for x in items)
rows = "".join(f"<tr><td>{html.escape(name)}</td><td>{count}</td></tr>" for name, count in sorted(dimensions.items()))
block = f'''<!-- GUIDE_DATA_START -->
    <div class="callout ok"><strong>{len(items)} indicadores:</strong> {states['Oficializado']} oficializados y {states['Faltante']} faltantes. Este bloque se genera desde <code>data/indicadores.json</code>; no mantener cantidades manualmente.</div>
    <table><tr><th>Dimensión</th><th>Indicadores</th></tr>{rows}</table>
    <!-- GUIDE_DATA_END -->'''
text = GUIDE.read_text(encoding="utf-8")
updated, count = re.subn(r"<!-- GUIDE_DATA_START -->.*?<!-- GUIDE_DATA_END -->", block, text, flags=re.S)
if count != 1: raise SystemExit("Generated guide data markers are missing or duplicated")
GUIDE.write_text(updated, encoding="utf-8")
print(f"Synchronized {len(items)} indicators into {GUIDE}")
