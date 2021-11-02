const button = document.querySelector('.btn')
const email = document.querySelector('#email')
const emailFeedback = document.querySelector('.email-feedback')

button.addEventListener('click', function () {

    if (!email.checkValidity() && email.value) {
        emailFeedback.innerText = 'Invalid Email'
    }
})

const save = document.querySelector('.btn-info')
const back = document.querySelector('.btn-dark')

save.addEventListener('click', function (e) {
    const confSave = confirm('Save Information?')
    if (!confSave) {
        e.preventDefault();
    }
})
back.addEventListener('click', function (e) {
    const confExit = confirm('Leave Without Saving?')
    if (!confExit) {
        e.preventDefault();
    }
})
