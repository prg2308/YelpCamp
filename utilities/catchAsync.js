module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next)
    }
}   //Accepts and executes func -> if error passes it to next