const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const syllabusSchema = new Schema({
    sylTitle: {
        type: String,
        required: true,
    },
    sylFile: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
}
);

const Syllabus = mongoose.model('Syllabus', syllabusSchema);
module.exports = Syllabus;