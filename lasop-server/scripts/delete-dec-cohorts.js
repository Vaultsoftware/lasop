// scripts/delete-dec-cohorts.js
// Usage:
//   node scripts/delete-dec-cohorts.js                    # dry-run
//   node scripts/delete-dec-cohorts.js --apply            # delete
//   node scripts/delete-dec-cohorts.js --year=2025        # limit by year
//   node scripts/delete-dec-cohorts.js --field=start|end|both
//   node scripts/delete-dec-cohorts.js --name             # also require cohortName ~ /Dec/i
//   node scripts/delete-dec-cohorts.js --preview=50       # dry-run preview size

require('dotenv').config();
const mongoose = require('mongoose');

const argv = process.argv.slice(2);
const has = (k) => argv.some(a => a === `--${k}` || a.startsWith(`--${k}=`));
const get = (k, def) => {
  const hit = argv.find(a => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : def;
};

const APPLY   = has('apply');
const YEAR    = get('year');                     // e.g., 2025
const FIELD   = (get('field', 'both') || 'both').toLowerCase(); // start|end|both
const NAME    = has('name');
const PREVIEW = Math.max(0, Math.min(parseInt(get('preview', '20'), 10) || 0, 200));

// ✅ Use MONGO_DB as requested (with common fallbacks just in case)
const MONGO_URI =
  process.env.MONGO_DB ||
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('❌ Missing MONGO_DB (or MONGO_URI/MONGODB_URI/DATABASE_URL) in environment.');
  process.exit(1);
}

function monthExprFor(field) {
  const isDec = { $eq: [{ $month: `$${field}` }, 12] };
  if (YEAR) return { $and: [isDec, { $eq: [{ $year: `$${field}` }, Number(YEAR)] }] };
  return isDec;
}

function buildFilter() {
  const orDate = [];
  if (FIELD === 'start' || FIELD === 'both') orDate.push(monthExprFor('startDate'));
  if (FIELD === 'end'   || FIELD === 'both') orDate.push(monthExprFor('endDate'));
  const expr = orDate.length === 1 ? orDate[0] : { $or: orDate };
  const base = { $expr: expr };
  return NAME ? { $and: [base, { cohortName: { $regex: 'Dec', $options: 'i' } }] } : base;
}

(async () => {
  const filter = buildFilter();
  console.log('ℹ️  Connecting to Mongo…');
  await mongoose.connect(MONGO_URI);

  const coll = mongoose.connection.db.collection('cohorts'); // default for Cohort model
  console.log('🔎 Filter:', JSON.stringify(filter));
  const total = await coll.countDocuments(filter);
  console.log(`📊 Matched: ${total}`);

  if (!APPLY) {
    if (total > 0 && PREVIEW > 0) {
      const preview = await coll
        .find(filter, { projection: { _id: 1, cohortName: 1, startDate: 1, endDate: 1 } })
        .limit(PREVIEW)
        .toArray();
      console.log(`👀 Preview (first ${preview.length}):`);
      for (const d of preview) {
        console.log(` - ${d._id} | ${d.cohortName ?? '(no name)'} | start=${d.startDate} | end=${d.endDate}`);
      }
    }
    console.log('🚫 Dry-run only. Add --apply to delete.');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log('⚠️  APPLY MODE: Deleting…');
  const res = await coll.deleteMany(filter);
  console.log(`✅ Deleted: ${res.deletedCount}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch(async (err) => {
  console.error('❌ Error:', err?.message || err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
