console.log("Testing")

let openAddFolder = document.querySelector("#add-folder-button");
let openAddFile = document.querySelector("#add-file-button");
let closeAddFolder = document.querySelector("#add-folder-close");
let closeAddFile = document.querySelector("#add-file-close");
let addFolderForm = document.querySelector(".add-folder-form-container");
let addFileForm = document.querySelector(".add-file-form-container");

openAddFolder.addEventListener("click", (event) => {
    addFolderForm.style.visibility = "visible";
})

closeAddFolder.addEventListener("click", (event) => {
    addFolderForm.style.visibility = "hidden";
})

openAddFile.addEventListener("click", (event) => {
    addFileForm.style.visibility = "visible";
})

closeAddFile.addEventListener("click", (event) => {
    addFileForm.style.visibility = "hidden";
})