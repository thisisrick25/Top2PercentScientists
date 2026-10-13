const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const csv = require('csv-parser');

const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const OUTPUT_DIR = DATA_DIR;

// Field name mappings (CSV header -> clean property name)
const FIELD_MAP = {
  'authfull': 'name',
  'inst_name': 'institution',
  'cntry': 'country',
  'np6025': 'papers',
  'firstyr': 'firstYear',
  'lastyr': 'lastYear',
  'rank': 'rank',
  'nc2525': 'citations',
  'h25': 'hIndex',
  'hm25': 'hmIndex',
  'c': 'compositeScore',
  'npciting': 'distinctCitingPapers',
  'cprat': 'citationRatio',
  'self%': 'selfCitationPct',
  'sm-subfield-1': 'subfield',
  'sm-field': 'field',
  'rank sm-subfield-1': 'rankInSubfield',
  'rank sm-subfield-1 (ns)': 'rankInSubfieldNs',
  'cosmo': 'cosmoScore',
};

function transformRow(row) {
  const scientist = {
    rank: parseInt(row['rank']) || 0,
    rankNs: parseInt(row['rank (ns)']) || 0,
    name: (row['authfull'] || '').trim(),
    institution: (row['inst_name'] || '').trim(),
    country: (row['cntry'] || '').trim().toUpperCase(),
    field: (row['sm-field'] || '').trim(),
    subfield: (row['sm-subfield-1'] || '').trim(),
    citations: parseInt(row['nc2525'] || row['nc9625']) || 0,
    hIndex: parseInt(row['h25']) || 0,
    hmIndex: parseFloat(row['hm25']) || 0,
    compositeScore: parseFloat(row['c']) || 0,
    papers: parseInt(row['np6025']) || 0,
    firstYear: parseInt(row['firstyr']) || 0,
    lastYear: parseInt(row['lastyr']) || 0,
    selfCitationPct: parseFloat(row['self%']) || 0,
    distinctCitingPapers: parseInt(row['npciting']) || 0,
    citationRatio: parseFloat(row['cprat']) || 0,
    rankInSubfield: parseInt(row['rank sm-subfield-1']) || 0,
    rankInSubfieldNs: parseInt(row['rank sm-subfield-1 (ns)']) || 0,
    cosmoScore: parseFloat(row['cosmo']) || 0,
    // Extended fields (used by profile page)
    nps: parseFloat(row['nps']) || 0,
    ncs: parseFloat(row['ncs']) || 0,
    cpsf: parseFloat(row['cpsf']) || 0,
    ncsf: parseFloat(row['ncsf']) || 0,
    npsfl: parseFloat(row['npsfl']) || 0,
    ncsfl: parseFloat(row['ncsfl']) || 0,
    "sm-subfield-1-frac": parseFloat(row['sm-subfield-1-frac']) || 0,
    "sm-subfield-2": (row['sm-subfield-2'] || '').trim(),
    "sm-subfield-2-frac": parseFloat(row['sm-subfield-2-frac']) || 0,
    "sm-field-frac": parseFloat(row['sm-field-frac']) || 0,
    "sm-subfield-1 count": parseInt(row['sm-subfield-1 count']) || 0,
    top_cntry_career: (row['top_cntry_career'] || '').trim(),
    top_cntry_share: parseFloat(row['top_cntry_share']) || 0,
    cntry_10pct: (row['cntry_10pct'] || '').trim(),
    cntry_cov: parseFloat(row['cntry_cov']) || 0,
    // Self-citation-excluded (ns) variants — paired with the "All" columns
    citationsNs: parseInt(row['nc2525 (ns)'] || row['nc9625 (ns)']) || 0,
    hIndexNs: parseInt(row['h25 (ns)']) || 0,
    hmIndexNs: parseFloat(row['hm25 (ns)']) || 0,
    npsNs: parseInt(row['nps (ns)']) || 0,
    ncsNs: parseInt(row['ncs (ns)']) || 0,
    cpsfNs: parseInt(row['cpsf (ns)']) || 0,
    ncsfNs: parseInt(row['ncsf (ns)']) || 0,
    npsflNs: parseInt(row['npsfl (ns)']) || 0,
    ncsflNs: parseInt(row['ncsfl (ns)']) || 0,
    compositeScoreNs: parseFloat(row['c (ns)']) || 0,
    npcitingNs: parseInt(row['npciting (ns)']) || 0,
    cpratNs: parseFloat(row['cprat (ns)']) || 0,
  };
  
  return scientist;
}

