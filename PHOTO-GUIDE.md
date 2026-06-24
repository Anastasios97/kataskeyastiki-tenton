# Οδηγός φωτογραφιών

Όλες οι θέσεις φωτογραφιών ορίζονται στο `image-slots.json`. Δεν χρειάζεται να
αλλάζεις το `App.tsx` όταν θέλεις να αντικαταστήσεις εικόνες.

## Πώς ανεβαίνει μία φωτογραφία

1. Βρίσκεις την ενότητα στον παρακάτω χάρτη.
2. Μετονομάζεις τη φωτογραφία ακριβώς όπως αναφέρεται.
3. Την τοποθετείς μέσα στο `public/images/...`.
4. Ανανεώνεις τη σελίδα.

Αν το αρχείο δεν υπάρχει ακόμη, η ιστοσελίδα εμφανίζει αυτόματα την προσωρινή
εξωτερική φωτογραφία.

## Έλεγχος διαθέσιμων φωτογραφιών

```bash
npm run check:images
```

Η εντολή εμφανίζει:

- ποιες φωτογραφίες έχουν ήδη τοποθετηθεί,
- το ακριβές path κάθε φωτογραφίας που λείπει,
- το προτεινόμενο μέγεθος.

## Χάρτης φακέλων

```text
public/images/
├── home/
│   ├── hero.jpg
│   ├── company.jpg
│   ├── contact.jpg
│   ├── products/
│   │   ├── classic.jpg
│   │   ├── pergola.jpg
│   │   ├── bioclimatic.jpg
│   │   ├── umbrella.jpg
│   │   └── parking.jpg
│   └── applications/
│       ├── homes.jpg
│       ├── hospitality.jpg
│       └── special.jpg
├── classic/
│   ├── hero.jpg
│   ├── antirida/
│   ├── arms/
│   ├── cassette/
│   ├── monoblock/
│   ├── vertical/
│   └── kapotines/
├── pergola/
│   ├── hero.jpg
│   └── gallery-01.jpg ... gallery-04.jpg
├── bioclimatic/
│   ├── hero.jpg
│   └── gallery-01.jpg ... gallery-04.jpg
└── pages/
    ├── other-systems-hero.jpg
    ├── services-hero.jpg
    ├── company-hero.jpg
    ├── company-story.jpg
    └── contact-hero.jpg
```

Κάθε φάκελος κλασσικού συστήματος χρησιμοποιεί:

```text
hero.jpg
gallery-01.jpg
gallery-02.jpg
gallery-03.jpg
gallery-04.jpg
```

## Προτεινόμενες προδιαγραφές

- Hero: JPG ή WebP, τουλάχιστον `2000 × 1300 px`, οριζόντια.
- Gallery: JPG ή WebP, περίπου `1600 × 1200 px`.
- Κάρτες αρχικής: περίπου `1400 × 1100 px`.
- Φωτογραφίες εταιρείας: κατακόρυφη λήψη περίπου `1400 × 1700 px`.
- Αποφεύγουμε screenshots, πολύ μικρά αρχεία και φωτογραφίες με ενσωματωμένο κείμενο.
- Κρατάμε το βασικό θέμα σχετικά κοντά στο κέντρο, επειδή οι εικόνες κόβονται
  διαφορετικά σε desktop και κινητό.

## Αλλαγή ονόματος ή format

Αν θέλεις διαφορετικό όνομα ή αρχείο `.webp`, αλλάζεις μόνο το πεδίο `local`
της αντίστοιχης θέσης στο `image-slots.json`.
