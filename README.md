# Κατασκευαστική Τεντών

Πρώτη ολοκληρωμένη έκδοση της ιστοσελίδας της οικογενειακής επιχείρησης
«Κατασκευαστική Τεντών».

Η επιχείρηση εξυπηρετεί όλη την Αττική και αναλαμβάνει έργα σε όλη την Ελλάδα.

## Φόρμα επικοινωνίας

Η φόρμα στέλνει αιτήματα με AJAX προς FormSubmit. Το προεπιλεγμένο endpoint
είναι το email της επιχείρησης, ενώ μπορεί να αλλαχθεί χωρίς αλλαγή κώδικα με:

```bash
VITE_QUOTE_FORM_ENDPOINT=https://formsubmit.co/ajax/your-form-id
```

Για αλλαγή live URL ή custom domain, αντίστοιχα:

```bash
VITE_SITE_URL=https://example.gr
```

## Φωτογραφίες

Κάθε προϊόν έχει δικό του φάκελο μέσα στο `photos/`. Όσες φωτογραφίες
ανεβαίνουν σε έναν φάκελο, τόσες εμφανίζονται στη σελίδα του προϊόντος και
στη σελίδα «Έργα μας». Κατά το build οι φωτογραφίες γυρίζουν σωστά, μικραίνουν
και μετατρέπονται σε WebP. Αναλυτικά: [PHOTO-GUIDE.md](PHOTO-GUIDE.md).

```bash
npm run check:photos
```

## Google, domain και διαφήμιση

Στο build κάθε σελίδα γράφεται ως ξεχωριστό HTML με δικό της τίτλο,
περιγραφή και structured data, και δημιουργούνται `sitemap.xml` και
`robots.txt` με βάση τη `VITE_SITE_URL`. Οδηγίες για Vercel, αγορά domain,
Google Search Console, Google Business Profile, λέξεις-κλειδιά και Google Ads:
[ODIGOS-ANAZITISI-DIAFIMISI.md](ODIGOS-ANAZITISI-DIAFIMISI.md). Όλες οι
ρυθμίσεις: [.env.example](.env.example).

```bash
npm run build                      # δημιουργεί το dist/
python3 scripts/serve-spa.py       # τοπική προβολή στο http://127.0.0.1:3002
```
