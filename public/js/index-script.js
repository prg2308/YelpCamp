const navbar = document.querySelector('.navbar');
window.onscroll = () => {
    if (window.scrollY > 100) {
        navbar.classList.add('bg-dark');
        navbar.classList.remove('bg-trans');
    } else {
        navbar.classList.add('bg-trans');
        navbar.classList.remove('bg-dark');
    }
};