// The SQL the dashboard runs for two of its own queries, for the deck: compiled from the
// semantic model by dax-sql, with the page's options (dashboard/github/common/semantic/query.js).
// Run from this folder's parent: node sql/compile.mjs   (reads the local clone C:\git\analytics-as-code)
import fs from 'node:fs';
import { createRequire } from 'node:module';
const R = 'C:/git/analytics-as-code/';
const OUT = new URL('.', import.meta.url);
const YAML = createRequire(R + 'dax-sql/package.json')('yaml');
const { createCompiler } = await import('file:///' + R + 'dax-sql/src/index.js');
const { ossieToModel } = await import('file:///' + R + 'dax-sql/formats/ossie.js');
const DAX = createCompiler(ossieToModel(YAML.parse(fs.readFileSync(R + 'semantic_model/ossie.yaml', 'utf8'))), {
  tableSource: t => `v_${t.name}`, assumeIntegrity: true,
  castOutput: { int: s => `CAST(${s} AS INTEGER)`, double: s => `CAST(${s} AS DOUBLE)`, decimal: s => `CAST(${s} AS DOUBLE)`, datetime: s => `CAST(CAST(${s} AS DATE) AS VARCHAR)` },
});
for (const n of ['averages-fuel-1y-wind', 'changegeneration-3d-all']) {
  const dax = fs.readFileSync(`${R}dax-sql/conformance/queries/aac/dashboard/dashboard-${n}.dax`, 'utf8')
    .split('\n').filter(l => !l.startsWith('//')).join('\n').trim();
  const sql = DAX.compile(dax).sql;
  fs.writeFileSync(new URL(`${n}.dax`, OUT), dax + '\n');
  fs.writeFileSync(new URL(`${n}.sql`, OUT), sql + '\n');
  console.log(n, 'DAX', dax.length, 'chars; SQL', sql.length, 'chars,', (sql.match(/\bSELECT\b/g) || []).length, 'SELECTs');
}
