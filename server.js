const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.send('Route hit')
})

app.listen(3000, () => {
    console.log('Hosted on port 3000')
})