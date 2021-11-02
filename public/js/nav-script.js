const heading = document.querySelector('h1')
const newLink = document.querySelector('#new-link')
const campLink = document.querySelector('#camp-link')
const loginLink = document.querySelector('#login-link')
const regLink = document.querySelector('#reg-link')
if (heading.innerText === 'New Campground') {
    newLink.classList.add('active')
    campLink.classList.remove('active')
}

if (heading.innerText === 'Login') {
    loginLink.classList.add('active')
    campLink.classList.remove('active')
}

if (heading.innerText === 'Register') {
    regLink.classList.add('active')
    campLink.classList.remove('active')
}