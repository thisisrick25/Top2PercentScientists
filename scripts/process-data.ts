import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

// Types for our processed data
interface Scientist {
  rank: number;
  name: string;
  institution: string;
  country: string;
  field: string;
  subfield: string;
  citations: number;
  hIndex: number;
  hmIndex: number;
  compositeScore: number;
  papers: number;
  firstYear: number;
  lastYear: number;
  selfCitationPct: number;
  distinctCitingPapers: number;
  citationRatio: number;
  rankInSubfield: number;
  rankInSubfieldNs: number;
  cosmoScore: number;
}

interface ProcessedData {
  metadata: {
    totalScientists: number;
    year: number;
    datasetType: 'singleyr' | 'career';
    processedAt: string;
  };
  scientists: Scientist[];
  fieldThresholds: FieldThreshold[];
  subfieldThresholds: SubfieldThreshold[];
}

interface FieldThreshold {
  domain: string;
  field: string;
  totalAuthors: number;
  topListCount: number;
  topListPercentage: number;
  citesPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  cPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

interface SubfieldThreshold {
  domain: string;
  field: string;
  subfield: string;
  totalAuthors: number;
  topListCount: number;
  topListPercentage: number;
  citesPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
  cPercentiles: {
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

// Column indices for the Data sheet (0-indexed)
const COLUMNS = {
  authfull: 0,
  inst_name: 1,
  cntry: 2,
  np6025: 3,
  firstyr: 4,
  lastyr: 5,
  rank_ns: 6,
  nc2525_ns: 7,
  h25_ns: 8,
  hm25_ns: 9,
  nps_ns: 10,
  ncs_ns: 11,
  cpsf_ns: 12,
  ncsf_ns: 13,
  npsfl_ns: 14,
  ncsfl_ns: 15,
  c_ns: 16,
  npciting_ns: 17,
  cprat_ns: 18,
  np6025_cited2525_ns: 19,
  self_pct: 20,
  rank: 21,
  nc2525: 22,
  h25: 23,
  hm25: 24,
  nps: 25,
  ncs: 26,
  cpsf: 27,
  ncsf: 28,
  npsfl: 29,
  ncsfl: 30,
  c: 31,
  npciting: 32,
  cprat: 33,
  np6025_cited2525: 34,
  np6025_rw: 35,
  nc2525_to_rw: 36,
  nc2525_rw: 37,
  sm_subfield_1: 38,
  sm_subfield_1_frac: 39,
  sm_subfield_2: 40,
  sm_subfield_2_frac: 41,
  sm_field: 42,
  sm_field_frac: 43,
  rank_sm_subfield_1: 44,
  rank_sm_subfield_1_ns: 45,
  sm_subfield_1_count: 46,
  cosmo: 47,
  n_cntry_10pct: 48,
  cntry_10pct: 49,
  top_cntry_career: 50,
  top_cntry_share: 51,
  cntry_cov: 52,
};

function readExcelSheet(filePath: string, sheetName: string): any[][] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
}

function processScientistData(rawData: any[][], datasetType: 'singleyr' | 'career'): Scientist[] {
  // Skip header row (index 0)
  const scientists: Scientist[] = [];
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 53) continue;
    
    const scientist: Scientist = {
      rank: parseInt(row[COLUMNS.rank]) || i,
      name: String(row[COLUMNS.authfull] || '').trim(),
      institution: String(row[COLUMNS.inst_name] || '').trim(),
      country: String(row[COLUMNS.cntry] || '').trim().toUpperCase(),
      field: String(row[COLUMNS.sm_field] || '').trim(),
      subfield: String(row[COLUMNS.sm_subfield_1] || '').trim(),
      citations: parseInt(row[COLUMNS.nc2525]) || 0,
      hIndex: parseInt(row[COLUMNS.h25]) || 0,
      hmIndex: parseFloat(row[COLUMNS.hm25]) || 0,
      compositeScore: parseFloat(row[COLUMNS.c]) || 0,
      papers: parseInt(row[COLUMNS.np6025]) || 0,
      firstYear: parseInt(row[COLUMNS.firstyr]) || 0,
      lastYear: parseInt(row[COLUMNS.lastyr]) || 0,
      selfCitationPct: parseFloat(row[COLUMNS.self_pct]) || 0,
      distinctCitingPapers: parseInt(row[COLUMNS.npciting]) || 0,
      citationRatio: parseFloat(row[COLUMNS.cprat]) || 0,
      rankInSubfield: parseInt(row[COLUMNS.rank_sm_subfield_1]) || 0,
      rankInSubfieldNs: parseInt(row[COLUMNS.rank_sm_subfield_1_ns]) || 0,
      cosmoScore: parseFloat(row[COLUMNS.cosmo]) || 0,
    };
    
    // Only include scientists with valid data
    if (scientist.name && scientist.rank > 0) {
      scientists.push(scientist);
    }
  }
  
  return scientists;
}

function processFieldThresholds(rawData: any[][]): FieldThreshold[] {
  const thresholds: FieldThreshold[] = [];
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 27) continue;
    if (!row[0] || !row[1]) continue; // Skip rows without domain/field
    
    thresholds.push({
      domain: String(row[0] || '').trim(),
      field: String(row[1] || '').trim(),
      totalAuthors: parseInt(row[2]) || 0,
      topListCount: parseInt(row[7]) || 0,
      topListPercentage: parseFloat(row[8]) || 0,
      citesPercentiles: {
        p25: parseFloat(row[9]) || 0,
        p50: parseFloat(row[10]) || 0,
        p75: parseFloat(row[11]) || 0,
        p90: parseFloat(row[12]) || 0,
        p95: parseFloat(row[13]) || 0,
        p99: parseFloat(row[14]) || 0,
      },
      cPercentiles: {
        p25: parseFloat(row[15]) || 0,
        p50: parseFloat(row[16]) || 0,
        p75: parseFloat(row[17]) || 0,
        p90: parseFloat(row[18]) || 0,
        p95: parseFloat(row[19]) || 0,
        p99: parseFloat(row[20]) || 0,
      },
    });
  }
  
  return thresholds;
}

