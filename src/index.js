const { buildSchema, introspectionFromSchema } = require('graphql');
const stableStringify = require('fast-json-stable-stringify');
const crypto = require('crypto');
const fs = require('fs');

const schemaFile = process.argv[2];
if (!schemaFile) {
  console.log('usage: <schema file>');
  process.exit(1);
}

const schemaSource = fs.readFileSync(schemaFile, 'utf8');
const schema = buildSchema(schemaSource);
const introspectionSchema = introspectionFromSchema(schema).__schema;

// It's important that we perform a deterministic stringification here
// since, depending on changes in the underlying `graphql-js` execution
// layer, varying orders of the properties in the introspection
const stringifiedSchema = stableStringify(introspectionSchema);

const hash = crypto.createHash('sha512')
    .update(stringifiedSchema)
    .digest('hex');

console.log(hash);
