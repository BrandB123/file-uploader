console.log("Hello world");


// FOR /sign-up route
function dontAddUser(event){
    passwordConfirmationInput.style = "border-color: red;"
    event.preventDefault()
}

const passwordInput = document.querySelector("#password");
const passwordConfirmationInput = document.querySelector("#password-confirmation");
const submitButton = document.querySelector("#add-user-button")

passwordConfirmationInput.addEventListener("change", () => {
    if (passwordInput.value !== passwordConfirmationInput.value){
        submitButton.addEventListener("click", dontAddUser)
    }
})

passwordConfirmationInput.addEventListener("change", () => {
    if (passwordInput.value === passwordConfirmationInput.value){
        passwordConfirmationInput.style = "border-color: black"
        submitButton.removeEventListener("click", dontAddUser)
    }
})