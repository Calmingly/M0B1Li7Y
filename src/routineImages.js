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

function parseDocumentForImageMap(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const candidates = Array.from(doc.querySelectorAll("img"));

  const discoveredByName = {};
  for (const img of candidates) {
    const combined = `${img.getAttribute("alt") || ""} ${img.getAttribute("title") || ""}`.trim();
    if (!combined) continue;
    const normalized = combined.toLowerCase();
    const src = img.currentSrc || img.src || img.getAttribute("src");
    if (!src) continue;
    discoveredByName[normalized] = new URL(src, SOURCE_URL).toString();
  }

  const mapped = {};
  for (const [stepId, names] of Object.entries(EXERCISE_QUERY_MAP)) {
    const foundName = Object.keys(discoveredByName).find((key) =>
      names.some((name) => key.includes(name.toLowerCase()))
    );
    if (foundName) mapped[stepId] = discoveredByName[foundName];
  }

  return mapped;
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
  for (const [stepId, url] of Object.entries(urlMap)) {
    map[stepId] = {
      url,
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