function processSubfieldThresholds(rawData: any[][]): SubfieldThreshold[] {
  const thresholds: SubfieldThreshold[] = [];
  
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 28) continue;
    if (!row[0] || !row[1] || !row[2]) continue;
    
    thresholds.push({
      domain: String(row[0] || '').trim(),
      field: String(row[1] || '').trim(),
      subfield: String(row[2] || '').trim(),
      totalAuthors: parseInt(row[3]) || 0,
      topListCount: parseInt(row[8]) || 0,
      topListPercentage: parseFloat(row[9]) || 0,
      citesPercentiles: {
        p25: parseFloat(row[10]) || 0,
        p50: parseFloat(row[11]) || 0,
        p75: parseFloat(row[12]) || 0,
        p90: parseFloat(row[13]) || 0,
        p95: parseFloat(row[14]) || 0,
        p99: parseFloat(row[15]) || 0,
      },
      cPercentiles: {
        p25: parseFloat(row[16]) || 0,
        p50: parseFloat(row[17]) || 0,
        p75: parseFloat(row[18]) || 0,
        p90: parseFloat(row[19]) || 0,
        p95: parseFloat(row[20]) || 0,
        p99: parseFloat(row[21]) || 0,
      },
    });
  }
  
  return thresholds;
}

async function main() {
  const dataDir = path.join(__dirname, '..', '..', 'August 2026 data-update for Updated science-wide a');
  const outputDir = path.join(__dirname, '..', 'public', 'data');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  console.log('Processing single-year data...');
  const singleyrData = readExcelSheet(
    path.join(dataDir, 'Table_1_Authors_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx'),
    'Data'
  );
  
  const singleyrScientists = processScientistData(singleyrData, 'singleyr');
  console.log(`Processed ${singleyrScientists.length} single-year scientists`);
  
  console.log('Processing career data...');
  const careerData = readExcelSheet(
    path.join(dataDir, 'Table_1_Authors_career_2025_pubs_since_1788_wopp_extracted_202608.xlsx'),
    'Data'
  );
  
  const careerScientists = processScientistData(careerData, 'career');
  console.log(`Processed ${careerScientists.length} career scientists`);
  
  console.log('Processing field thresholds...');
  const fieldThresholdsData = readExcelSheet(
    path.join(dataDir, 'Table_2_field_subfield_thresholds_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx'),
    'Field'
  );
  
  const fieldThresholds = processFieldThresholds(fieldThresholdsData);
  console.log(`Processed ${fieldThresholds.length} field thresholds`);
  
  console.log('Processing subfield thresholds...');
  const subfieldThresholdsData = readExcelSheet(
    path.join(dataDir, 'Table_2_field_subfield_thresholds_singleyr_2025_pubs_since_1788_wopp_extracted_202608.xlsx'),
    'SubField'
  );
  
  const subfieldThresholds = processSubfieldThresholds(subfieldThresholdsData);
  console.log(`Processed ${subfieldThresholds.length} subfield thresholds`);
  
  // Create output files
  const singleyrOutput: ProcessedData = {
    metadata: {
      totalScientists: singleyrScientists.length,
      year: 2025,
      datasetType: 'singleyr',
      processedAt: new Date().toISOString(),
    },
    scientists: singleyrScientists,
    fieldThresholds,
    subfieldThresholds,
  };
  
  const careerOutput: ProcessedData = {
    metadata: {
      totalScientists: careerScientists.length,
      year: 2025,
      datasetType: 'career',
      processedAt: new Date().toISOString(),
    },
    scientists: careerScientists,
    fieldThresholds,
    subfieldThresholds,
  };
  
  // Write JSON files (we'll also create a lighter version for initial load)
  fs.writeFileSync(
    path.join(outputDir, 'singleyr.json'),
    JSON.stringify(singleyrOutput)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'career.json'),
    JSON.stringify(careerOutput)
  );
  
  // Create a lighter index file for quick loading (top 1000 + metadata)
  const createLightIndex = (scientists: Scientist[]) => ({
    metadata: {
      totalScientists: scientists.length,
      year: 2025,
      processedAt: new Date().toISOString(),
    },
    topScientists: scientists.slice(0, 1000),
    fields: [...new Set(scientists.map(s => s.field).filter(Boolean))].sort(),
    countries: [...new Set(scientists.map(s => s.country).filter(Boolean))].sort(),
    subfields: [...new Set(scientists.map(s => s.subfield).filter(Boolean))].sort(),
    stats: {
      maxRank: scientists.length,
      maxCitations: Math.max(...scientists.map(s => s.citations)),
      maxHIndex: Math.max(...scientists.map(s => s.hIndex)),
      maxCompositeScore: Math.max(...scientists.map(s => s.compositeScore)),
    },
  });
  
  fs.writeFileSync(
    path.join(outputDir, 'singleyr-index.json'),
    JSON.stringify(createLightIndex(singleyrScientists))
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'career-index.json'),
    JSON.stringify(createLightIndex(careerScientists))
  );
  
  // Create field/subfield thresholds files
  fs.writeFileSync(
    path.join(outputDir, 'field-thresholds.json'),
    JSON.stringify(fieldThresholds)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'subfield-thresholds.json'),
    JSON.stringify(subfieldThresholds)
  );
  
  console.log('Data processing complete!');
  console.log(`Output written to ${outputDir}`);
}

main().catch(console.error);