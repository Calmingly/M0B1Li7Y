const CACHE_KEY = "m0b1li7y.routineImages.humanGif.v4";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_FILE_BY_STEP = {
  armCircles: "armcircles.gif",
  trunkRotations: "trunkrotation.gif",
  sideBends: "sidebend.gif",
  legSwingsLeft: "legswings.gif",
  legSwingsRight: "legswings.gif",
  kneesToChest: "kneestochest.gif",
  figureFourLeft: "lyingfigurefour.gif",
  figureFourRight: "lyingfigurefour.gif",
  childPose: "childspose.gif",
  postureReset: "overheadreach.gif",
  plank: "demo-plank.svg",
  pushUps: "sidebend-seated.gif",
  walk: "toetouchtwist.gif"
};

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

function buildStaticImageMap() {
  return Object.fromEntries(
    Object.entries(IMAGE_FILE_BY_STEP).map(([stepId, filename]) => [
      stepId,
      `${LOCAL_MEDIA_DIR}/${filename}`
    ])
  );
}

export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

  const imageMap = buildStaticImageMap();
  persistImageMap(imageMap);
  return buildImageInfoMap(imageMap);
}

function buildImageInfoMap(urlMap) {
  const map = {};

  for (const stepId of Object.keys(IMAGE_FILE_BY_STEP)) {
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
