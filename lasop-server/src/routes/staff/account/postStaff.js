// File: lasop-server/src/routes/staff/postStaff.js
const { getSocket } = require('../../../config/connection');
const Staff = require('../../../models/staff/staff');
const bcrypt = require('bcrypt');

const postStaff = async (req, res) => {
  // NOTE: address removed. Accept split address fields; keep legacy fallback.
  const {
    firstName,
    lastName,
    email,
    contact,
    houseNo,       // new
    streetName,    // new
    city,          // new
    dateOfEmploy,
    salary,
    password,
    otherInfo,
    role,
    enrol,
    status,
    address,       // legacy (optional)
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);

  const staffExist = await Staff.findOne({ email });

if (staffExist) {
  // Update existing record instead of blocking
  staffExist.firstName = firstName;
  staffExist.lastName = lastName;
  staffExist.contact = contact;
  staffExist.houseNo = _houseNo;
  staffExist.streetName = _streetName;
  staffExist.city = _city;
  staffExist.dateOfEmploy = dateOfEmploy;
  staffExist.salary = salary;
  staffExist.password = hashPwd;
  staffExist.otherInfo = otherInfo;
  staffExist.role = role;
  staffExist.enrol = enrol;
  staffExist.status = status;

  await staffExist.save();

  return res.status(200).json({
    message: 'Staff account updated successfully',
    data: staffExist
  });
}


    // Legacy compatibility: derive parts from `address` if needed
    let _houseNo = (houseNo ?? '').trim();
    let _streetName = (streetName ?? '').trim();
    let _city = (city ?? '').trim();

    if ((!_houseNo || !_streetName || !_city) && typeof address === 'string' && address.trim()) {
      const parts = address.split(',').map(s => s.trim()).filter(Boolean);
      _houseNo = _houseNo || parts[0] || '';
      _streetName = _streetName || parts[1] || '';
      _city = _city || parts[2] || '';
    }

    // Minimal validation (server-side)
    if (!firstName || !lastName || !email || !contact || !_houseNo || !_streetName || !_city || !password || !enrol) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newStaff = await Staff.create({
      firstName,
      lastName,
      email,
      contact,
      houseNo: _houseNo,
      streetName: _streetName,
      city: _city,
      dateOfEmploy,
      salary,
      password: hashPwd,
      otherInfo,
      role,
      enrol,
      status,
    });

    const io = getSocket();
    if(io) {
      io.to('lasop_global_room').emit('newStaff', newStaff)
    }
    
    res.status(201).json({
      message: 'Account created successfully',
      data: newStaff,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = postStaff;
