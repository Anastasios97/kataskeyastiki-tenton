/**
 * Αυτόματη ανάγνωση φωτογραφιών από τον φάκελο `photos/`.
 *
 * Κάθε υποφάκελος είναι ένα «άλμπουμ». Όσες φωτογραφίες υπάρχουν μέσα του,
 * τόσες εμφανίζονται στην ιστοσελίδα. Κατά το build οι φωτογραφίες
 * περιστρέφονται σωστά, μικραίνουν και μετατρέπονται σε WebP.
 */

export type Photo = {
  /** Φωτογραφία πλήρους μεγέθους (έως 2000px). */
  src: string;
  /** Μικρότερη εκδοχή για κάρτες και μικρογραφίες (έως 900px). */
  thumb: string;
  alt: string;
  /** Όνομα αρχείου, π.χ. `03.jpg`. */
  file: string;
};

export type AlbumKey = keyof typeof albumConfig;

export type Album = {
  key: AlbumKey;
  title: string;
  folder: string;
  /** Κεντρική φωτογραφία: το αρχείο που περιέχει «kentriki», αλλιώς η πρώτη. */
  cover: Photo;
  /** Όλες οι ανεβασμένες φωτογραφίες (μαζί με την κεντρική). */
  photos: Photo[];
  /** `true` όταν ο φάκελος είναι άδειος και χρησιμοποιείται προσωρινή εικόνα. */
  isFallback: boolean;
  /** Σελίδα της ιστοσελίδας όπου παρουσιάζεται το προϊόν. */
  path?: string;
  showInProjects: boolean;
};