function processCSV(inputFile, outputFile, datasetType) {
  return new Promise((resolve, reject) => {
    const scientists = [];
    const fields = new Set();
    const countries = new Set();
    const subfields = new Set();
    let maxCitations = 0;
    let maxHIndex = 0;
    let maxCompositeScore = 0;
    let rowCount = 0;
    
    fs.createReadStream(inputFile)
      .pipe(csv())
      .on('data', (row) => {
        rowCount++;
        const scientist = transformRow(row);
        
        if (scientist.name && scientist.rank > 0) {
          scientists.push(scientist);
          fields.add(scientist.field);
          countries.add(scientist.country);
          subfields.add(scientist.subfield);
          const subfield2 = scientist['sm-subfield-2'];
          if (subfield2) subfields.add(subfield2);
          maxCitations = Math.max(maxCitations, scientist.citations);
          maxHIndex = Math.max(maxHIndex, scientist.hIndex);
          maxCompositeScore = Math.max(maxCompositeScore, scientist.compositeScore);
        }
        
        // Progress logging
        if (rowCount % 50000 === 0) {
          console.log(`  Processed ${rowCount} rows, kept ${scientists.length} scientists...`);
        }
      })
      .on('end', () => {
        console.log(`Finished processing ${inputFile}: ${scientists.length} scientists from ${rowCount} rows`);
        
        // Sort by rank
        scientists.sort((a, b) => a.rank - b.rank);

        // Dense id = 1-based array position (file order = official rank order).
        // Must match lib/data-server.ts loadDataset so index and full.json agree.
        scientists.forEach((s, i) => {
          s.id = i + 1;
        });

        // Derived sm-subfield-2 ranks (dataset ships no official column for it).
        // Competition ranking: ties share the better position, same as official ranks.
        const groups2 = {};
        for (const sc of scientists) {
          const key = sc['sm-subfield-2'];
          if (key) (groups2[key] = groups2[key] || []).push(sc);
        }
        for (const arr of Object.values(groups2)) {
          arr.sort((a, b) => a.rank - b.rank);
          arr.forEach((sc, i) => {
            sc.rankInSubfield2 = i > 0 && arr[i - 1].rank === sc.rank ? arr[i - 1].rankInSubfield2 : i + 1;
          });
          arr.sort((a, b) => a.rankNs - b.rankNs);
          arr.forEach((sc, i) => {
            sc.rankInSubfield2Ns = i > 0 && arr[i - 1].rankNs === sc.rankNs ? arr[i - 1].rankInSubfield2Ns : i + 1;
          });
        }
        
        // ---- Aggregates for homepage ----
        const percentile = (sorted, p) =>
          sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)] : 0;
        const percentileBlock = (values) => {
          const s = values.filter((v) => v > 0).sort((a, b) => a - b);
          return {
            p25: percentile(s, 25), p50: percentile(s, 50), p75: percentile(s, 75),
            p90: percentile(s, 90), p99: percentile(s, 99), max: s.length ? s[s.length - 1] : 0,
          };
        };

        const institutionCounts = {};
        const countryCounts = {};
        const fieldCounts = {};
        const decadeCounts = {};
        for (const sc of scientists) {
          if (sc.institution) institutionCounts[sc.institution] = (institutionCounts[sc.institution] || 0) + 1;
          if (sc.country) countryCounts[sc.country] = (countryCounts[sc.country] || 0) + 1;
          if (sc.field) fieldCounts[sc.field] = (fieldCounts[sc.field] || 0) + 1;
          if (sc.firstYear >= 1900) {
            const decade = Math.floor(sc.firstYear / 10) * 10 + 's';
            decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
          }
        }
        const topEntries = (obj, n) =>
          Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, count]) => ({ name, count }));

        const risingStars = scientists
          .filter((s) => s.firstYear >= 2020)
          .sort((a, b) => b.citations - a.citations)
          .slice(0, 10);

        const aggregates = {
          institutionCounts: topEntries(institutionCounts, 20),
          countryCounts: topEntries(countryCounts, 25),
          fieldCounts: topEntries(fieldCounts, 25),
          decadeCounts,
          percentiles: {
            citations: percentileBlock(scientists.map((s) => s.citations)),
            hIndex: percentileBlock(scientists.map((s) => s.hIndex)),
            compositeScore: percentileBlock(scientists.map((s) => s.compositeScore)),
          },
          risingStars,
        };
        
        // Create full dataset
        const fullData = {
          metadata: {
            totalScientists: scientists.length,
            year: 2025,
            datasetType,
            processedAt: new Date().toISOString(),
          },
          scientists,
        };
        
        // Create index (lightweight)
        const indexData = {
          metadata: {
            totalScientists: scientists.length,
            year: 2025,
            datasetType,
            processedAt: new Date().toISOString(),
          },
          topScientists: scientists.slice(0, 1000),
          fields: [...fields].filter(Boolean).sort(),
          countries: [...countries].filter(Boolean).sort(),
          subfields: [...subfields].filter(Boolean).sort(),
          stats: {
            maxRank: scientists.length,
            maxCitations,
            maxHIndex,
            maxCompositeScore,
          },
          aggregates,
        };
        
        // Write files
        fs.writeFileSync(outputFile.replace('.json', '.full.json'), JSON.stringify(fullData));
        fs.writeFileSync(outputFile, JSON.stringify(indexData));
        
        console.log(`  Written: ${outputFile} and ${outputFile.replace('.json', '.full.json')}`);
        resolve({ scientists, fields, countries, subfields, stats: { maxCitations, maxHIndex, maxCompositeScore } });
      })
      .on('error', reject);
  });
}

