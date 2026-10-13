export interface Scientist {
  /** Dense unique id (1-based array index) used for URLs. */
  id?: number;
  rank: number;
  rankNs?: number;
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
  // Additional fields from CSV
  nps?: number;
  ncs?: number;
  cpsf?: number;
  ncsf?: number;
  npsfl?: number;
  ncsfl?: number;
  npciting?: number;
  cprat?: number;
  np6025_cited2525?: number;
  np6025_rw?: number;
  nc2525_to_rw?: number;
  nc2525_rw?: number;
  "sm-subfield-1-frac"?: number;
  "sm-subfield-2"?: string;
  "sm-subfield-2-frac"?: number;
  "sm-field"?: string;
  "sm-field-frac"?: number;
  "rank sm-subfield-1"?: number;
  "rank sm-subfield-1 (ns)"?: number;
  "sm-subfield-1 count"?: number;
  top_cntry_career?: string;
  top_cntry_share?: number;
  cntry_10pct?: string;
  cntry_cov?: number;
  // Self-citation-excluded (ns) variants of the main metrics
  citationsNs?: number;
  hIndexNs?: number;
  hmIndexNs?: number;
  npsNs?: number;
  ncsNs?: number;
  cpsfNs?: number;
  ncsfNs?: number;
  npsflNs?: number;
  ncsflNs?: number;
  compositeScoreNs?: number;
  npcitingNs?: number;
  cpratNs?: number;
  // Derived sm-subfield-2 ranks (competition ranking within sm-subfield-2 group)
  rankInSubfield2?: number;
  rankInSubfield2Ns?: number;
}

export interface CountEntry {
  name: string;
  count: number;
}

export interface PercentileBlock {
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
  max: number;
}

export interface Aggregates {
  institutionCounts: CountEntry[];
  countryCounts: CountEntry[];
  fieldCounts: CountEntry[];
  decadeCounts: Record<string, number>;
  percentiles: {
    citations: PercentileBlock;
    hIndex: PercentileBlock;
    compositeScore: PercentileBlock;
  };
  risingStars: Scientist[];
}

export interface ScientistIndex {
  metadata: {
    totalScientists: number;
    year: number;
    datasetType: 'singleyr' | 'career';
    processedAt: string;
  };
  topScientists: Scientist[];
  fields: string[];
  countries: string[];
  subfields: string[];
  stats: {
    maxRank: number;
    maxCitations: number;
    maxHIndex: number;
    maxCompositeScore: number;
  };
  aggregates?: Aggregates;
}

export interface ScientistFullData {
  metadata: {
    totalScientists: number;
    year: number;
    datasetType: 'singleyr' | 'career';
    processedAt: string;
  };
  scientists: Scientist[];
}

export interface FieldThreshold {
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

export interface SubfieldThreshold {
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

export interface TableFilters {
  search: string;
  field: string;
  country: string;
  subfield: string;
  subfield2: string;
  firstYear: string;
  dataset: 'singleyr' | 'career';
  density: 'comfortable' | 'compact';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalScientists: number;
  totalCountries: number;
  totalFields: number;
  topCitations: number;
  topHIndex: number;
  avgCompositeScore: number;
}

export interface FieldDistribution {
  field: string;
  count: number;
  percentage: number;
}

export interface CountryDistribution {
  country: string;
  count: number;
  percentage: number;
}

export interface RankingDistribution {
  range: string;
  count: number;
}