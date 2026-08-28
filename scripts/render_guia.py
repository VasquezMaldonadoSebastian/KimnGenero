#!/usr/bin/env python3
"""Render the canonical HTML guide to PDF with an available Chromium browser."""
from __future__ import annotations
import os, shutil, subprocess, sys, time
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
GUIDES = ROOT / "guides"
OUTPUT = ROOT / "output" / "pdf" / "Guia_KimnGenero.pdf"
PORT = 8766

def find_browser() -> str:
    configured = os.environ.get("CHROME_PATH")
    candidates = [configured] if configured else []
    candidates += [shutil.which(name) for name in ("chrome", "chromium", "chromium-browser", "msedge")]
    if sys.platform == "win32":
        local = Path(os.environ.get("LOCALAPPDATA", ""))
        bases = [Path(os.environ.get(key, "")) for key in ("PROGRAMFILES", "PROGRAMFILES(X86)")]
        candidates += [str(local / "Google/Chrome/Application/chrome.exe"), str(local / "Microsoft/Edge/Application/msedge.exe")]
        candidates += [str(base / rel) for base in bases for rel in ("Google/Chrome/Application/chrome.exe", "Microsoft/Edge/Application/msedge.exe")]
        candidates += [str(path) for path in sorted((local / "ms-playwright").glob("chromium-*/chrome-win*/chrome.exe"), reverse=True)]
    for candidate in candidates:
        if candidate and Path(candidate).is_file():
            return candidate
    raise SystemExit("No Chromium browser found. Install Chrome/Edge/Chromium or set CHROME_PATH.")

def main() -> None:
    subprocess.run([sys.executable, str(ROOT / "scripts" / "sync_guide_data.py")], check=True)
    subprocess.run([sys.executable, str(ROOT / "scripts" / "validate_guide.py")], check=True)
    browser = find_browser()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    server = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=GUIDES, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        time.sleep(1)
        subprocess.run([browser, "--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage", "--no-pdf-header-footer", f"--print-to-pdf={OUTPUT}", f"http://127.0.0.1:{PORT}/Guia_KimnGenero.html"], check=True, capture_output=True, text=True, timeout=180)
    finally:
        server.terminate(); server.wait(timeout=10)
    if not OUTPUT.exists() or OUTPUT.stat().st_size < 5_000:
        raise SystemExit("PDF generation failed or produced an unexpectedly small file.")
    print(f"Generated {OUTPUT} ({OUTPUT.stat().st_size} bytes) using {browser}")
if __name__ == "__main__": main()
