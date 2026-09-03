import { CountryGroup, LeagueConfig } from '../types';

/**
 * CONFIGURAZIONE CENTRALIZZATA DELLE 10 COMPETIZIONI MONITORATE.
 * Fonte primaria: API-Football (api-football.com).
 * 
 * ESCLUSIVAMENTE queste 10 competizioni sono ammesse nel sistema.
 * Qualsiasi altra competizione (Champions League, Europa League, Coppe Nazionali, Amichevoli, ecc.)
 * viene categoricamente esclusa.
 */
export const MONITORED_LEAGUES: LeagueConfig[] = [
  // ITALIA
  {
    id: 'it-serie-a',
    apiLeagueId: 135,
    name: 'Serie A',
    country: 'Italia',
    countryCode: 'IT',
    countryFlag: '🇮🇹',
    tier: 1,
    shortName: 'Serie A',
    colorAccent: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
    active: true,
  },
  {
    id: 'it-serie-b',
    apiLeagueId: 136,
    name: 'Serie B',
    country: 'Italia',
    countryCode: 'IT',
    countryFlag: '🇮🇹',
    tier: 2,
    shortName: 'Serie B',
    colorAccent: 'text-sky-400 border-sky-400/20 bg-sky-400/10',
    active: true,
  },

  // FRANCIA
  {
    id: 'fr-ligue-1',
    apiLeagueId: 61,
    name: 'Ligue 1',
    country: 'Francia',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    tier: 1,
    shortName: 'Ligue 1',
    colorAccent: 'text-indigo-500 border-indigo-500/20 bg-indigo-500/10',
    active: true,
  },
  {
    id: 'fr-ligue-2',
    apiLeagueId: 62,
    name: 'Ligue 2',
    country: 'Francia',
    countryCode: 'FR',
    countryFlag: '🇫🇷',
    tier: 2,
    shortName: 'Ligue 2',
    colorAccent: 'text-violet-400 border-violet-400/20 bg-violet-400/10',
    active: true,
  },

  // INGHILTERRA
  {
    id: 'en-premier-league',
    apiLeagueId: 39,
    name: 'Premier League',
    country: 'Inghilterra',
    countryCode: 'EN',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tier: 1,
    shortName: 'Premier',
    colorAccent: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
    active: true,
  },
  {
    id: 'en-championship',
    apiLeagueId: 40,
    name: 'Championship',
    country: 'Inghilterra',
    countryCode: 'EN',
    countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    tier: 2,
    shortName: 'Championship',
    colorAccent: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
    active: true,
  },

  // SPAGNA
  {
    id: 'es-la-liga',
    apiLeagueId: 140,
    name: 'La Liga',
    country: 'Spagna',
    countryCode: 'ES',
    countryFlag: '🇪🇸',
    tier: 1,
    shortName: 'La Liga',
    colorAccent: 'text-rose-500 border-rose-500/20 bg-rose-500/10',
    active: true,
  },
  {
    id: 'es-segunda-division',
    apiLeagueId: 141,
    name: 'Segunda División',
    country: 'Spagna',
    countryCode: 'ES',
    countryFlag: '🇪🇸',
    tier: 2,
    shortName: 'LaLiga 2',
    colorAccent: 'text-orange-400 border-orange-400/20 bg-orange-400/10',
    active: true,
  },

  // GERMANIA
  {
    id: 'de-bundesliga',
    apiLeagueId: 78,
    name: 'Bundesliga',
    country: 'Germania',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    tier: 1,
    shortName: 'Bundesliga',
    colorAccent: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
    active: true,
  },
  {
    id: 'de-2-bundesliga',
    apiLeagueId: 79,
    name: '2. Bundesliga',
    country: 'Germania',
    countryCode: 'DE',
    countryFlag: '🇩🇪',
    tier: 2,
    shortName: '2. Bundesliga',
    colorAccent: 'text-teal-400 border-teal-400/20 bg-teal-400/10',
    active: true,
  },
];

/**
 * Array immutabile degli unici 10 ID ammessi di API-Football.
 */
export const ALLOWED_API_LEAGUE_IDS: readonly number[] = MONITORED_LEAGUES.map(
  (l) => l.apiLeagueId
);

/**
 * Verifica se un ID di lega appartiene rigorosamente alle 10 competizioni consentite.
 */
export function isAllowedApiLeagueId(apiLeagueId: number): boolean {
  return ALLOWED_API_LEAGUE_IDS.includes(Number(apiLeagueId));
}

/**
 * Recupera la configurazione di una lega dal suo ID API-Football.
 */
export function getLeagueByApiId(apiLeagueId: number): LeagueConfig | undefined {
  return MONITORED_LEAGUES.find((l) => l.apiLeagueId === Number(apiLeagueId));
}

/**
 * Recupera la configurazione di una lega dal suo slug interno (es. 'it-serie-a').
 */
export function getLeagueById(id: string): LeagueConfig | undefined {
  return MONITORED_LEAGUES.find((l) => l.id === id);
}

export const COUNTRY_GROUPS: CountryGroup[] = [
  {
    name: 'Italia',
    code: 'IT',
    flag: '🇮🇹',
    leagues: MONITORED_LEAGUES.filter((l) => l.countryCode === 'IT'),
  },
  {
    name: 'Francia',
    code: 'FR',
    flag: '🇫🇷',
    leagues: MONITORED_LEAGUES.filter((l) => l.countryCode === 'FR'),
  },
  {
    name: 'Inghilterra',
    code: 'EN',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    leagues: MONITORED_LEAGUES.filter((l) => l.countryCode === 'EN'),
  },
  {
    name: 'Spagna',
    code: 'ES',
    flag: '🇪🇸',
    leagues: MONITORED_LEAGUES.filter((l) => l.countryCode === 'ES'),
  },
  {
    name: 'Germania',
    code: 'DE',
    flag: '🇩🇪',
    leagues: MONITORED_LEAGUES.filter((l) => l.countryCode === 'DE'),
  },
];

export const DEFAULT_SETTINGS = {
  noDrawAlertThreshold: 5,
  frequentDrawPercentageThreshold: 35,
  initialBankroll: 1000,
  currency: '€',
  activeLeagues: MONITORED_LEAGUES.map((l) => l.id),
};
