const buttons = document.querySelectorAll(".btn-danger");
for (let button of buttons) {
    button.addEventListener('click', function (e) {
        const res = confirm('Confirm Delete? You cant undo this action')
        if (!res) {
            e.preventDefault();
        }
    })
}