type AlbumConfig = {
  folder: string;
  title: string;
  path?: string;
  fallback?: string;
  showInProjects?: boolean;
};

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=82`;

/**
 * Λίστα όλων των φακέλων. Για νέο προϊόν αρκεί ένας νέος φάκελος και μία
 * γραμμή εδώ.
 */
export const albumConfig = {
  classic: {
    folder: "proionta/klassika-systimata",
    title: "Κλασσικά συστήματα σκίασης",
    path: "/klassika-systimata-skiasis",
    fallback: unsplash("photo-1600585154340-be6161a56a0c"),
  },
  antirida: {
    folder: "proionta/antirides",
    title: "Τέντες με αντιρίδες",
    path: "/klassika-systimata-skiasis/antirida",
    fallback: unsplash("photo-1600585154340-be6161a56a0c"),
  },
  arms: {
    folder: "proionta/spastoi-vrachiones",
    title: "Σπαστοί βραχίονες",
    path: "/klassika-systimata-skiasis/spastoi-vrachiones",
    fallback: unsplash("photo-1511452885600-a3d2c9148a31"),
  },
  cassette: {
    folder: "proionta/kasetes-kasoneta",
    title: "Κασέτες & κασονέτα",
    path: "/klassika-systimata-skiasis/kasetes-kasoneta",
    fallback: unsplash("photo-1600566753086-00f18fb6b3ea"),
  },
  monoblock: {
    folder: "proionta/monoblock",
    title: "Monoblock",
    path: "/klassika-systimata-skiasis/monoblock",
    fallback: unsplash("photo-1515263487990-61b07816b324"),
  },
  vertical: {
    folder: "proionta/katheta-systimata",
    title: "Κάθετα συστήματα",
    path: "/klassika-systimata-skiasis/katheta-systimata",
    fallback: unsplash("photo-1600607686527-6fb886090705"),
  },
  kapotines: {
    folder: "proionta/kapotines",
    title: "Καποτίνες",
    path: "/klassika-systimata-skiasis/kapotines",
    fallback: unsplash("photo-1511452885600-a3d2c9148a31"),
  },
  pergola: {
    folder: "proionta/pergkotentes",
    title: "Περγκοτέντες",
    path: "/pergkotentes",
    fallback: unsplash("photo-1696846912973-3233cc80bf86"),
  },
  bioclimatic: {
    folder: "proionta/vioklimatikes-pergkoles",
    title: "Βιοκλιματικές πέργκολες",
    path: "/vioklimatikes-pergkoles",
    fallback: unsplash("photo-1696846912293-9a8013e17403"),
  },
  umbrellas: {
    folder: "proionta/ompreles",
    title: "Ομπρέλες",
    path: "/alla-systimata-skiasis",
    fallback: "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1800",
  },
  parking: {
    folder: "proionta/prostasia-oximatos",
    title: "Προστασία οχήματος",
    path: "/alla-systimata-skiasis",
    fallback: unsplash("photo-1506521781263-d8422e82f27a"),
  },
  windbreakers: {
    folder: "proionta/anemothrafstes-tzamia",
    title: "Ανεμοθραύστες & τζάμια",
    path: "/alla-systimata-skiasis",
  },
  special: {
    folder: "proionta/eidikes-kataskeves",
    title: "Ειδικές κατασκευές",
    path: "/alla-systimata-skiasis",
  },
  home: {
    folder: "selides/arxiki",
    title: "Αρχική σελίδα",
    fallback: unsplash("photo-1600585154340-be6161a56a0c"),
    showInProjects: false,
  },
  company: {
    folder: "selides/etaireia",
    title: "Η εταιρεία",
    fallback: unsplash("photo-1515263487990-61b07816b324"),
    showInProjects: false,
  },
  appHomes: {
    folder: "selides/efarmoges-katoikies",
    title: "Εφαρμογές σε κατοικίες",
    fallback: unsplash("photo-1600585154340-be6161a56a0c"),
    showInProjects: false,
  },
  appHospitality: {
    folder: "selides/efarmoges-estiasi",
    title: "Εφαρμογές σε χώρους εστίασης",
    fallback: "https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=1400",
    showInProjects: false,
  },
  appSpecial: {
    folder: "selides/efarmoges-eidikes",
    title: "Ειδικές εφαρμογές",
    fallback: unsplash("photo-1515263487990-61b07816b324"),
    showInProjects: false,
  },
} satisfies Record<string, AlbumConfig>;

const fullImages = import.meta.glob<string>(
  "./photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  {
    eager: true,
    import: "default",
    query: { w: "2000", format: "webp", quality: "78" },
  },
);
const thumbImages = import.meta.glob<string>(
  "./photos/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}",
  {
    eager: true,
    import: "default",
    query: { w: "900", format: "webp", quality: "72" },
  },
);

const naturalSort = new Intl.Collator("el", { numeric: true, sensitivity: "base" });

function isCoverName(file: string) {
  return /(kentriki|κεντρικ|cover|hero)/i.test(file);
}

function buildAlbum(key: AlbumKey): Album {
  const config: AlbumConfig = albumConfig[key];
  const prefix = `./photos/${config.folder}/`;
  const files = Object.keys(fullImages)
    .filter((path) => path.startsWith(prefix) && !path.slice(prefix.length).includes("/"))
    .sort((a, b) => naturalSort.compare(a, b));

  const photos: Photo[] = files.map((path, index) => ({
    src: fullImages[path],
    thumb: thumbImages[path] ?? fullImages[path],
    alt: `${config.title} – φωτογραφία ${index + 1}`,
    file: path.slice(prefix.length),
  }));

  const coverIndex = Math.max(0, photos.findIndex((photo) => isCoverName(photo.file)));
  const fallbackPhoto: Photo = {
    src: config.fallback ?? "",
    thumb: config.fallback ?? "",
    alt: config.title,
    file: "",
  };

  return {
    key,
    title: config.title,
    folder: config.folder,
    cover: photos[coverIndex] ?? fallbackPhoto,
    photos,
    isFallback: photos.length === 0,
    path: config.path,
    showInProjects: config.showInProjects ?? true,
  };
}

export const albums = Object.fromEntries(
  (Object.keys(albumConfig) as AlbumKey[]).map((key) => [key, buildAlbum(key)]),
) as Record<AlbumKey, Album>;

/** Άλμπουμ προϊόντων με τουλάχιστον μία φωτογραφία, για τη σελίδα «Έργα». */
export const projectAlbums = Object.values(albums).filter(
  (album) => album.showInProjects && album.photos.length > 0,
);
