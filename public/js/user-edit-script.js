const button = document.querySelector('.btn')
const email = document.querySelector('#email')
const emailFeedback = document.querySelector('.email-feedback')

button.addEventListener('click', function () {

    if (!email.checkValidity() && email.value) {
        emailFeedback.innerText = 'Invalid Email'
    }
})