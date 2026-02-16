const SOURCE_URL = "https://bend.com/routines/f1JxVbwHQfKbx84VgI4i4A/midday-mobility-starter";
const CACHE_KEY = "m0b1li7y.routineImages.v1";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const EXERCISE_QUERY_MAP = {
  armCircles: ["Arm Circles"],
  trunkRotations: ["Trunk Rotations", "Toe Touch Twist"],
  sideBends: ["Side Bend"],
  legSwingsLeft: ["Leg Swings"],
  legSwingsRight: ["Leg Swings"],
  kneesToChest: ["Knees to Chest"],
  figureFourLeft: ["Lying Figure Four"],
  figureFourRight: ["Lying Figure Four"],
  childPose: ["Child Pose"]
};

// Keep as fallback only when discovery fails.
const FALLBACK_IMAGE_URLS = {
  armCircles: "https://bend.com/images/routines/arm-circles.jpg",
  trunkRotations: "https://bend.com/images/routines/toe-touch-twist.jpg",
  sideBends: "https://bend.com/images/routines/side-bend.jpg",
  legSwingsLeft: "https://bend.com/images/routines/leg-swings.jpg",
  legSwingsRight: "https://bend.com/images/routines/leg-swings.jpg",
  kneesToChest: "https://bend.com/images/routines/knees-to-chest.jpg",
  figureFourLeft: "https://bend.com/images/routines/lying-figure-four.jpg",
  figureFourRight: "https://bend.com/images/routines/lying-figure-four.jpg",
  childPose: "https://bend.com/images/routines/child-pose.jpg"
};

function readCachedImageMap() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) return null;
    return parsed.imageMap;
  } catch {
    return null;
  }
}

function persistImageMap(imageMap) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ imageMap, expiresAt: Date.now() + CACHE_TTL_MS })
    );
  } catch {
    // localStorage may be unavailable; ignore.
  }
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isLikelyImageUrl(url) {
  if (!url || typeof url !== "string") return false;
  const lower = url.toLowerCase();
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("//") ||
    lower.startsWith("/")
  );
}

function extractUrlFromSrcset(srcset) {
  if (!srcset) return "";
  const first = srcset.split(",")[0]?.trim() || "";
  return first.split(/\s+/)[0] || "";
}

function toAbsoluteUrl(url) {
  try {
    return new URL(url, SOURCE_URL).toString();
  } catch {
    return "";
  }
}

function getImgSrcCandidate(img) {
  const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
  const srcsetUrl = extractUrlFromSrcset(srcset);

  return (
    img.currentSrc ||
    img.getAttribute("src") ||
    img.getAttribute("data-src") ||
    img.getAttribute("data-lazy-src") ||
    srcsetUrl
  );
}

function scanImageElements(doc) {
  const byName = {};
  const images = Array.from(doc.querySelectorAll("img"));

  for (const img of images) {
    const label = [
      img.getAttribute("alt"),
      img.getAttribute("title"),
      img.getAttribute("aria-label"),
      img.getAttribute("data-exercise"),
      img.getAttribute("data-name")
    ]
      .filter(Boolean)
      .join(" ");

    const normalizedLabel = normalizeText(label);
    if (!normalizedLabel) continue;

    const rawSrc = getImgSrcCandidate(img);
    if (!isLikelyImageUrl(rawSrc)) continue;

    const abs = toAbsoluteUrl(rawSrc);
    if (!abs) continue;

    byName[normalizedLabel] = abs;
  }

  return byName;
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function walkJsonForExerciseImages(node, outMap, ancestry = []) {
  if (!node) return;

  if (Array.isArray(node)) {
    node.forEach((item) => walkJsonForExerciseImages(item, outMap, ancestry));
    return;
  }

  if (typeof node !== "object") return;

  const keys = Object.keys(node);
  const nameCandidate =
    node.name || node.title || node.exercise || node.exerciseName || node.displayName || "";
  const normalizedName = normalizeText(nameCandidate);

  const imageCandidate =
    node.imageUrl ||
    node.image ||
    node.thumbnail ||
    node.thumbnailUrl ||
    node.mediaUrl ||
    node.src ||
    node.url ||
    "";

  if (normalizedName && isLikelyImageUrl(imageCandidate)) {
    const abs = toAbsoluteUrl(imageCandidate);
    if (abs) outMap[normalizedName] = abs;
  }

  // Catch nested { exercise: { name }, image: { url } } patterns.
  const imageObjUrl =
    node.image && typeof node.image === "object" ? node.image.url || node.image.src : "";
  if (normalizedName && isLikelyImageUrl(imageObjUrl)) {
    const abs = toAbsoluteUrl(imageObjUrl);
    if (abs) outMap[normalizedName] = abs;
  }

  // Mild heuristic: if object looks exercise-related by key names, attempt to pair nearest strings+urls.
  const looksExerciseLike =
    keys.some((k) => /exercise|movement|routine|pose|stretch/i.test(k)) ||
    ancestry.some((k) => /exercise|movement|routine|pose|stretch/i.test(k));

  if (looksExerciseLike) {
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "string" && isLikelyImageUrl(v)) {
        const probableName = normalizeText(nameCandidate || k);
        const abs = toAbsoluteUrl(v);
        if (probableName && abs) outMap[probableName] = abs;
      }
    }
  }

  for (const [k, v] of Object.entries(node)) {
    walkJsonForExerciseImages(v, outMap, ancestry.concat(k));
  }
}

