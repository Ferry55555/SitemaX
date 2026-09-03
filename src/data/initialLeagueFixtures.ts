import { MONITORED_LEAGUES } from '../config/leagues';
import { MatchFixture } from '../types';
import { getCurrentFootballSeason } from '../utils/seasonUtils';
import { getSpainFixtures } from './leagues/spain';
import { getItalyFixtures } from './leagues/italy';
import { getEnglandFixtures } from './leagues/england';
import { getGermanyFixtures } from './leagues/germany';
import { getFranceFixtures } from './leagues/france';

/**
 * Squadre ufficiali per le 10 competizioni monitorate
 */
export const OFFICIAL_LEAGUE_TEAMS: Record<number, { id: number; name: string }[]> = {
  // Serie A (ID: 135) - 20 Squadre
  135: [
    { id: 505, name: 'Inter' },
    { id: 492, name: 'Napoli' },
    { id: 496, name: 'Juventus' },
    { id: 489, name: 'Milan' },
    { id: 499, name: 'Atalanta' },
    { id: 497, name: 'Roma' },
    { id: 487, name: 'Lazio' },
    { id: 502, name: 'Fiorentina' },
    { id: 500, name: 'Bologna' },
    { id: 503, name: 'Torino' },
    { id: 520, name: 'Genoa' },
    { id: 506, name: 'Monza' },
    { id: 523, name: 'Verona' },
    { id: 522, name: 'Lecce' },
    { id: 494, name: 'Udinese' },
    { id: 518, name: 'Cagliari' },
    { id: 507, name: 'Parma' },
    { id: 508, name: 'Como' },
    { id: 509, name: 'Venezia' },
    { id: 511, name: 'Empoli' },
  ],
  // Serie B (ID: 136) - 20 Squadre
  136: [
    { id: 514, name: 'Salernitana' },
    { id: 517, name: 'Frosinone' },
    { id: 510, name: 'Cremonese' },
    { id: 512, name: 'Catanzaro' },
    { id: 513, name: 'Palermo' },
    { id: 516, name: 'Sampdoria' },
    { id: 519, name: 'Brescia' },
    { id: 521, name: 'Cosenza' },
    { id: 524, name: 'Bari' },
    { id: 504, name: 'Spezia' },
    { id: 501, name: 'Pisa' },
    { id: 525, name: 'Cesena' },
    { id: 526, name: 'Modena' },
    { id: 527, name: 'Reggiana' },
    { id: 528, name: 'Südtirol' },
    { id: 534, name: 'Cittadella' },
    { id: 535, name: 'Juve Stabia' },
    { id: 549, name: 'Carrarese' },
    { id: 550, name: 'Mantova' },
    { id: 515, name: 'Sassuolo' },
  ],
  // Ligue 1 (ID: 61) - 18 Squadre
  61: [
    { id: 85, name: 'Paris Saint Germain' },
    { id: 91, name: 'Monaco' },
    { id: 81, name: 'Marseille' },
    { id: 80, name: 'Lyon' },
    { id: 94, name: 'Rennes' },
    { id: 79, name: 'Lille' },
    { id: 84, name: 'Nice' },
    { id: 116, name: 'Lens' },
    { id: 95, name: 'Strasbourg' },
    { id: 106, name: 'Brest' },
    { id: 93, name: 'Stade de Reims' },
    { id: 96, name: 'Toulouse' },
    { id: 82, name: 'Montpellier' },
    { id: 83, name: 'Nantes' },
    { id: 105, name: 'Le Havre' },
    { id: 111, name: 'Auxerre' },
    { id: 112, name: 'Angers' },
    { id: 113, name: 'Saint Etienne' },
  ],
  // Ligue 2 (ID: 62) - 18 Squadre
  62: [
    { id: 97, name: 'Lorient' },
    { id: 110, name: 'Metz' },
    { id: 114, name: 'Clermont' },
    { id: 115, name: 'Rodez' },
    { id: 117, name: 'Paris FC' },
    { id: 118, name: 'Pau FC' },
    { id: 119, name: 'Laval' },
    { id: 120, name: 'Guingamp' },
    { id: 121, name: 'Caen' },
    { id: 122, name: 'Amiens' },
    { id: 123, name: 'Bastia' },
    { id: 124, name: 'Grenoble' },
    { id: 125, name: 'Ajaccio' },
    { id: 126, name: 'Annecy' },
    { id: 127, name: 'Dunkerque' },
    { id: 128, name: 'Troyes' },
    { id: 129, name: 'Red Star' },
    { id: 130, name: 'Martigues' },
  ],
  // Premier League (ID: 39) - 20 Squadre
  39: [
    { id: 50, name: 'Manchester City' },
    { id: 42, name: 'Arsenal' },
    { id: 40, name: 'Liverpool' },
    { id: 66, name: 'Aston Villa' },
    { id: 47, name: 'Tottenham' },
    { id: 49, name: 'Chelsea' },
    { id: 34, name: 'Newcastle' },
    { id: 33, name: 'Manchester United' },
    { id: 51, name: 'Brighton' },
    { id: 48, name: 'West Ham' },
    { id: 52, name: 'Crystal Palace' },
    { id: 35, name: 'Bournemouth' },
    { id: 36, name: 'Fulham' },
    { id: 38, name: 'Wolverhampton' },
    { id: 45, name: 'Everton' },
    { id: 55, name: 'Brentford' },
    { id: 65, name: 'Nottingham Forest' },
    { id: 46, name: 'Leicester' },
    { id: 71, name: 'Ipswich' },
    { id: 41, name: 'Southampton' },
  ],
  // Championship (ID: 40) - 24 Squadre
  40: [
    { id: 63, name: 'Leeds' },
    { id: 44, name: 'Burnley' },
    { id: 43, name: 'Luton' },
    { id: 62, name: 'Sheffield United' },
    { id: 60, name: 'West Brom' },
    { id: 72, name: 'Norwich' },
    { id: 64, name: 'Hull City' },
    { id: 57, name: 'Middlesbrough' },
    { id: 1077, name: 'Coventry' },
    { id: 70, name: 'Preston' },
    { id: 73, name: 'Bristol City' },
    { id: 69, name: 'Cardiff' },
    { id: 74, name: 'Swansea' },
    { id: 37, name: 'Watford' },
    { id: 746, name: 'Sunderland' },
    { id: 75, name: 'Stoke' },
    { id: 76, name: 'QPR' },
    { id: 67, name: 'Blackburn' },
    { id: 58, name: 'Millwall' },
    { id: 77, name: 'Sheffield Wednesday' },
    { id: 78, name: 'Plymouth' },
    { id: 79, name: 'Oxford United' },
    { id: 80, name: 'Derby County' },
    { id: 81, name: 'Portsmouth' },
  ],
  // La Liga (ID: 140) - 20 Squadre
  140: [
    { id: 541, name: 'Real Madrid' },
    { id: 529, name: 'Barcelona' },
    { id: 530, name: 'Atletico Madrid' },
    { id: 546, name: 'Girona' },
    { id: 531, name: 'Athletic Club' },
    { id: 548, name: 'Real Sociedad' },
    { id: 543, name: 'Real Betis' },
    { id: 533, name: 'Villarreal' },
    { id: 532, name: 'Valencia' },
    { id: 536, name: 'Sevilla' },
    { id: 727, name: 'Osasuna' },
    { id: 534, name: 'Getafe' },
    { id: 538, name: 'Celta Vigo' },
    { id: 798, name: 'Mallorca' },
    { id: 535, name: 'Las Palmas' },
    { id: 728, name: 'Rayo Vallecano' },
    { id: 542, name: 'Alaves' },
    { id: 537, name: 'Leganes' },
    { id: 720, name: 'Valladolid' },
    { id: 540, name: 'Espanyol' },
  ],
  // Segunda División (ID: 141) - 22 Squadre
  141: [
    { id: 724, name: 'Cadiz' },
    { id: 723, name: 'Almeria' },
    { id: 715, name: 'Granada' },
    { id: 539, name: 'Eibar' },
    { id: 544, name: 'Sporting Gijon' },
    { id: 545, name: 'Oviedo' },
    { id: 547, name: 'Racing Santander' },
    { id: 536, name: 'Levante' },
    { id: 729, name: 'Burgos' },
    { id: 730, name: 'Racing Ferrol' },
    { id: 797, name: 'Elche' },
    { id: 731, name: 'Tenerife' },
    { id: 732, name: 'Albacete' },
    { id: 733, name: 'Cartagena' },
    { id: 734, name: 'Zaragoza' },
    { id: 735, name: 'Eldense' },
    { id: 736, name: 'Huesca' },
    { id: 737, name: 'Mirandes' },
    { id: 738, name: 'Cordoba' },
    { id: 739, name: 'Malaga' },
    { id: 740, name: 'Castellon' },
    { id: 741, name: 'Deportivo La Coruna' },
  ],
  // Bundesliga (ID: 78) - 18 Squadre
  78: [
    { id: 168, name: 'Bayer Leverkusen' },
    { id: 157, name: 'Bayern Munich' },
    { id: 172, name: 'VfB Stuttgart' },
    { id: 173, name: 'RB Leipzig' },
    { id: 165, name: 'Borussia Dortmund' },
    { id: 169, name: 'Eintracht Frankfurt' },
    { id: 167, name: 'TSG Hoffenheim' },
    { id: 180, name: 'FC Heidenheim' },
    { id: 162, name: 'Werder Bremen' },
    { id: 160, name: 'SC Freiburg' },
    { id: 170, name: 'FC Augsburg' },
    { id: 161, name: 'VfL Wolfsburg' },
    { id: 164, name: 'FSV Mainz 05' },
    { id: 163, name: 'Borussia Monchengladbach' },
    { id: 182, name: 'Union Berlin' },
    { id: 176, name: 'VfL Bochum' },
    { id: 181, name: 'FC St. Pauli' },
    { id: 183, name: 'Holstein Kiel' },
  ],
  // 2. Bundesliga (ID: 79) - 18 Squadre
  79: [
    { id: 183, name: 'Holstein Kiel' },
    { id: 192, name: '1. FC Köln' },
    { id: 193, name: 'SV Darmstadt 98' },
    { id: 184, name: 'Fortuna Düsseldorf' },
    { id: 185, name: 'Hamburger SV' },
    { id: 186, name: 'Karlsruher SC' },
    { id: 187, name: 'Hannover 96' },
    { id: 188, name: 'SC Paderborn 07' },
    { id: 189, name: 'SpVgg Greuther Fürth' },
    { id: 190, name: 'Hertha BSC' },
    { id: 191, name: 'FC Schalke 04' },
    { id: 194, name: 'SV Elversberg' },
    { id: 195, name: '1. FC Nürnberg' },
    { id: 196, name: '1. FC Kaiserslautern' },
    { id: 197, name: '1. FC Magdeburg' },
    { id: 198, name: 'Eintracht Braunschweig' },
    { id: 199, name: 'SSV Ulm 1846' },
    { id: 200, name: 'Preußen Münster' },
  ],
};

