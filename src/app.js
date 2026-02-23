const routineImages = [
  "armcircles.png",
  "briskwalk.png",
  "childspose.png",
  "counterpushups.png",
  "kneestochest.png",
  "legswings.png",
  "lyingfigurefour.png",
  "overheadreach.png",
  "plank.png",
  "sidebends.png",
  "toetouchtwist.png",
  "trunkrotation.png"
];

const iconImages = [
  "icon-192.png",
  "icon-512.png",
  "icon.svg",
  "yoga-2svgrepo-com.svg",
  "yoga-svgrepo-com.svg"
];

const summary = document.getElementById("summary");
const routineGrid = document.getElementById("routine-grid");
const iconGrid = document.getElementById("icon-grid");

if (summary) {
  summary.textContent = `Saved assets: ${routineImages.length} routine images + ${iconImages.length} icon images.`;
}

renderGrid(routineGrid, "img", routineImages);
renderGrid(iconGrid, "icons", iconImages);

function renderGrid(container, basePath, fileNames) {
  if (!container) return;

  const fragment = document.createDocumentFragment();

  for (const fileName of fileNames) {
    const card = document.createElement("figure");
    card.className = "asset-card";

    const image = document.createElement("img");
    image.src = `./${basePath}/${fileName}`;
    image.alt = fileName;
    image.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.textContent = fileName;

    card.append(image, caption);
    fragment.append(card);
  }

  container.append(fragment);
}
