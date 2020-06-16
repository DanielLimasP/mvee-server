// Mongodb connection file

const mongoose = require('mongoose')
const url = 'mongodb://localhost/mveedb'

mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(db => console.log('DB Connection established'))
.catch(err => console.log(err))