async function processThresholds() {
  console.log('Processing field thresholds...');
  const fieldThresholds = [];
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(DATA_DIR, 'field-thresholds.csv'))
      .pipe(csv())
      .on('data', (row) => {
        if (row.Domain && row.Field) {
          fieldThresholds.push({
            domain: row.Domain.trim(),
            field: row.Field.trim(),
            totalAuthors: parseInt(row['#Auth']) || 0,
            topListCount: parseInt(row['#Auth in top-list']) || 0,
            topListPercentage: parseFloat(row['% in top-list']) || 0,
            citesPercentiles: {
              p25: parseFloat(row['Cites@25']) || 0,
              p50: parseFloat(row['Cites@50']) || 0,
              p75: parseFloat(row['Cites@75']) || 0,
              p90: parseFloat(row['Cites@90']) || 0,
              p95: parseFloat(row['Cites@95']) || 0,
              p99: parseFloat(row['Cites@99']) || 0,
            },
            cPercentiles: {
              p25: parseFloat(row['c@25']) || 0,
              p50: parseFloat(row['c@50']) || 0,
              p75: parseFloat(row['c@75']) || 0,
              p90: parseFloat(row['c@90']) || 0,
              p95: parseFloat(row['c@95']) || 0,
              p99: parseFloat(row['c@99']) || 0,
            },
          });
        }
      })
      .on('end', () => {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'field-thresholds.json'), JSON.stringify(fieldThresholds));
        console.log(`  Processed ${fieldThresholds.length} field thresholds`);
        resolve();
      })
      .on('error', reject);
  });
  
  console.log('Processing subfield thresholds...');
  const subfieldThresholds = [];
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(DATA_DIR, 'subfield-thresholds.csv'))
      .pipe(csv())
      .on('data', (row) => {
        if (row.Domain && row.Field && row.Subfield) {
          subfieldThresholds.push({
            domain: row.Domain.trim(),
            field: row.Field.trim(),
            subfield: row.Subfield.trim(),
            totalAuthors: parseInt(row['#Auth']) || 0,
            topListCount: parseInt(row['#Auth in top-list']) || 0,
            topListPercentage: parseFloat(row['% in top-list']) || 0,
            citesPercentiles: {
              p25: parseFloat(row['Cites@25']) || 0,
              p50: parseFloat(row['Cites@50']) || 0,
              p75: parseFloat(row['Cites@75']) || 0,
              p90: parseFloat(row['Cites@90']) || 0,
              p95: parseFloat(row['Cites@95']) || 0,
              p99: parseFloat(row['Cites@99']) || 0,
            },
            cPercentiles: {
              p25: parseFloat(row['c@25']) || 0,
              p50: parseFloat(row['c@50']) || 0,
              p75: parseFloat(row['c@75']) || 0,
              p90: parseFloat(row['c@90']) || 0,
              p95: parseFloat(row['c@95']) || 0,
              p99: parseFloat(row['c@99']) || 0,
            },
          });
        }
      })
      .on('end', () => {
        fs.writeFileSync(path.join(OUTPUT_DIR, 'subfield-thresholds.json'), JSON.stringify(subfieldThresholds));
        console.log(`  Processed ${subfieldThresholds.length} subfield thresholds`);
        resolve();
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('Starting data processing...\n');
  
  // Install csv-parser if needed
  try {
    require('csv-parser');
  } catch (e) {
    console.log('Installing csv-parser...');
    require('child_process').execSync('npm install csv-parser', { cwd: __dirname, stdio: 'inherit' });
  }
  
  // Process single-year data
  console.log('Processing single-year (2025) dataset...');
  await processCSV(
    path.join(DATA_DIR, 'singleyr.csv'),
    path.join(OUTPUT_DIR, 'singleyr.json'),
    'singleyr'
  );
  
  // Process career data
  console.log('\nProcessing career dataset...');
  await processCSV(
    path.join(DATA_DIR, 'career.csv'),
    path.join(OUTPUT_DIR, 'career.json'),
    'career'
  );
  
  // Process thresholds
  console.log('\nProcessing thresholds...');
  await processThresholds();
  
  console.log('\n✅ All data processing complete!');
  console.log(`Output files in: ${OUTPUT_DIR}`);
}

main().catch(console.error);