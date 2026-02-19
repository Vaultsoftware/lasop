// File: lasop-server/src/routes/staff/postStaff.js
const { getSocket } = require('../../../config/connection');
const Staff = require('../../../models/staff/staff');
const Student = require('../../../models/student/student');
const bcrypt = require('bcrypt');

const postStaff = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contact,
    houseNo,
    streetName,
    city,
    dateOfEmploy,
    salary,
    password,
    otherInfo,
    role,
    enrol,
    status,
    address, // legacy (optional)
  } = req.body;

  try {
    // --- Minimal validation first ---
    if (!firstName || !lastName || !email || !contact || !password || !enrol) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // --- Check if staff already exists ---
    const staffExist = await Staff.findOne({ email });
    if (staffExist) {
      // Derive address if missing
      let _houseNo = houseNo?.trim() || staffExist.houseNo;
      let _streetName = streetName?.trim() || staffExist.streetName;
      let _city = city?.trim() || staffExist.city;

      if ((!_houseNo || !_streetName || !_city) && typeof address === 'string' && address.trim()) {
        const parts = address.split(',').map(s => s.trim()).filter(Boolean);
        _houseNo = _houseNo || parts[0] || '';
        _streetName = _streetName || parts[1] || '';
        _city = _city || parts[2] || '';
      }

      // Hash password if changed
      const hashPwd = await bcrypt.hash(password, 10);

      // Update staff record
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

    // --- Check if email exists as student (okay to proceed) ---
    const studentExist = await Student.findOne({ email });
    if (studentExist) {
      // allowed; only block if already a staff (already checked)
    }

    // --- Derive address parts if missing ---
    let _houseNo = (houseNo ?? '').trim();
    let _streetName = (streetName ?? '').trim();
    let _city = (city ?? '').trim();

    if ((!_houseNo || !_streetName || !_city) && typeof address === 'string' && address.trim()) {
      const parts = address.split(',').map(s => s.trim()).filter(Boolean);
      _houseNo = _houseNo || parts[0] || '';
      _streetName = _streetName || parts[1] || '';
      _city = _city || parts[2] || '';
    }

    // --- Hash password ---
    const hashPwd = await bcrypt.hash(password, 10);

    // --- Create new staff record ---
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

    // --- Emit socket event ---
    const io = getSocket();
    if (io) io.to('lasop_global_room').emit('newStaff', newStaff);

    return res.status(201).json({
      message: 'Staff account created successfully',
      data: newStaff,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = postStaff;