function scanScriptPayloads(doc) {
  const outMap = {};
  const scripts = Array.from(
    doc.querySelectorAll('script[type="application/json"], script#__NEXT_DATA__, script')
  );

  for (const script of scripts) {
    const text = (script.textContent || "").trim();
    if (!text) continue;

    const likelyJson =
      script.type === "application/json" ||
      script.id === "__NEXT_DATA__" ||
      text.startsWith("{") ||
      text.startsWith("[");

    if (!likelyJson) continue;

    const parsed = safeJsonParse(text);
    if (!parsed) continue;

    walkJsonForExerciseImages(parsed, outMap);
  }

  return outMap;
}

function mapDiscoveredNamesToSteps(discoveredByName) {
  const mapped = {};

  for (const [stepId, names] of Object.entries(EXERCISE_QUERY_MAP)) {
    const normalizedQueries = names.map((n) => normalizeText(n));

    const foundKey = Object.keys(discoveredByName).find((key) =>
      normalizedQueries.some((query) => key.includes(query))
    );

    if (!foundKey) continue;

    const candidateUrl = discoveredByName[foundKey];
    if (!isLikelyImageUrl(candidateUrl)) continue;

    const abs = toAbsoluteUrl(candidateUrl);
    if (abs) mapped[stepId] = abs;
  }

  return mapped;
}

function parseDocumentForImageMap(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const fromScripts = scanScriptPayloads(doc);
  const fromImages = scanImageElements(doc);

  // Prefer script payload discoveries first, then DOM image metadata.
  const discoveredByName = { ...fromImages, ...fromScripts };

  return mapDiscoveredNamesToSteps(discoveredByName);
}

async function fetchBendRoutineHtml() {
  const direct = await fetch(SOURCE_URL, { cache: "no-store" });
  if (direct.ok) return direct.text();
  throw new Error("Unable to load Bend routine page");
}

async function discoverImageUrls() {
  try {
    const html = await fetchBendRoutineHtml();
    return parseDocumentForImageMap(html);
  } catch {
    return {};
  }
}

export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

  const discovered = await discoverImageUrls();
  const merged = { ...FALLBACK_IMAGE_URLS, ...discovered };
  persistImageMap(merged);

  return buildImageInfoMap(merged);
}

function buildImageInfoMap(urlMap) {
  const map = {};
  for (const stepId of Object.keys(EXERCISE_QUERY_MAP)) {
    const url = urlMap[stepId];
    if (!isLikelyImageUrl(url)) continue;

    const abs = toAbsoluteUrl(url);
    if (!abs) continue;

    map[stepId] = {
      url: abs,
      alt: `Demonstration of ${humanize(stepId)}`,
      sourceUrl: SOURCE_URL,
      sourceName: "Bend"
    };
  }
  return map;
}

function humanize(stepId) {
  return stepId
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
