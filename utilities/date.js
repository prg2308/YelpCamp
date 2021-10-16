module.exports = function () {
    const date = new Date().toUTCString().slice(5, 16);
    return date;
}
