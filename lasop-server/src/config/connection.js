require('dotenv').config();
const mongoose = require('mongoose');

const connection = ({ app, port }) => {
    const dbURL = process.env.MONGO_DB

    mongoose.connect(dbURL, { autoIndex: true })
    .then(() => {
        app.listen(port);
        console.log('Connected to database');
        console.log('Server running on port ' + port);
    })
    .catch((err) => {
        console.log(err);
    })
};

module.exports = connection