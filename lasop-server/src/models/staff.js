// File: server/models/Staff.js  (replace your current staff schema file)
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  firstName:   { type: String, required: true },
  lastName:    { type: String, required: true },
  email:       { type: String, required: true },
  contact:     { type: String, required: true },

  // NEW: split address fields (replaces `address`)
  houseNo:     { type: String, required: true },
  streetName:  { type: String, required: true },
  city:        { type: String, required: true },

  dateOfEmploy:{ type: Date },
  salary:      { type: String },
  password:    { type: String, required: true },
  otherInfo:   { type: mongoose.Schema.Types.ObjectId, ref: 'OtherInformation' },
  role:        { type: String, enum: ['academic', 'non-academic'] },
  enrol:       { type: String, required: true },
  status:      {
    type: String,
    enum: ['rejected', 'fired', 'suspended', 'permanent', 'probation', 'pending'],
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Optional: legacy virtual for older clients expecting `address`
staffSchema.virtual('address').get(function () {
  return [this.houseNo, this.streetName, this.city].filter(Boolean).join(', ');
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
