const CACHE_KEY = "m0b1li7y.routineImages.demoOnly.v7";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_FILE_BY_STEP = {
  armCircles: "armcircles.png",
  trunkRotations: "trunkrotation.png",
  sideBends: "sidebends.png",
  legSwings: "legswings.png",
  kneesToChest: "kneestochest.png",
  figureFour: "lyingfigurefour.png",
  childPose: "childspose.png",
  postureReset: "overheadreach.png",
  plank: "plank.png",
  counterPushups: "counterpushups.png",
  briskWalk: "briskwalk.png",
  toeTouchTwist: "toetouchtwist.png"
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
    Object.entries(IMAGE_FILE_BY_STEP).map(([stepId, filename]) => {
      const fallbackUrl = `${LOCAL_MEDIA_DIR}/${filename}`;
      const optimizedUrl = toOptimizedUrl(fallbackUrl);
      return [
        stepId,
        {
          url: optimizedUrl,
          fallbackUrl
        }
      ];
    })
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
    const entry = urlMap?.[stepId];
    if (!entry) continue;

    const url = typeof entry === "string" ? entry : entry.url;
    const fallbackUrl = typeof entry === "string" ? null : entry.fallbackUrl || null;
    if (!url) continue;

    map[stepId] = {
      url,
      fallbackUrl,
      alt: `Demonstration of ${humanize(stepId)}`,
      sourceUrl: LOCAL_MEDIA_DIR,
      sourceName: "Local routine media"
    };
  }

  return map;
}

function toOptimizedUrl(url) {
  return url.replace(/\.(png|jpg|jpeg)$/i, ".webp");
}

function humanize(stepId) {
  return stepId
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}
