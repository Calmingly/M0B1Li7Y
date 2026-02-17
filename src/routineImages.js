<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v3";
=======
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v7";
>>>>>>> theirs
=======
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v7";
>>>>>>> theirs
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_FILE_BY_STEP = {
  armCircles: "armcircles.gif",
<<<<<<< ours
<<<<<<< ours
  trunkRotations: "trunkrotations.gif",
  sideBends: "sidebends.gif",
  legSwingsLeft: "legswings.gif",
  legSwingsRight: "legswings.gif",
  kneesToChest: "kneestochest.gif",
  figureFourLeft: "lyingfigurefour.gif",
  figureFourRight: "lyingfigurefour.gif",
  childPose: "childspose.gif",
  postureReset: "posturereset.gif",
  pushUps: "pushups.gif",
  walk: "walk.gif"

=======
const CACHE_KEY = "m0b1li7y.routineImages.localGif.v5";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const LOCAL_MEDIA_DIR = "./img";

const IMAGE_CANDIDATES_BY_STEP = {
  armCircles: ["armcircles.gif"],
  trunkRotations: ["trunkrotations.gif"],
  sideBends: ["sidebends.gif"],
  legSwingsLeft: ["legswings.gif"],
  legSwingsRight: ["legswings.gif"],
  kneesToChest: ["kneestochest.gif", "KneesToChest.gif"],
  figureFourLeft: ["lyingfigurefour.gif"],
  figureFourRight: ["lyingfigurefour.gif"],
  childPose: ["childspose.gif"],
  postureReset: ["overheadreach.gif"],
  pushUps: ["sidebend-seated.gif"],
  walk: ["toetouchtwist.gif"]
>>>>>>> theirs
=======
=======
>>>>>>> theirs
  trunkRotations: "trunkrotation.gif",
  sideBends: "sidebend.gif",
  legSwingsLeft: "legswings.gif",
  legSwingsRight: "legswings.gif",
  kneesToChest: "kneestochest.gif",
  figureFourLeft: "lyingfigurefour.gif",
  figureFourRight: "lyingfigurefour.gif",
  childPose: "childspose.gif",
  postureReset: "overheadreach.gif",
  pushUps: "sidebend-seated.gif",
  walk: "toetouchtwist.gif"
<<<<<<< ours
>>>>>>> theirs
=======
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
<<<<<<< ours
<<<<<<< ours
=======
>>>>>>> theirs
=======
>>>>>>> theirs
function buildStaticImageMap() {
  return Object.fromEntries(
    Object.entries(IMAGE_FILE_BY_STEP).map(([stepId, filename]) => [
      stepId,
      `${LOCAL_MEDIA_DIR}/${filename}`
    ])
<<<<<<< ours
<<<<<<< ours
  );
}

=======
async function discoverImageMap() {
  const entries = await Promise.all(
    Object.entries(IMAGE_CANDIDATES_BY_STEP).map(async ([stepId, filenames]) => {
      const url = await findFirstExistingImageUrl(filenames);
      return [stepId, url];
    })
=======
>>>>>>> theirs
=======
>>>>>>> theirs
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

<<<<<<< ours
<<<<<<< ours
async function resourceExists(url) {
  try {
    const response = await fetch(url, { method: "GET", cache: "no-store" });
    return response.ok;
  } catch {
    return false;
  }
}

>>>>>>> theirs
=======
>>>>>>> theirs
=======
>>>>>>> theirs
export async function loadRoutineImages() {
  const cached = readCachedImageMap();
  if (cached) return buildImageInfoMap(cached);

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  const imageMap = buildStaticImageMap();
=======
  const imageMap = await discoverImageMap();
>>>>>>> theirs
=======
  const imageMap = buildStaticImageMap();
>>>>>>> theirs
=======
  const imageMap = buildStaticImageMap();
>>>>>>> theirs
  persistImageMap(imageMap);
  return buildImageInfoMap(imageMap);
}

function buildImageInfoMap(urlMap) {
  const map = {};

<<<<<<< ours
<<<<<<< ours
<<<<<<< ours
  for (const stepId of Object.keys(IMAGE_FILE_BY_STEP)) {
=======
  for (const stepId of Object.keys(IMAGE_CANDIDATES_BY_STEP)) {
>>>>>>> theirs
=======
  for (const stepId of Object.keys(IMAGE_FILE_BY_STEP)) {
>>>>>>> theirs
=======
  for (const stepId of Object.keys(IMAGE_FILE_BY_STEP)) {
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
