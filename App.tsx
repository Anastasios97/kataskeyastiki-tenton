import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Album, albums, Photo, projectAlbums } from "./photos";
import { Fabric, FabricSupplier, FabricType, fabricCollections, fabricFamilies, fabrics, fabricSuppliers } from "./fabrics";

const business = {
  name: "Κατασκευαστική Τεντών",
  shortName: "ΚΤ",
  manager: "Μιχάλης Παπαδάμ",
  managerAccusative: "Μιχάλη Παπαδάμ",
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
  | "camera"
  | "grid"
  | "up"
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
  image: Photo;
  icon: IconName;
  items: DetailItem[];
  albums?: Album[];
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
  image: Photo;
  album: Album;
  chooser: {
    shortTitle: string;
    bestFor: string;
    keyBenefit: string;
    decisionHint: string;
    tags: string[];
  };
};

type AdvisorItem = {
  path: string;
  title: string;
  shortTitle: string;
  image: Photo;
  bestFor: string;
  keyBenefit: string;
  decisionHint: string;
  tags: string[];
  features: string[];
};

type AdvisorQuizQuestion = {
  id: string;
  question: string;
  options: {
    label: string;
    text: string;
    itemPath: string;
  }[];
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
    camera: (
      <>
        <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13.5" r="3.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>
    ),
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
    up: <path d="m6 15 6-6 6 6" />,
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

function MediaImage({
  image,
  alt = image.alt,
  className,
  loading,
  priority = false,
  sizes = "(max-width: 680px) 100vw, 50vw",
}: {
  image: Photo;
  alt?: string;
  className?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
  sizes?: string;
}) {
  const hasVariants = image.thumb !== image.src;

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      loading={loading}
      sizes={hasVariants ? sizes : undefined}
      src={image.thumb}
      srcSet={hasVariants ? `${image.thumb} 900w, ${image.src} 2000w` : undefined}
    />
  );
}

function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;
    document.body.classList.add("menu-is-open");
    return () => document.body.classList.remove("menu-is-open");
  }, [isLocked]);
}

