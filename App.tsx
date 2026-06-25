import { FormEvent, ReactNode, useEffect, useState } from "react";
import { media, SiteImage } from "./siteMedia";

const business = {
  name: "Κατασκευαστική Τεντών",
  shortName: "ΚΤ",
  manager: "Μιχάλης Παπαδάμ",
  email: "k.tenton@yahoo.gr",
  phones: ["6932254494", "6932254443", "2109829988"],
  address: "Στρατάρχη Παπάγου Αλεξάνδρου 109, Άγιος Δημήτριος, Αττική",
  serviceArea: "Εξυπηρετούμε όλη την Αττική και αναλαμβάνουμε έργα σε όλη την Ελλάδα.",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Stratarchi+Papagou+Alexandrou+109+Agios+Dimitrios+Attiki",
  facebookUrl: "https://www.facebook.com/katas.tenton?locale=el_GR",
  instagramUrl: "https://www.instagram.com/outdoor_awings",
};

type IconName =
  | "arrow"
  | "awning"
  | "check"
  | "glass"
  | "menu"
  | "parking"
  | "pergola"
  | "phone"
  | "plus"
  | "shield"
  | "spark"
  | "umbrella"
  | "x";

type DetailItem = {
  title: string;
  text: string;
};

type ProductPage = {
  path: string;
  eyebrow: string;
  title: string;
  intro: string;
  description: string;
  image: SiteImage;
  icon: IconName;
  items: DetailItem[];
  sources?: {
    name: string;
    text: string;
    url: string;
  }[];
};

type ClassicSystem = {
  path: string;
  title: string;
  summary: string;
  description: string[];
  features: string[];
  image: SiteImage;
  gallery: SiteImage[];
};

type FabricDesign = {
  name: string;
  code: string;
  supplier: string;
  url: string;
  image?: string;
  value?: string;
};

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="m9 18 6-6-6-6" />,
    awning: (
      <>
        <path d="M3 10h18L18 4H6l-3 6Z" />
        <path d="M5 10v10M19 10v10M9 20v-6h6v6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    glass: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1" />
        <path d="M12 3v18M4 12h16" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    parking: (
      <>
        <path d="M5 21V4h8a5 5 0 0 1 0 10H5" />
        <path d="M9 8h4a1 1 0 0 1 0 2H9" />
      </>
    ),
    pergola: (
      <>
        <path d="M3 6h18M5 6v15M19 6v15M3 3h18" />
        <path d="m7 3 2 3m2-3 2 3m2-3 2 3" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.05 9.71a16 16 0 0 0 6 6l1.26-1.26a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.9Z" />
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z" />
        <path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Zm14-2 .8 2.2 2.2.8-2.2.8L19 18l-.8-2.2L16 15l2.2-.8L19 12Z" />
      </>
    ),
    umbrella: (
      <>
        <path d="M3 12a9 9 0 0 1 18 0H3Z" />
        <path d="M12 3v16a2 2 0 0 0 4 0" />
      </>
    ),
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      className="icon"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {paths[name]}
      </g>
    </svg>
  );
}

function useMediaSource(image: SiteImage) {
  const [source, setSource] = useState(image.local);

  useEffect(() => {
    const controller = new AbortController();
    setSource(image.local);

    fetch(image.local, {
      cache: "no-store",
      method: "HEAD",
      signal: controller.signal,
    })
      .then((response) => {
        const contentType = response.headers.get("content-type") ?? "";
        if (response.ok && contentType.startsWith("image/")) {
          setSource(image.local);
        } else {
          setSource(image.fallback);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setSource(image.fallback);
      });

    return () => controller.abort();
  }, [image.fallback, image.local]);

  return source;
}

function MediaImage({
  image,
  alt = image.alt,
  className,
  loading,
  priority = false,
}: {
  image: SiteImage;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}) {
  const source = useMediaSource(image);

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={loading}
      onError={(event) => {
        if (event.currentTarget.src !== image.fallback) {
          event.currentTarget.src = image.fallback;
        }
      }}
      src={source}
    />
  );
}

function DetailHero({
  image,
  eyebrow,
  title,
  intro,
  className = "",
  ctaLabel,
}: {
  image: SiteImage;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  className?: string;
  ctaLabel?: string;
}) {
  const source = useMediaSource(image);

  return (
    <section
      className={`detail-hero ${className}`.trim()}
      style={{ backgroundImage: `url("${source}")` }}
    >
      <div className="detail-hero-shade" />
      <div className="container detail-hero-content">
        <p className="eyebrow light"><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {ctaLabel && (
          <a className="button button-sun" href={appHref("/epikoinonia")}>
            {ctaLabel} <Icon name="arrow" size={19} />
          </a>
        )}
      </div>
    </section>
  );
}

