// import tfjs from "https://esm.sh/@tensorflow/tfjs"
// import cocoSsd from "https://esm.sh/@tensorflow-models/coco-ssd"
const img = document.querySelector("#img");
const imgMount = document.querySelector(".img-container");
const urlInput = document.getElementById("img-url");
const updateURLForm = document.forms["image-url-changer"];
const analyseImageButton = document.getElementById("analyse");
let analyzingIndicator = null;

let canvas = null;

updateURLForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(img);
  img.src = urlInput.value;
  if (imgMount.contains(canvas)) {
    canvas.replaceWith(img);
  }
  updateURLForm.reset();
});

img.onerror = () => {
  img.alt = "incorrect url";
  imageReady = false;
  analyseImageButton.setAttribute("disabled", "disabled");
};

img.onload = () => {
  imageReady = true;
  analyseImageButton.removeAttribute("disabled");
};

function showAnalysing() {
  if (!analyzingIndicator) {
    analyzingIndicator = document.createElement("span");
    analyzingIndicator.textContent = "Analysing...";
    analyzingIndicator.classList.add("analysing");
    analyseImageButton.after(analyzingIndicator);
  }
}

function hideAnalysing() {
  if (analyzingIndicator) {
    analyzingIndicator.remove();
  }
}

function drawImage(predictions, image) {
  canvas = document.createElement("canvas");

  // const customWidth = image.width;
  // const customHeight = image.height;

  const customWidth = image.naturalWidth;
  const customHeight = image.naturalHeight;
  console.log({ customWidth, customHeight });


  canvas.width = customWidth;
  canvas.height = customHeight;

  // canvas.width = image.naturalWidth;
  // canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");

  context.drawImage(
    image,
    0,
    0,
    customWidth,
    customHeight,
    0,
    0,
    customWidth,
    customHeight
  );
  context.font = "12px arial";

  predictions.forEach((prediction) => {
    context.beginPath();
    context.rect(...prediction.bbox);
    context.lineWidth = 1;
    context.strokeStyle = "green";
    context.fillStyle = "white";
    context.stroke();

    context.fillText(
      `${prediction.class} (${prediction.score.toFixed(3)})`,
      prediction.bbox[0],
      prediction.bbox[1]
    );
  });

  image.replaceWith(canvas);
  hideAnalysing();
}

async function getPredictions() {
  cocoSsd.load().then((model) => {
    model.detect(img).then((predictions) => {
      console.log(predictions);
      drawImage(predictions, img);
    });
  });
}

analyseImageButton.addEventListener("click", () => {
  showAnalysing();
  getPredictions();
});

// getPredictions(); // <-- do it onload
