const CACHE_KEY = "m0b1li7y.routineImages.localGif.v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";
const STEP_IDS = [
  "armCircles",
  "trunkRotations",
  "sideBends",
  "legSwingsLeft",
  "legSwingsRight",
  "kneesToChest",
  "figureFourLeft",
  "figureFourRight",
  "childPose",
  "postureReset",
  "pushUps",
  "walk"
];

function readCachedImageMap() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.imageMap || Date.now() > parsed.expiresAt) return null;
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

function toKebabCase(stepId) {
  return stepId
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function buildCandidates(stepId) {
  const kebab = toKebabCase(stepId);
  const compact = stepId.toLowerCase();

  return Array.from(
    new Set([
      `${LOCAL_MEDIA_DIR}/${stepId}.gif`,
      `${LOCAL_MEDIA_DIR}/${kebab}.gif`,
      `${LOCAL_MEDIA_DIR}/${compact}.gif`,
      `${LOCAL_MEDIA_DIR}/${stepId}.webp`,
      `${LOCAL_MEDIA_DIR}/${kebab}.webp`,
      `${LOCAL_MEDIA_DIR}/${compact}.webp`
    ])
  );
}

async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

async function discoverLocalGifMap() {
  const found = {};

  for (const stepId of STEP_IDS) {
    const candidates = buildCandidates(stepId);

    for (const candidate of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const exists = await resourceExists(candidate);
      if (!exists) continue;

      found[stepId] = candidate;
      break;
    }
  }

  return found;
}

export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

  const discovered = await discoverLocalGifMap();
  persistImageMap(discovered);
  return buildImageInfoMap(discovered);
}

function buildImageInfoMap(urlMap) {
  const map = {};

  for (const stepId of STEP_IDS) {
    const url = urlMap?.[stepId];
    if (!url) continue;

    map[stepId] = {
      url,
      alt: `Demonstration of ${humanize(stepId)}`,
      sourceUrl: LOCAL_MEDIA_DIR,
      sourceName: "Local routine media"
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