function Lightbox({
  photos,
  index,
  title,
  onClose,
  onChange,
}: {
  photos: Photo[];
  index: number;
  title: string;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const touchStart = useRef<number | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const total = photos.length;
  const photo = photos[index];

  const go = useCallback(
    (step: number) => onChange((index + step + total) % total),
    [index, onChange, total],
  );

  useBodyScrollLock(true);

  useEffect(() => {
    closeButton.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [go, onClose]);

  useEffect(() => {
    // Προφόρτωση της επόμενης φωτογραφίας για άμεση εναλλαγή.
    if (total < 2) return;
    const next = new Image();
    next.src = photos[(index + 1) % total].src;
  }, [index, photos, total]);

  return (
    <div
      aria-label={`${title}: φωτογραφία ${index + 1} από ${total}`}
      aria-modal="true"
      className="lightbox"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchEnd={(event) => {
        if (touchStart.current === null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
        touchStart.current = null;
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0].clientX;
      }}
      role="dialog"
    >
      <div className="lightbox-top">
        <span className="lightbox-title">{title}</span>
        <span className="lightbox-count">
          {index + 1} / {total}
        </span>
        <button aria-label="Κλείσιμο" className="lightbox-close" onClick={onClose} ref={closeButton} type="button">
          <Icon name="x" size={22} />
        </button>
      </div>
      <figure className="lightbox-stage" key={photo.src}>
        <img alt={photo.alt} src={photo.src} />
      </figure>
      {total > 1 && (
        <>
          <button aria-label="Προηγούμενη φωτογραφία" className="lightbox-nav lightbox-prev" onClick={() => go(-1)} type="button">
            <Icon name="arrow" size={26} />
          </button>
          <button aria-label="Επόμενη φωτογραφία" className="lightbox-nav lightbox-next" onClick={() => go(1)} type="button">
            <Icon name="arrow" size={26} />
          </button>
          <div className="lightbox-thumbs">
            {photos.map((item, thumbIndex) => (
              <button
                aria-label={`Φωτογραφία ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={thumbIndex === index ? "is-active" : ""}
                key={item.src}
                onClick={() => onChange(thumbIndex)}
                type="button"
              >
                <img alt="" loading="lazy" src={item.thumb} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DetailHero({
  image,
  eyebrow,
  title,
  intro,
  className = "",
  ctaLabel,
  photoCount = 0,
}: {
  image: Photo;
  eyebrow: string;
  title: string;
  intro: ReactNode;
  className?: string;
  ctaLabel?: string;
  photoCount?: number;
}) {
  return (
    <section
      className={`detail-hero ${className}`.trim()}
      style={{ backgroundImage: `url("${image.src}")` }}
    >
      <div className="detail-hero-shade" />
      <div className="container detail-hero-content">
        <p className="eyebrow light"><span /> {eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
        {(ctaLabel || photoCount > 0) && (
          <div className="hero-actions">
            {ctaLabel && (
              <a className="button button-sun" href={appHref("/epikoinonia")}>
                {ctaLabel} <Icon name="arrow" size={19} />
              </a>
            )}
            {photoCount > 0 && (
              <a className="button button-glass" href="#fotografies">
                <Icon name="camera" size={19} /> {photoCountLabel(photoCount)}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PlainDetailHero({
  eyebrow,
  title,
  intro,
  className = "",
  ctaLabel,
}: {
  eyebrow: string;
  title: string;
  intro: ReactNode;
  className?: string;
  ctaLabel?: string;
}) {
  return (
    <section className={`plain-detail-hero ${className}`.trim()}>
      <div className="container plain-detail-hero-content">
        <p className="eyebrow"><span /> {eyebrow}</p>
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

const GALLERY_PREVIEW = 9;

function photoCountLabel(count: number) {
  return count === 1 ? "1 φωτογραφία" : `${count} φωτογραφίες`;
}

/**
 * Γκαλερί που προσαρμόζει τη διάταξη στον αριθμό των φωτογραφιών:
 * 1 φωτογραφία = πλατιά, 2 = δίπλα δίπλα, 3+ = μωσαϊκό με την πρώτη μεγάλη.
 */
function PhotoGallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? photos : photos.slice(0, GALLERY_PREVIEW);
  const layout = photos.length >= 5 ? "many" : String(photos.length);

  if (photos.length === 0) return null;

  return (
    <>
      <div className={`photo-grid photo-grid--${layout}`}>
        {visible.map((photo, index) => (
          <button
            aria-label={`Μεγέθυνση: ${photo.alt}`}
            className="photo-tile"
            key={photo.src}
            onClick={() => setOpenIndex(index)}
            type="button"
          >
            <MediaImage
              image={photo}
              loading="lazy"
              sizes={index === 0 ? "(max-width: 680px) 100vw, 66vw" : "(max-width: 680px) 50vw, 33vw"}
            />
            <span className="photo-tile-zoom" aria-hidden="true">
              <Icon name="plus" size={20} />
            </span>
          </button>
        ))}
      </div>
      {photos.length > GALLERY_PREVIEW && (
        <button className="button button-ghost gallery-more" onClick={() => setShowAll((value) => !value)} type="button">
          {showAll ? "Λιγότερες φωτογραφίες" : `Δείτε όλες τις φωτογραφίες (${photos.length})`}
        </button>
      )}
      {openIndex !== null && (
        <Lightbox
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          photos={photos}
          title={title}
        />
      )}
    </>
  );
}

function GallerySection({
  eyebrow = "Φωτογραφίες έργων",
  title,
  intro = "Πατήστε σε μία φωτογραφία για μεγέθυνση. Με τα βελάκια ή με σύρσιμο περνάτε στην επόμενη.",
  album,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  album: Album;
}) {
  if (album.photos.length === 0) return null;

  return (
    <section className="system-gallery section" id="fotografies">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> {eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div className="gallery-heading-meta">
            <span className="photo-count-pill">{photoCountLabel(album.photos.length)}</span>
            <p>{intro}</p>
          </div>
        </div>
        <PhotoGallery photos={album.photos} title={album.title} />
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
  { label: "Κλασικά συστήματα σκίασης", path: "/klassika-systimata-skiasis" },
  { label: "Περγκοτέντες", path: "/pergkotentes" },
  { label: "Βιοκλιματικές πέργκολες", path: "/vioklimatikes-pergkoles" },
  { label: "Άλλα συστήματα σκίασης", path: "/alla-systimata-skiasis" },
  { label: "Υφάσματα & χρώματα", path: "/yfasmata-xromata" },
  { label: "Έργα μας", path: "/erga" },
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
    title: "Κλασικά συστήματα σκίασης",
    description:
      "Τέντες με αντιρίδες, σπαστούς βραχίονες, κασέτες, monoblock, καποτίνες και κάθετα συστήματα ZIP, με σύγκριση, υφάσματα και αυτοματισμούς.",
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
      "Συστήματα με τζάμια (UP/DOWN, γκιλοτίνα, επάλληλα), ομπρέλες, εφελκυόμενα πανιά, στέγαστρα parking και ειδικές κατασκευές.",
  },
  "/yfasmata-xromata": {
    title: "Υφάσματα & χρώματα τεντών",
    description:
      "Όλα τα χρώματα και σχέδια τεντόπανων TenCate, DAS Awning και Calbari: μονόχρωμα, block out, εμπριμέ, ριγέ και ομπρελόπανα, με φίλτρα και κωδικούς.",
  },
  "/erga": {
    title: "Έργα μας",
    description:
      "Φωτογραφίες από τέντες, περγκοτέντες, βιοκλιματικές πέργκολες και συστήματα σκίασης της Κατασκευαστικής Τεντών.",
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
    eyebrow: "Κλασικά συστήματα σκίασης",
    title: "Δοκιμασμένες λύσεις σκίασης για κάθε άνοιγμα.",
    intro:
      "Τέντες και μηχανισμοί που προσαρμόζονται στις διαστάσεις, στη χρήση και στην αισθητική του χώρου.",
    description:
      "Μελετάμε τον προσανατολισμό, την έκθεση στον αέρα και τις ανάγκες καθημερινής χρήσης πριν επιλέξουμε μηχανισμό, πανί και τρόπο στήριξης. Έτσι η κατασκευή λειτουργεί σωστά και παραμένει πρακτική στον χρόνο.",
    image: albums.classic.cover,
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
    image: albums.pergola.cover,
    icon: "pergola",
    items: [
      {
        title: "Κλασική περγκοτέντα",
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
    image: albums.bioclimatic.cover,
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
    title: "Εξειδικευμένες επιλογές πέρα από την κλασική τέντα.",
    intro:
      "Ομπρέλες, σκίαση οχημάτων, ανεμοθραύστες και ειδικά συστήματα για οικιακές και επαγγελματικές ανάγκες.",
    description:
      "Όταν ο χώρος απαιτεί διαφορετική προσέγγιση, επιλέγουμε τη λύση που καλύπτει τη χρήση χωρίς περιττούς συμβιβασμούς. Στα συστήματα πλευρικής προστασίας εξετάζονται ιδιαίτερα η ανεμοπίεση, η ασφαλής στήριξη, οι διαστάσεις και ο τρόπος λειτουργίας.",
    image: albums.umbrellas.cover,
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
    albums: [albums.umbrellas, albums.parking, albums.windbreakers, albums.special],
    sources: [
      {
        name: "LAMDA • Συστήματα με τζάμια",
        text: "Τεχνικά στοιχεία για ανεμοθραύστες UP/DOWN, ηλεκτροκίνητα συστήματα Guillotine και επάλληλα τζάμια.",
        url: "https://lamda.com.gr/sistimata-me-tzamia/",
      },
    ],
  },
];

type PergolaShape = "sloped" | "flat" | "curved" | "hanging" | "large" | "existing";

const pergolaTypes: {
  title: string;
  shape: PergolaShape;
  text: string;
  bestFor: string;
  keyBenefit: string;
  tags: string[];
}[] = [
  {
    title: "Με κλίση",
    shape: "sloped",
    text: "Η κλασική περγκοτέντα αλουμινίου με προκαθορισμένη κλίση, για σωστό τέντωμα του PVC και οργανωμένη απορροή της βροχής.",
    bestFor: "Βεράντες και αυλές όπου χρειάζεται καθαρή απορροή νερού.",
    keyBenefit: "Σταθερή λειτουργία, απλή γεωμετρία και αξιόπιστη κάλυψη.",
    tags: ["Κλασική επιλογή", "Απορροή", "Καθημερινή χρήση"],
  },
  {
    title: "Επίπεδη, χωρίς εμφανή κλίση",
    shape: "flat",
    text: "Καμπυλωτές δοκοί και περιμετρική υδρορροή απομακρύνουν το νερό, ενώ η όψη μένει οριζόντια και λιτή.",
    bestFor: "Σύγχρονες κατοικίες και επαγγελματικές όψεις.",
    keyBenefit: "Minimal αποτέλεσμα και εύκολη προσθήκη ZIP ή τζαμιών περιμετρικά.",
    tags: ["Minimal", "Σύγχρονη όψη", "Καθαρή γραμμή"],
  },
  {
    title: "Καμπυλωτή",
    shape: "curved",
    text: "Τοξωτή οροφή για ιδιαίτερες αρχιτεκτονικές απαιτήσεις, με πιο ανάλαφρη τελική μορφή.",
    bestFor: "Χώρους με ιδιαίτερη αρχιτεκτονική ή πιο μαλακή τελική μορφή.",
    keyBenefit: "Δίνει χαρακτήρα και βοηθά όταν η ευθεία γραμμή δεν ταιριάζει.",
    tags: ["Τοξωτή", "Αρχιτεκτονική", "Ειδική μορφή"],
  },
  {
    title: "Κρεμαστή",
    shape: "hanging",
    text: "Αναρτάται σε τοίχο ή μαρκίζα με διακριτικές ντίζες, χωρίς εμπρόσθιες κολώνες, όταν το υπόβαθρο επιτρέπει ασφαλή στήριξη.",
    bestFor: "Χώρους όπου θέλουμε να μείνει ελεύθερη η μπροστινή πλευρά.",
    keyBenefit: "Ανεμπόδιστη θέα και κίνηση, χωρίς κολώνες στο δάπεδο.",
    tags: ["Χωρίς κολώνες", "Ελεύθερη θέα", "Τεχνικός έλεγχος"],
  },
  {
    title: "Μεγάλων επιφανειών",
    shape: "large",
    text: "Οδηγοί βαρέως τύπου καλύπτουν με ένα σύστημα έως περίπου 150 m², για εστίαση, ξενοδοχεία και μεγάλες αυλές.",
    bestFor: "Επαγγελματικούς χώρους, μεγάλες αυλές και εκτεταμένες βεράντες.",
    keyBenefit: "Μεγάλη σκιαζόμενη επιφάνεια με ενισχυμένη κατασκευή.",
    tags: ["Μεγάλη κάλυψη", "Ενισχυμένη", "Επαγγελματική χρήση"],
  },
  {
    title: "Σε υπάρχουσα κατασκευή",
    shape: "existing",
    text: "Το κινητό σύστημα σκίασης μπορεί, μετά από τεχνικό έλεγχο, να εφαρμοστεί επάνω σε κατάλληλη μεταλλική ή ξύλινη υποδομή.",
    bestFor: "Χώρους που έχουν ήδη μεταλλική ή ξύλινη υποδομή.",
    keyBenefit: "Αξιοποιεί υπάρχουσα κατασκευή όταν είναι ασφαλής και κατάλληλη.",
    tags: ["Υπάρχουσα βάση", "Προσαρμογή", "Έλεγχος στήριξης"],
  },
];

/** Σχηματική πλάγια όψη για κάθε τύπο περγκοτέντας. */
function PergolaShapeIcon({ shape }: { shape: PergolaShape }) {
  const drawings: Record<PergolaShape, ReactNode> = {
    sloped: (
      <>
        <path d="M6 4v34M58 18v20M6 10l52 8" />
        <path className="accent" d="M10 11.5l44 6.8" />
      </>
    ),
    flat: (
      <>
        <path d="M6 4v34M58 14v24M6 14h52" />
        <path className="accent" d="M10 17q22 4 44 0" />
      </>
    ),
    curved: (
      <>
        <path d="M6 4v34M58 18v20" />
        <path d="M6 12q26-10 52 6" />
        <path className="accent" d="M10 14q22-7 44 5" />
      </>
    ),
    hanging: (
      <>
        <path d="M6 4v34M6 12l52 6M6 4l52 14" />
        <path className="accent" d="M10 13.5l44 5" />
      </>
    ),
    large: (
      <>
        <path d="M4 12h56M8 12v26M32 12v26M56 12v26" />
        <path className="accent" d="M8 15h48" />
      </>
    ),
    existing: (
      <>
        <path d="M8 12v26M56 12v26M4 12h56" strokeDasharray="3 3" />
        <path className="accent" d="M8 9h48" />
      </>
    ),
  };

  return (
    <svg aria-hidden="true" className="pergola-shape" fill="none" viewBox="0 0 64 42">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">
        {drawings[shape]}
      </g>
    </svg>
  );
}

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
    text: "Οι περσίδες αλουμινίου αλλάζουν γωνία έως 120°–135°, για ακριβή έλεγχο της σκιάς και του φυσικού αερισμού. Όταν κλείνουν, η οροφή γίνεται στεγανή.",
  },
  {
    title: "Περιστρεφόμενες και αναδιπλούμενες",
    text: "Εκτός από την περιστροφή, οι περσίδες μαζεύονται στη μία πλευρά και η οροφή ανοίγει σχεδόν ολόκληρη για ανοιχτό ουρανό.",
  },
  {
    title: "Σταθερές περσίδες",
    text: "Περσίδες αλουμινίου σε σταθερή, μελετημένη γωνία για μόνιμη σκίαση και φυσικό αερισμό, χωρίς μηχανισμό.",
  },
  {
    title: "Οριζόντιες περσίδες για όψεις",
    text: "Ρυθμιζόμενες περσίδες για όψεις κτιρίων, παράθυρα και τζαμαρίες, που μειώνουν τη θερμική επιβάρυνση και την ανάγκη για κλιματισμό.",
  },
  {
    title: "Μόνωση και στεγανότητα",
    text: "Σε επιλεγμένες σειρές οι περσίδες έχουν θερμική και ηχητική μόνωση, ενώ το νερό οδηγείται στην περιμετρική υδρορροή και μέσα από τις κολώνες.",
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
    title: "Κλασικό σύστημα σκίασης (Αντιρίδα)",
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
    image: albums.antirida.cover,
    album: albums.antirida,
    chooser: {
      shortTitle: "Αντιρίδα",
      bestFor: "Κλασικά μπαλκόνια και σημεία με αέρα.",
      keyBenefit: "Οικονομική και στιβαρή λύση με σταθερούς οδηγούς.",
      decisionHint: "Τη διαλέγετε όταν θέλετε αντοχή, απλή λειτουργία και εύκολη συντήρηση.",
      tags: ["Οικονομική", "Αντοχή στον αέρα", "Κλασική λύση"],
    },
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
    image: albums.arms.cover,
    album: albums.arms,
    chooser: {
      shortTitle: "Σπαστοί βραχίονες",
      bestFor: "Μπαλκόνια και προσόψεις που πρέπει να μένουν ελεύθερα.",
      keyBenefit: "Μεγάλη σκίαση χωρίς μπροστινή στήριξη.",
      decisionHint: "Τη διαλέγετε όταν θέλετε πιο καθαρή όψη και άνετη κίνηση μπροστά από την τέντα.",
      tags: ["Ελεύθερος χώρος", "Σύγχρονη όψη", "Μεγάλο άνοιγμα"],
    },
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
      "Προμηθευτές και επιλογές από LAMDA, SevenSun, MetaForm και άλλους οίκους",
    ],
    image: albums.cassette.cover,
    album: albums.cassette,
    chooser: {
      shortTitle: "Κασέτες",
      bestFor: "Σύγχρονες κατοικίες και εκτεθειμένα σημεία.",
      keyBenefit: "Προστατεύονται πανί, άξονας και βραχίονες όταν μαζεύεται.",
      decisionHint: "Τη διαλέγετε όταν μετράει η εμφάνιση και θέλετε το σύστημα πιο προστατευμένο.",
      tags: ["Κλειστού τύπου", "Προστασία πανιού", "Premium όψη"],
    },
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
    image: albums.monoblock.cover,
    album: albums.monoblock,
    chooser: {
      shortTitle: "Monoblock",
      bestFor: "Μεγάλα ανοίγματα ή δύσκολες επιφάνειες στήριξης.",
      keyBenefit: "Ενιαία μπάρα που μοιράζει καλύτερα τα φορτία.",
      decisionHint: "Το διαλέγετε όταν ο τοίχος ή η πρόσοψη χρειάζεται πιο σίγουρη και ενιαία στήριξη.",
      tags: ["Ενιαία μπάρα", "Μεγάλα ανοίγματα", "Δύσκολη στήριξη"],
    },
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
    image: albums.vertical.cover,
    album: albums.vertical,
    chooser: {
      shortTitle: "Κάθετα",
      bestFor: "Πλαϊνό ή μπροστινό κλείσιμο σε μπαλκόνια και ημιυπαίθριους.",
      keyBenefit: "Προστασία από ήλιο, αέρα και βροχή σε κατακόρυφη κάλυψη.",
      decisionHint: "Το διαλέγετε όταν θέλετε προστασία σαν εξωτερική κουρτίνα ή κάθετο κλείσιμο.",
      tags: ["Κάθετη κάλυψη", "Αέρας & βροχή", "Screen ή ζελατίνα"],
    },
  },
  {
    path: "/klassika-systimata-skiasis/kapotines",
    title: "Τέντες καποτίνες",
    summary:
      "Κλασική καμπυλωτή κατασκευή για παράθυρα, βιτρίνες και εισόδους επαγγελματικών χώρων.",
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
    image: albums.kapotines.cover,
    album: albums.kapotines,
    chooser: {
      shortTitle: "Καποτίνες",
      bestFor: "Παράθυρα, εισόδους, βιτρίνες και μικρότερα ανοίγματα.",
      keyBenefit: "Καμπυλωτή κατασκευή με διαχρονική εμφάνιση και δυνατότητα σήμανσης.",
      decisionHint: "Τη διαλέγετε όταν θέλετε κλασική όψη, προβολή και σκίαση σε συγκεκριμένο άνοιγμα.",
      tags: ["Καμπυλωτή μορφή", "Βιτρίνες", "Σήμανση"],
    },
  },
];

// Συγκριτικά στοιχεία ανά σύστημα. Τα ενδεικτικά όρια προέρχονται από
// σειρές των προμηθευτών (βλ. KATALOGOS-PROMITHEFTON.md).
const classicSystemDetails: Record<
  string,
  { group: "horizontal" | "vertical"; support: string; closed: string; size: string; operation: string }
> = {
  "/klassika-systimata-skiasis/antirida": {
    group: "horizontal",
    support: "Στον τοίχο, με αντιρίδες στηριγμένες στο κάγκελο ή στο στηθαίο.",
    closed: "Το πανί τυλίγεται στον άξονα.",
    size: "Στο πλάτος του μπαλκονιού.",
    operation: "Χειροκίνητη ή με μοτέρ.",
  },
  "/klassika-systimata-skiasis/spastoi-vrachiones": {
    group: "horizontal",
    support: "Μόνο σε τοίχο ή οροφή, χωρίς μπροστινή στήριξη.",
    closed: "Οι βραχίονες διπλώνουν κάτω από τον άξονα.",
    size: "Προβολή έως 3 m, έως 6,25 m με βραχίονες βαρέως τύπου.",
    operation: "Χειροκίνητη ή ηλεκτρική.",
  },
  "/klassika-systimata-skiasis/kasetes-kasoneta": {
    group: "horizontal",
    support: "Σε τοίχο ή οροφή.",
    closed: "Πανί, άξονας και βραχίονες κλείνουν μέσα στην κασέτα.",
    size: "Έως 7 × 3,5 m.",
    operation: "Συνήθως με μοτέρ και τηλεχειρισμό.",
  },
  "/klassika-systimata-skiasis/monoblock": {
    group: "horizontal",
    support: "Ενιαία μπάρα με λίγα σημεία στήριξης στον τοίχο.",
    closed: "Προαιρετικό στέγαστρο αλουμινίου πάνω από το πανί.",
    size: "Έως 8 × 3 m, μεγαλύτερες μετά από μελέτη.",
    operation: "Χειροκίνητη ή με μοτέρ.",
  },
  "/klassika-systimata-skiasis/katheta-systimata": {
    group: "vertical",
    support: "Κουτί επάνω, πλευρικοί οδηγοί ZIP ή συρματόσχοινα.",
    closed: "Το ύφασμα τυλίγεται μέσα στο κουτί.",
    size: "Συστήματα ZIP έως 5 × 3,25 m.",
    operation: "Χειροκίνητη ή ηλεκτρική.",
  },
  "/klassika-systimata-skiasis/kapotines": {
    group: "horizontal",
    support: "Σε τοίχο, πάνω από παράθυρο, είσοδο ή βιτρίνα.",
    closed: "Σταθερή ή ανασυρόμενη, αναδιπλώνεται σαν φυσαρμόνικα.",
    size: "Έως 4,5 × 1,5 m.",
    operation: "Σταθερή ή χειροκίνητη.",
  },
};

const fabricGuideTypes = [
  {
    title: "Ακρυλικά τεντόπανα",
    text: "Η κλασική επιλογή για τέντες μπαλκονιού και κασέτες. Αναπνέουν, κρατούν το χρώμα τους και διατίθενται σε μονόχρωμα, ριγέ και αδιάβροχες εκδόσεις.",
    brands: "Dickson, Tempotest, Docril, Recasens",
    bestFor: "Σπαστοί βραχίονες, κασέτες, αντιρίδες",
  },
  {
    title: "Πολυεστερικά & Block out",
    text: "Τεχνικά υφάσματα με επίστρωση, 100% αδιάβροχα και με σκίαση που φτάνει σχεδόν το 100%. Υπάρχουν μονόχρωμα, εμπριμέ και ψηφιακά τυπωμένα σχέδια.",
    brands: "TenCate, DAS Awning, Calbari",
    bestFor: "Χώροι με έντονη ηλιοφάνεια και βροχή",
  },
  {
    title: "PVC για οροφές",
    text: "Βαρύ αδιαφανές PVC blockout για την κινητή οροφή της περγκοτέντας. Δίνει πλήρη σκίαση και στεγανότητα σε μεγάλες επιφάνειες.",
    brands: "Dickson, NYFAN Blackout",
    bestFor: "Περγκοτέντες",
  },
  {
    title: "Screen & κρυστάλ ζελατίνα",
    text: "Διάτρητα υφάσματα που κόβουν τον ήλιο χωρίς να κρύβουν τη θέα, ή διάφανη ζελατίνα για προστασία από αέρα και βροχή.",
    brands: "Serge Ferrari, NYFAN Screen, Achilles",
    bestFor: "Κάθετα συστήματα και ZIP",
  },
];


const automationFeatures = [
  {
    title: "Μοτέρ ενσύρματο ή ασύρματο",
    text: "Σωληνωτό μοτέρ μέσα στον άξονα, με διακόπτη ή τηλεχειριστήριο ενός ή περισσότερων καναλιών.",
  },
  {
    title: "Χειροκίνηση ανάγκης",
    text: "Προαιρετικός μηχανισμός για να κλείνει η τέντα και σε διακοπή ρεύματος.",
  },
  {
    title: "Αισθητήρες ανέμου και ήλιου",
    text: "Η τέντα μαζεύεται μόνη της στις ριπές και ανοίγει όταν δυναμώνει ο ήλιος.",
  },
  {
    title: "Έλεγχος από το κινητό",
    text: "Σύνδεση με έξυπνο σπίτι μέσω εφαρμογής, μαζί με φωτισμό LED στους βραχίονες ή στην κασέτα.",
  },
];

const partnerBrands = [
  "LAMDA",
  "MetaForm",
  "NYFAN",
  "SevenSun",
  "Floros",
  "Sabbas",
  "Somfy",
  "Dickson",
  "TenCate",
  "Calbari",
  "DAS Awning",
];

const processSteps = [
  {
    title: "Επικοινωνία",
    text: "Μας καλείτε ή στέλνετε το αίτημά σας. Αν έχετε φωτογραφίες ή διαστάσεις του χώρου, βοηθούν από την αρχή.",
  },
  {
    title: "Αυτοψία & μέτρηση",
    text: "Ερχόμαστε στον χώρο, μετράμε και ελέγχουμε στήριξη, προσανατολισμό και έκθεση στον αέρα.",
  },
  {
    title: "Πρόταση & προσφορά",
    text: "Σας προτείνουμε σύστημα, ύφασμα, χρώμα και αυτοματισμούς, με δείγματα και καθαρή προσφορά.",
  },
  {
    title: "Κατασκευή & τοποθέτηση",
    text: "Κατασκευάζουμε στις διαστάσεις σας, τοποθετούμε, ρυθμίζουμε και μένουμε δίπλα σας για τη συντήρηση.",
  },
];

const advisorQuizQuestions: AdvisorQuizQuestion[] = [
  {
    id: "space",
    question: "Πού θα μπει κυρίως η σκίαση;",
    options: [
      {
        label: "Μπαλκόνι με αέρα",
        text: "Θέλω κάτι δοκιμασμένο και στιβαρό.",
        itemPath: "/klassika-systimata-skiasis/antirida",
      },
      {
        label: "Πρόσοψη ή μπαλκόνι χωρίς εμπόδια",
        text: "Θέλω να μένει ελεύθερος ο χώρος μπροστά.",
        itemPath: "/klassika-systimata-skiasis/spastoi-vrachiones",
      },
      {
        label: "Μεγάλη αυλή ή επαγγελματικός χώρος",
        text: "Χρειάζομαι μόνιμη κατασκευή με μεγάλη κάλυψη.",
        itemPath: "/pergkotentes",
      },
      {
        label: "Χώρος υψηλής αισθητικής",
        text: "Θέλω έλεγχο φωτός, αέρα και πιο αρχιτεκτονική λύση.",
        itemPath: "/vioklimatikes-pergkoles",
      },
    ],
  },
  {
    id: "priority",
    question: "Τι είναι πιο σημαντικό για εσάς;",
    options: [
      {
        label: "Οικονομία και αντοχή",
        text: "Να είναι πρακτικό και αξιόπιστο.",
        itemPath: "/klassika-systimata-skiasis/antirida",
      },
      {
        label: "Ελεύθερη κίνηση",
        text: "Να μη χρειάζεται μπροστινή στήριξη.",
        itemPath: "/klassika-systimata-skiasis/spastoi-vrachiones",
      },
      {
        label: "Προστασία όλο τον χρόνο",
        text: "Θέλω σκιά και κάλυψη σε μεγάλη επιφάνεια.",
        itemPath: "/pergkotentes",
      },
      {
        label: "Έλεγχος φωτός και αερισμού",
        text: "Θέλω να ρυθμίζεται το μικροκλίμα του χώρου.",
        itemPath: "/vioklimatikes-pergkoles",
      },
    ],
  },
  {
    id: "look",
    question: "Ποια εικόνα ταιριάζει περισσότερο στον χώρο;",
    options: [
      {
        label: "Κλασική και απλή",
        text: "Θέλω κάτι γνώριμο, πρακτικό και διαχρονικό.",
        itemPath: "/klassika-systimata-skiasis/antirida",
      },
      {
        label: "Καθαρή και μοντέρνα",
        text: "Θέλω πιο σύγχρονη όψη στην πρόσοψη.",
        itemPath: "/klassika-systimata-skiasis/spastoi-vrachiones",
      },
      {
        label: "Σταθερή κατασκευή εξωτερικού χώρου",
        text: "Θέλω να μοιάζει περισσότερο με πέργκολα.",
        itemPath: "/pergkotentes",
      },
      {
        label: "Αρχιτεκτονική πέργκολα με περσίδες",
        text: "Θέλω πιο premium εικόνα και ρυθμιζόμενη οροφή.",
        itemPath: "/vioklimatikes-pergkoles",
      },
    ],
  },
];

const otherSystemGroups: {
  id: string;
  icon: IconName;
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; text: string; spec?: string; icon?: IconName }[];
}[] = [
  {
    id: "tzamia",
    icon: "glass",
    eyebrow: "Συστήματα με τζάμια",
    title: "Κλείστε τη βεράντα χωρίς να χάσετε τη θέα.",
    intro: "Περιμετρικό κλείσιμο για πέργκολες, βεράντες και καταστήματα, με προστασία από αέρα και βροχή.",
    items: [
      {
        title: "Ανεμοθραύστες UP/DOWN",
        text: "Δύο τζάμια με αντίβαρο: το επάνω ανεβοκατεβαίνει εύκολα στο ύψος που θέλετε.",
        spec: "Χειροκίνητοι · έως 3,25 × 2,20 m",
      },
      {
        title: "Τριπλή γκιλοτίνα",
        text: "Ηλεκτροκίνητο σύστημα τριών φύλλων που κινούνται κατακόρυφα. Ιδανικό για καφέ, εστιατόρια και μπαρ.",
        spec: "Με μοτέρ και τηλεχειρισμό · έως 4,50 × 3,00 m",
      },
      {
        title: "Επάλληλα συρόμενα τζάμια",
        text: "Συρόμενα φύλλα για περιμετρικό κλείσιμο, με κλειδαριά και επιλογή υαλοπίνακα: διάφανο, φιμέ, αμμοβολή ή θερμομονωτικό.",
        spec: "Έως 8,00 × 3,00 m",
      },
    ],
  },
  {
    id: "ompreles",
    icon: "umbrella",
    eyebrow: "Ομπρέλες & πανιά σκίασης",
    title: "Σκιά εκεί που δεν μπαίνει τέντα.",
    intro: "Ευέλικτες λύσεις για αυλές, πισίνες, τραπεζοκαθίσματα και ακάλυπτους χώρους.",
    items: [
      {
        title: "Ομπρέλες",
        text: "Επαγγελματικές και οικιακές ομπρέλες μεγάλης κάλυψης, με ανθεκτικό ύφασμα και εύκολο άνοιγμα.",
      },
      {
        title: "Εφελκυόμενα πανιά σκίασης",
        text: "Τεντωμένα τριγωνικά ή τετράγωνα πανιά σε ιστούς ή τοίχους. Μοντέρνα όψη και υψηλή προστασία από την υπεριώδη ακτινοβολία.",
        spec: "Έτοιμα μεγέθη ή κατασκευή στα μέτρα σας",
      },
    ],
  },
  {
    id: "stegastra",
    icon: "parking",
    eyebrow: "Στέγαστρα & ειδικές κατασκευές",
    title: "Λύσεις στα μέτρα του κτιρίου.",
    intro: "Για χώρους που χρειάζονται κάτι πιο ειδικό από ένα τυποποιημένο σύστημα.",
    items: [
      {
        title: "Προστασία οχήματος",
        text: "Στέγαστρα parking με σκελετό και τεχνικό ύφασμα ή PVC, για προστασία από ήλιο, βροχή και καθημερινή φθορά.",
      },
      {
        title: "Ειδικές μεταλλικές κατασκευές",
        icon: "shield",
        text: "Σκελετοί, στηθαία και στέγαστρα προσαρμοσμένα στις ιδιαιτερότητες του κτιρίου.",
      },
      {
        title: "Εκτύπωση και σήμανση",
        icon: "spark",
        text: "Ψηφιακή εκτύπωση λογότυπου ή σχεδίου στο ύφασμα, για καταστήματα και επαγγελματικούς χώρους.",
      },
    ],
  },
];

const homeProducts = [
  {
    title: "Κλασικά συστήματα σκίασης",
    description:
      "Τέντες για μπαλκόνια, βεράντες και προσόψεις, και κάθετη σκίαση για πλαϊνή προστασία.",
    includes: ["Αντιρίδα", "Σπαστοί βραχίονες", "Κασέτες", "Monoblock", "Κάθετα & ZIP", "Καποτίνες"],
    icon: "awning" as IconName,
    image: albums.classic.cover,
    tag: "Σκίαση στα μέτρα σας",
    path: "/klassika-systimata-skiasis",
  },
  {
    title: "Περγκοτέντες",
    description:
      "Σταθερή κατασκευή αλουμινίου με οροφή PVC που ανοίγει και κλείνει.",
    includes: ["Με κλίση", "Επίπεδες", "Καμπυλωτές", "Κρεμαστές", "Μεγάλων επιφανειών"],
    icon: "pergola" as IconName,
    image: albums.pergola.cover,
    tag: "Κάλυψη όλο τον χρόνο",
    path: "/pergkotentes",
  },
  {
    title: "Βιοκλιματικές πέργκολες",
    description:
      "Περσίδες αλουμινίου που ρυθμίζουν φως, αερισμό και προστασία.",
    includes: ["Περιστρεφόμενες", "Αναδιπλούμενες", "Σταθερές περσίδες"],
    icon: "pergola" as IconName,
    image: albums.bioclimatic.cover,
    tag: "Έξυπνη διαχείριση σκίασης",
    path: "/vioklimatikes-pergkoles",
  },
  {
    title: "Ομπρέλες & πανιά σκίασης",
    description:
      "Σκιά για αυλές, πισίνες και τραπεζοκαθίσματα, εκεί που δεν μπαίνει τέντα.",
    includes: ["Ομπρέλες", "Εφελκυόμενα πανιά"],
    icon: "umbrella" as IconName,
    image: albums.umbrellas.cover,
    tag: "Για κάθε εξωτερικό χώρο",
    path: "/alla-systimata-skiasis#ompreles",
  },
  {
    title: "Τζάμια, στέγαστρα & ειδικές κατασκευές",
    description:
      "Περιμετρικό κλείσιμο με τζάμια, στέγαστρα parking και κατασκευές στα μέτρα του κτιρίου.",
    includes: ["UP/DOWN", "Γκιλοτίνα", "Επάλληλα", "Parking"],
    icon: "parking" as IconName,
    image: albums.parking.cover,
    tag: "Ολοκληρωμένες λύσεις",
    path: "/alla-systimata-skiasis#tzamia",
  },
];

const advisorItems: AdvisorItem[] = [
  ...classicSystems.map((system) => ({
    path: system.path,
    title: system.title,
    shortTitle: system.chooser.shortTitle,
    image: system.image,
    bestFor: system.chooser.bestFor,
    keyBenefit: system.chooser.keyBenefit,
    decisionHint: system.chooser.decisionHint,
    tags: system.chooser.tags,
    features: system.features,
  })),
  {
    path: "/pergkotentes",
    title: "Περγκοτέντες",
    shortTitle: "Περγκοτέντα",
    image: albums.pergola.cover,
    bestFor: "Μεγάλες βεράντες, αυλές και επαγγελματικούς χώρους.",
    keyBenefit: "Σταθερή κατασκευή αλουμινίου με κινητή οροφή PVC.",
    decisionHint: "Τη διαλέγετε όταν θέλετε μεγάλη κάλυψη, πιο μόνιμη παρουσία και προστασία σε εξωτερικό χώρο.",
    tags: ["Μεγάλη κάλυψη", "PVC οροφή", "Ηλεκτροκίνηση"],
    features: pergolaFeatures.slice(0, 3).map((feature) => feature.title),
  },
  {
    path: "/vioklimatikes-pergkoles",
    title: "Βιοκλιματικές πέργκολες",
    shortTitle: "Βιοκλιματική",
    image: albums.bioclimatic.cover,
    bestFor: "Χώρους υψηλής αισθητικής που χρειάζονται έλεγχο ήλιου και αέρα.",
    keyBenefit: "Ρυθμιζόμενες περσίδες για σκιά, φυσικό αερισμό και προστασία.",
    decisionHint: "Τη διαλέγετε όταν θέλετε πιο premium κατασκευή και ακριβή ρύθμιση φωτός και μικροκλίματος.",
    tags: ["Περσίδες", "Μικροκλίμα", "Premium λύση"],
    features: bioclimaticFeatures.slice(0, 3).map((feature) => feature.title),
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
      "Προϋπολογισμός πριν από την κατασκευή",
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
    question: "Πόσο κοστίζει μία τέντα ή πέργκολα;",
    answer:
      "Η τιμή εξαρτάται από τις διαστάσεις, το σύστημα, το ύφασμα και τους αυτοματισμούς. Γι' αυτό κάνουμε πρώτα αυτοψία και σας δίνουμε δωρεάν, αναλυτική προσφορά.",
  },
  {
    question: "Τι εγγύηση έχουν τα προϊόντα;",
    answer:
      "Τα συστήματα και τα υφάσματα που χρησιμοποιούμε συνοδεύονται από την εγγύηση του κατασκευαστή τους. Σε ορισμένες σειρές υφασμάτων φτάνει τα 10 χρόνια. Σας ενημερώνουμε για τους όρους κάθε προϊόντος πριν αποφασίσετε.",
  },
  {
    question: "Αναλαμβάνετε επισκευές παλιών τεντών;",
    answer:
      "Ναι. Ελέγχουμε πανί, βραχίονες, στηρίξεις και μηχανισμό και σας ενημερώνουμε αν συμφέρει επισκευή ή αντικατάσταση.",
  },
  {
    question: "Μπορώ να βάλω μοτέρ σε τέντα που ήδη έχω;",
    answer:
      "Στις περισσότερες περιπτώσεις ναι. Ελέγχουμε τον άξονα και τον μηχανισμό και προτείνουμε το κατάλληλο μοτέρ, με τηλεχειρισμό και προαιρετικά αισθητήρες ήλιου ή ανέμου.",
  },
  {
    question: "Μπορώ να επιλέξω πανί και χρώμα;",
    answer:
      "Βεβαίως. Υπάρχουν ακρυλικά, πολυεστερικά block out, PVC και διάτρητα screen υφάσματα, σε μονόχρωμα, ριγέ και εμπριμέ σχέδια. Δείτε όλα τα χρώματα στη σελίδα «Υφάσματα & χρώματα» και φέρνουμε δείγματα στην αυτοψία για να διαλέξετε με σιγουριά.",
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
  const [fabricMessage] = useState(() => fabricPicksMessage(window.location.search));
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
          <option>Κλασικό σύστημα σκίασης</option>
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
          defaultValue={fabricMessage}
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

function SelectionAdvisor() {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [comparedPaths, setComparedPaths] = useState<string[]>([
    "/klassika-systimata-skiasis/spastoi-vrachiones",
    "/pergkotentes",
    "/vioklimatikes-pergkoles",
  ]);
  const [selectedItemPath, setSelectedItemPath] = useState<string>("");
  const [advisorTab, setAdvisorTab] = useState<"quiz" | "all" | "compare">("quiz");
  const answeredCount = Object.keys(quizAnswers).length;

  const quizScores = Object.values(quizAnswers).reduce<Record<string, number>>((scores, itemPath) => {
    scores[itemPath] = (scores[itemPath] ?? 0) + 1;
    return scores;
  }, {});
  const quizRecommendations = advisorItems
    .filter((item) => quizScores[item.path])
    .sort((a, b) => (quizScores[b.path] ?? 0) - (quizScores[a.path] ?? 0))
    .slice(0, 2);
  const selectedItem = advisorItems.find((item) => item.path === selectedItemPath);
  const comparedItems = comparedPaths
    .map((itemPath) => advisorItems.find((item) => item.path === itemPath))
    .filter((item): item is AdvisorItem => Boolean(item));

  function updateQuizAnswer(questionId: string, itemPath: string) {
    setQuizAnswers((current) => ({ ...current, [questionId]: itemPath }));
  }

  function toggleComparedItem(itemPath: string) {
    setComparedPaths((current) => {
      if (current.includes(itemPath)) {
        return current.length === 1 ? current : current.filter((path) => path !== itemPath);
      }

      return [...(current.length >= 3 ? current.slice(1) : current), itemPath];
    });
  }

  return (
    <>
      <section className="advisor-tools classic-quiz section" id="odigos-epilogis" aria-labelledby="advisor-title">
        <div className="container advisor-tools-stack">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Οδηγός επιλογής</p>
              <h2 id="advisor-title">Δείτε μαζί τις βασικές λύσεις και βρείτε από πού να ξεκινήσετε.</h2>
            </div>
            <p>
              Το quiz και η σύγκριση δεν αντικαθιστούν την αυτοψία, αλλά βοηθούν
              να ξεχωρίσετε αν σας ταιριάζει κλασική τέντα, περγκοτέντα ή
              βιοκλιματική πέργκολα.
            </p>
          </div>

          <div className="advisor-tabs" role="tablist" aria-label="Εργαλεία επιλογής">
            {[
              { id: "quiz" as const, label: "Γρήγορο quiz", meta: `${answeredCount}/3` },
              { id: "all" as const, label: "Όλες οι λύσεις", meta: String(advisorItems.length) },
              { id: "compare" as const, label: "Σύγκριση", meta: String(comparedItems.length) },
            ].map((tab) => (
              <button
                aria-selected={advisorTab === tab.id}
                className={advisorTab === tab.id ? "is-active" : ""}
                key={tab.id}
                onClick={() => setAdvisorTab(tab.id)}
                role="tab"
                type="button"
              >
                {tab.label} <small>{tab.meta}</small>
              </button>
            ))}
          </div>

          {advisorTab === "quiz" && (
          <div className="classic-quiz-grid advisor-panel">
            <div className="classic-quiz-intro">
              <p className="eyebrow"><span /> Γρήγορο quiz</p>
              <h3>Απαντήστε σε 3 ερωτήσεις και δείτε την πιο πιθανή κατεύθυνση.</h3>
              <p>
                Μετά επιλέγετε λύσεις για σύγκριση, ώστε να φανούν δίπλα δίπλα
                τα πλεονεκτήματα κάθε συστήματος.
              </p>
            </div>

            <div className="classic-quiz-panel">
              {advisorQuizQuestions.map((question, questionIndex) => (
                <fieldset className="classic-quiz-question" key={question.id}>
                  <legend>
                    <span>{String(questionIndex + 1).padStart(2, "0")}</span>
                    {question.question}
                  </legend>
                  <div className="classic-quiz-options">
                    {question.options.map((option) => {
                      const isSelected = quizAnswers[question.id] === option.itemPath;

                      return (
                        <button
                          className={`classic-quiz-option ${isSelected ? "is-selected" : ""}`}
                          key={`${question.id}-${option.label}`}
                          onClick={() => updateQuizAnswer(question.id, option.itemPath)}
                          type="button"
                        >
                          <strong>{option.label}</strong>
                          <span>{option.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <div className="classic-quiz-result" aria-live="polite">
                <span>Πρόταση</span>
                {quizRecommendations.length > 0 ? (
                  <div className="classic-quiz-result-list">
                    {quizRecommendations.map((item, index) => (
                      <article key={item.path}>
                        <small>{index === 0 ? "Πιο πιθανή επιλογή" : "Εναλλακτική"}</small>
                        <h3>{item.shortTitle}</h3>
                        <p>{item.decisionHint}</p>
                        <div>
                          <button onClick={() => setSelectedItemPath(item.path)} type="button">
                            Επιλογή
                          </button>
                          <a href={appHref(item.path)}>Δείτε τη σελίδα</a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p>Διαλέξτε απαντήσεις για να εμφανιστεί πρόταση συστήματος.</p>
                )}
              </div>
            </div>
          </div>

          )}

          {advisorTab === "all" && (
          <div className="classic-choice-grid advisor-panel" aria-label="Όλες οι βασικές λύσεις σκίασης">
            {advisorItems.map((item, index) => {
              const isCompared = comparedPaths.includes(item.path);
              const isSelected = selectedItemPath === item.path;

              return (
                <article
                  className={`classic-choice-card ${isSelected ? "is-selected" : ""}`}
                  key={item.path}
                >
                  <a className="classic-choice-media" href={appHref(item.path)}>
                    <MediaImage image={item.image} alt={item.image.alt} loading="lazy" />
                    <span className="classic-choice-number">{String(index + 1).padStart(2, "0")}</span>
                  </a>
                  <div className="classic-choice-body">
                    <span className="classic-choice-kicker">{item.shortTitle}</span>
                    <h3>{item.title}</h3>
                    <p>{item.decisionHint}</p>
                    <dl className="classic-choice-facts">
                      <div>
                        <dt>Ιδανικό για</dt>
                        <dd>{item.bestFor}</dd>
                      </div>
                      <div>
                        <dt>Κερδίζετε</dt>
                        <dd>{item.keyBenefit}</dd>
                      </div>
                    </dl>
                    <div className="classic-choice-tags" aria-label="Χαρακτηριστικά">
                      {item.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                    <div className="classic-choice-actions">
                      <button
                        className="classic-choice-select"
                        onClick={() => setSelectedItemPath(item.path)}
                        type="button"
                      >
                        Επιλογή
                      </button>
                      <button
                        className={`classic-choice-compare ${isCompared ? "is-active" : ""}`}
                        onClick={() => toggleComparedItem(item.path)}
                        type="button"
                      >
                        {isCompared ? "Στη σύγκριση" : "Σύγκριση"}
                      </button>
                    </div>
                    <a className="classic-choice-link" href={appHref(item.path)}>
                      Δείτε αναλυτικά <Icon name="arrow" size={17} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          )}

          {advisorTab === "compare" && (
          <div className="classic-compare advisor-compare advisor-panel" aria-labelledby="advisor-compare-title">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow"><span /> Σύγκριση</p>
                <h2 id="advisor-compare-title">Συγκρίνετε μέχρι 3 λύσεις πριν αποφασίσετε.</h2>
              </div>
              <p>
                Πατήστε «Σύγκριση» στις κάρτες για να αλλάξετε τις επιλογές. Η
                σύγκριση κρατά τα στοιχεία που βοηθούν περισσότερο στην πρώτη απόφαση.
              </p>
            </div>

            <div className="classic-compare-grid">
              {comparedItems.map((item) => (
                <article className="classic-compare-card" key={item.path}>
                  <div className="classic-compare-head">
                    <span>{item.shortTitle}</span>
                    <button
                      disabled={comparedItems.length === 1}
                      onClick={() => toggleComparedItem(item.path)}
                      type="button"
                    >
                      Αφαίρεση
                    </button>
                  </div>
                  <h3>{item.title}</h3>
                  <dl>
                    <div>
                      <dt>Ιδανικό για</dt>
                      <dd>{item.bestFor}</dd>
                    </div>
                    <div>
                      <dt>Κερδίζετε</dt>
                      <dd>{item.keyBenefit}</dd>
                    </div>
                    <div>
                      <dt>Δυνατότητες</dt>
                      <dd>{item.features.slice(0, 2).join(" • ")}</dd>
                    </div>
                  </dl>
                  <button
                    className="classic-compare-select"
                    onClick={() => setSelectedItemPath(item.path)}
                    type="button"
                  >
                    Επιλογή αυτού <Icon name="arrow" size={17} />
                  </button>
                </article>
              ))}
            </div>
            <button className="button button-ghost advisor-add" onClick={() => setAdvisorTab("all")} type="button">
              Αλλαγή λύσεων προς σύγκριση
            </button>
          </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <aside className="classic-sticky-choice" aria-live="polite">
          <div>
            <span>Επιλέξατε</span>
            <strong>{selectedItem.shortTitle}</strong>
            <p>{selectedItem.keyBenefit}</p>
          </div>
          <div className="classic-sticky-actions">
            <a href={appHref("/epikoinonia")}>Ζητήστε προσφορά</a>
            <a href={appHref(selectedItem.path)}>Λεπτομέρειες</a>
            <button
              aria-label="Κλείσιμο επιλογής"
              onClick={() => setSelectedItemPath("")}
              type="button"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

function ClassicChoiceCard({ system, index }: { system: ClassicSystem; index: number }) {
  const details = classicSystemDetails[system.path];

  return (
    <article className="classic-choice-card">
      <a className="classic-choice-media" href={appHref(system.path)}>
        <MediaImage
          image={system.image}
          alt={system.image.alt}
          loading="lazy"
        />
        <span className="classic-choice-number">{String(index + 1).padStart(2, "0")}</span>
      </a>
      <div className="classic-choice-body">
        <span className="classic-choice-kicker">{system.chooser.shortTitle}</span>
        <h3>{system.title}</h3>
        <p>{system.chooser.decisionHint}</p>
        <dl className="classic-choice-facts">
          <div>
            <dt>Ιδανικό για</dt>
            <dd>{system.chooser.bestFor}</dd>
          </div>
          <div>
            <dt>Κερδίζετε</dt>
            <dd>{system.chooser.keyBenefit}</dd>
          </div>
          {details && (
            <div>
              <dt>Ενδεικτικό μέγεθος</dt>
              <dd>{details.size}</dd>
            </div>
          )}
        </dl>
        <div className="classic-choice-tags" aria-label="Χαρακτηριστικά">
          {system.chooser.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <a className="classic-choice-link" href={appHref(system.path)}>
          Δείτε αναλυτικά <Icon name="arrow" size={17} />
        </a>
      </div>
    </article>
  );
}

function ClassicCompareTable() {
  return (
    <section className="compare-table-section section" id="sygkrisi">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> Σύγκριση με μια ματιά</p>
            <h2>Ποια τέντα ταιριάζει στο δικό σας άνοιγμα;</h2>
          </div>
          <p>
            Τα βασικά σημεία κάθε συστήματος δίπλα δίπλα. Τα μεγέθη είναι
            ενδεικτικά μέγιστα των σειρών που χρησιμοποιούμε· το τελικό
            ορίζεται στην αυτοψία.
          </p>
        </div>
        <div className="compare-table-wrap" role="region" aria-label="Σύγκριση κλασικών συστημάτων" tabIndex={0}>
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col">Σύστημα</th>
                <th scope="col">Ιδανικό για</th>
                <th scope="col">Στήριξη</th>
                <th scope="col">Όταν κλείνει</th>
                <th scope="col">Ενδεικτικό μέγεθος</th>
              </tr>
            </thead>
            <tbody>
              {classicSystems.map((system) => {
                const details = classicSystemDetails[system.path];
                return (
                  <tr key={system.path}>
                    <th scope="row">
                      <a href={appHref(system.path)}>{system.chooser.shortTitle}</a>
                    </th>
                    <td>{system.chooser.bestFor}</td>
                    <td>{details?.support}</td>
                    <td>{details?.closed}</td>
                    <td>{details?.size}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function FabricGuide() {
  return (
    <section className="fabrics-section section" id="yfasmata">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> Είδος και χρώμα πανιών</p>
            <h2>Το σωστό ύφασμα κάνει τη μισή δουλειά.</h2>
          </div>
          <p>
            Διαλέγουμε μαζί το ύφασμα με φυσικό δείγμα στην αυτοψία, ώστε να
            δείτε σωστά απόχρωση, ύφανση και πόσο φως περνά. Πολλές σειρές
            συνοδεύονται από εγγύηση του κατασκευαστή έως 10 ετών.
          </p>
        </div>

        <div className="fabric-type-grid">
          {fabricGuideTypes.map((type, index) => (
            <article className="fabric-type-card" key={type.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{type.title}</h3>
              <p>{type.text}</p>
              <dl>
                <div>
                  <dt>Για</dt>
                  <dd>{type.bestFor}</dd>
                </div>
                <div>
                  <dt>Οίκοι</dt>
                  <dd>{type.brands}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <div className="supplier-row">
          <strong>Δείτε όλα τα χρώματα και σχέδια ({fabrics.length}) με κωδικούς, σε μία σελίδα.</strong>
          <a className="button button-primary" href={appHref("/yfasmata-xromata")}>
            Υφάσματα & χρώματα <Icon name="arrow" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

function AutomationSection() {
  return (
    <section className="automation-section section" id="aftomatismoi">
      <div className="container automation-grid">
        <div>
          <p className="eyebrow light"><span /> Αυτοματισμοί</p>
          <h2>Άνετη λειτουργία και αυτόματη προστασία.</h2>
          <p>
            Το μοτέρ τοποθετείται μέσα στον άξονα και ταιριάζει σε όλα τα
            κλασικά συστήματα σκίασης, ακόμη και σε πολλές υπάρχουσες τέντες.
            Χρησιμοποιούμε μοτέρ και αισθητήρες αναγνωρισμένων κατασκευαστών,
            όπως η Somfy.
          </p>
          <a className="button button-outline" href={appHref("/epikoinonia")}>
            Ρωτήστε για ηλεκτροκίνηση <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="automation-features">
          {automationFeatures.map((feature, index) => (
            <article key={feature.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClassicSystemsPage() {
  const groups = [
    {
      id: "orizontia",
      title: "Τέντες για μπαλκόνια, βεράντες και προσόψεις",
      systems: classicSystems.filter((system) => classicSystemDetails[system.path]?.group !== "vertical"),
    },
    {
      id: "katheta",
      title: "Κάθετη σκίαση για πλαϊνό ή μπροστινό κλείσιμο",
      systems: classicSystems.filter((system) => classicSystemDetails[system.path]?.group === "vertical"),
    },
  ];
  const displayOrder = groups.flatMap((group) => group.systems);

  return (
    <main className="detail-main">
      <DetailHero
        ctaLabel="Ζητήστε δωρεάν εκτίμηση"
        eyebrow="Κλασικά συστήματα σκίασης"
        image={albums.classic.cover}
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

      <section className="classic-choices section" id="systimata">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Οδηγός επιλογής</p>
              <h2>Δείτε όλα τα κλασικά συστήματα μαζί και διαλέξτε πιο εύκολα.</h2>
            </div>
            <p>
              Συγκρίνετε με μια ματιά πού ταιριάζει κάθε σύστημα, τι κερδίζετε
              και ποια λύση αξίζει να δείτε αναλυτικά.
            </p>
          </div>
          {groups.map((group) => (
            <div className="classic-choice-group" id={group.id} key={group.id}>
              <h3 className="classic-choice-group-title">{group.title}</h3>
              <div className="classic-choice-grid" aria-label={group.title}>
                {group.systems.map((system) => (
                  <ClassicChoiceCard
                    index={displayOrder.indexOf(system)}
                    key={system.path}
                    system={system}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ClassicCompareTable />
      <FabricGuide />
      <AutomationSection />
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
        image={albums.cassette.cover}
        photoCount={albums.cassette.photos.length}
        intro="Ολοκληρωμένα συστήματα σκίασης που φυλάσσουν ύφασμα, βραχίονες και μηχανισμό μέσα σε ένα καθαρό, συμπαγές κέλυφος αλουμινίου."
        title="Η τέντα κλείνει. Η κατασκευή προστατεύεται."
      />

      {classicSystems
        .filter((system) => system.path === "/klassika-systimata-skiasis/kasetes-kasoneta")
        .map((system) => <SystemQuickFacts key={system.path} system={system} />)}

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

      <GallerySection
        album={albums.cassette}
        title="Κασετίνες για σύγχρονες κατοικίες και επαγγελματικούς χώρους."
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

      <DetailCta />
    </main>
  );
}

function SystemQuickFacts({ system }: { system: ClassicSystem }) {
  const details = classicSystemDetails[system.path];
  if (!details) return null;

  const facts = [
    { label: "Ιδανικό για", value: system.chooser.bestFor },
    { label: "Στήριξη", value: details.support },
    { label: "Όταν κλείνει", value: details.closed },
    { label: "Λειτουργία", value: details.operation },
    { label: "Ενδεικτικό μέγεθος", value: details.size },
  ];

  return (
    <section className="quick-facts" aria-label="Με μια ματιά">
      <div className="container">
        <p className="eyebrow"><span /> Με μια ματιά</p>
        <dl className="quick-facts-grid">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
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
        eyebrow="Κλασικά συστήματα σκίασης"
        image={system.image}
        photoCount={system.album.photos.length}
        intro={system.summary}
        title={system.title}
      />

      <SystemQuickFacts system={system} />

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

      <GallerySection
        album={system.album}
        title="Δείτε το σύστημα σε πραγματικούς χώρους."
      />

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
        image={albums.pergola.cover}
        photoCount={albums.pergola.photos.length}
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

      <GallerySection
        album={albums.pergola}
        title="Περγκοτέντες για κατοικίες και επαγγελματικούς χώρους."
      />

      <section className="pergola-types section" id="typoi-kataskeyis">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow light"><span /> Οδηγός επιλογής κατασκευής</p>
              <h2>Δείτε τους τύπους περγκοτέντας και ποιος ταιριάζει στον χώρο σας.</h2>
            </div>
            <p>
              Η μορφή επιλέγεται αφού ελεγχθούν η στήριξη, η απαιτούμενη
              προβολή, η απορροή και η αρχιτεκτονική του χώρου. Παρακάτω είναι
              ένας πρακτικός οδηγός για την πρώτη επιλογή.
            </p>
          </div>
          <div className="pergola-type-grid">
            {pergolaTypes.map((type, index) => (
              <article className="pergola-type-card" key={type.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <PergolaShapeIcon shape={type.shape} />
                <h3>{type.title}</h3>
                <p>{type.text}</p>
                <dl className="pergola-type-facts">
                  <div>
                    <dt>Ιδανικό για</dt>
                    <dd>{type.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Κερδίζετε</dt>
                    <dd>{type.keyBenefit}</dd>
                  </div>
                </dl>
                <div className="pergola-type-tags" aria-label="Χαρακτηριστικά">
                  {type.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a className="pergola-type-link" href={appHref("/epikoinonia")}>
                  Ζητήστε εκτίμηση <Icon name="arrow" size={17} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pergola-scale section" id="klimaka-efarmoges">
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
              <strong>150 m²</strong>
              <span>κάλυψη με ένα σύστημα σε σειρές μεγάλων επιφανειών</span>
            </article>
            <article>
              <strong>100%</strong>
              <span>αδιάβροχη οροφή με PVC blockout</span>
            </article>
          </div>
          <p className="pergola-scale-note">
            Η αντοχή σε άνεμο και βροχή ισχύει πάντοτε μέσα στα πιστοποιημένα
            όρια του κατασκευαστή και προϋποθέτει σωστή χρήση του συστήματος.
          </p>
        </div>
      </section>

      <section className="pergola-equipment section" id="eksoplismos-pergkotentas">
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

      <DetailCta />
    </main>
  );
}

function BioclimaticPergolaPage() {
  return (
    <main className="detail-main">
      <DetailHero
        className="bioclimatic-hero"
        ctaLabel="Ζητήστε μελέτη του χώρου"
        eyebrow="Βιοκλιματικές πέργκολες"
        image={albums.bioclimatic.cover}
        photoCount={albums.bioclimatic.photos.length}
        intro="Πέργκολες αλουμινίου με κινητές περσίδες που προσαρμόζουν το μικροκλίμα του εξωτερικού χώρου στις συνθήκες κάθε στιγμής."
        title="Ελέγξτε το φως, τον αέρα και τη σκιά."
      />

      <DetailOverview
        bullets={[
          "Συνεχής ρύθμιση φωτός και αερισμού",
          "Ηλεκτρική κίνηση και τηλεχειρισμός",
          "Κατασκευή για οικιακούς και επαγγελματικούς χώρους",
        ]}
        description="Οι περσίδες αλουμινίου περιστρέφονται ώστε να μεταβάλλουν την ποσότητα φυσικού φωτός και αέρα κάτω από την κατασκευή. Σε ανοιχτή θέση απομακρύνουν τον θερμό αέρα, ενώ σε κλειστή θέση δημιουργούν προστατευμένη οροφή με οργανωμένη απορροή νερού. Ορισμένα συστήματα προσφέρουν και πλήρη αναδίπλωση των περσίδων."
        eyebrow="Βιοκλιματικός σχεδιασμός"
        icon="pergola"
        title="Μία οροφή που συνεργάζεται με το περιβάλλον."
      />

      <GallerySection
        album={albums.bioclimatic}
        title="Σύγχρονοι εξωτερικοί χώροι με ελεγχόμενες περσίδες."
      />

      <section className="bioclimatic-modes section" id="leitourgia-persidon">
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

      <section className="bioclimatic-types section" id="typoi-vioklimatikis">
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
              <strong>4 × 20 m</strong>
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

      <section className="bioclimatic-equipment section" id="eksoplismos-vioklimatikis">
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

      <DetailCta />
    </main>
  );
}

function OtherSystemsPage({ page }: { page: ProductPage }) {
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

      <section className="detail-options other-groups section">
        <div className="container">
          {otherSystemGroups.map((group) => (
            <div className="other-group" id={group.id} key={group.id}>
              <div className="section-heading split-heading">
                <div>
                  <p className="eyebrow light"><span /> {group.eyebrow}</p>
                  <h2>{group.title}</h2>
                </div>
                <p>{group.intro}</p>
              </div>
              <div className="detail-option-grid">
                {group.items.map((item) => (
                  <article className="detail-option-card" key={item.title}>
                    <span className="other-group-icon"><Icon name={item.icon ?? group.icon} size={22} /></span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.spec && <small className="detail-option-spec">{item.spec}</small>}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {page.albums && (
        <AlbumShowcase
          albumList={page.albums}
          eyebrow="Φωτογραφίες ανά σύστημα"
          intro="Πατήστε σε μία κατηγορία για να δείτε όλες τις φωτογραφίες της."
          title="Δείτε τα συστήματα σε πραγματικούς χώρους."
        />
      )}
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

function AlbumShowcase({
  albumList,
  eyebrow,
  title,
  intro,
}: {
  albumList: Album[];
  eyebrow: string;
  title: string;
  intro: string;
}) {
  const [openAlbum, setOpenAlbum] = useState<{ album: Album; index: number } | null>(null);
  const withPhotos = albumList.filter((album) => album.photos.length > 0);

  if (withPhotos.length === 0) return null;

  return (
    <section className="album-showcase section" id="fotografies">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow"><span /> {eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <p>{intro}</p>
        </div>
        <div className="album-grid">
          {withPhotos.map((album) => (
            <button
              className="album-card"
              key={album.key}
              onClick={() => setOpenAlbum({ album, index: 0 })}
              type="button"
            >
              <MediaImage image={album.cover} loading="lazy" sizes="(max-width: 680px) 100vw, 33vw" />
              <span className="album-card-shade" aria-hidden="true" />
              <span className="album-card-copy">
                <span className="photo-count-pill">
                  <Icon name="camera" size={15} /> {photoCountLabel(album.photos.length)}
                </span>
                <strong>{album.title}</strong>
              </span>
            </button>
          ))}
        </div>
      </div>
      {openAlbum && (
        <Lightbox
          index={openAlbum.index}
          onChange={(index) => setOpenAlbum({ ...openAlbum, index })}
          onClose={() => setOpenAlbum(null)}
          photos={openAlbum.album.photos}
          title={openAlbum.album.title}
        />
      )}
    </section>
  );
}

type ProjectPhoto = Photo & { albumTitle: string; albumKey: string; path?: string };

const allProjectPhotos: ProjectPhoto[] = projectAlbums.flatMap((album) =>
  album.photos.map((photo) => ({
    ...photo,
    albumTitle: album.title,
    albumKey: album.key,
    path: album.path,
  })),
);

function ProjectsPage() {
  const [filter, setFilter] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const photos =
    filter === "all" ? allProjectPhotos : allProjectPhotos.filter((photo) => photo.albumKey === filter);
  const activeAlbum = projectAlbums.find((album) => album.key === filter);

  return (
    <main className="detail-main">
      <PlainDetailHero
        className="projects-hero"
        eyebrow="Έργα μας"
        intro="Φωτογραφίες από τέντες, πέργκολες και συστήματα σκίασης. Διαλέξτε κατηγορία και πατήστε σε μία φωτογραφία για μεγέθυνση."
        title="Δείτε τη δουλειά μας στην πράξη."
      />
      <section className="projects-section section">
        <div className="container">
          <div className="filter-chips" role="toolbar" aria-label="Φίλτρο κατηγορίας">
            <button
              aria-pressed={filter === "all"}
              className={filter === "all" ? "is-active" : ""}
              onClick={() => setFilter("all")}
              type="button"
            >
              <Icon name="grid" size={16} /> Όλα <small>{allProjectPhotos.length}</small>
            </button>
            {projectAlbums.map((album) => (
              <button
                aria-pressed={filter === album.key}
                className={filter === album.key ? "is-active" : ""}
                key={album.key}
                onClick={() => setFilter(album.key)}
                type="button"
              >
                {album.title} <small>{album.photos.length}</small>
              </button>
            ))}
          </div>

          <div className="projects-masonry" key={filter}>
            {photos.map((photo, index) => (
              <button
                aria-label={`Μεγέθυνση: ${photo.alt}`}
                className="projects-tile"
                key={photo.src}
                onClick={() => setOpenIndex(index)}
                style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
                type="button"
              >
                <MediaImage image={photo} loading="lazy" sizes="(max-width: 680px) 50vw, 33vw" />
                <span className="projects-tile-label">{photo.albumTitle}</span>
              </button>
            ))}
          </div>

          {activeAlbum?.path && (
            <div className="projects-more">
              <a className="button button-primary" href={appHref(activeAlbum.path)}>
                Μάθετε για: {activeAlbum.title} <Icon name="arrow" size={18} />
              </a>
            </div>
          )}
        </div>
      </section>
      {openIndex !== null && photos[openIndex] && (
        <Lightbox
          index={openIndex}
          onChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
          photos={photos}
          title={photos[openIndex].albumTitle}
        />
      )}
      <DetailCta />
    </main>
  );
}

function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <section className={`process-section section process-${tone}`} id="pos-doulevoume">
      <div className="container">
        <div className="section-heading split-heading">
          <div>
            <p className={`eyebrow ${tone === "dark" ? "light" : ""}`}><span /> Πώς δουλεύουμε</p>
            <h2>Από το πρώτο τηλεφώνημα μέχρι την τοποθέτηση, σε 4 βήματα.</h2>
          </div>
          <p>
            Η εκτίμηση είναι δωρεάν και δεν σας δεσμεύει. Πριν ξεκινήσει η
            κατασκευή ξέρετε ακριβώς τι θα πάρετε και πόσο κοστίζει.
          </p>
        </div>
        <ol className="process-grid">
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PartnersStrip() {
  return (
    <section className="partners-section" aria-labelledby="partners-title">
      <div className="container partners-inner">
        <div>
          <p className="eyebrow"><span /> Υλικά & συστήματα</p>
          <h2 id="partners-title">Δουλεύουμε με αναγνωρισμένους Έλληνες και Ευρωπαίους κατασκευαστές.</h2>
        </div>
        <ul className="partners-list">
          {partnerBrands.map((brand) => (
            <li key={brand}>{brand}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecentWorkStrip() {
  // Πρώτα η κεντρική φωτογραφία κάθε κατηγορίας, μετά οι υπόλοιπες.
  const covers = projectAlbums.map((album) => ({ ...album.cover, albumTitle: album.title }));
  const coverSources = new Set(covers.map((photo) => photo.src));
  const strip = covers
    .concat(allProjectPhotos.filter((photo) => !coverSources.has(photo.src)))
    .slice(0, 14);

  if (strip.length < 3) return null;

  return (
    <section className="recent-work section" aria-labelledby="recent-work-title">
      <div className="container recent-work-head">
        <div>
          <p className="eyebrow"><span /> Έργα μας</p>
          <h2 id="recent-work-title">Πραγματικές κατασκευές, όχι υποσχέσεις.</h2>
        </div>
        <a className="button button-primary" href={appHref("/erga")}>
          Όλες οι φωτογραφίες ({allProjectPhotos.length}) <Icon name="arrow" size={18} />
        </a>
      </div>
      <div className="recent-work-track" aria-hidden="true">
        <div className="recent-work-rail">
          {[...strip, ...strip].map((photo, index) => (
            <a className="recent-work-item" href={appHref("/erga")} key={`${photo.src}-${index}`} tabIndex={-1}>
              <img alt="" loading="lazy" src={photo.thumb} />
              <span>{photo.albumTitle}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesPage() {
  return (
    <main className="detail-main">
      <PlainDetailHero
        className="services-detail-hero"
        eyebrow="Υπηρεσίες"
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
      <ProcessSteps tone="dark" />
      <DetailCta />
    </main>
  );
}

function CompanyPage() {
  return (
    <main className="detail-main">
      <PlainDetailHero
        className="company-detail-hero"
        eyebrow="Η εταιρεία μας"
        intro={<>Μία οικογενειακή επιχείρηση με υπεύθυνο τον {business.managerAccusative} και περισσότερα από 30 χρόνια τεχνικής εμπειρίας στη σκίαση.</>}
        title="Η εμπειρία περνά από γενιά σε γενιά."
      />
      <section className="about-section section">
        <div className="container about-grid">
          <div className="about-image">
            <MediaImage image={albums.company.cover} sizes="(max-width: 980px) 100vw, 45vw" />
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
      {albums.company.photos.length > 1 && (
        <GallerySection
          album={albums.company}
          eyebrow="Η ομάδα στη δουλειά"
          title="Από το εργαστήριο μέχρι την τοποθέτηση."
        />
      )}
      <DetailCta />
    </main>
  );
}

const FABRIC_PICKS_KEY = "kt-fabric-picks";
const MAX_FABRIC_PICKS = 6;
const fabricTypeFilters: FabricType[] = ["Μονόχρωμα", "Block out", "Σχέδια", "Ριγέ", "Ομπρελόπανα"];

function fabricId(fabric: Fabric) {
  return `${fabric.supplier}-${fabric.code}`;
}

function fabricLabel(fabric: Fabric) {
  return `${fabricSuppliers[fabric.supplier].name} ${fabric.collection} ${fabric.code} (${fabric.name})`;
}

function readFabricPicks(): string[] {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FABRIC_PICKS_KEY) ?? "[]");
    return Array.isArray(stored) ? stored.filter((id) => typeof id === "string").slice(0, MAX_FABRIC_PICKS) : [];
  } catch {
    return [];
  }
}

function saveFabricPicks(ids: string[]) {
  try {
    window.localStorage.setItem(FABRIC_PICKS_KEY, JSON.stringify(ids));
  } catch {
    // Η αποθήκευση είναι προαιρετική· οι επιλογές μένουν για την τρέχουσα επίσκεψη.
  }
}

/** Κείμενο για τη φόρμα, όταν ο επισκέπτης έρχεται από τις επιλογές υφασμάτων. */
function fabricPicksMessage(search: string) {
  const ids = new URLSearchParams(search).get("yfasmata")?.split(",") ?? [];
  const picked = ids
    .map((id) => fabrics.find((fabric) => fabricId(fabric) === id))
    .filter((fabric): fabric is Fabric => Boolean(fabric));
  if (picked.length === 0) return "";
  return `Με ενδιαφέρουν τα παρακάτω υφάσματα:\n${picked.map((fabric) => `• ${fabricLabel(fabric)}`).join("\n")}\n\n`;
}

function FabricModal({
  fabric,
  isPicked,
  canPick,
  onTogglePick,
  onClose,
}: {
  fabric: Fabric;
  isPicked: boolean;
  canPick: boolean;
  onTogglePick: () => void;
  onClose: () => void;
}) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const supplier = fabricSuppliers[fabric.supplier];

  useBodyScrollLock(true);

  useEffect(() => {
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      aria-label={`${fabric.name}, κωδικός ${fabric.code}`}
      aria-modal="true"
      className="fabric-modal"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
    >
      <div className="fabric-modal-card">
        <button aria-label="Κλείσιμο" className="fabric-modal-close" onClick={onClose} ref={closeButton} type="button">
          <Icon name="x" size={20} />
        </button>
        <div className="fabric-modal-image" style={{ backgroundColor: fabric.hex }}>
          <img alt={`Δείγμα υφάσματος ${fabric.name}`} src={fabric.image} />
        </div>
        <div className="fabric-modal-body">
          <span className="fabric-modal-kicker">{supplier.name} · {fabric.collection}</span>
          <h2>{fabric.name}</h2>
          <dl>
            <div><dt>Κωδικός</dt><dd>{fabric.code}</dd></div>
            <div><dt>Είδος</dt><dd>{fabric.type}</dd></div>
            {fabric.family && <div><dt>Απόχρωση</dt><dd>{fabric.family}</dd></div>}
          </dl>
          {fabricCollections[fabric.collection] && <p>{fabricCollections[fabric.collection]}</p>}
          {fabric.note && <p className="fabric-modal-note">{fabric.note}</p>}
          <div className="fabric-modal-actions">
            <button
              className={`button ${isPicked ? "button-ghost" : "button-primary"}`}
              disabled={!isPicked && !canPick}
              onClick={onTogglePick}
              type="button"
            >
              {isPicked ? "Αφαίρεση από τις επιλογές" : "Προσθήκη στις επιλογές μου"}
            </button>
            <a className="button button-sun" href={appHref(`/epikoinonia?yfasmata=${fabricId(fabric)}`)}>
              Ζητήστε αυτό το χρώμα <Icon name="arrow" size={18} />
            </a>
          </div>
          {!isPicked && !canPick && (
            <small className="fabric-modal-hint">Έχετε ήδη {MAX_FABRIC_PICKS} επιλογές. Αφαιρέστε μία για να προσθέσετε άλλη.</small>
          )}
        </div>
      </div>
    </div>
  );
}

function FabricsPage() {
  const [supplierFilter, setSupplierFilter] = useState<FabricSupplier | "all">("all");
  const [typeFilter, setTypeFilter] = useState<FabricType | "all">("all");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [picks, setPicks] = useState<string[]>(() => readFabricPicks());

  useEffect(() => saveFabricPicks(picks), [picks]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = fabrics.filter(
    (fabric) =>
      (supplierFilter === "all" || fabric.supplier === supplierFilter) &&
      (typeFilter === "all" || fabric.type === typeFilter) &&
      (familyFilter === "all" || fabric.family === familyFilter) &&
      (!normalizedQuery ||
        `${fabric.name} ${fabric.code} ${fabric.collection} ${fabricSuppliers[fabric.supplier].name}`
          .toLowerCase()
          .includes(normalizedQuery)),
  );

  const groups: { key: string; supplier: FabricSupplier; collection: string; items: Fabric[] }[] = [];
  for (const fabric of filtered) {
    const key = `${fabric.supplier}|${fabric.collection}`;
    const group = groups.find((item) => item.key === key);
    if (group) group.items.push(fabric);
    else groups.push({ key, supplier: fabric.supplier, collection: fabric.collection, items: [fabric] });
  }

  const pickedFabrics = picks
    .map((id) => fabrics.find((fabric) => fabricId(fabric) === id))
    .filter((fabric): fabric is Fabric => Boolean(fabric));
  const openFabric = fabrics.find((fabric) => fabricId(fabric) === openId);
  const hasFilters = supplierFilter !== "all" || typeFilter !== "all" || familyFilter !== "all" || normalizedQuery !== "";

  function togglePick(id: string) {
    setPicks((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length >= MAX_FABRIC_PICKS
          ? current
          : [...current, id],
    );
  }

  function resetFilters() {
    setSupplierFilter("all");
    setTypeFilter("all");
    setFamilyFilter("all");
    setQuery("");
  }

  return (
    <main className={`detail-main fabrics-page ${pickedFabrics.length > 0 ? "has-picks" : ""}`}>
      <PlainDetailHero
        className="fabrics-hero"
        eyebrow="Υφάσματα & χρώματα"
        intro={`Δείτε ${fabrics.length} χρώματα και σχέδια τεντόπανων από TenCate, DAS Awning και Calbari. Φιλτράρετε ανά είδος ή απόχρωση και κρατήστε τα αγαπημένα σας για την προσφορά.`}
        title="Διαλέξτε το πανί που ταιριάζει στον χώρο σας."
      />

      <section className="fabrics-browser section">
        <div className="container">
          <div className="fabric-filters" role="search" aria-label="Φίλτρα υφασμάτων">
            <div className="fabric-filter-row">
              <span className="fabric-filter-label">Προμηθευτής</span>
              <div className="filter-chips">
                <button aria-pressed={supplierFilter === "all"} className={supplierFilter === "all" ? "is-active" : ""} onClick={() => setSupplierFilter("all")} type="button">
                  Όλοι
                </button>
                {(Object.keys(fabricSuppliers) as FabricSupplier[]).map((key) => (
                  <button aria-pressed={supplierFilter === key} className={supplierFilter === key ? "is-active" : ""} key={key} onClick={() => setSupplierFilter(key)} type="button">
                    {fabricSuppliers[key].name} <small>{fabrics.filter((fabric) => fabric.supplier === key).length}</small>
                  </button>
                ))}
              </div>
            </div>
            <div className="fabric-filter-row">
              <span className="fabric-filter-label">Είδος</span>
              <div className="filter-chips">
                <button aria-pressed={typeFilter === "all"} className={typeFilter === "all" ? "is-active" : ""} onClick={() => setTypeFilter("all")} type="button">
                  Όλα
                </button>
                {fabricTypeFilters.map((type) => (
                  <button aria-pressed={typeFilter === type} className={typeFilter === type ? "is-active" : ""} key={type} onClick={() => setTypeFilter(type)} type="button">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="fabric-filter-row">
              <span className="fabric-filter-label">Απόχρωση</span>
              <div className="fabric-family-chips">
                <button aria-pressed={familyFilter === "all"} className={familyFilter === "all" ? "is-active" : ""} onClick={() => setFamilyFilter("all")} type="button">
                  Όλες
                </button>
                {fabricFamilies.map((family) => (
                  <button
                    aria-pressed={familyFilter === family.name}
                    className={familyFilter === family.name ? "is-active" : ""}
                    key={family.name}
                    onClick={() => setFamilyFilter(family.name)}
                    title={family.name}
                    type="button"
                  >
                    <i style={{ background: family.swatch }} /> {family.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="fabric-filter-row fabric-search-row">
              <label className="fabric-search">
                <span className="visually-hidden">Αναζήτηση με όνομα ή κωδικό</span>
                <input onChange={(event) => setQuery(event.target.value)} placeholder="Αναζήτηση με όνομα ή κωδικό, π.χ. 4505" type="search" value={query} />
              </label>
              <p className="fabric-count" aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "ύφασμα" : "υφάσματα"}
                {hasFilters && (
                  <button onClick={resetFilters} type="button">Καθαρισμός φίλτρων</button>
                )}
              </p>
            </div>
          </div>

          {groups.length === 0 && (
            <div className="fabric-empty">
              <p>Δεν βρέθηκαν υφάσματα με αυτά τα φίλτρα.</p>
              <button className="button button-ghost" onClick={resetFilters} type="button">Εμφάνιση όλων</button>
            </div>
          )}

          {groups.map((group) => (
            <section className="fabric-group" key={group.key} aria-label={`${fabricSuppliers[group.supplier].name} ${group.collection}`}>
              <header className="fabric-group-head">
                <div>
                  <span>{fabricSuppliers[group.supplier].name}</span>
                  <h2>{group.collection}</h2>
                </div>
                {fabricCollections[group.collection] && <p>{fabricCollections[group.collection]}</p>}
              </header>
              <div className="fabric-grid">
                {group.items.map((fabric) => {
                  const id = fabricId(fabric);
                  const isPicked = picks.includes(id);
                  return (
                    <article className={`fabric-card ${isPicked ? "is-picked" : ""}`} key={id}>
                      <button aria-label={`Μεγέθυνση: ${fabric.name}, κωδικός ${fabric.code}`} className="fabric-card-open" onClick={() => setOpenId(id)} type="button">
                        <span className="fabric-card-swatch" style={{ backgroundColor: fabric.hex }}>
                          <img alt="" decoding="async" loading="lazy" src={fabric.thumb} />
                        </span>
                        <span className="fabric-card-copy">
                          <strong>{fabric.name}</strong>
                          <small>Κωδ. {fabric.code}</small>
                        </span>
                      </button>
                      <button
                        aria-label={isPicked ? `Αφαίρεση ${fabric.code} από τις επιλογές` : `Προσθήκη ${fabric.code} στις επιλογές`}
                        aria-pressed={isPicked}
                        className="fabric-card-pick"
                        disabled={!isPicked && picks.length >= MAX_FABRIC_PICKS}
                        onClick={() => togglePick(id)}
                        type="button"
                      >
                        <Icon name={isPicked ? "check" : "plus"} size={16} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}

          <aside className="fabric-disclaimer">
            <Icon name="spark" size={20} />
            <p>
              Τα χρώματα στην οθόνη είναι ενδεικτικά και η διαθεσιμότητα κάθε
              κωδικού αλλάζει. Στην αυτοψία φέρνουμε φυσικά δείγματα, ώστε να
              δείτε σωστά απόχρωση, ύφανση και πόσο φως περνά. Οι φωτογραφίες
              προέρχονται από τους καταλόγους των{" "}
              {(Object.keys(fabricSuppliers) as FabricSupplier[]).map((key, index, all) => (
                <span key={key}>
                  <a href={fabricSuppliers[key].url} rel="noreferrer" target="_blank">{fabricSuppliers[key].name}</a>
                  {index < all.length - 2 ? ", " : index === all.length - 2 ? " και " : ""}
                </span>
              ))}
              .
            </p>
          </aside>
        </div>
      </section>

      {pickedFabrics.length > 0 && (
        <aside className="fabric-picks" aria-label="Οι επιλογές μου">
          <div className="fabric-picks-inner">
            <div className="fabric-picks-head">
              <strong>Οι επιλογές μου</strong>
              <small>{pickedFabrics.length} / {MAX_FABRIC_PICKS}</small>
            </div>
            <ul>
              {pickedFabrics.map((fabric) => (
                <li key={fabricId(fabric)}>
                  <button
                    aria-label={`Αφαίρεση ${fabric.name} ${fabric.code}`}
                    onClick={() => togglePick(fabricId(fabric))}
                    style={{ backgroundColor: fabric.hex, backgroundImage: `url("${fabric.thumb}")` }}
                    title={`${fabric.name} · ${fabric.code}`}
                    type="button"
                  >
                    <Icon name="x" size={12} />
                  </button>
                </li>
              ))}
            </ul>
            <a className="button button-sun" href={appHref(`/epikoinonia?yfasmata=${picks.join(",")}`)}>
              Ζητήστε προσφορά <Icon name="arrow" size={18} />
            </a>
          </div>
        </aside>
      )}

      {openFabric && (
        <FabricModal
          canPick={picks.length < MAX_FABRIC_PICKS}
          fabric={openFabric}
          isPicked={picks.includes(fabricId(openFabric))}
          onClose={() => setOpenId(null)}
          onTogglePick={() => togglePick(fabricId(openFabric))}
        />
      )}

      <DetailCta />
    </main>
  );
}

function ContactPage() {

  return (
    <main className="detail-main contact-page">
      <PlainDetailHero
        className="contact-detail-hero"
        eyebrow="Επικοινωνία"
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
            <div className="contact-tips">
              <strong>Για πιο γρήγορη και ακριβή προσφορά, στείλτε μας:</strong>
              <ul className="check-list">
                <li><Icon name="check" size={18} /> Περίπου διαστάσεις (πλάτος και βάθος)</li>
                <li><Icon name="check" size={18} /> Μία ή δύο φωτογραφίες του χώρου</li>
                <li><Icon name="check" size={18} /> Την περιοχή και τον όροφο</li>
                <li><Icon name="check" size={18} /> Αν θέλετε μοτέρ ή αυτοματισμούς</li>
              </ul>
            </div>
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
  const heroPhotos = albums.home.photos.length > 0 ? albums.home.photos : [albums.home.cover];
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    // Με περισσότερες από μία φωτογραφίες στον φάκελο «arxiki», η κεντρική
    // εικόνα εναλλάσσεται αυτόματα.
    if (heroPhotos.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroPhotos.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroPhotos.length]);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-media" aria-hidden="true">
          {heroPhotos.map((photo, index) => (
            <div
              className={`hero-slide ${index === heroIndex ? "is-active" : ""}`}
              key={photo.src}
              style={{ backgroundImage: `url("${photo.src}")` }}
            />
          ))}
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="container hero-content">
          <p className="eyebrow light">
            <span />
            Οικογενειακή επιχείρηση • 30+ χρόνια εμπειρίας • Υπεύθυνος Μιχάλης Παπαδάμ
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
        {heroPhotos.length > 1 && (
          <div className="hero-dots">
            {heroPhotos.map((photo, index) => (
              <button
                aria-label={`Φωτογραφία ${index + 1}`}
                className={index === heroIndex ? "is-active" : ""}
                key={photo.src}
                onClick={() => setHeroIndex(index)}
                type="button"
              />
            ))}
          </div>
        )}
        <div className="hero-proof">
          <div>
            <strong>30+</strong>
            <span>χρόνια εμπειρίας στη σκίαση</span>
          </div>
          <div>
            <strong>Δωρεάν</strong>
            <span>εκτίμηση και πρόταση για τον χώρο σας</span>
          </div>
          <div>
            <strong>Αττική</strong>
            <span>και έργα σε όλη την Ελλάδα</span>
          </div>
        </div>
      </section>

      <section className="products-section section" id="products">
        <div className="container">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow"><span /> Προϊόντα</p>
              <h2>Μία λύση για κάθε χώρο.</h2>
            </div>
            <p>
              Πέντε κατηγορίες καλύπτουν όλα όσα κατασκευάζουμε. Δεν ξέρετε από
              πού να ξεκινήσετε;{" "}
              <a className="inline-link" href="#odigos-epilogis">Κάντε το γρήγορο quiz</a>.
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
                  <ul className="product-includes" aria-label="Περιλαμβάνει">
                    {product.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="card-link">
                    Δείτε αναλυτικά <Icon name="arrow" size={18} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ProcessSteps />

      <RecentWorkStrip />

      <SelectionAdvisor />

      <CoverageBand />

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

      <PartnersStrip />

      <section className="about-section section" id="about">
        <div className="container about-grid">
          <div className="about-image">
            <MediaImage image={albums.company.cover} loading="lazy" sizes="(max-width: 980px) 100vw, 45vw" />
            <div className="experience-badge">
              <strong>30+</strong>
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
            <ul className="check-list about-checks">
              <li><Icon name="check" size={18} /> Επιλεγμένα υλικά και μηχανισμοί αναγνωρισμένων κατασκευαστών</li>
              <li><Icon name="check" size={18} /> Λύσεις για κατοικίες και επιχειρήσεις</li>
              <li><Icon name="check" size={18} /> Υποστήριξη και μετά την εγκατάσταση</li>
            </ul>
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
          backgroundImage: `linear-gradient(90deg, rgba(7, 27, 53, 0.98), rgba(7, 27, 53, 0.88)), url("${albums.home.cover.src}")`,
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

/** Μετά την αλλαγή σελίδας: στην αρχή ή στην ενότητα του #anchor. */
function scrollToHash(hash: string) {
  window.scrollTo(0, 0);
  if (!hash) return;
  window.setTimeout(() => {
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: "start" });
  }, 80);
}

export default function App() {
  const [path, setPath] = useState(() => cleanPath(window.location.pathname));
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
        setIsScrolled(window.scrollY > 24);
        setShowBackToTop(window.scrollY > 900);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // Ομαλή εμφάνιση των ενοτήτων καθώς ο επισκέπτης κάνει scroll.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const selectors = [
      ".section-heading",
      ".intro-copy",
      ".product-card",
      ".service-item",
      ".application-card",
      ".about-image",
      ".about-copy",
      ".faq-item",
      ".coverage-list article",
      ".detail-overview-grid > div",
      ".system-description-grid > div",
      ".photo-tile",
      ".album-card",
      ".detail-option-card",
      ".pergola-type-card",
      ".service-page-card",
      ".source-card-grid a",
    ].join(",");

    const elements = Array.from(document.querySelectorAll<HTMLElement>(selectors)).filter(
      (element) => element.getBoundingClientRect().top > window.innerHeight * 0.9,
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    elements.forEach((element) => {
      element.classList.add("reveal");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("reveal", "is-visible"));
    };
  }, [path]);

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
    if (window.location.hash) scrollToHash(window.location.hash);
  }, []);

  useEffect(() => {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.href = albums.home.cover.src;
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
      scrollToHash(url.hash);
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
    const imageUrl = absoluteSiteUrl("/og-image.jpg");

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
    path === "/erga" ||
    path === "/ypiresies" ||
    path === "/i-etaireia-mas" ||
    path === "/epikoinonia" ||
    path === "/yfasmata-xromata";
  const secondaryTabs = path.startsWith("/klassika-systimata-skiasis")
    ? [
        {
          label: "Όλα",
          href: appHref("/klassika-systimata-skiasis"),
          isActive: path === "/klassika-systimata-skiasis",
        },
        ...classicSystems.map((system) => ({
          label: system.chooser.shortTitle,
          href: appHref(system.path),
          isActive: path === system.path,
        })),
      ]
    : path === "/pergkotentes"
      ? [
          { label: "Τύποι κατασκευής", href: "#typoi-kataskeyis", isActive: false },
          { label: "Κλίμακα και εφαρμογές", href: "#klimaka-efarmoges", isActive: false },
          { label: "Εξοπλισμός", href: "#eksoplismos-pergkotentas", isActive: false },
        ]
      : path === "/vioklimatikes-pergkoles"
        ? [
            { label: "Λειτουργία περσίδων", href: "#leitourgia-persidon", isActive: false },
            { label: "Τύποι", href: "#typoi-vioklimatikis", isActive: false },
            { label: "Εξοπλισμός", href: "#eksoplismos-vioklimatikis", isActive: false },
          ]
        : path === "/alla-systimata-skiasis"
          ? otherSystemGroups.map((group) => ({
              label: group.eyebrow,
              href: `#${group.id}`,
              isActive: false,
            }))
          : [];

  return (
    <div className="site-shell">
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <span className="scroll-progress" aria-hidden="true" />
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
        {secondaryTabs.length > 0 && (
          <nav className="secondary-tabs" aria-label="Υποκατηγορίες">
            <div className="secondary-tabs-inner">
              {secondaryTabs.map((item) => (
                <a
                  className={item.isActive ? "is-active" : ""}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
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
      {activeProductPage && path === "/alla-systimata-skiasis" && (
        <OtherSystemsPage page={activeProductPage} />
      )}
      {path === "/erga" && <ProjectsPage />}
      {path === "/ypiresies" && <ServicesPage />}
      {path === "/i-etaireia-mas" && <CompanyPage />}
      {path === "/epikoinonia" && <ContactPage />}
      {path === "/yfasmata-xromata" && <FabricsPage />}

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <span className="brand-mark">{business.shortName}</span>
            <div>
              <strong>{business.name}</strong>
              <span>Λύσεις σκίασης με τεχνική συνέπεια.</span>
            </div>
          </div>
          <nav className="footer-links" aria-label="Χάρτης ιστοσελίδας">
            <div>
              <strong>Προϊόντα</strong>
              <a href={appHref("/klassika-systimata-skiasis")}>Κλασικά συστήματα σκίασης</a>
              <a href={appHref("/pergkotentes")}>Περγκοτέντες</a>
              <a href={appHref("/vioklimatikes-pergkoles")}>Βιοκλιματικές πέργκολες</a>
              <a href={appHref("/alla-systimata-skiasis")}>Άλλα συστήματα σκίασης</a>
              <a href={appHref("/yfasmata-xromata")}>Υφάσματα & χρώματα</a>
            </div>
            <div>
              <strong>Εταιρεία</strong>
              <a href={appHref("/erga")}>Έργα μας</a>
              <a href={appHref("/ypiresies")}>Υπηρεσίες</a>
              <a href={appHref("/i-etaireia-mas")}>Η εταιρεία μας</a>
              <a href={appHref("/epikoinonia")}>Επικοινωνία</a>
            </div>
          </nav>
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
      <button
        aria-label="Επιστροφή στην κορυφή"
        className={`back-to-top ${showBackToTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        tabIndex={showBackToTop ? 0 : -1}
        type="button"
      >
        <Icon name="up" size={20} />
      </button>
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