/**
 * Genera partite realistiche per ciascuna lega per una specifica stagione.
 */
export function generateInitialLeagueFixturesForSeason(targetSeason: number): Record<number, MatchFixture[]> {
  const currentSeason = getCurrentFootballSeason();
  const isCurrentSeason = targetSeason === currentSeason;

  const spain = getSpainFixtures(targetSeason, isCurrentSeason);
  const italy = getItalyFixtures(targetSeason, isCurrentSeason);
  const england = getEnglandFixtures(targetSeason, isCurrentSeason);
  const germany = getGermanyFixtures(targetSeason, isCurrentSeason);
  const france = getFranceFixtures(targetSeason, isCurrentSeason);

  return {
    ...italy,
    ...france,
    ...england,
    ...spain,
    ...germany,
  };
}

/**
 * Genera partite storiche realistiche per ciascuna lega con serie deterministiche
 */
export function generateInitialLeagueFixtures(targetSeason?: number): Record<number, MatchFixture[]> {
  if (targetSeason !== undefined) {
    return generateInitialLeagueFixturesForSeason(targetSeason);
  }

  const currentSeason = getCurrentFootballSeason();
  const seasons = [currentSeason, currentSeason - 1, currentSeason - 2];
  const combined: Record<number, MatchFixture[]> = {};

  MONITORED_LEAGUES.forEach((l) => {
    combined[l.apiLeagueId] = [];
  });

  seasons.forEach((season) => {
    const seasonFixtures = generateInitialLeagueFixturesForSeason(season);
    Object.entries(seasonFixtures).forEach(([apiIdStr, fixtures]) => {
      const apiId = Number(apiIdStr);
      combined[apiId] = (combined[apiId] || []).concat(fixtures);
    });
  });

  return combined;
}
