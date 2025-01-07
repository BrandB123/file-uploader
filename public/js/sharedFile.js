// FORMAT FILE UPLOAD DATE
let uploadDate = document.querySelector(".shared-upload-date")
uploadDate.textContent = uploadDate.textContent.trim().split(" ", 4).reverse().slice(0, -1).reverse().join(" ");