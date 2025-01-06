// FORMAT FILE UPLOAD DATE
let uploadDate = document.querySelector(".upload-date")
uploadDate.textContent = uploadDate.textContent.trim().split(" ", 4).reverse().slice(0, -1).reverse().join(" ");

let openShareFormButton = document.querySelector(".file-open-share-form-button");
let closeShareFormButton = document.querySelector("#close-share-form-button");
let shareForm = document.querySelector(".file-share-form");

openShareFormButton.addEventListener("click", () => shareForm.style.visibility = "visible");
closeShareFormButton.addEventListener("click", () => shareForm.style.visibility = "hidden")
