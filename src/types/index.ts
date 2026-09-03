export type PageId =
  | 'dashboard'
  | 'no-draw-alerts'
  | 'frequent-draws-alerts'
  | 'bet-entry'
  | 'bet-database';

export type CountryCode = 'IT' | 'FR' | 'EN' | 'ES' | 'DE';

export type LeagueTier = 1 | 2;

export interface LeagueConfig {
  id: string;
  apiLeagueId: number; // Official API-Football League ID (e.g. 135 for Serie A)
  name: string;
  country: string;
  countryCode: CountryCode;
  countryFlag: string;
  tier: LeagueTier;
  shortName: string;
  colorAccent: string;
  active: boolean;
}

export interface CountryGroup {
  name: string;
  code: CountryCode;
  flag: string;
  leagues: LeagueConfig[];
}

export interface MatchTeam {
  id: number;
  name: string;
  logo?: string;
}

export interface MatchFixture {
  id: number;
  apiFixtureId: number;
  apiLeagueId: number;
  leagueId: string;
  leagueName: string;
  countryFlag: string;
  season: number;
  round: string;
  date: string; // ISO date string
  timestamp: number;
  status: string; // 'FT', 'NS', '1H', '2H', 'HT', 'PST', 'CANC'
  statusShort: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  goalsHome: number | null;
  goalsAway: number | null;
  isFinished: boolean;
  isDraw: boolean;
}

export interface LeagueTableEntry {
  rank: number;
  teamId: number;
  teamName: string;
  teamLogo: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalsDiff: number;
  form: string;
}

export interface LeagueSyncMetadata {
  apiLeagueId: number;
  leagueId: string;
  season: number;
  lastSyncAt: string;
  fixturesCount: number;
  standingsCount: number;
  status: 'idle' | 'syncing' | 'success' | 'error';
  errorMessage?: string;
}

export interface ApiTestResult {
  success: boolean;
  timestamp: string;
  apiLeagueId: number;
  leagueName: string;
  country: string;
  latencyMs: number;
  requestsRemaining?: number;
  requestsLimit?: number;
  seasonUsed: number;
  sampleFixture?: {
    home: string;
    away: string;
    date: string;
    status: string;
    score: string;
  };
  error?: string;
}

export type BetStatus = 'pending' | 'won' | 'lost' | 'void';

export type BetType = '1X2_DRAW' | 'DRAW_NO_BET' | 'HALF_TIME_DRAW' | 'OTHER';

export interface PrefillBetData {
  leagueId: string;
  season?: number;
  homeTeam: string;
  awayTeam: string;
  alertTeam?: string;
  matchDate?: string;
  fixtureId?: number;
}

export interface Bet {
  id: string;
  leagueId: string;
  leagueName: string;
  countryFlag: string;
  season?: number;
  homeTeam: string;
  awayTeam: string;
  alertTeam?: string;
  matchDate: string;
  betType: BetType;
  odds: number;
  stake: number;
  targetProfit?: number;
  potentialPayout: number;
  netProfit?: number;
  status: BetStatus;
  result_checked?: boolean;
  notes?: string;
  createdAt: string;
  settledAt?: string;
}

export interface NoDrawAlertItem {
  id: string;
  leagueId: string;
  leagueName: string;
  countryFlag: string;
  teamName: string;
  matchesWithoutDraw: number;
  lastDrawDate: string;
  nextMatch?: {
    opponent: string;
    date: string;
    isHome: boolean;
  };
  historicalMaxWithoutDraw?: number;
}

export interface FrequentDrawAlertItem {
  id: string;
  leagueId: string;
  leagueName: string;
  countryFlag: string;
  teamName: string;
  playedMatches: number;
  drawsCount: number;
  drawPercentage: number;
  recentForm: ('W' | 'D' | 'L')[];
  nextMatch?: {
    opponent: string;
    date: string;
    isHome: boolean;
  };
}

export interface DashboardStats {
  currentBankroll: number;
  currency: string;
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  lastDataUpdate: string;
}

export interface AppSettings {
  noDrawAlertThreshold: number; // min matches without draw to trigger alert (e.g. 5)
  frequentDrawPercentageThreshold: number; // min draw percentage to trigger alert (e.g. 35%)
  initialBankroll: number;
  currency: string;
  activeLeagues: string[];
}
