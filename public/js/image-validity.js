const imgFiles = document.querySelector('#image');
const imageHelp = document.querySelector('#imageHelp');
const imageFeedback = document.querySelector('.image-feedback')
imgFiles.addEventListener('change', function () {
    let flag = 0
    for (image of imgFiles.files) {
        if (image.size > 10485760) {
            imgFiles.setCustomValidity('File Limit Exeeded')
            imageHelp.classList.add('text-danger')
            imageHelp.innerText = `"${image.name}" Exceeds 10 MB`
            flag = 1
            break;
        }

        if (image.type.slice(0, 5) !== 'image') {
            imgFiles.setCustomValidity('Invalid File')
            imageHelp.classList.add('text-danger')
            imageHelp.innerText = `"${image.name}"  is not an image!`
            flag = 1
            break;
        }

    }

    if (flag === 0) {
        imgFiles.setCustomValidity('')
        imageHelp.classList.remove('text-danger')
        imageHelp.innerText = `Maximum Size : 10 MB`
    }
})