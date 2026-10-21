"""Erzeugt die öffentliche GitHub-Pages-Seite aus verschlüsselten Beiträgen.

WICHTIG: Im öffentlichen Repository liegt ausschließlich die verschlüsselte
Fassung der 24 Karten. ADVENT_KEY wird nur als GitHub-Actions-Secret verwendet.
Die Dechiffrierung findet beim Erstellen der Website statt, nicht im Browser.
"""

import json
import os
import shutil
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from cryptography.fernet import Fernet, InvalidToken

ROOT = Path(__file__).resolve().parent
SITE = ROOT / "site"
YEAR = 2026


def read_private_cards():
    """Entschlüsselt die Inhalte. Fehlt der Schlüssel, bricht der Build ab."""
    secret = os.environ.get("ADVENT_KEY", "").strip()
    if not secret:
        raise SystemExit("ADVENT_KEY fehlt. Trage zuerst den GitHub-Secret ein.")
    try:
        raw = Fernet(secret.encode("ascii")).decrypt((ROOT / "cards.enc").read_bytes())
        cards = json.loads(raw.decode("utf-8"))
    except (ValueError, InvalidToken, UnicodeError, json.JSONDecodeError) as exc:
        raise SystemExit("Der Secret-Schlüssel passt nicht zum verschlüsselten Inhalt.") from exc
    if len(cards) != 24 or sorted(card["day"] for card in cards) != list(range(1, 25)):
        raise SystemExit("Ungültiger Kartensatz: Es müssen die Tage 1 bis 24 enthalten sein.")
    return cards


def release_cards(cards, now):
    """Veröffentlicht nur Inhalte, deren Datum in Berlin erreicht ist."""
    berlin_today = now.astimezone(ZoneInfo("Europe/Berlin")).date()
    return [card for card in cards if date(YEAR, 12, card["day"]) <= berlin_today]


def main():
    now = datetime.now(ZoneInfo("UTC"))
    all_cards = read_private_cards()
    released = release_cards(all_cards, now)
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    for filename in ("index.html", "styles.css", "app.js"):
        shutil.copy2(ROOT / filename, SITE / filename)
    (SITE / ".nojekyll").touch()
    config = {"year": YEAR, "preview": False, "builtAt": now.isoformat()}
    payload = (
        "// Enthält nur freigeschaltete Karten. Die übrigen Inhalte bleiben verschlüsselt.\n"
        + "window.ADVENT_CARDS = " + json.dumps(released, ensure_ascii=False) + ";\n"
        + "window.ADVENT_CONFIG = " + json.dumps(config, ensure_ascii=False) + ";\n"
    )
    (SITE / "data.js").write_text(payload, encoding="utf-8")
    print(f"Erzeugt am {now:%Y-%m-%d %H:%M} UTC: {len(released)} von 24 Türchen öffentlich.")


if __name__ == "__main__":
    main()
