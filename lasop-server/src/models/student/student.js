// File: server/models/Student.js (replace your schema file)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true },
    password:  { type: String, required: true },
    contact:   { type: String, required: true },

    // NEW: split address
    houseNo:    { type: String, required: true },     // why: replace single address with structured fields
    streetName: { type: String, required: true },
    city:       { type: String, required: true },

    program: {
      courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
      cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true },
      center:   { type: Schema.Types.ObjectId, ref: 'Center', required: true },
      mode:     { type: String, required: true },
      tutorId:  { type: Schema.Types.ObjectId, ref: 'Staff' },
    },

    gender: { type: String },
    allowed: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['applicant', 'student', 'graduate', 'rejected', 'expelled'],
      default: 'applicant',
    },
    OtherName: { type: String },
    otherName: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: legacy virtual for reads (does not store in DB)
studentSchema.virtual('address').get(function () {
  const parts = [this.houseNo, this.streetName, this.city].filter(Boolean);
  return parts.join(', ');
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
