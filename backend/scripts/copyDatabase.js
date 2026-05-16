/**
 * Copy all collections (documents + indexes) from MONGO_URI → COPY_URI.
 *
 * Prerequisites in backend/.env:
 *   MONGO_URI=mongodb://.../sourceDbName   (existing data)
 *   COPY_URI=mongodb://.../destDbName      (target; collections will be replaced)
 *
 * Safety:
 *   COPY_CONFIRM=yes   required — drops matching collections on the destination before copying.
 *
 * Optional:
 *   COPY_DRY_RUN=1     connect and list collections only (no writes)
 *
 * Usage:
 *   npm run db:copy
 */
require('dotenv').config();

const { MongoClient } = require('mongodb');

const SOURCE_URI = process.env.MONGO_URI;
const DEST_URI = process.env.COPY_URI;
const DRY_RUN = String(process.env.COPY_DRY_RUN || '').trim() === '1';
const CONFIRMED = String(process.env.COPY_CONFIRM || '').trim().toLowerCase() === 'yes';

const BATCH_SIZE = 500;

async function copyIndexes(sourceColl, destColl) {
  const indexes = await sourceColl.indexes();
  for (const spec of indexes) {
    if (!spec.key || spec.name === '_id_') continue;
    const opts = { name: spec.name };
    if (spec.unique) opts.unique = spec.unique;
    if (spec.sparse) opts.sparse = spec.sparse;
    if (spec.background != null) opts.background = spec.background;
    if (spec.expireAfterSeconds != null) opts.expireAfterSeconds = spec.expireAfterSeconds;
    if (spec.partialFilterExpression) opts.partialFilterExpression = spec.partialFilterExpression;
    if (spec.collation) opts.collation = spec.collation;
    await destColl.createIndex(spec.key, opts);
  }
}

async function copyCollection(sourceDb, destDb, collName) {
  const sourceColl = sourceDb.collection(collName);
  const destColl = destDb.collection(collName);

  const total = await sourceColl.countDocuments();
  console.log(`  ${collName}: ${total} document(s)`);

  if (DRY_RUN) return;

  await destColl.drop().catch(() => {});

  const freshDest = destDb.collection(collName);
  let inserted = 0;

  const cursor = sourceColl.find({});
  let batch = [];

  async function flush() {
    if (batch.length === 0) return;
    await freshDest.insertMany(batch, { ordered: false });
    inserted += batch.length;
    batch = [];
  }

  for await (const doc of cursor) {
    batch.push(doc);
    if (batch.length >= BATCH_SIZE) {
      await flush();
      process.stdout.write(`    … ${inserted}/${total}\r`);
    }
  }
  await flush();
  if (total > 0) console.log(`    inserted ${inserted}`);

  await copyIndexes(sourceColl, freshDest);
}

async function main() {
  if (!SOURCE_URI || !DEST_URI) {
    console.error('Missing env: set both MONGO_URI (source) and COPY_URI (destination).');
    process.exit(1);
  }

  if (SOURCE_URI.trim() === DEST_URI.trim()) {
    console.error('MONGO_URI and COPY_URI must not be identical.');
    process.exit(1);
  }

  if (!DRY_RUN && !CONFIRMED) {
    console.error(
      'Refusing to write: set COPY_CONFIRM=yes in .env (or env) to replace collections on COPY_URI.'
    );
    console.error('Preview only: COPY_DRY_RUN=1 npm run db:copy');
    process.exit(1);
  }

  const sourceClient = new MongoClient(SOURCE_URI);
  const destClient = new MongoClient(DEST_URI);

  await sourceClient.connect();
  await destClient.connect();

  const sourceDb = sourceClient.db();
  const destDb = destClient.db();

  console.log(`Source DB: ${sourceDb.databaseName}`);
  console.log(`Dest DB:   ${destDb.databaseName}`);
  if (DRY_RUN) console.log('(dry run — no writes)');

  const meta = await sourceDb.listCollections({ type: 'collection' }).toArray();
  const names = meta.map((m) => m.name).filter((n) => !n.startsWith('system.'));

  if (names.length === 0) {
    console.log('No collections to copy.');
    await sourceClient.close();
    await destClient.close();
    return;
  }

  console.log(`Collections: ${names.join(', ')}`);

  for (const name of names) {
    try {
      await copyCollection(sourceDb, destDb, name);
    } catch (err) {
      console.error(`Failed on "${name}":`, err.message);
      process.exitCode = 1;
      break;
    }
  }

  await sourceClient.close();
  await destClient.close();

  if (!process.exitCode) {
    console.log(DRY_RUN ? 'Dry run finished.' : 'Copy finished.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
