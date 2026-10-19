#!/usr/bin/env python3
"""Τοπική προβολή του dist/ όπως στο Vercel: /σελίδα -> σελίδα.html, αλλιώς 404.html."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class SiteRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        url_path = self.path.split("?", 1)[0].split("#", 1)[0]
        requested = Path(self.translate_path(url_path))
        if requested.is_dir() and (requested / "index.html").exists():
            pass
        elif not requested.exists() and not requested.suffix:
            html = requested.with_suffix(".html")
            if html.exists():
                self.path = url_path.rstrip("/") + ".html"
            else:
                self.send_response(404)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(Path("404.html").read_bytes())
                return
        super().do_GET()


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    port = int(os.environ.get("PORT", "3002"))
    os.chdir(project_root / "dist")
    server = ThreadingHTTPServer(("127.0.0.1", port), SiteRequestHandler)
    print(f"Serving the site at http://127.0.0.1:{port}/")
    server.serve_forever()
