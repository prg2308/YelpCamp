const logout = document.querySelector('.logout')
logout.addEventListener('click', function (e) {
    const resp = confirm('Confirm Logout?')
    if (!resp) {
        e.preventDefault();
    }
})