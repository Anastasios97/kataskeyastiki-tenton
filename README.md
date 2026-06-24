# Κατασκευαστική Τεντών

Πρώτη ολοκληρωμένη έκδοση της ιστοσελίδας της οικογενειακής επιχείρησης
«Κατασκευαστική Τεντών».

## Εκτέλεση

```bash
npm install
npm run dev
```

## Παραγωγικό build

```bash
npm run build
```

Το build δημιουργεί και `dist/404.html`, ώστε οι υποσελίδες να ανοίγουν σωστά
στο GitHub Pages.

## Δημοσίευση με GitHub Pages

Το project είναι έτοιμο για δημοσίευση μέσω GitHub Actions.

1. Δημιουργήστε ένα νέο repository στο GitHub.
2. Σπρώξτε τον κώδικα στο branch `main`.
3. Στο GitHub ανοίξτε `Settings` → `Pages`.
4. Στο `Build and deployment`, επιλέξτε `Source: GitHub Actions`.
5. Κάθε push στο `main` θα τρέχει το workflow
   `.github/workflows/deploy-pages.yml` και θα ανεβάζει το site.

Για repository τύπου project site, το τελικό URL θα είναι:

```text
https://USERNAME.github.io/REPOSITORY_NAME/
```

Για custom domain, προσθέστε αργότερα το domain από το GitHub Pages settings.

## Φωτογραφίες

Οι φωτογραφίες διαχειρίζονται κεντρικά από το `image-slots.json`.

Αναλυτικές οδηγίες και ο χάρτης των φακέλων υπάρχουν στο `PHOTO-GUIDE.md`.

```bash
npm run check:images
```

Μέχρι να προστεθεί μία τοπική φωτογραφία στο `public/images`, χρησιμοποιείται
αυτόματα η προσωρινή εικόνα fallback.

## Πριν τη δημοσίευση

- Επιβεβαίωση τηλεφώνου, διεύθυνσης και email.
- Αντικατάσταση των ενδεικτικών εικόνων με πραγματικές φωτογραφίες έργων.
- Επιβεβαίωση του ακριβούς έτους έναρξης και των εμπορικών συνεργασιών.
- Σύνδεση της φόρμας με email service ή backend, αν δεν επιθυμούμε `mailto`.
