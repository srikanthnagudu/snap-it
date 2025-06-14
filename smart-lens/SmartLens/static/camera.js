let video = document.getElementById("camera");
let canvas = document.createElement("canvas");
let captureButton = document.getElementById("capture-button");
let captureOptions = document.getElementById("capture-options");
let imageInput = document.getElementById("image-data");
let stream;

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then(function (stream) {
    video.srcObject = stream;
    video.play();
  })
  .catch(function (err) {
    console.error("Error accessing camera: " + err);
  });

// function capture() {
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   let context = canvas.getContext("2d");
//   context.drawImage(video, 0, 0, canvas.width, canvas.height);
//   let dataURL = canvas.toDataURL("image/png");
//   imageInput.value = dataURL;
//   video.pause();
//   captureButton.style.display = "none";
//   captureOptions.style.display = "block";
// }

function capture() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  let dataURL = canvas.toDataURL("image/png");

  let imageSize = (dataURL.length * 3) / 4 / 1024; // Calculate image size in KB

  if (imageSize > 100) {
    compressAndCheckImage();
    return;
  }

  imageInput.value = dataURL;
  video.pause();
  captureButton.style.display = "none";
  captureOptions.style.display = "block";
}

function compressAndCheckImage() {
  let quality = 0.8; // Initial compression quality (0 to 1)
  let compressedDataURL = compressImage(canvas, quality);

  let imageSize = (compressedDataURL.length * 3) / 4 / 1024;

  while (imageSize > 100 && quality > 0.2) {
    quality -= 0.1; // Decrease quality to compress more
    compressedDataURL = compressImage(canvas, quality);
    imageSize = (compressedDataURL.length * 3) / 4 / 1024;
  }

  if (imageSize > 100) {
    alert("The image is still too large after compression. Please try again.");
    return;
  }

  imageInput.value = compressedDataURL;
  video.pause();
  captureButton.style.display = "none";
  captureOptions.style.display = "block";
}

function compressImage(canvas, quality) {
  let compressedDataURL = canvas.toDataURL("image/jpeg", quality); // Convert to JPEG format with compression quality
  return compressedDataURL;
}

function uploadFile() {
  let file = document.getElementById("file-input").files[0];
  if (file) {
    if (file.size > 100 * 1024) {
      alert("The image is too large. Please upload an image under 100KB.");
      return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
      let dataURL = e.target.result;
      imageInput.value = dataURL;
      captureButton.style.display = "none";
      captureOptions.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please select a file to upload.");
  }
}

function retry() {
  video.play();
  captureButton.style.display = "block";
  captureOptions.style.display = "none";
}
