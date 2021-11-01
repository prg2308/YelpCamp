const button = document.querySelector('.btn')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const confPassword = document.querySelector('#confPassword')
const emailFeedback = document.querySelector('.email-feedback')
const confFeedback = document.querySelector('.conf-feedback')
const passwordFeedback = document.querySelector('.password-feedback')
const showPassword = document.querySelector("#showPassword")
const username = document.querySelector('#username')
const usernameFeedback = document.querySelector('.username-feedback')

button.addEventListener('click', function () {

    if (!email.checkValidity() && email.value) {
        emailFeedback.innerText = 'Invalid Email'
    }

    if (!password.checkValidity() && password.value) {
        if (password.value.length < 8) {
            passwordFeedback.innerText = 'Must be atleast 8 charcters'
        } else {
            passwordFeedback.innerText = 'Must have atleast One Digit and One Character'
        }
    }
    if (!confPassword.checkValidity() && confPassword.value) {
        confFeedback.innerText = ''
    }

})

showPassword.addEventListener('change', function () {
    if (this.checked) {
        password.type = 'text'
        confPassword.type = 'text'
    } else {
        password.type = 'password'
        confPassword.type = 'password'
    }
})