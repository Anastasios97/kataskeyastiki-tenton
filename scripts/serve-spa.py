#!/usr/bin/env python3

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


class SpaRequestHandler(SimpleHTTPRequestHandler):
    def do_GET(self) -> None:
        requested_path = Path(self.translate_path(self.path.split("?", 1)[0]))
        if not requested_path.exists() and not requested_path.suffix:
            self.path = "/index.html"
        super().do_GET()


if __name__ == "__main__":
    project_root = Path(__file__).resolve().parent.parent
    port = int(os.environ.get("PORT", "3002"))
    os.chdir(project_root / "dist")
    server = ThreadingHTTPServer(("127.0.0.1", port), SpaRequestHandler)
    print(f"Serving the site at http://127.0.0.1:{port}/")
    server.serve_forever()