function DetailOverview({
  icon,
  eyebrow,
  title,
  description,
  bullets,
}: {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: ReactNode;
  bullets: string[];
}) {
  return (
    <section className="detail-overview section">
      <div className="container detail-overview-grid">
        <div>
          <div className="detail-page-icon"><Icon name={icon} size={31} /></div>
          <p className="eyebrow"><span /> {eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <div className="detail-description">
          <p>{description}</p>
          <ul className="check-list">
            {bullets.map((bullet) => (
              <li key={bullet}><Icon name="check" size={18} /> {bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function GallerySection({
  eyebrow = "Ενδεικτικές εφαρμογές",
  title,
  intro,
  images,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  images: SiteImage[];
}) {
  return (
    <section className="system-gallery section">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> {eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <p>{intro}</p>
        </div>
        <div className="system-gallery-grid">
          {images.map((image, index) => (
            <figure key={image.local}>
              <MediaImage image={image} loading="lazy" />
              <figcaption>Εφαρμογή {String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SourcesSection({
  title,
  intro,
  sources,
}: {
  title: string;
  intro: string;
  sources: { name: string; text: string; url: string }[];
}) {
  return (
    <section className="sources-section section">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> Τεχνικές πηγές</p>
            <h2>{title}</h2>
          </div>
          <p>{intro}</p>
        </div>
        <div className={`source-card-grid source-card-grid--${sources.length}`}>
          {sources.map((source) => (
            <a href={source.url} key={source.name} rel="noreferrer" target="_blank">
              <strong>{source.name}</strong>
              <p>{source.text}</p>
              <span>Επισκεφθείτε την ιστοσελίδα <Icon name="arrow" size={17} /></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const navItems = [
  { label: "Κλασσικά συστήματα σκίασης", path: "/klassika-systimata-skiasis" },
  { label: "Περγκοτέντες", path: "/pergkotentes" },
  { label: "Βιοκλιματικές πέργκολες", path: "/vioklimatikes-pergkoles" },
  { label: "Άλλα συστήματα σκίασης", path: "/alla-systimata-skiasis" },
  { label: "Υπηρεσίες", path: "/ypiresies" },
  { label: "Η εταιρεία μας", path: "/i-etaireia-mas" },
  { label: "Επικοινωνία", path: "/epikoinonia" },
];

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Λύσεις σκίασης με εμπειρία",
    description:
      "Οικογενειακή επιχείρηση με περισσότερα από 30 χρόνια εμπειρίας σε τέντες, πέργκολες και συστήματα σκίασης σε όλη την Αττική και την Ελλάδα.",
  },
  "/klassika-systimata-skiasis": {
    title: "Κλασσικά συστήματα σκίασης",
    description:
      "Τέντες με αντιρίδες, σπαστούς βραχίονες, κασετίνες, monoblock και κάθετα συστήματα.",
  },
  "/pergkotentes": {
    title: "Περγκοτέντες",
    description:
      "Περγκοτέντες αλουμινίου με αναδιπλούμενη οροφή, ηλεκτροκίνηση, φωτισμό και πλευρική προστασία.",
  },
  "/vioklimatikes-pergkoles": {
    title: "Βιοκλιματικές πέργκολες",
    description:
      "Βιοκλιματικές πέργκολες με κινητές περσίδες για έλεγχο φωτός, αέρα και σκίασης.",
  },
  "/alla-systimata-skiasis": {
    title: "Άλλα συστήματα σκίασης",
    description:
      "Ομπρέλες, προστασία οχημάτων, ανεμοθραύστες και ειδικά συστήματα εξωτερικού χώρου.",
  },
  "/ypiresies": {
    title: "Υπηρεσίες",
    description:
      "Μελέτη, κατασκευή, τοποθέτηση, επισκευή, συντήρηση και καθαρισμός συστημάτων σκίασης.",
  },
  "/i-etaireia-mas": {
    title: "Η εταιρεία μας",
    description:
      "Η οικογενειακή επιχείρηση Κατασκευαστική Τεντών και η εμπειρία της στον χώρο της σκίασης.",
  },
  "/epikoinonia": {
    title: "Επικοινωνία",
    description:
      "Επικοινωνήστε με την Κατασκευαστική Τεντών για αυτοψία και δωρεάν αρχική εκτίμηση σε Αττική και όλη την Ελλάδα.",
  },
};

const productPages: ProductPage[] = [
  {
    path: "/klassika-systimata-skiasis",
    eyebrow: "Κλασσικά συστήματα σκίασης",
    title: "Δοκιμασμένες λύσεις σκίασης για κάθε άνοιγμα.",
    intro:
      "Τέντες και μηχανισμοί που προσαρμόζονται στις διαστάσεις, στη χρήση και στην αισθητική του χώρου.",
    description:
      "Μελετάμε τον προσανατολισμό, την έκθεση στον αέρα και τις ανάγκες καθημερινής χρήσης πριν επιλέξουμε μηχανισμό, πανί και τρόπο στήριξης. Έτσι η κατασκευή λειτουργεί σωστά και παραμένει πρακτική στον χρόνο.",
    image: media.classic.hero,
    icon: "awning",
    items: [
      {
        title: "Τέντες με σπαστούς βραχίονες",
        text: "Ευέλικτη λύση για μπαλκόνια και βεράντες, με χειροκίνητη ή ηλεκτρική λειτουργία.",
      },
      {
        title: "Κασέτες & κασονέτα",
        text: "Ο μηχανισμός και το πανί προστατεύονται όταν η τέντα είναι κλειστή.",
      },
      {
        title: "Monoblock συστήματα",
        text: "Ενισχυμένη μπάρα στήριξης για μεγάλα ανοίγματα και απαιτητικές εφαρμογές.",
      },
      {
        title: "Κάθετα συστήματα",
        text: "Πλευρική προστασία από ήλιο και αέρα με υφάσματα ή διάφανη ζελατίνα.",
      },
    ],
  },
  {
    path: "/pergkotentes",
    eyebrow: "Περγκοτέντες",
    title: "Ελεγχόμενη σκίαση με καθαρή αρχιτεκτονική γραμμή.",
    intro:
      "Σταθερές κατασκευές αλουμινίου με κινητό ύφασμα για μεγάλες βεράντες, αυλές και επαγγελματικούς χώρους.",
    description:
      "Η περγκοτέντα συνδυάζει τη σταθερότητα μιας πέργκολας με τη δυνατότητα να ανοίγει και να κλείνει η οροφή. Κατασκευάζεται στις διαστάσεις του χώρου και μπορεί να συνδυαστεί με φωτισμό, αυτοματισμούς και πλευρικά συστήματα.",
    image: media.pergola.hero,
    icon: "pergola",
    items: [
      {
        title: "Κλασσική περγκοτέντα",
        text: "Ευθύγραμμη κατασκευή για αποτελεσματική κάλυψη κατοικιών και επιχειρήσεων.",
      },
      {
        title: "Καμπυλωτή περγκοτέντα",
        text: "Ιδιαίτερη γραμμή με αποτελεσματική απορροή νερού και ομαλή κίνηση του πανιού.",
      },
      {
        title: "Compact εφαρμογές",
        text: "Συμπαγείς λύσεις για μικρότερους χώρους χωρίς υποχώρηση σε αντοχή και λειτουργία.",
      },
      {
        title: "Πλευρική προστασία",
        text: "Δυνατότητα συνδυασμού με κάθετα συστήματα ή ανεμοθραύστες UP/DOWN, μετά από τεχνικό έλεγχο συμβατότητας.",
      },
    ],
  },
  {
    path: "/vioklimatikes-pergkoles",
    eyebrow: "Βιοκλιματικές πέργκολες",
    title: "Φως, αέρας και προστασία με μία κίνηση.",
    intro:
      "Πέργκολες αλουμινίου με περιστρεφόμενες περσίδες για έλεγχο των συνθηκών όλο τον χρόνο.",
    description:
      "Οι βιοκλιματικές πέργκολες επιτρέπουν τον ακριβή έλεγχο σκίασης και αερισμού. Όταν κλείνουν, δημιουργούν προστατευμένη οροφή με οργανωμένη απορροή νερού μέσα από την κατασκευή.",
    image: media.bioclimatic.hero,
    icon: "pergola",
    items: [
      {
        title: "Περιστρεφόμενες περσίδες",
        text: "Ρύθμιση της γωνίας για φυσικό φωτισμό, σκίαση και κυκλοφορία του αέρα.",
      },
      {
        title: "Κρυφή απορροή υδάτων",
        text: "Το νερό οδηγείται στις υδρορροές και απομακρύνεται μέσα από τις κολώνες.",
      },
      {
        title: "Αυτοματισμοί",
        text: "Ηλεκτρική κίνηση, τηλεχειρισμός και δυνατότητα προσθήκης αισθητήρων.",
      },
      {
        title: "Ολοκληρωμένος χώρος",
        text: "Συνδυασμός με φωτισμό, κάθετες τέντες ή ανεμοθραύστες UP/DOWN, ανάλογα με τη διαμόρφωση.",
      },
    ],
  },
  {
    path: "/alla-systimata-skiasis",
    eyebrow: "Άλλα συστήματα σκίασης",
    title: "Εξειδικευμένες επιλογές πέρα από την κλασσική τέντα.",
    intro:
      "Ομπρέλες, σκίαση οχημάτων, ανεμοθραύστες και ειδικά συστήματα για οικιακές και επαγγελματικές ανάγκες.",
    description:
      "Όταν ο χώρος απαιτεί διαφορετική προσέγγιση, επιλέγουμε τη λύση που καλύπτει τη χρήση χωρίς περιττούς συμβιβασμούς. Στα συστήματα πλευρικής προστασίας εξετάζονται ιδιαίτερα η ανεμοπίεση, η ασφαλής στήριξη, οι διαστάσεις και ο τρόπος λειτουργίας.",
    image: media.pages.other,
    icon: "umbrella",
    items: [
      {
        title: "Ομπρέλες",
        text: "Επαγγελματικές και οικιακές επιλογές μεγάλης κάλυψης και εύκολης λειτουργίας.",
      },
      {
        title: "Προστασία οχήματος",
        text: "Στέγαστρα και ανθεκτικές κατασκευές για ήλιο, βροχή και καθημερινή φθορά.",
      },
      {
        title: "Ανεμοθραύστες UP/DOWN",
        text: "Χειροκίνητο σύστημα δύο τζαμιών για προστασία από τον άνεμο. Διατίθεται σε στάνταρ έκδοση έως 2,20 m πλάτος και βαρέως τύπου έως 3,25 m, με μέγιστο ύψος 2,20 m.",
      },
      {
        title: "Τριπλό τζάμι Guillotine",
        text: "Ηλεκτροκίνητο σύστημα τριών τμημάτων, με τα δύο να κινούνται κατακόρυφα. Υποστηρίζει διαστάσεις έως 4,50 × 3,00 m και λειτουργία με μοτέρ και τηλεχειρισμό Somfy.",
      },
      {
        title: "Επάλληλα τζάμια",
        text: "Συρόμενα φύλλα για προστασία από αέρα και βροχή, με κλειδαριά δαπέδου. Το σύστημα φτάνει έως 3,00 m ύψος και συνολικό πλάτος 8,00 m.",
      },
      {
        title: "Ειδικές κατασκευές",
        text: "Μεταλλικές λύσεις προσαρμοσμένες στις ιδιαιτερότητες του κτιρίου.",
      },
    ],
    sources: [
      {
        name: "LAMDA • Συστήματα με τζάμια",
        text: "Τεχνικά στοιχεία για ανεμοθραύστες UP/DOWN, ηλεκτροκίνητα συστήματα Guillotine και επάλληλα τζάμια.",
        url: "https://lamda.com.gr/sistimata-me-tzamia/",
      },
    ],
  },
];

const pergolaGalleryImages = media.pergola.gallery;

const pergolaTypes = [
  {
    title: "Ευθύγραμμη με κλίση",
    text: "Η κλασσική τεντοπέργκολα αλουμινίου με προκαθορισμένη κλίση για σωστή τάση του PVC και οργανωμένη απορροή της βροχής.",
  },
  {
    title: "Επίπεδη όψη 90°",
    text: "Λύση με καθαρή, οριζόντια αρχιτεκτονική γραμμή για σύγχρονες προσόψεις και χώρους όπου ζητείται λιτή εμφάνιση.",
  },
  {
    title: "Καμπυλωτή",
    text: "Η καμπύλη διαδρομή της οροφής εξυπηρετεί ιδιαίτερες αρχιτεκτονικές απαιτήσεις και δημιουργεί πιο ανάλαφρη τελική μορφή.",
  },
  {
    title: "Κρεμαστή",
    text: "Αναρτώμενη κατασκευή χωρίς εμπρόσθιες κολώνες, όταν το κατάλληλο υπόβαθρο επιτρέπει ασφαλή στήριξη σε τοίχο ή οροφή.",
  },
  {
    title: "Μεγάλων ανοιγμάτων",
    text: "Ενισχυμένες διατομές και οδηγοί για επαγγελματικές εφαρμογές, αυλές και μεγάλες επιφάνειες που απαιτούν στιβαρή κάλυψη.",
  },
  {
    title: "Σε υπάρχουσα κατασκευή",
    text: "Το κινητό σύστημα σκίασης μπορεί, μετά από τεχνικό έλεγχο, να εφαρμοστεί επάνω σε κατάλληλη μεταλλική ή ξύλινη υποδομή.",
  },
];

const pergolaFeatures = [
  {
    title: "Κινητή οροφή PVC Blockout",
    text: "Το αδιαφανές τεχνικό ύφασμα αναδιπλώνεται ηλεκτρικά, προσφέροντας πλήρη σκίαση όταν αναπτύσσεται και ανοιχτό ουρανό όταν μαζεύεται.",
  },
  {
    title: "Αλουμίνιο και επιλογές RAL",
    text: "Ο σκελετός σχεδιάζεται στις διαστάσεις του χώρου και μπορεί να βαφτεί ηλεκτροστατικά σε απόχρωση που συνδέεται με την όψη του κτιρίου.",
  },
  {
    title: "Υδρορροή και απορροή",
    text: "Η κλίση, οι τραβέρσες και το στηθαίο συνεργάζονται ώστε τα νερά να οδηγούνται ελεγχόμενα προς την προβλεπόμενη έξοδο.",
  },
  {
    title: "Ηλεκτροκίνηση",
    text: "Η ανάπτυξη και η σύμπτυξη της οροφής γίνεται με μοτέρ και τηλεχειρισμό, με δυνατότητα ένταξης επιπλέον αυτοματισμών.",
  },
  {
    title: "Φωτισμός LED",
    text: "Γραμμικός ή σημειακός φωτισμός μπορεί να ενσωματωθεί στις δοκούς, με ασύρματο έλεγχο και προαιρετική ρύθμιση έντασης.",
  },
  {
    title: "Πλευρική προστασία",
    text: "Κάθετα συστήματα ZIP ή άλλες συμβατές λύσεις περιορίζουν τον χαμηλό ήλιο και τον αέρα, ολοκληρώνοντας τον εξωτερικό χώρο.",
  },
];

const pergolaSources = [
  {
    name: "LAMDA",
    text: "Συστήματα με διαφορετικές γεωμετρίες, ενισχυμένες εκδόσεις μεγάλων διαστάσεων, LED, στηθαία και επιλογές χρωμάτων RAL.",
    url: "https://lamda.com.gr/en/pergoles/",
  },
  {
    name: "MetaForm",
    text: "Τεντοπέργκολες αλουμινίου με PVC Blockout, προκαθορισμένη κλίση και δυνατότητα συνδυασμού με ZIP και φωτισμό LED.",
    url: "https://www.metaform.gr/proionta/pergoles/",
  },
  {
    name: "NYFAN",
    text: "Σειρές τεντοπέργκολας με κλίση και συστήματα 90°, μαζί με επιλογές τεχνικών υφασμάτων και εξοπλισμού.",
    url: "https://nyfan.gr/pergola/",
  },
];

const bioclimaticModes = [
  {
    title: "Ανοιχτές περσίδες",
    text: "Το φυσικό φως περνά και ο θερμός αέρας απομακρύνεται προς τα επάνω, διατηρώντας τον χώρο αεριζόμενο.",
    angle: "70deg",
  },
  {
    title: "Ενδιάμεση θέση",
    text: "Η γωνία προσαρμόζεται για ισορροπία ανάμεσα σε σκιά, φωτισμό και κυκλοφορία του αέρα μέσα στην ημέρα.",
    angle: "35deg",
  },
  {
    title: "Κλειστή οροφή",
    text: "Οι περσίδες εφαρμόζουν μεταξύ τους και το νερό οδηγείται στην περιμετρική υδρορροή και στις προβλεπόμενες εξόδους.",
    angle: "0deg",
  },
];

const bioclimaticTypes = [
  {
    title: "Περιστρεφόμενες περσίδες",
    text: "Οι περσίδες αλουμινίου μεταβάλλουν συνεχώς τη γωνία τους, επιτρέποντας ακριβή έλεγχο της σκιάς και του φυσικού αερισμού.",
  },
  {
    title: "Περιστρεφόμενες και αναδιπλούμενες",
    text: "Εκτός από την αλλαγή κλίσης, τα κινητά πάνελ συγκεντρώνονται στη μία πλευρά ώστε να απελευθερώνεται μεγάλο τμήμα της οροφής.",
  },
  {
    title: "Επίπεδη χωρίς εμφανή κλίση",
    text: "Σύγχρονη οριζόντια μορφή με την απορροή ενσωματωμένη στον σχεδιασμό, για καθαρή αρχιτεκτονική ένταξη.",
  },
  {
    title: "Με ελάχιστη κλίση",
    text: "Αναδιπλούμενες λύσεις με μικρή τεχνική κλίση, κατάλληλες όταν προτεραιότητα είναι το μεγάλο άνοιγμα της οροφής.",
  },
  {
    title: "Σταθερές περσίδες",
    text: "Παθητική λύση με μελετημένη γωνία και απόσταση πτερυγίων, για μόνιμη σκίαση και φυσικό αερισμό χωρίς μηχανισμό.",
  },
  {
    title: "Αυτόνομη ή επιτοίχια",
    text: "Η κατασκευή μπορεί να στηρίζεται ανεξάρτητα σε κολώνες ή να συνδέεται στο κτίριο, ανάλογα με το υπόβαθρο και τη μελέτη.",
  },
];

const bioclimaticFeatures = [
  {
    title: "Έλεγχος μικροκλίματος",
    text: "Η μεταβολή της κλίσης των περσίδων ρυθμίζει τον ήλιο και επιτρέπει στον θερμό αέρα να διαφεύγει φυσικά.",
  },
  {
    title: "Ενσωματωμένη απορροή",
    text: "Όταν η οροφή κλείνει, το νερό συλλέγεται περιμετρικά και απομακρύνεται μέσα από υδρορροές και κολώνες.",
  },
  {
    title: "Ηλεκτροκίνηση",
    text: "Η κίνηση γίνεται με ηλεκτρικό μηχανισμό και τηλεχειρισμό, με επιλογές αυτοματισμού ανάλογα με το σύστημα.",
  },
  {
    title: "Φωτισμός LED",
    text: "Περιμετρικός φωτισμός ή φωτισμός επάνω στα πάνελ επεκτείνει τη χρήση του χώρου και δημιουργεί ελεγχόμενη ατμόσφαιρα.",
  },
  {
    title: "Πλευρική προστασία",
    text: "Κάθετα ZIP, υαλοπίνακες ή άλλες συμβατές λύσεις μπορούν να περιορίσουν τον αέρα και τον χαμηλό ήλιο.",
  },
  {
    title: "Χρώματα και φινιρίσματα",
    text: "Η ηλεκτροστατική βαφή σε επιλογές RAL συνδέει την κατασκευή με τα κουφώματα και τη συνολική εικόνα του κτιρίου.",
  },
];

const bioclimaticSources = [
  {
    name: "NYFAN APERTO",
    text: "Περιστρεφόμενες περσίδες, αυτόματη λειτουργία Somfy, περιμετρικό LED και ενσωματωμένη διαχείριση νερού.",
    url: "https://nyfan.gr/pergola/aperto/",
  },
  {
    name: "LAMDA",
    text: "Περιστρεφόμενες, περιστρεφόμενες και αναδιπλούμενες ή σταθερές περσίδες, με διαφορετικές επιλογές στήριξης.",
    url: "https://lamda.com.gr/en/bioklimatiki/",
  },
  {
    name: "MetaForm",
    text: "Σειρές περιστρεφόμενων και αναδιπλούμενων πάνελ με LED, ηλεκτροκίνηση και δυνατότητες πλευρικού εξοπλισμού.",
    url: "https://www.metaform.gr/proionta/bioklimatikes-pergoles/",
  },
];

const bioclimaticColors = [
  { name: "RAL 9016", value: "#f1f0e9" },
  { name: "RAL 1013", value: "#ddd4bc" },
  { name: "RAL 1019", value: "#9a8675" },
  { name: "RAL 7040", value: "#8b9194" },
  { name: "RAL 7016", value: "#353a3d" },
  { name: "RAL 8017", value: "#44302a" },
  { name: "RAL 9005", value: "#171719" },
];

const cassetteGalleryImages = media.cassette.gallery;

const cassetteCategories = [
  {
    title: "Compact κασετίνα",
    text: "Λεπτή και διακριτική κατασκευή για μπαλκόνια και μικρότερες βεράντες, με δυνατότητα χειροκίνητης ή ηλεκτρικής λειτουργίας ανά σύστημα.",
    metric: "έως 5 × 3 m",
  },
  {
    title: "Ενισχυμένη κασετίνα",
    text: "Μεγαλύτερο κέλυφος και ενισχυμένοι βραχίονες για ευρύτερες επιφάνειες κατοικιών ή επαγγελματικών χώρων.",
    metric: "έως 7 × 3,2 m",
  },
  {
    title: "Υπερβαρέως τύπου",
    text: "Ηλεκτροκίνητη λύση μεγάλης κάλυψης με δυνατότητα ενσωμάτωσης φωτισμού LED και πρόσθετων αυτοματισμών.",
    metric: "έως 7 × 3,5 m",
  },
];

const cassetteFeatures = [
  {
    title: "Πλήρες κλείσιμο",
    text: "Όταν η τέντα μαζεύεται, το ύφασμα, ο άξονας και οι βραχίονες προστατεύονται μέσα στο κέλυφος αλουμινίου.",
  },
  {
    title: "Σταθερή τάση υφάσματος",
    text: "Οι ειδικά σχεδιασμένοι βραχίονες διατηρούν σωστό τέντωμα ακόμη και κοντά στη μέγιστη προβολή.",
  },
  {
    title: "Τοίχος ή οροφή",
    text: "Ανάλογα με τη σειρά και το υπόβαθρο, η κασετίνα μπορεί να στερεωθεί σε κάθετη επιφάνεια ή κάτω από οροφή και μαρκίζα.",
  },
  {
    title: "Ρυθμιζόμενη κλίση",
    text: "Η κλίση προσαρμόζεται εντός των ορίων του επιλεγμένου μοντέλου για καλύτερη σκίαση και απομάκρυνση νερού.",
  },
  {
    title: "Ηλεκτροκίνηση",
    text: "Ενσύρματο ή ασύρματο μοτέρ, τηλεχειρισμός και δυνατότητα διασύνδεσης με συμβατό σύστημα έξυπνου ελέγχου.",
  },
  {
    title: "LED και αισθητήρες",
    text: "Προαιρετικός φωτισμός και αισθητήρες ανέμου, ήλιου ή βροχής προσθέτουν άνεση και προστασία στη χρήση.",
  },
];

const cassetteSources = [
  {
    name: "LAMDA",
    text: "Compact, ενισχυμένες και υπερβαρέως τύπου κασετίνες με διαφορετικά όρια διαστάσεων, κλίσεων, βραχιόνων και φωτισμού.",
    url: "https://lamda.com.gr/kasetines/",
  },
  {
    name: "SEVENSUN HELIOS",
    text: "Σύστημα πλήρους κασετίνας έως 7 × 3,5 m, με ειδικούς βραχίονες, ενσύρματη ή ασύρματη τεχνολογία και προαιρετικούς αυτοματισμούς.",
    url: "https://sevensun.gr/el/helios/",
  },
];

const classicSystems: ClassicSystem[] = [
  {
    path: "/klassika-systimata-skiasis/antirida",
    title: "Κλασσικό σύστημα σκίασης (Αντιρίδα)",
    summary:
      "Οικονομική και αξιόπιστη λύση για κάθε μπαλκόνι, με ιδιαίτερα υψηλή αντοχή στον αέρα και στον χρόνο.",
    description: [
      "Η τέντα με αντιρίδες είναι μία από τις πιο δοκιμασμένες επιλογές σκίασης για κατοικίες. Οι σταθεροί οδηγοί κρατούν σωστά τεντωμένο το ύφασμα και προσφέρουν σταθερότητα ακόμη και σε σημεία με αυξημένη έκθεση στον αέρα.",
      "Η κατασκευή προσαρμόζεται στο πλάτος και στις απαιτήσεις του μπαλκονιού. Μπορούν να χρησιμοποιηθούν αντιρίδες αλουμινίου ή σιδερένιες, από δύο έως όσες απαιτούνται για τη σωστή κατανομή των φορτίων.",
    ],
    features: [
      "Αντιρίδες αλουμινίου ή σιδερένιες ανάλογα με την απαιτούμενη αντοχή",
      "Χειροκίνητος εξωτερικός μηχανισμός αλουμινίου",
      "Δυνατότητα εσωτερικού σωληνωτού μοτέρ",
      "Πολυεστερικά ή ακρυλικά υφάσματα σε μεγάλη ποικιλία",
    ],
    image: media.classic.systems.antirida.hero,
    gallery: media.classic.systems.antirida.gallery,
  },
  {
    path: "/klassika-systimata-skiasis/spastoi-vrachiones",
    title: "Τέντες με σπαστούς βραχίονες",
    summary:
      "Λειτουργική και κομψή σκίαση μικρών ή μεγάλων επιφανειών χωρίς πρόσθετη εμπρόσθια στήριξη.",
    description: [
      "Οι τέντες με σπαστούς βραχίονες διατίθενται και σε εκδόσεις βαρέως τύπου, ανάλογα με τις διαστάσεις και τις ανάγκες του χώρου. Είναι κατάλληλες για μπαλκόνια, προσόψεις ισογείων και καταστήματα, καθώς αφήνουν ελεύθερη την περιοχή μπροστά από την κατασκευή.",
      "Η ρυθμιζόμενη κλίση των βραχιόνων επιτρέπει καλύτερη αξιοποίηση της σκίασης μέσα στην ημέρα. Η λιτή, σύγχρονη εμφάνιση συνδυάζεται με πολυεστερικά ή ακρυλικά υφάσματα και μπορεί να ολοκληρωθεί με ηλεκτροκίνηση, τηλεχειρισμό και αισθητήρες ήλιου ή ανέμου.",
    ],
    features: [
      "Βραχίονες κανονικού ή βαρέως τύπου",
      "Ρυθμιζόμενη κλίση για μεγαλύτερη επιφάνεια σκίασης",
      "Χειροκίνητη ή ηλεκτρική τηλεχειριζόμενη λειτουργία",
      "Συμβατότητα με αυτοματισμούς ηλίου και αέρα",
    ],
    image: media.classic.systems.arms.hero,
    gallery: media.classic.systems.arms.gallery,
  },
  {
    path: "/klassika-systimata-skiasis/kasetes-kasoneta",
    title: "Κασέτες & κασονέτα",
    summary:
      "Συστήματα κλειστού τύπου που προστατεύουν πλήρως ύφασμα και μηχανισμό όταν η τέντα μαζεύεται.",
    description: [
      "Οι τέντες κασέτα αποτελούν μία ολοκληρωμένη λύση υψηλής αισθητικής. Ο άξονας, το πανί και οι βραχίονες κλείνουν μέσα σε κασονέτο αλουμινίου, παραμένοντας προστατευμένα από ήλιο, σκόνη και καιρική καταπόνηση.",
      "Υπάρχουν κατασκευές βαρέως τύπου για μεγάλα ανοίγματα και ελαφρύτερες εκδόσεις για μικρότερες εφαρμογές. Ανάλογα με το μοντέλο, οι βραχίονες χρησιμοποιούν βιονικό ιμάντα για ομαλή και αθόρυβη κίνηση ή διπλή καδένα ενίσχυσης. Ο σκελετός προσφέρεται σε επιλογές RAL και συνδυάζεται με εσωτερικό μοτέρ και μεγάλη γκάμα υφασμάτων.",
    ],
    features: [
      "Πλήρης προστασία πανιού, άξονα και βραχιόνων",
      "Βιονικός ιμάντας ή διπλή καδένα ανάλογα με το μοντέλο",
      "Επιλογές χρωμάτων RAL και σχεδιασμού πλαϊνών καπακιών",
      "Προμηθευτές και επιλογές από H Lamda, SevenSun, Metafrom και άλλους οίκους",
    ],
    image: media.cassette.hero,
    gallery: media.cassette.gallery,
  },
  {
    path: "/klassika-systimata-skiasis/monoblock",
    title: "Monoblock συστήματα",
    summary:
      "Ενιαία τέντα μπάρα για σημεία με περιορισμένη ή ευαίσθητη επιφάνεια στήριξης.",
    description: [
      "Το σύστημα Monoblock συγκεντρώνει τα βασικά σημεία στήριξης επάνω σε ενισχυμένη μπάρα. Έτσι μπορεί να τοποθετηθεί σε εξωτερική θερμομόνωση, ασθενέστερη τοιχοποιία, περιορισμένη επιφάνεια ή επάνω από μεγάλες τζαμαρίες καταστημάτων, με τη μικρότερη δυνατή επιβάρυνση του υποστρώματος.",
      "Κατασκευάζεται στις διαστάσεις του χώρου και μπορεί να λειτουργεί χειροκίνητα ή με εσωτερικό μοτέρ και τηλεχειρισμό. Συνδυάζεται με αισθητήρες ηλίου και αέρα και με πολυεστερικά ή ακρυλικά υφάσματα σε πληθώρα χρωμάτων.",
    ],
    features: [
      "Ενισχυμένη ενιαία μπάρα στήριξης",
      "Κατάλληλο για θερμοπρόσοψη και ευαίσθητη τοιχοποιία",
      "Δυνατότητα ηλεκτροκίνησης και τηλεχειρισμού",
      "Αυτοματισμοί ηλίου και αέρα",
    ],
    image: media.classic.systems.monoblock.hero,
    gallery: media.classic.systems.monoblock.gallery,
  },
  {
    path: "/klassika-systimata-skiasis/katheta-systimata",
    title: "Κάθετα συστήματα",
    summary:
      "Πλήρης κάθετη κάλυψη για προστασία από ήλιο, αέρα και βροχή σε μπαλκόνια και ημιυπαίθριους χώρους.",
    description: [
      "Τα κάθετα συστήματα αποτελούν οικονομική και πρακτική λύση όταν απαιτείται πλαϊνή προστασία. Κατεβαίνουν κατακόρυφα και μπορούν να καλύψουν πλήρως το επιθυμητό άνοιγμα, περιορίζοντας την έντονη ηλιοφάνεια, τον αέρα και τη βροχή.",
      "Ανάλογα με τη χρήση επιλέγεται τεντόπανο, τεχνικό ύφασμα screen ή διάφανη ζελατίνα, ώστε να διατηρείται η ορατότητα. Η λειτουργία μπορεί να είναι χειροκίνητη ή ηλεκτρική.",
    ],
    features: [
      "Τεντόπανο, screen ή διάφανη ζελατίνα",
      "Κάλυψη έως και του 100% του επιθυμητού ανοίγματος",
      "Προστασία από ήλιο, αέρα και βροχή",
      "Χειροκίνητη ή ηλεκτρική λειτουργία",
    ],
    image: media.classic.systems.vertical.hero,
    gallery: media.classic.systems.vertical.gallery,
  },
  {
    path: "/klassika-systimata-skiasis/kapotines",
    title: "Τέντες καποτίνες",
    summary:
      "Κλασσική καμπυλωτή κατασκευή για παράθυρα, βιτρίνες και εισόδους επαγγελματικών χώρων.",
    description: [
      "Οι καποτίνες προσφέρουν διαχρονική εμφάνιση και αποτελεσματική κάλυψη σε παράθυρα, ακάλυπτους χώρους και σημεία όπου μία συμβατική τέντα δεν μπορεί να στηριχθεί εύκολα. Είναι ιδιαίτερα κατάλληλες για εισόδους καταστημάτων, ξενοδοχείων, περιπτέρων και χώρων υποδοχής.",
      "Ο καμπυλωτός σκελετός αλουμινίου εξασφαλίζει αντοχή και καθαρή μορφή. Μπορεί να είναι σταθερός ή ανοιγόμενος και επενδύεται με ακρυλικά ή πολυεστερικά υφάσματα σε πολλά χρώματα, με δυνατότητα εταιρικής σήμανσης.",
    ],
    features: [
      "Ανθεκτικός καμπυλωτός σκελετός αλουμινίου",
      "Σταθερή ή ανοιγόμενη κατασκευή",
      "Ιδανική για παράθυρα, εισόδους και βιτρίνες",
      "Μεγάλη ποικιλία χρωμάτων και δυνατότητα εκτύπωσης",
    ],
    image: media.classic.systems.kapotines.hero,
    gallery: media.classic.systems.kapotines.gallery,
  },
];

const fabricSuppliers = [
  {
    name: "NYFAN • TenCate",
    text: "Συλλογή ψηφιακών εμπριμέ σχεδίων TenCate για σύγχρονες και κλασσικές εφαρμογές σκίασης.",
    url: "https://nyfan.gr/emprime-nyfan-tencate/",
    action: "Δείτε τα εμπριμέ σχέδια",
  },
  {
    name: "DAS Awning",
    text: "Μονόχρωμα, διπλής επίστρωσης και ειδικά τεχνικά τεντόπανα με σαφείς χρωματικούς κωδικούς.",
    url: "https://catalogue.dashome.gr/DasAwning/18/",
    action: "Ανοίξτε τον κατάλογο",
  },
  {
    name: "Calbari",
    text: "Μονόχρωμες, εμπριμέ και υβριδικές συλλογές τεντοπάνων για διαφορετικές ανάγκες σκίασης.",
    url: "https://www.calbari.gr/tentopana",
    action: "Δείτε τις συλλογές",
  },
];

const fabricSwatches: FabricDesign[] = [
  {
    name: "Cherokee",
    code: "1630",
    supplier: "NYFAN • TenCate",
    url: "https://nyfan.gr/emprime-nyfan-tencate/cherokee/",
    image: "https://nyfan.gr/wp-content/uploads/2023/04/CHEROKEE-1630-600x401.webp",
  },
  {
    name: "Garden",
    code: "1579",
    supplier: "NYFAN • TenCate",
    url: "https://nyfan.gr/emprime-nyfan-tencate/garden/",
    image: "https://nyfan.gr/wp-content/uploads/2023/04/garden-600x401.webp",
  },
  {
    name: "Dream",
    code: "1607",
    supplier: "NYFAN • TenCate",
    url: "https://nyfan.gr/emprime-nyfan-tencate/dream/",
    image: "https://nyfan.gr/wp-content/uploads/2023/04/dream-600x401.webp",
  },
  {
    name: "Grey / Ecru",
    code: "4516",
    supplier: "DAS Awning",
    url: "https://catalogue.dashome.gr/DasAwning/18/",
    value: "linear-gradient(135deg,#8e9292 0 52%,#ded8c7 52%)",
  },
  {
    name: "Dark Grey / Dark Grey",
    code: "4500",
    supplier: "DAS Awning",
    url: "https://catalogue.dashome.gr/DasAwning/18/",
    value: "#555758",
  },
  {
    name: "Black / Black",
    code: "4517",
    supplier: "DAS Awning",
    url: "https://catalogue.dashome.gr/DasAwning/18/",
    value: "#191919",
  },
  {
    name: "Hybrid Bali HD",
    code: "3003",
    supplier: "Calbari",
    url: "https://www.calbari.gr/tentopana/emprime",
    image: "https://static.wixstatic.com/media/5a92a2_7f3d1be84be6472e87d9f87af4324980~mv2.png/v1/fit/w_849,h_1408,q_90,enc_avif,quality_auto/5a92a2_7f3d1be84be6472e87d9f87af4324980~mv2.png",
  },
  {
    name: "Hybrid Varadero HD",
    code: "3001",
    supplier: "Calbari",
    url: "https://www.calbari.gr/tentopana/emprime",
    image: "https://static.wixstatic.com/media/5a92a2_e5a9ec71e776429e8819f4a89e082288~mv2.png/v1/fit/w_849,h_1408,q_90,enc_avif,quality_auto/5a92a2_e5a9ec71e776429e8819f4a89e082288~mv2.png",
  },
  {
    name: "Hybrid Catalina HD",
    code: "3006",
    supplier: "Calbari",
    url: "https://www.calbari.gr/tentopana/emprime",
    image: "https://static.wixstatic.com/media/5a92a2_2dddaf0bb74944c08cbe535f1c0bf38b~mv2.png/v1/fit/w_849,h_1408,q_90,enc_avif,quality_auto/5a92a2_2dddaf0bb74944c08cbe535f1c0bf38b~mv2.png",
  },
];

const homeProducts = [
  {
    title: "Κλασσικά συστήματα σκίασης",
    description:
      "Σπαστοί βραχίονες, κασέτες, monoblock και κάθετα συστήματα για κατοικίες και επιχειρήσεις.",
    icon: "awning" as IconName,
    image: media.home.products.classic,
    tag: "Σκίαση στα μέτρα σας",
    path: "/klassika-systimata-skiasis",
  },
  {
    title: "Περγκοτέντες",
    description:
      "Σταθερές κατασκευές με κινητή οροφή για άνεση και προστασία σε μεγάλους εξωτερικούς χώρους.",
    icon: "pergola" as IconName,
    image: media.home.products.pergola,
    tag: "Κάλυψη όλο τον χρόνο",
    path: "/pergkotentes",
  },
  {
    title: "Βιοκλιματικές πέργκολες",
    description:
      "Περιστρεφόμενες περσίδες αλουμινίου για έλεγχο φωτός, αερισμού και προστασίας.",
    icon: "pergola" as IconName,
    image: media.home.products.bioclimatic,
    tag: "Έξυπνη διαχείριση σκίασης",
    path: "/vioklimatikes-pergkoles",
  },
  {
    title: "Ομπρέλες",
    description:
      "Επαγγελματικές και οικιακές λύσεις μεγάλης κάλυψης, με έμφαση στην αντοχή και την ευχρηστία.",
    icon: "umbrella" as IconName,
    image: media.home.products.umbrella,
    tag: "Για κάθε εξωτερικό χώρο",
    path: "/alla-systimata-skiasis",
  },
  {
    title: "Προστασία οχήματος",
    description:
      "Ανθεκτικές κατασκευές που προστατεύουν το όχημα από ήλιο, βροχή και καθημερινή φθορά.",
    icon: "parking" as IconName,
    image: media.home.products.parking,
    tag: "Σκίαση parking",
    path: "/alla-systimata-skiasis",
  },
];

const services = [
  {
    number: "01",
    title: "Μελέτη & κατασκευή",
    text: "Μετράμε τον χώρο, ακούμε τις ανάγκες σας και προτείνουμε τη λύση που ταιριάζει πραγματικά.",
    details: [
      "Αυτοψία και ακριβής μέτρηση",
      "Πρόταση συστήματος και υλικών",
      "Προϋπολογισμός πριν την κατασκευή",
    ],
  },
  {
    number: "02",
    title: "Τοποθέτηση",
    text: "Οργανωμένη εγκατάσταση με προσοχή στην ασφάλεια, τη λεπτομέρεια και την καθαριότητα του χώρου.",
    details: [
      "Έλεγχος των σημείων στήριξης",
      "Ρύθμιση μηχανισμών και κλίσεων",
      "Καθαρή παράδοση του χώρου",
    ],
  },
  {
    number: "03",
    title: "Επισκευή & συντήρηση",
    text: "Αλλαγή πανιών, βραχιόνων και μηχανισμών, ώστε το σύστημα να λειτουργεί ξανά σωστά.",
    details: [
      "Διάγνωση της βλάβης",
      "Αλλαγή πανιού, βραχιόνων ή μοτέρ",
      "Ρύθμιση και δοκιμή λειτουργίας",
    ],
  },
  {
    number: "04",
    title: "Καθαρισμός",
    text: "Εξειδικευμένη φροντίδα για την απομάκρυνση ρύπων και την παράταση της ζωής του υφάσματος.",
    details: [
      "Έλεγχος καταλληλότητας του υφάσματος",
      "Καθαρισμός με κατάλληλη μέθοδο",
      "Οδηγίες φροντίδας μετά την εργασία",
    ],
  },
];

const applications = [
  {
    title: "Κατοικίες",
    subtitle: "Μπαλκόνια, βεράντες και αυλές",
    image: media.home.applications.homes,
  },
  {
    title: "Εστίαση",
    subtitle: "Καφέ, εστιατόρια και ξενοδοχεία",
    image: media.home.applications.hospitality,
  },
  {
    title: "Ειδικές κατασκευές",
    subtitle: "Λύσεις προσαρμοσμένες στον χώρο",
    image: media.home.applications.special,
  },
];

const serviceAreas = [
  {
    title: "Όλη η Αττική",
    text: "Άμεση εξυπηρέτηση σε κατοικίες και επαγγελματικούς χώρους σε Αθήνα, Πειραιά και προάστια.",
  },
  {
    title: "Όλη η Ελλάδα",
    text: "Αναλαμβάνουμε έργα εκτός Αττικής με συνεννόηση για μελέτη, μεταφορά και τοποθέτηση.",
  },
  {
    title: "Κατοικίες & επιχειρήσεις",
    text: "Προσαρμόζουμε τη λύση στη χρήση του χώρου, από μπαλκόνια μέχρι επαγγελματικές εγκαταστάσεις.",
  },
];

const faqs = [
  {
    question: "Πώς ξεκινά η διαδικασία;",
    answer:
      "Με μια σύντομη επικοινωνία και αυτοψία στον χώρο. Καταγράφουμε διαστάσεις, προσανατολισμό και ανάγκες πριν προτείνουμε σύστημα και υλικά.",
  },
  {
    question: "Αναλαμβάνετε επισκευές παλιών τεντών;",
    answer:
      "Ναι. Ελέγχουμε πανί, βραχίονες, στηρίξεις και μηχανισμό και σας ενημερώνουμε αν συμφέρει επισκευή ή αντικατάσταση.",
  },
  {
    question: "Υπάρχουν επιλογές αυτοματισμού;",
    answer:
      "Ναι, ανάλογα με το σύστημα μπορούν να τοποθετηθούν ηλεκτρικοί μηχανισμοί, τηλεχειρισμός και αισθητήρες ήλιου ή ανέμου.",
  },
  {
    question: "Μπορώ να επιλέξω πανί και χρώμα;",
    answer:
      "Βεβαίως. Διατίθεται μεγάλη γκάμα ακρυλικών, αδιάβροχων και τεχνικών υφασμάτων, σε μονόχρωμες και ριγέ επιλογές.",
  },
];

function normalizeBasePath(path: string) {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}/`;
}

const appBasePath = normalizeBasePath(import.meta.env.BASE_URL || "/");
const appBasePrefix = appBasePath === "/" ? "" : appBasePath.replace(/\/$/, "");
const siteUrl = (
  import.meta.env.VITE_SITE_URL || "https://anastasios97.github.io/kataskeyastiki-tenton"
).replace(/\/+$/, "");
const quoteFormEndpoint =
  import.meta.env.VITE_QUOTE_FORM_ENDPOINT ||
  `https://formsubmit.co/ajax/${business.email}`;

function appHref(path: string) {
  if (!path.startsWith("/")) return path;
  return `${appBasePrefix}${path}`;
}

function absoluteSiteUrl(path: string) {
  const routePath = path === "/" ? "" : path;

  if (appBasePrefix && siteUrl.endsWith(appBasePrefix)) {
    return `${siteUrl}${routePath}`;
  }

  return `${siteUrl}${appHref(path)}`;
}

function setMetaAttribute(selector: string, attribute: string, value: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);
  element?.setAttribute(attribute, value);
}

function buildQuoteMailto(form: FormData) {
  const name = String(form.get("name") ?? "").trim();
  const contact = String(form.get("contact") ?? "").trim();
  const area = String(form.get("area") ?? "").trim();
  const need = String(form.get("need") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  const subject = encodeURIComponent(`Αίτημα προσφοράς από ${name || "την ιστοσελίδα"}`);
  const body = encodeURIComponent(
    [
      `Ονοματεπώνυμο: ${name}`,
      `Τηλέφωνο / Email: ${contact}`,
      `Περιοχή: ${area}`,
      `Ενδιαφέρον: ${need}`,
      "",
      "Περιγραφή:",
      message,
    ].join("\n"),
  );

  return `mailto:${business.email}?subject=${subject}&body=${body}`;
}

function stripBasePath(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (appBasePrefix && (path === appBasePrefix || path.startsWith(`${appBasePrefix}/`))) {
    return path.slice(appBasePrefix.length) || "/";
  }

  return path;
}

function cleanPath(pathname: string) {
  const path = stripBasePath(pathname);
  if (path === "/index.html") return "/";
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function ContactDetails() {
  return (
    <div className="contact-details">
      <div className="phone-links">
        {business.phones.map((phone) => (
          <a
            aria-label={`Καλέστε στο ${phone}`}
            href={`tel:+30${phone}`}
            key={phone}
          >
            <Icon name="phone" size={17} /> {phone}
          </a>
        ))}
      </div>
      <a
        aria-label={`Στείλτε email στο ${business.email}`}
        href={`mailto:${business.email}`}
      >
        {business.email}
      </a>
      <a href={business.mapsUrl} target="_blank" rel="noreferrer">
        {business.address}
      </a>
      <div className="social-links">
        <a href={business.facebookUrl} target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a href={business.instagramUrl} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
    </div>
  );
}

function QuoteForm() {
  const [status, setStatus] = useState<{
    type: "idle" | "sending" | "success" | "error";
    message: string;
    fallbackHref?: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const fallbackHref = buildQuoteMailto(form);

    if (String(form.get("_honey") ?? "").trim()) return;

    form.set("_subject", `Νέο αίτημα προσφοράς - ${business.name}`);
    form.set("_template", "table");
    form.set("_captcha", "false");

    setStatus({
      type: "sending",
      message: "Στέλνουμε το αίτημά σας...",
    });

    try {
      const response = await fetch(quoteFormEndpoint, {
        body: form,
        headers: {
          Accept: "application/json",
        },
        method: "POST",
      });

      if (!response.ok) throw new Error("Quote form submission failed");

      formElement.reset();
      setStatus({
        type: "success",
        message: "Το αίτημα στάλθηκε. Θα επικοινωνήσουμε μαζί σας το συντομότερο.",
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "Δεν ολοκληρώθηκε η αυτόματη αποστολή. Μπορείτε να στείλετε το ίδιο αίτημα με email.",
        fallbackHref,
      });
    }
  };

  return (
    <form className="quote-form" onSubmit={handleQuote}>
      <div className="form-head">
        <strong>Γρήγορο αίτημα προσφοράς</strong>
        <p>Στείλτε μας τα βασικά στοιχεία και θα επικοινωνήσουμε για λεπτομέρειες.</p>
      </div>
      <input
        aria-hidden="true"
        autoComplete="off"
        className="form-honey"
        name="_honey"
        tabIndex={-1}
        type="text"
      />
      <input name="_subject" type="hidden" value={`Νέο αίτημα προσφοράς - ${business.name}`} />
      <input name="_template" type="hidden" value="table" />
      <input name="_captcha" type="hidden" value="false" />
      <label>
        Ονοματεπώνυμο
        <input autoComplete="name" name="name" type="text" placeholder="Το όνομά σας" required />
      </label>
      <label>
        Τηλέφωνο ή email
        <input
          autoComplete="tel email"
          name="contact"
          type="text"
          placeholder="Τηλέφωνο ή email"
          required
        />
      </label>
      <label>
        Περιοχή
        <input
          autoComplete="address-level2"
          name="area"
          type="text"
          placeholder="π.χ. Αθήνα ή πόλη εκτός Αττικής"
        />
      </label>
      <label>
        Τι σας ενδιαφέρει;
        <select name="need" defaultValue="" required>
          <option value="" disabled>
            Επιλέξτε λύση
          </option>
          <option>Κλασσικό σύστημα σκίασης</option>
          <option>Περγκοτέντα</option>
          <option>Βιοκλιματική πέργκολα</option>
          <option>Ομπρέλα ή προστασία οχήματος</option>
          <option>Ανεμοθραύστης ή σύστημα με τζάμια</option>
          <option>Επισκευή ή συντήρηση</option>
          <option>Άλλο</option>
        </select>
      </label>
      <label>
        Σύντομη περιγραφή
        <textarea
          name="message"
          placeholder="Περιγράψτε τον χώρο, τις διαστάσεις ή ό,τι θέλετε να γνωρίζουμε."
          rows={4}
          required
        />
      </label>
      <button
        className="button button-sun form-submit"
        disabled={status.type === "sending"}
        type="submit"
      >
        {status.type === "sending" ? "Αποστολή..." : "Στείλτε αίτημα"} <Icon name="arrow" size={19} />
      </button>
      {status.message && (
        <p
          aria-live="polite"
          className={`form-status form-status-${status.type}`}
          role="status"
        >
          {status.message}
          {status.fallbackHref && (
            <>
              {" "}
              <a href={status.fallbackHref}>Άνοιγμα email</a>
            </>
          )}
        </p>
      )}
      <small>
        Τα στοιχεία αποστέλλονται αποκλειστικά για να οργανώσουμε επικοινωνία
        και αρχική εκτίμηση.
      </small>
    </form>
  );
}

function DetailCta() {
  return (
    <section className="detail-cta">
      <div className="container detail-cta-inner">
        <div>
          <p className="eyebrow light"><span /> Επόμενο βήμα</p>
          <h2>Να δούμε ποια λύση ταιριάζει στον χώρο σας;</h2>
        </div>
        <a className="button button-sun" href={appHref("/epikoinonia")}>
          Επικοινωνήστε μαζί μας <Icon name="arrow" size={19} />
        </a>
      </div>
    </section>
  );
}

function CoverageBand() {
  return (
    <section className="coverage-section">
      <div className="container coverage-grid">
        <div>
          <p className="eyebrow light"><span /> Περιοχές εξυπηρέτησης</p>
          <h2>{business.serviceArea}</h2>
        </div>
        <div className="coverage-list">
          {serviceAreas.map((area) => (
            <article key={area.title}>
              <strong>{area.title}</strong>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClassicSystemsPage() {
  return (
    <main className="detail-main">
      <DetailHero
        ctaLabel="Ζητήστε δωρεάν εκτίμηση"
        eyebrow="Κλασσικά συστήματα σκίασης"
        image={media.classic.hero}
        intro="Επιλέγουμε τον κατάλληλο μηχανισμό, τρόπο στήριξης, ύφασμα και αυτοματισμό σύμφωνα με τις πραγματικές απαιτήσεις του χώρου."
        title="Δοκιμασμένες λύσεις για κάθε μπαλκόνι και πρόσοψη."
      />

      <DetailOverview
        bullets={[
          "Αυτοψία και ακριβής μέτρηση",
          "Επιλογή κατάλληλων υλικών",
          "Τοποθέτηση και τεχνική υποστήριξη",
        ]}
        description="Μελετάμε τον προσανατολισμό, την έκθεση στον αέρα και τις ανάγκες καθημερινής χρήσης πριν επιλέξουμε μηχανισμό, πανί και τρόπο στήριξης. Έτσι η κατασκευή λειτουργεί σωστά και παραμένει πρακτική στον χρόνο."
        eyebrow="Η προσέγγισή μας"
        icon="awning"
        title="Κατασκευή με βάση τον χώρο και τη χρήση."
      />

      <section className="classic-choices section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Επιλογές</p>
              <h2>Έξι συστήματα, μία σωστή επιλογή για τον χώρο σας.</h2>
            </div>
            <p>
              Επιλέξτε σύστημα για να δείτε αναλυτική περιγραφή, εξαρτήματα,
              αυτοματισμούς και ενδεικτική συλλογή εφαρμογών.
            </p>
          </div>
          <div className="classic-choice-grid">
            {classicSystems.map((system, index) => (
              <a className="classic-choice-card" href={appHref(system.path)} key={system.path}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{system.title}</h3>
                <p>{system.summary}</p>
                <strong>Δείτε αναλυτικά <Icon name="arrow" size={17} /></strong>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="fabrics-section section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Είδος και χρώμα πανιών</p>
              <h2>Προμηθευτές και σχέδια για κάθε αισθητική.</h2>
            </div>
            <p>
              Συνεργαζόμαστε με μεγάλους προμηθευτές όπως TenCate, DAS και
              Calbari. Η τελική επιλογή γίνεται με φυσικό δείγμα, ώστε να
              αξιολογούνται σωστά η απόχρωση, η ύφανση και η διαπερατότητα.
            </p>
          </div>

          <div className="supplier-grid">
            {fabricSuppliers.map((supplier) => (
              <a
                className="supplier-card"
                href={supplier.url}
                key={supplier.name}
                rel="noreferrer"
                target="_blank"
              >
                <strong>{supplier.name}</strong>
                <p>{supplier.text}</p>
                <span>{supplier.action} <Icon name="arrow" size={17} /></span>
              </a>
            ))}
          </div>

          <div className="swatch-panel">
            <div>
              <h3>Ενδεικτικά σχέδια και κωδικοί</h3>
              <p>
                Επιλεγμένες αναφορές από τους ηλεκτρονικούς καταλόγους των
                προμηθευτών. Πατήστε σε ένα δείγμα για να δείτε τη συλλογή του.
              </p>
            </div>
            <div className="swatch-grid">
              {fabricSwatches.map((swatch) => (
                <a
                  className="swatch"
                  href={swatch.url}
                  key={`${swatch.supplier}-${swatch.code}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span
                    aria-hidden="true"
                    className="swatch-preview"
                    style={
                      swatch.image
                        ? { backgroundImage: `url("${swatch.image}")` }
                        : { background: swatch.value }
                    }
                  />
                  <span className="swatch-copy">
                    <small>{swatch.supplier}</small>
                    <strong>{swatch.name}</strong>
                    <em>Κωδικός {swatch.code} <Icon name="arrow" size={15} /></em>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="automation-section section">
        <div className="container automation-grid">
          <div>
            <p className="eyebrow light"><span /> Αυτοματισμοί</p>
            <h2>Άνετη λειτουργία και αυτόματη προστασία.</h2>
            <p>
              Το σωληνωτό μοτέρ τοποθετείται εσωτερικά στον άξονα και μπορεί να
              εφαρμοστεί σε όλα τα κλασσικά συστήματα σκίασης. Επιλέγεται
              ενσύρματη ή ασύρματη λειτουργία, με ή χωρίς χειροκίνηση έκτακτης
              ανάγκης για διακοπή ρεύματος.
            </p>
            <a
              className="button button-outline"
              href="https://www.somfy.gr/"
              rel="noreferrer"
              target="_blank"
            >
              Δείτε τις λύσεις Somfy <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="automation-features">
            <article>
              <span>01</span>
              <h3>Ενσύρματα ή ασύρματα</h3>
              <p>Διακόπτης, τηλεχειρισμός ή συνδυασμός με σύστημα έξυπνου σπιτιού.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Χειροκίνηση ανάγκης</h3>
              <p>Προαιρετική λειτουργία για χρήση της τέντας ακόμη και σε διακοπή ρεύματος.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Αισθητήρας ήλιου</h3>
              <p>Αυτόματη ανάπτυξη της σκίασης όταν η ένταση της ηλιοφάνειας αυξάνεται.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Αισθητήρας αέρα</h3>
              <p>Αυτόματο μάζεμα για προστασία της κατασκευής όταν εντοπιστούν ισχυρές ριπές.</p>
            </article>
          </div>
        </div>
      </section>
      <DetailCta />
    </main>
  );
}

function CassettePage() {
  const cassetteColors = [
    { name: "RAL 9010", value: "#f3f0e7" },
    { name: "RAL 9016", value: "#efefeb" },
    { name: "RAL 1013", value: "#ddd4bc" },
    { name: "RAL 1019", value: "#9a8675" },
    { name: "RAL 7040", value: "#8b9194" },
    { name: "RAL 7016", value: "#353a3d" },
    { name: "RAL 8017", value: "#44302a" },
    { name: "RAL 9005", value: "#171719" },
  ];

  return (
    <main className="detail-main">
      <DetailHero
        className="cassette-hero"
        ctaLabel="Ζητήστε μελέτη του χώρου"
        eyebrow="Κασέτες και κασονέτα"
        image={media.cassette.hero}
        intro="Ολοκληρωμένα συστήματα σκίασης που φυλάσσουν ύφασμα, βραχίονες και μηχανισμό μέσα σε ένα καθαρό, συμπαγές κέλυφος αλουμινίου."
        title="Η τέντα κλείνει. Η κατασκευή προστατεύεται."
      />

      <DetailOverview
        bullets={[
          "Καθαρή εμφάνιση σε κλειστή θέση",
          "Προστασία υφάσματος και εξαρτημάτων",
          "Κατασκευή στις διαστάσεις της πρόσοψης",
        ]}
        description="Σε μία τέντα πλήρους κασετίνας, η μετώπη εφαρμόζει επάνω στο περίβλημα όταν το σύστημα κλείνει. Έτσι το τεντόπανο, οι αρθρωτοί βραχίονες και τα κινούμενα μέρη παραμένουν λιγότερο εκτεθειμένα σε ήλιο, σκόνη και καιρική καταπόνηση."
        eyebrow="Γιατί κασετίνα"
        icon="awning"
        title="Προστασία του μηχανισμού με διακριτική αρχιτεκτονική παρουσία."
      />

      <section className="cassette-mechanism section">
        <div className="container cassette-mechanism-grid">
          <div>
            <p className="eyebrow light"><span /> Πώς λειτουργεί</p>
            <h2>Όλα τα μέρη συγκεντρώνονται μέσα στην κασέτα.</h2>
            <p>
              Με την ανάκληση της τέντας, το ύφασμα τυλίγεται στον άξονα, οι
              βραχίονες διπλώνουν και η εμπρόσθια μετώπη ολοκληρώνει το κλείσιμο
              του κελύφους.
            </p>
          </div>
          <div className="cassette-diagram" aria-label="Σχηματική λειτουργία κασετίνας">
            <div className="cassette-shell">
              <span className="cassette-roll" />
              <span className="cassette-arm arm-one" />
              <span className="cassette-arm arm-two" />
              <span className="cassette-front" />
            </div>
            <div className="cassette-diagram-labels">
              <span>Κέλυφος αλουμινίου</span>
              <span>Άξονας και ύφασμα</span>
              <span>Αρθρωτοί βραχίονες</span>
              <span>Μετώπη κλεισίματος</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cassette-categories section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Κατηγορίες συστημάτων</p>
              <h2>Από μικρό μπαλκόνι έως μεγάλη επαγγελματική πρόσοψη.</h2>
            </div>
            <p>
              Οι διαστάσεις είναι ενδεικτικά μέγιστα από συγκεκριμένες σειρές
              των LAMDA και SEVENSUN. Το κατάλληλο μοντέλο καθορίζεται μετά τη
              μέτρηση και τον έλεγχο της στήριξης.
            </p>
          </div>
          <div className="cassette-category-grid">
            {cassetteCategories.map((category, index) => (
              <article key={category.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{category.metric}</strong>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cassette-specs section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Ενδεικτικά τεχνικά όρια</p>
              <h2>Διαστάσεις και κλίση προσαρμοσμένες στη σειρά.</h2>
            </div>
            <p>
              Κάθε τιμή ισχύει μόνο για το αντίστοιχο μοντέλο και δεν πρέπει να
              μεταφέρεται σε διαφορετικό σύστημα χωρίς τον επίσημο κατάλογο.
            </p>
          </div>
          <div className="cassette-spec-grid">
            <article><strong>5 × 3 m</strong><span>compact κασετίνα LAMDA</span></article>
            <article><strong>7 × 3,2 m</strong><span>ενισχυμένη σειρά LAMDA</span></article>
            <article><strong>7 × 3,5 m</strong><span>LAMDA βαρέως τύπου και SEVENSUN Helios</span></article>
            <article><strong>5°–70°</strong><span>συνολικό εύρος κλίσεων που συναντάται στις επιλεγμένες σειρές</span></article>
          </div>
          <p className="cassette-spec-note">
            Η πραγματική μέγιστη διάσταση επηρεάζεται από την προβολή, τον
            αριθμό βραχιόνων, τη θέση εγκατάστασης, το υπόβαθρο και την
            πιστοποιημένη κλάση του συγκεκριμένου συστήματος.
          </p>
        </div>
      </section>

      <section className="cassette-equipment section">
        <div className="container cassette-equipment-grid">
          <div>
            <p className="eyebrow light"><span /> Κατασκευή και εξοπλισμός</p>
            <h2>Η σωστή κασετίνα είναι συνδυασμός μηχανικής και άνεσης.</h2>
            <p>
              Επιλέγουμε κέλυφος, βραχίονες, μοτέρ, ύφασμα και αυτοματισμούς
              σύμφωνα με το άνοιγμα, τον προσανατολισμό και τη χρήση.
            </p>
            <a className="button button-outline" href={appHref("/epikoinonia")}>
              Συζητήστε τις επιλογές <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="cassette-feature-grid">
            {cassetteFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cassette-installation section">
        <div className="container cassette-installation-grid">
          <div>
            <p className="eyebrow"><span /> Τρόπος τοποθέτησης</p>
            <h2>Στήριξη στον τοίχο ή κάτω από οροφή.</h2>
            <p>
              Οι διαθέσιμες βάσεις και η κλίση εξαρτώνται από τη σειρά. Πριν
              την επιλογή ελέγχονται το σκυρόδεμα ή η τοιχοποιία, η θερμοπρόσοψη,
              οι αποστάσεις από κουφώματα και η ελεύθερη κίνηση των βραχιόνων.
            </p>
            <div className="cassette-install-options">
              <article>
                <span>01</span>
                <h3>Τοποθέτηση σε τοίχο</h3>
                <p>Για προσόψεις με κατάλληλο ύψος και ασφαλές δομικό υπόβαθρο.</p>
              </article>
              <article>
                <span>02</span>
                <h3>Τοποθέτηση σε οροφή</h3>
                <p>Για μπαλκόνια, μαρκίζες και περιπτώσεις όπου απαιτείται ανάρτηση.</p>
              </article>
            </div>
          </div>
          <div className="cassette-colors">
            <h3>Χρώματα κελύφους</h3>
            <p>
              Το λευκό αποτελεί συνήθη βασική επιλογή, ενώ διατίθενται πρόσθετες
              αποχρώσεις RAL ανά κατασκευαστή και παραγγελία.
            </p>
            <div>
              {cassetteColors.map((color) => (
                <span key={color.name}>
                  <i style={{ background: color.value }} />
                  <small>{color.name}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SourcesSection
        intro="Η παρουσίαση συνθέτει κοινές τεχνικές αρχές και ενδεικτικές δυνατότητες. Η τελική επιλογή γίνεται βάσει του επίσημου τεχνικού καταλόγου της διαθέσιμης σειράς."
        sources={cassetteSources}
        title="Συστήματα κασετίνας από δύο εξειδικευμένους κατασκευαστές."
      />

      <GallerySection
        images={cassetteGalleryImages}
        intro="Οι εικόνες είναι προσωρινά ενδεικτικές και θα αντικατασταθούν με φωτογραφίες πραγματικών έργων της Κατασκευαστικής Τεντών."
        title="Κασετίνες για σύγχρονες κατοικίες και επαγγελματικούς χώρους."
      />
      <DetailCta />
    </main>
  );
}

function ClassicSystemDetailPage({
  system,
}: {
  system: ClassicSystem;
}) {
  return (
    <main className="detail-main">
      <DetailHero
        className="classic-system-hero"
        ctaLabel="Ζητήστε εκτίμηση"
        eyebrow="Κλασσικά συστήματα σκίασης"
        image={system.image}
        intro={system.summary}
        title={system.title}
      />

      <section className="system-description section">
        <div className="container system-description-grid">
          <div>
            <p className="eyebrow"><span /> Το σύστημα</p>
            <h2>Λειτουργία, αντοχή και επιλογές κατασκευής.</h2>
          </div>
          <div className="system-copy">
            {system.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="system-features section">
        <div className="container">
          <p className="eyebrow light"><span /> Εξαρτήματα και δυνατότητες</p>
          <div className="system-feature-grid">
            {system.features.map((feature, index) => (
              <article key={feature}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{feature}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GallerySection
        eyebrow="Συλλογή φωτογραφιών"
        images={system.gallery}
        intro="Οι φωτογραφίες είναι προσωρινά ενδεικτικές. Η συλλογή θα αντικατασταθεί με πραγματικά έργα της Κατασκευαστικής Τεντών."
        title="Ενδεικτικές εφαρμογές του συστήματος."
      />
      <DetailCta />
    </main>
  );
}

function PergolaPage() {
  return (
    <main className="detail-main">
      <DetailHero
        className="pergola-hero"
        ctaLabel="Ζητήστε μελέτη του χώρου"
        eyebrow="Περγκοτέντες αλουμινίου"
        image={media.pergola.hero}
        intro="Ηλεκτροκίνητες κατασκευές με αναδιπλούμενη οροφή PVC για βεράντες, αυλές και επαγγελματικούς χώρους που χρειάζονται άνεση και προστασία."
        title="Μεγάλη κάλυψη. Ελεγχόμενη σκιά. Καθαρή γραμμή."
      />

      <DetailOverview
        bullets={[
          "Κατασκευή ακριβώς στις διαστάσεις του έργου",
          "Ηλεκτρική λειτουργία και τηλεχειρισμός",
          "Ελεγχόμενη κλίση και απορροή υδάτων",
        ]}
        description="Η περγκοτέντα αποτελεί σύστημα αλουμινίου με κινητό υλικό κάλυψης PVC Blockout. Η οροφή αναπτύσσεται για σκίαση και προστασία από βροχή και συμπτύσσεται όταν θέλουμε περισσότερο φως και ανοιχτό ουρανό. Κάθε εφαρμογή μελετάται σύμφωνα με τις διαστάσεις, τα σημεία στήριξης, την έκθεση και τη χρήση του χώρου."
        eyebrow="Τι είναι η περγκοτέντα"
        icon="pergola"
        title="Η σταθερότητα της πέργκολας με οροφή που ανοίγει."
      />

      <section className="pergola-types section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Τύποι κατασκευής</p>
              <h2>Η σωστή γεωμετρία για κάθε κτίριο.</h2>
            </div>
            <p>
              Η μορφή επιλέγεται αφού ελεγχθούν η στήριξη, η απαιτούμενη
              προβολή, η απορροή και η αρχιτεκτονική του χώρου.
            </p>
          </div>
          <div className="pergola-type-grid">
            {pergolaTypes.map((type, index) => (
              <article className="pergola-type-card" key={type.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="pergola-line-icon" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <h3>{type.title}</h3>
                <p>{type.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pergola-scale section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Κλίμακα και εφαρμογές</p>
              <h2>Από μία οικιακή βεράντα έως μεγάλη επαγγελματική επιφάνεια.</h2>
            </div>
            <p>
              Οι παρακάτω τιμές αποτελούν ενδεικτικές μέγιστες δυνατότητες
              επιλεγμένων σειρών προμηθευτών. Η επιτρεπόμενη διάσταση κάθε έργου
              ορίζεται από το συγκεκριμένο σύστημα και την τεχνική μελέτη.
            </p>
          </div>
          <div className="pergola-scale-grid">
            <article>
              <strong>15 m</strong>
              <span>ενδεικτικό μέγιστο πλάτος άξονα</span>
            </article>
            <article>
              <strong>10 m</strong>
              <span>ενδεικτική μέγιστη προβολή</span>
            </article>
            <article>
              <strong>130 m²</strong>
              <span>κάλυψη σε ειδικά ενισχυμένα συστήματα</span>
            </article>
            <article>
              <strong>UV</strong>
              <span>πιστοποιημένη προστασία ανά επιλεγμένο υλικό</span>
            </article>
          </div>
          <p className="pergola-scale-note">
            Η αντοχή σε άνεμο και βροχή ισχύει πάντοτε μέσα στα πιστοποιημένα
            όρια του κατασκευαστή και προϋποθέτει σωστή χρήση του συστήματος.
          </p>
        </div>
      </section>

      <section className="pergola-equipment section">
        <div className="container pergola-equipment-grid">
          <div>
            <p className="eyebrow light"><span /> Υλικά και εξοπλισμός</p>
            <h2>Μία κατασκευή που ολοκληρώνεται γύρω από τη χρήση σας.</h2>
            <p>
              Από το χρώμα του αλουμινίου και το ύφασμα της οροφής μέχρι τον
              φωτισμό και την πλευρική προστασία, κάθε στοιχείο συνδυάζεται σε
              ένα ενιαίο τεχνικό και αισθητικό αποτέλεσμα.
            </p>
            <a className="button button-outline" href={appHref("/epikoinonia")}>
              Συζητήστε τις επιλογές <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="pergola-feature-grid">
            {pergolaFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pergola-process section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Από τη μέτρηση στην παράδοση</p>
              <h2>Η λεπτομέρεια της μελέτης καθορίζει το αποτέλεσμα.</h2>
            </div>
            <p>
              Δεν επιλέγουμε ένα σύστημα μόνο από την εμφάνιση. Ελέγχουμε το
              κτίριο, τα φορτία, τις κλίσεις και τον τρόπο καθημερινής χρήσης.
            </p>
          </div>
          <div className="pergola-process-grid">
            <article><span>01</span><h3>Αυτοψία</h3><p>Μέτρηση, έλεγχος υποβάθρου και αποτύπωση των πραγματικών περιορισμών.</p></article>
            <article><span>02</span><h3>Επιλογή συστήματος</h3><p>Καθορισμός γεωμετρίας, διατομών, τρόπου στήριξης και τεχνικού υφάσματος.</p></article>
            <article><span>03</span><h3>Κατασκευή</h3><p>Προσαρμογή διαστάσεων, χρώματος, μοτέρ, φωτισμού και πρόσθετου εξοπλισμού.</p></article>
            <article><span>04</span><h3>Τοποθέτηση</h3><p>Εγκατάσταση, ρυθμίσεις κίνησης και απορροής, δοκιμή και οδηγίες χρήσης.</p></article>
          </div>
        </div>
      </section>

      <SourcesSection
        intro="Η παρουσίαση βασίζεται σε διαθέσιμα τεχνικά στοιχεία των παρακάτω εταιρειών. Η τελική πρόταση εξαρτάται από τη διαθεσιμότητα και τις προδιαγραφές του μοντέλου που θα επιλεγεί."
        sources={pergolaSources}
        title="Κατασκευαστές και διαθέσιμες σειρές συστημάτων."
      />

      <GallerySection
        images={pergolaGalleryImages}
        intro="Οι εικόνες είναι προσωρινά ενδεικτικές και θα αντικατασταθούν με φωτογραφίες πραγματικών έργων της Κατασκευαστικής Τεντών."
        title="Περγκοτέντες για κατοικίες και επαγγελματικούς χώρους."
      />
      <DetailCta />
    </main>
  );
}

function BioclimaticPergolaPage() {
  const bioclimaticGallery = media.bioclimatic.gallery;

  return (
    <main className="detail-main">
      <DetailHero
        className="bioclimatic-hero"
        ctaLabel="Ζητήστε μελέτη του χώρου"
        eyebrow="Βιοκλιματικές πέργκολες"
        image={media.bioclimatic.hero}
        intro="Πέργκολες αλουμινίου με κινητές περσίδες που προσαρμόζουν το μικροκλίμα του εξωτερικού χώρου στις συνθήκες κάθε στιγμής."
        title="Ελέγξτε το φως, τον αέρα και τη σκιά."
      />

      <DetailOverview
        bullets={[
          "Συνεχής ρύθμιση φωτός και αερισμού",
          "Ηλεκτρική κίνηση και τηλεχειρισμός",
          "Κατασκευή για οικιακούς και επαγγελματικούς χώρους",
        ]}
        description="Οι περσίδες αλουμινίου περιστρέφονται ώστε να μεταβάλλουν την ποσότητα φυσικού φωτός και αέρα κάτω από την κατασκευή. Σε ανοικτή θέση απομακρύνουν τον θερμό αέρα, ενώ σε κλειστή θέση δημιουργούν προστατευμένη οροφή με οργανωμένη απορροή νερού. Ορισμένα συστήματα προσφέρουν και πλήρη αναδίπλωση των περσίδων."
        eyebrow="Βιοκλιματικός σχεδιασμός"
        icon="pergola"
        title="Μία οροφή που συνεργάζεται με το περιβάλλον."
      />

      <section className="bioclimatic-modes section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Τρεις θέσεις λειτουργίας</p>
              <h2>Από ανοιχτό ουρανό έως πλήρη κάλυψη.</h2>
            </div>
            <p>
              Η πραγματική γωνία περιστροφής και ο τρόπος κλεισίματος
              καθορίζονται από το μοντέλο που θα επιλεγεί.
            </p>
          </div>
          <div className="bioclimatic-mode-grid">
            {bioclimaticModes.map((mode, index) => (
              <article key={mode.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div className="louver-diagram" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((blade) => (
                    <i
                      key={blade}
                      style={{ transform: `rotate(${mode.angle})` }}
                    />
                  ))}
                </div>
                <h3>{mode.title}</h3>
                <p>{mode.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bioclimatic-types section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Διαθέσιμες τεχνολογίες</p>
              <h2>Δεν λειτουργούν όλες οι βιοκλιματικές με τον ίδιο τρόπο.</h2>
            </div>
            <p>
              Η κατάλληλη λύση επιλέγεται σύμφωνα με το επιθυμητό άνοιγμα της
              οροφής, τη στήριξη, την απορροή και τις απαιτήσεις χρήσης.
            </p>
          </div>
          <div className="bioclimatic-type-grid">
            {bioclimaticTypes.map((type, index) => (
              <article key={type.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{type.title}</h3>
                <p>{type.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bioclimatic-scale section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Ενδεικτικές προδιαγραφές</p>
              <h2>Η τελική διάσταση εξαρτάται από το συγκεκριμένο σύστημα.</h2>
            </div>
            <p>
              Τα στοιχεία προέρχονται από επιλεγμένες σειρές των κατασκευαστών
              και δεν αποτελούν κοινή προδιαγραφή για κάθε βιοκλιματική πέργκολα.
            </p>
          </div>
          <div className="bioclimatic-scale-grid">
            <article>
              <strong>135°</strong>
              <span>περιστροφή περσίδας σε επιλεγμένη σειρά MetaForm</span>
            </article>
            <article>
              <strong>5 × 6 m</strong>
              <span>μέγιστη μονάδα του συστήματος NYFAN Aperto</span>
            </article>
            <article>
              <strong>7 × 7 m</strong>
              <span>ενδεικτική μέγιστη μονάδα επιλεγμένης σειράς LAMDA</span>
            </article>
            <article>
              <strong>0–120°</strong>
              <span>εύρος περιστροφής επιλεγμένου συστήματος LAMDA</span>
            </article>
          </div>
          <p className="bioclimatic-scale-note">
            Οι αντοχές σε άνεμο, βροχή ή χιόνι ισχύουν μόνο μέσα στα
            πιστοποιημένα όρια του επιλεγμένου μοντέλου, με την προβλεπόμενη
            τοποθέτηση, συντήρηση και χρήση.
          </p>
        </div>
      </section>

      <section className="bioclimatic-equipment section">
        <div className="container bioclimatic-equipment-grid">
          <div>
            <p className="eyebrow light"><span /> Λειτουργία και εξοπλισμός</p>
            <h2>Άνεση όλη την ημέρα, με μία ενιαία κατασκευή.</h2>
            <p>
              Η βιοκλιματική πέργκολα μπορεί να εξελιχθεί σε ολοκληρωμένο
              εξωτερικό χώρο, με φωτισμό, αυτοματισμούς και περιμετρική προστασία.
            </p>
            <a className="button button-outline" href={appHref("/epikoinonia")}>
              Συζητήστε τις δυνατότητες <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="bioclimatic-feature-grid">
            {bioclimaticFeatures.map((feature, index) => (
              <article key={feature.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bioclimatic-config section">
        <div className="container bioclimatic-config-grid">
          <div>
            <p className="eyebrow"><span /> Διαμόρφωση</p>
            <h2>Ενσωμάτωση στο κτίριο ή αυτόνομη κατασκευή.</h2>
            <p>
              Η πέργκολα μπορεί να στηριχθεί στον τοίχο, να σταθεί ανεξάρτητα
              με κολώνες ή να επεκταθεί με περισσότερες μονάδες για μεγαλύτερη
              κάλυψη. Η επιλογή προκύπτει μετά τον έλεγχο του υποβάθρου και των
              πραγματικών φορτίων.
            </p>
            <div className="bioclimatic-config-options">
              <span>Επιτοίχια</span>
              <span>Ελεύθερης στήριξης</span>
              <span>Πολλαπλές μονάδες</span>
              <span>Περιμετρικό κλείσιμο</span>
            </div>
          </div>
          <div className="bioclimatic-colors">
            <h3>Ενδεικτικές αποχρώσεις RAL</h3>
            <p>
              Οι διαθέσιμες αποχρώσεις και τα ειδικά φινιρίσματα εξαρτώνται από
              τον κατασκευαστή και την επιλεγμένη σειρά.
            </p>
            <div>
              {bioclimaticColors.map((color) => (
                <span key={color.name}>
                  <i style={{ background: color.value }} />
                  <small>{color.name}</small>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SourcesSection
        intro="Η παρουσίαση συνθέτει κοινές τεχνικές αρχές και επιλεγμένες δυνατότητες των παρακάτω σειρών. Η τελική πρόταση γίνεται βάσει επίσημου τεχνικού καταλόγου και διαθεσιμότητας."
        sources={bioclimaticSources}
        title="Σειρές και τεχνολογίες από εξειδικευμένους κατασκευαστές."
      />

      <GallerySection
        images={bioclimaticGallery}
        intro="Οι εικόνες είναι προσωρινά ενδεικτικές και θα αντικατασταθούν με φωτογραφίες πραγματικών έργων της Κατασκευαστικής Τεντών."
        title="Σύγχρονοι εξωτερικοί χώροι με ελεγχόμενες περσίδες."
      />
      <DetailCta />
    </main>
  );
}

function ProductDetailPage({
  page,
}: {
  page: ProductPage;
}) {
  return (
    <main className="detail-main">
      <DetailHero
        ctaLabel="Ζητήστε δωρεάν εκτίμηση"
        eyebrow={page.eyebrow}
        image={page.image}
        intro={page.intro}
        title={page.title}
      />

      <DetailOverview
        bullets={[
          "Αυτοψία και ακριβής μέτρηση",
          "Επιλογή κατάλληλων υλικών",
          "Τοποθέτηση και τεχνική υποστήριξη",
        ]}
        description={page.description}
        eyebrow="Η προσέγγισή μας"
        icon={page.icon}
        title="Κατασκευή με βάση τον χώρο και τη χρήση."
      />

      <section className="detail-options section">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Επιλογές</p>
              <h2>Οι βασικές εφαρμογές.</h2>
            </div>
            <p>Η τελική διαμόρφωση καθορίζεται μετά την αυτοψία και τη συζήτηση των αναγκών σας.</p>
          </div>
          <div className="detail-option-grid">
            {page.items.map((item, index) => (
              <article className="detail-option-card" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      {page.sources && (
        <SourcesSection
          intro="Οι αναγραφόμενες διαστάσεις είναι μέγιστα όρια συγκεκριμένων σειρών του προμηθευτή. Η κατάλληλη λύση επιλέγεται μετά από αυτοψία και έλεγχο της θέσης εγκατάστασης."
          sources={page.sources}
          title="Συγκεκριμένα συστήματα και τεχνικά χαρακτηριστικά."
        />
      )}
      <DetailCta />
    </main>
  );
}

function ServicesPage() {
  return (
    <main className="detail-main">
      <DetailHero
        className="services-detail-hero"
        eyebrow="Υπηρεσίες"
        image={media.pages.services}
        intro="Από τη μελέτη και την τοποθέτηση μέχρι την επισκευή και τον καθαρισμό, παραμένουμε το σταθερό σημείο επικοινωνίας σας."
        title="Φροντίδα της κατασκευής σε κάθε στάδιο."
      />
      <section className="service-page-section section">
        <div className="container service-page-grid">
          {services.map((service) => (
            <article className="service-page-card" key={service.number}>
              <span>{service.number}</span>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
              <ul>
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <DetailCta />
    </main>
  );
}

function CompanyPage() {
  return (
    <main className="detail-main">
      <DetailHero
        className="company-detail-hero"
        eyebrow="Η εταιρεία μας"
        image={media.pages.companyHero}
        intro={<>Μία οικογενειακή επιχείρηση με υπεύθυνο τον {business.manager} και περισσότερα από 30 χρόνια τεχνικής εμπειρίας στη σκίαση.</>}
        title="Η εμπειρία περνά από γενιά σε γενιά."
      />
      <section className="about-section section">
        <div className="container about-grid">
          <div className="about-image">
            <MediaImage image={media.pages.companyStory} />
            <div className="experience-badge">
              <strong>30+</strong>
              <span>χρόνια<br />εμπειρίας</span>
            </div>
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span /> Κατασκευαστική Τεντών</p>
            <h2>Πρακτική γνώση, καθαρές λύσεις και προσωπική ευθύνη.</h2>
            <p className="lead">
              Αναλαμβάνουμε κάθε έργο με την ίδια προσοχή, είτε πρόκειται για μία
              τέντα κατοικίας είτε για μία σύνθετη επαγγελματική κατασκευή.
            </p>
            <p>
              Συνδυάζουμε την εμπειρία του τεχνίτη με σύγχρονα συστήματα, υφάσματα
              και αυτοματισμούς. Στόχος μας είναι η κατασκευή να λειτουργεί σωστά,
              να αντέχει και να παραμένει οικονομικά λογική.
            </p>
            <div className="values">
              <div><Icon name="shield" /><span><strong>Αξιοπιστία</strong>Καθαρή πρόταση και σωστή εφαρμογή.</span></div>
              <div><Icon name="spark" /><span><strong>Φροντίδα</strong>Προσοχή στη λεπτομέρεια του χώρου.</span></div>
            </div>
          </div>
        </div>
      </section>
      <DetailCta />
    </main>
  );
}

function ContactPage() {
  return (
    <main className="detail-main contact-page">
      <DetailHero
        className="contact-detail-hero"
        eyebrow="Επικοινωνία"
        image={media.pages.contact}
        intro="Επικοινωνήστε απευθείας μαζί μας ή στείλτε μια πρώτη περιγραφή για να οργανώσουμε αυτοψία στον χώρο."
        title="Πείτε μας τι θέλετε να σκιάσετε."
      />
      <section className="contact-page-section section">
        <div className="container contact-page-grid">
          <div className="contact-page-copy">
            <p className="eyebrow"><span /> Στοιχεία επικοινωνίας</p>
            <h2>Μιλήστε με την ομάδα μας.</h2>
            <p>
              Υπεύθυνος: <strong>{business.manager}</strong>. Εξυπηρετούμε κατοικίες
              και επαγγελματικούς χώρους σε όλη την Αττική και αναλαμβάνουμε έργα
              σε όλη την Ελλάδα.
            </p>
            <ContactDetails />
          </div>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}

function HomePage({
  openFaq,
  setOpenFaq,
}: {
  openFaq: number | null;
  setOpenFaq: (index: number | null) => void;
}) {
  const homeHeroSource = useMediaSource(media.home.hero);
  const homeContactSource = useMediaSource(media.home.contact);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <section className="hero" id="home">
        <div
          className="hero-media"
          aria-hidden="true"
          style={{ backgroundImage: `url("${homeHeroSource}")` }}
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow light">
            <span />
            Οικογενειακή επιχείρηση • 30 χρόνια εμπειρίας • Υπεύθυνος Μιχάλης Παπαδάμ
          </p>
          <h1>
            Σκιά που σχεδιάζεται{" "}
            <br />
            <em>για να ζείτε καλύτερα.</em>
          </h1>
          <p className="hero-lead">
            Κατασκευάζουμε λύσεις σκίασης που ταιριάζουν στον χώρο, στις ανάγκες
            και στην αισθητική σας.
          </p>
          <div className="hero-actions">
            <a className="button button-sun" href={appHref("/epikoinonia")}>
              Ζητήστε δωρεάν εκτίμηση <Icon name="arrow" size={19} />
            </a>
            <button className="text-link light-link" onClick={scrollToProducts}>
              Δείτε τις λύσεις μας <Icon name="arrow" size={18} />
            </button>
          </div>
        </div>
        <div className="hero-proof">
          <div>
            <strong>30+</strong>
            <span>χρόνια εμπειρίας στη σκίαση</span>
          </div>
          <div>
            <strong>Στα μέτρα σας</strong>
            <span>λύσεις για κάθε χώρο</span>
          </div>
          <div>
            <strong>Ποιότητα</strong>
            <span>με λύσεις για κάθε προϋπολογισμό</span>
          </div>
        </div>
      </section>

      <section className="intro-section section">
        <div className="container intro-grid">
          <div>
            <p className="eyebrow"><span /> Γιατί να μας εμπιστευτείτε;</p>
            <h2>
              Πάνω από 30 χρόνια εμπειρίας, προσφέροντας συγκεκριμένες λύσεις στον
              δικό σας εξωτερικό χώρο.
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              Από μια μικρή τέντα μπαλκονιού μέχρι μια ολοκληρωμένη επαγγελματική
              κατασκευή, κάθε έργο ξεκινά με σωστή μέτρηση και τελειώνει με
              προσεγμένη τοποθέτηση.
            </p>
            <ul className="check-list">
              <li><Icon name="check" size={18} /> Επιλεγμένα υλικά και μηχανισμοί</li>
              <li><Icon name="check" size={18} /> Λύσεις για κατοικίες και επιχειρήσεις</li>
              <li><Icon name="check" size={18} /> Υποστήριξη και μετά την εγκατάσταση</li>
            </ul>
          </div>
        </div>
      </section>

      <CoverageBand />

      <section className="products-section section" id="products">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Προϊόντα</p>
              <h2>Μία λύση για κάθε χώρο.</h2>
            </div>
            <p>
              Επιλέξτε κατηγορία για να δείτε περισσότερες πληροφορίες, εφαρμογές
              και δυνατότητες κατασκευής.
            </p>
          </div>

          <div className="product-grid">
            {homeProducts.map((product, index) => (
              <a
                className={`product-card ${index === 0 ? "product-card-featured" : ""}`}
                href={appHref(product.path)}
                key={product.title}
              >
                <MediaImage image={product.image} loading="lazy" />
                <div className="product-overlay" />
                <div className="product-card-content">
                  <div className="product-icon"><Icon name={product.icon} /></div>
                  <span>{product.tag}</span>
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <span className="card-link">
                    Δείτε αναλυτικά <Icon name="arrow" size={18} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="services-section section" id="services">
        <div className="container services-grid">
          <div className="services-intro">
            <p className="eyebrow light"><span /> Υπηρεσίες</p>
            <h2>Μαζί, από την πρώτη μέτρηση μέχρι την επόμενη συντήρηση.</h2>
            <p>
              Δεν παραδίδουμε απλώς ένα προϊόν. Αναλαμβάνουμε τον κύκλο ζωής της
              κατασκευής, με ένα σταθερό σημείο επικοινωνίας.
            </p>
            <a className="button button-outline" href={appHref("/ypiresies")}>
              Δείτε αναλυτικά <Icon name="arrow" size={18} />
            </a>
          </div>
          <div className="service-list">
            {services.map((service) => (
              <article className="service-item" key={service.number}>
                <span>{service.number}</span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="applications-section section" id="applications">
        <div className="container">
          <div className="section-heading centered-heading">
            <p className="eyebrow"><span /> Εφαρμογές</p>
            <h2>Λύσεις που προσαρμόζονται στη ζωή του χώρου.</h2>
            <p>
              Οι εικόνες είναι ενδεικτικές των εφαρμογών που αναλαμβάνουμε.
              Σύντομα η ενότητα θα εμπλουτιστεί με πραγματικά έργα της επιχείρησης.
            </p>
          </div>
          <div className="application-grid">
            {applications.map((application) => (
              <article className="application-card" key={application.title}>
                <MediaImage image={application.image} loading="lazy" />
                <div className="application-caption">
                  <span>{application.subtitle}</span>
                  <h3>{application.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section section" id="about">
        <div className="container about-grid">
          <div className="about-image">
            <MediaImage image={media.home.company} loading="lazy" />
            <div className="experience-badge">
              <strong>30</strong>
              <span>χρόνια<br />εμπειρίας</span>
            </div>
          </div>
          <div className="about-copy">
            <p className="eyebrow"><span /> Η εταιρεία</p>
            <h2>Η εμπειρία περνά από γενιά σε γενιά.</h2>
            <p className="lead">
              Η Κατασκευαστική Τεντών είναι οικογενειακή επιχείρηση με βάση την
              Αττική, με έργα σε όλη την Ελλάδα και πολυετή παρουσία στον χώρο της σκίασης.
            </p>
            <p>
              Συνδυάζουμε την πρακτική γνώση του τεχνίτη με σύγχρονα συστήματα,
              υφάσματα και αυτοματισμούς. Στόχος μας είναι κάθε κατασκευή να
              λειτουργεί σωστά, να αντέχει και να δείχνει δεμένη με το κτίριο.
            </p>
            <div className="values">
              <div><Icon name="shield" /><span><strong>Αξιοπιστία</strong>Καθαρή πρόταση και σωστή εφαρμογή.</span></div>
              <div><Icon name="spark" /><span><strong>Φροντίδα</strong>Προσοχή στη λεπτομέρεια του χώρου.</span></div>
            </div>
            <a className="text-link about-link" href={appHref("/i-etaireia-mas")}>
              Περισσότερα για εμάς <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className="faq-section section">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow"><span /> Συχνές ερωτήσεις</p>
            <h2>Πριν ξεκινήσουμε.</h2>
            <p className="faq-intro">
              Μερικές σύντομες απαντήσεις για τη διαδικασία και τις επιλογές σας.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
                  <button onClick={() => setOpenFaq(isOpen ? null : index)}>
                    <span>{faq.question}</span>
                    <Icon name={isOpen ? "x" : "plus"} size={20} />
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="contact-section"
        id="contact"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(7, 27, 53, 0.98), rgba(7, 27, 53, 0.88)), url("${homeContactSource}")`,
        }}
      >
        <div className="container contact-grid">
          <div className="contact-copy">
            <p className="eyebrow light"><span /> Επικοινωνία</p>
            <h2>Πείτε μας τι θέλετε να σκιάσετε.</h2>
            <p>
              Στείλτε μια πρώτη περιγραφή και θα επικοινωνήσουμε για τις
              λεπτομέρειες, την αυτοψία και τον τρόπο εξυπηρέτησης στην περιοχή σας.
            </p>
            <ContactDetails />
            <a className="text-link light-link" href={appHref("/epikoinonia")}>
              Αναλυτική σελίδα επικοινωνίας <Icon name="arrow" size={18} />
            </a>
          </div>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(() => cleanPath(window.location.pathname));
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      setPath(cleanPath(window.location.pathname));
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", isMenuOpen);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    if (isMenuOpen) document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("menu-is-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = media.home.hero.local;
    preload.setAttribute("fetchpriority", "high");
    document.head.appendChild(preload);

    return () => {
      preload.remove();
    };
  }, []);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target instanceof Element ? event.target : null;
      const link = target?.closest<HTMLAnchorElement>("a[href]");
      const rawHref = link?.getAttribute("href");

      if (!link || !rawHref || !rawHref.startsWith("/") || (link.target && link.target !== "_self")) {
        return;
      }

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      event.preventDefault();
      window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      setPath(cleanPath(url.pathname));
      window.scrollTo(0, 0);
    };

    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  useEffect(() => {
    const classicSystem = classicSystems.find((system) => system.path === path);
    const meta = routeMeta[path] ?? (
      classicSystem
        ? {
            title: classicSystem.title,
            description: classicSystem.summary,
          }
        : routeMeta["/"]
    );
    const title = `${meta.title} | ${business.name}`;
    const canonicalUrl = absoluteSiteUrl(path);
    const imageUrl = absoluteSiteUrl("/images/home/hero.jpg");

    document.title = title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl);
    setMetaAttribute('meta[property="og:title"]', "content", title);
    setMetaAttribute('meta[property="og:description"]', "content", meta.description);
    setMetaAttribute('meta[property="og:url"]', "content", canonicalUrl);
    setMetaAttribute('meta[property="og:image"]', "content", imageUrl);
    setMetaAttribute('meta[name="twitter:title"]', "content", title);
    setMetaAttribute('meta[name="twitter:description"]', "content", meta.description);
    setMetaAttribute('meta[name="twitter:image"]', "content", imageUrl);
  }, [path]);

  const activeProductPage = productPages.find((page) => page.path === path);
  const activeClassicSystem = classicSystems.find((system) => system.path === path);
  const knownPath =
    path === "/" ||
    Boolean(activeProductPage) ||
    Boolean(activeClassicSystem) ||
    path === "/ypiresies" ||
    path === "/i-etaireia-mas" ||
    path === "/epikoinonia";

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href={appHref("/")} aria-label="Αρχική">
            <span className="brand-mark">{business.shortName}</span>
            <span className="brand-copy">
              <strong>Κατασκευαστική</strong>
              <span>Τεντών</span>
            </span>
          </a>
          <div className="header-contact">
            <a
              aria-label={`Καλέστε στο ${business.phones[0]}`}
              href={`tel:+30${business.phones[0]}`}
            >
              <Icon name="phone" size={16} /> {business.phones[0]}
            </a>
            <a className="header-cta" href={appHref("/epikoinonia")}>
              Ζητήστε προσφορά
            </a>
            <button
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
              className="menu-toggle"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              <Icon name={isMenuOpen ? "x" : "menu"} size={21} />
            </button>
          </div>
        </div>
        <nav className="primary-tabs" aria-label="Κύρια πλοήγηση">
          <div className="primary-tabs-inner">
            {navItems.map((item) => (
              <a
                className={
                  path === item.path ||
                  (item.path === "/klassika-systimata-skiasis" &&
                    path.startsWith("/klassika-systimata-skiasis/"))
                    ? "is-active"
                    : ""
                }
                href={appHref(item.path)}
                key={item.path}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
        <div
          className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`}
          id="mobile-menu"
          aria-hidden={!isMenuOpen}
        >
          <button
            aria-label="Κλείσιμο μενού"
            className="mobile-menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
            tabIndex={isMenuOpen ? 0 : -1}
            type="button"
          />
          <nav className="mobile-menu-panel" aria-label="Μενού κινητού">
            <div className="mobile-menu-head">
              <span className="brand-mark">{business.shortName}</span>
              <button
                aria-label="Κλείσιμο μενού"
                className="mobile-menu-close"
                onClick={() => setIsMenuOpen(false)}
                type="button"
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className="mobile-menu-links">
              {navItems.map((item) => (
                <a
                  className={
                    path === item.path ||
                    (item.path === "/klassika-systimata-skiasis" &&
                      path.startsWith("/klassika-systimata-skiasis/"))
                      ? "is-active"
                      : ""
                  }
                  href={appHref(item.path)}
                  key={item.path}
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="mobile-menu-actions">
              <a href={`tel:+30${business.phones[0]}`} tabIndex={isMenuOpen ? 0 : -1}>
                <Icon name="phone" size={17} /> {business.phones[0]}
              </a>
              <a href={appHref("/epikoinonia")} tabIndex={isMenuOpen ? 0 : -1}>
                Ζητήστε προσφορά <Icon name="arrow" size={17} />
              </a>
            </div>
          </nav>
        </div>
      </header>

      {!knownPath && (
        <main className="not-found">
          <div className="container">
            <p className="eyebrow"><span /> 404</p>
            <h1>Η σελίδα δεν βρέθηκε.</h1>
            <a className="button button-primary" href={appHref("/")}>
              Επιστροφή στην αρχική
            </a>
          </div>
        </main>
      )}

      {path === "/" && (
        <HomePage openFaq={openFaq} setOpenFaq={setOpenFaq} />
      )}
      {path === "/klassika-systimata-skiasis" && <ClassicSystemsPage />}
      {path === "/klassika-systimata-skiasis/kasetes-kasoneta" && <CassettePage />}
      {activeClassicSystem &&
        path !== "/klassika-systimata-skiasis/kasetes-kasoneta" && (
        <ClassicSystemDetailPage system={activeClassicSystem} />
      )}
      {path === "/pergkotentes" && <PergolaPage />}
      {path === "/vioklimatikes-pergkoles" && <BioclimaticPergolaPage />}
      {activeProductPage &&
        path !== "/klassika-systimata-skiasis" &&
        path !== "/pergkotentes" &&
        path !== "/vioklimatikes-pergkoles" && (
        <ProductDetailPage page={activeProductPage} />
      )}
      {path === "/ypiresies" && <ServicesPage />}
      {path === "/i-etaireia-mas" && <CompanyPage />}
      {path === "/epikoinonia" && <ContactPage />}

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <span className="brand-mark">{business.shortName}</span>
            <div>
              <strong>{business.name}</strong>
              <span>Λύσεις σκίασης με τεχνική συνέπεια.</span>
            </div>
          </div>
          <div className="footer-links">
            <a href={appHref("/klassika-systimata-skiasis")}>Συστήματα</a>
            <a href={appHref("/ypiresies")}>Υπηρεσίες</a>
            <a href={appHref("/i-etaireia-mas")}>Η εταιρεία</a>
            <a href={appHref("/epikoinonia")}>Επικοινωνία</a>
          </div>
          <div className="footer-contact">
            <div className="footer-phones">
              {business.phones.map((phone) => (
                <a
                  aria-label={`Καλέστε στο ${phone}`}
                  href={`tel:+30${phone}`}
                  key={phone}
                >
                  {phone}
                </a>
              ))}
            </div>
            <a
              aria-label={`Στείλτε email στο ${business.email}`}
              href={`mailto:${business.email}`}
            >
              {business.email}
            </a>
            <div className="footer-social">
              <a href={business.facebookUrl} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={business.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
            <p>© {new Date().getFullYear()} {business.name}</p>
          </div>
        </div>
      </footer>
      <div className="mobile-quick-actions" aria-label="Γρήγορες ενέργειες">
        <a href={`tel:+30${business.phones[0]}`}>
          <Icon name="phone" size={17} /> Κλήση
        </a>
        <a href={appHref("/epikoinonia")}>
          Προσφορά <Icon name="arrow" size={17} />
        </a>
      </div>
    </div>
  );
}
