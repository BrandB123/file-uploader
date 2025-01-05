
let editButtons = document.querySelectorAll(".folder-edit-button");
let deleteButtons = document.querySelectorAll(".folder-delete-button");

editButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let updateForm = document.querySelector(`.update-folder-form-${button.classList[1]}`);
        let input = document.querySelector(`.new-folder-name-input-${button.classList[1]}`);
        let cancelButton = document.querySelector(`.cancel-folder-name-${button.classList[1]}`);

        let originalFolderName = input.value;

        updateForm.style.visibility = "visible"

        cancelButton.addEventListener("click", () => {
            closeForm(updateForm, input, originalFolderName);
            cancelButton.removeEventListener("click", closeForm)
        });
    });
});

deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let deleteForm = document.querySelector(`.delete-folder-form-${button.classList[1]}`)
        let cancelButton = document.querySelector(`.folder-cancel-delete-button-${button.classList[1]}`)
        console.log(deleteForm);

        deleteForm.style.visibility = "visible";
        
        cancelButton.addEventListener("click", () => {
            closeForm(deleteForm);
            cancelButton.removeEventListener("click", closeForm)
        })

    })
});

function closeForm(formElement, inputElement, inputValue){
    if (inputElement && inputValue){
        inputElement.value = inputValue;
    }

    formElement.style.visibility = "hidden";
}
