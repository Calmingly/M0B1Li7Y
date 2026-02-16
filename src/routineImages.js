const SOURCE_URL = "https://bend.com/routines/f1JxVbwHQfKbx84VgI4i4A/midday-mobility-starter";
const CACHE_KEY = "m0b1li7y.routineImages.v2";
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
  childPose: ["Child Pose"],
  postureReset: ["Posture Reset"],
  pushUps: ["Wall Push Ups"],
  walk: ["Walk"]
};

// Stable, directly-loadable Bend-hosted image assets.
const FALLBACK_IMAGE_URLS = {
  armCircles: "https://bend.com/images/image_00045a-2f75c4d8cdd6ee8a95712682b95086a7.png?vsn=d",
  trunkRotations: "https://bend.com/images/image_00046a-80efdaf530016dcb1b8035e27d7c212d.png?vsn=d",
  sideBends: "https://bend.com/images/image_00059a-80783938e2ae8b9eb36ec0d8a7d6f97c.png?vsn=d",
  legSwingsLeft: "https://bend.com/images/image_00146-dc43f06eb4e8df14af38706ccf086b3e.png?vsn=d",
  legSwingsRight: "https://bend.com/images/image_00005-3fa57823222213be590cd6f92342f8b9.png?vsn=d",
  kneesToChest: "https://bend.com/images/image_00006-f3b02ce7c0ad85f7818ea346e8d29c67.png?vsn=d",
  figureFourLeft: "https://bend.com/images/image_00034-fbb468e32c51d0c9bb02e2e311aecad0.png?vsn=d",
  figureFourRight: "https://bend.com/images/image_00019-dd281b9bd56c8766e29fd9a8035bc02a.png?vsn=d",
  childPose: "https://bend.com/images/image_00025-e025b695536978822c6644cfa0c439dd.png?vsn=d",
  postureReset: "https://bend.com/images/image_00014-a1c5d8f2b298b4517ff22511b2826269.png?vsn=d",
  pushUps: "https://bend.com/images/image_00084-8e805d7a0ec3fa7a2df7de6e3c120e31.png?vsn=d",
  walk: "https://bend.com/images/image_00106-80e592e3703313388c1dcc1f31d201ac.png?vsn=d"
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

function toAbsoluteUrl(url) {
  try {
    return new URL(url, SOURCE_URL).toString();
  } catch {
    return "";
  }
}

export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

  persistImageMap(FALLBACK_IMAGE_URLS);
  return buildImageInfoMap(FALLBACK_IMAGE_URLS);
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
