<<<<<<< ours
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v3";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_FILE_BY_STEP = {
  armCircles: "armcircles.gif",
  trunkRotations: "trunkrotations.gif",
  sideBends: "sidebends.gif",
  legSwingsLeft: "legswingsleft.gif",
  legSwingsRight: "legswingsright.gif",
  kneesToChest: "kneestochest.gif",
  figureFourLeft: "figurefourleft.gif",
  figureFourRight: "figurefourright.gif",
  childPose: "childpose.gif",
  postureReset: "posturereset.gif",
  pushUps: "pushups.gif",
  walk: "walk.gif"
=======
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v5";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_CANDIDATES_BY_STEP = {
  armCircles: ["armcircles.gif", "ArmCircles.gif"],
  trunkRotations: ["trunkrotations.gif", "TrunkRotation.gif"],
  sideBends: ["sidebends.gif", "SideBend.gif"],
  legSwingsLeft: ["legswingsleft.gif", "legswings.gif", "LegSwings.gif"],
  legSwingsRight: ["legswingsright.gif", "legswings.gif", "LegSwings.gif"],
  kneesToChest: ["kneestochest.gif", "KneesToChest.gif"],
  figureFourLeft: ["figurefourleft.gif", "lyingfigurefour.gif", "LyingFigureFour.gif"],
  figureFourRight: ["figurefourright.gif", "lyingfigurefour.gif", "LyingFigureFour.gif"],
  childPose: ["childpose.gif", "childspose.gif", "ChildsPose.gif"],
  postureReset: ["posturereset.gif", "overheadreach.gif", "OverheadReach.gif"],
  pushUps: ["pushups.gif", "sidebend-seated.gif", "SideBend-Seated.gif"],
  walk: ["walk.gif", "toetouchtwist.gif", "ToeTouchTwist.gif"]
>>>>>>> theirs
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

<<<<<<< ours
function buildStaticImageMap() {
  return Object.fromEntries(
    Object.entries(IMAGE_FILE_BY_STEP).map(([stepId, filename]) => [
      stepId,
      `${LOCAL_MEDIA_DIR}/${filename}`
    ])
  );
}

=======
async function discoverImageMap() {
  const entries = await Promise.all(
    Object.entries(IMAGE_CANDIDATES_BY_STEP).map(async ([stepId, filenames]) => {
      const url = await findFirstExistingImageUrl(filenames);
      return [stepId, url];
    })
  );

  return Object.fromEntries(entries.filter(([, url]) => Boolean(url)));
}

async function findFirstExistingImageUrl(filenames) {
  for (const filename of filenames) {
    const url = `${LOCAL_MEDIA_DIR}/${filename}`;
    // eslint-disable-next-line no-await-in-loop
    if (await resourceExists(url)) return url;
  }

  return null;
}

async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

>>>>>>> theirs
export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

<<<<<<< ours
  const imageMap = buildStaticImageMap();
=======
  const imageMap = await discoverImageMap();
>>>>>>> theirs
  persistImageMap(imageMap);
  return buildImageInfoMap(imageMap);
}

function buildImageInfoMap(urlMap) {
  const map = {};

<<<<<<< ours
  for (const stepId of Object.keys(IMAGE_FILE_BY_STEP)) {
=======
  for (const stepId of Object.keys(IMAGE_CANDIDATES_BY_STEP)) {
>>>>>>> theirs
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
