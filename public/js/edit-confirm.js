const save = document.querySelector('.btn-primary')
const back = document.querySelector('.btn-dark')

save.addEventListener('click', function (e) {
    const confSave = confirm('Save Campground?')
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