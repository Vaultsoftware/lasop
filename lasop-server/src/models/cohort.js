const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cohortSchema = new Schema(
    {
        cohortName: {
            type: String,
            required: true
        },
        courseId: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            }
        ]
        ,
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        center: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Center',
                required: true
            }
        ],
        mode: [
            {
                type: String,
                required: true
            }
        ],
        courseTutors: [
            {
                course: {
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                },
                center: {
                    type: Schema.Types.ObjectId,
                    ref: 'Center',
                },
                mode: {
                    type: String,
                },
                tutors: {
                    type: Schema.Types.ObjectId,
                    ref: 'Staff',
                }
            }
        ],
        isActive: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['completed', 'current', 'inactive'],
            default: 'inactive'
        }
    },
    {
        timestamps: true,
    }
);

const Cohort = mongoose.model('Cohort', cohortSchema);
module.exports = Cohort;