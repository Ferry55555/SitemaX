import { MatchFixture } from '../../types';

export function getGermanyFixtures(season: number, isCurrentSeason: boolean): { [key: number]: MatchFixture[] } {
  const fixtures78: MatchFixture[] = [];
  const fixtures79: MatchFixture[] = [];

  let idCounter78 = 7800000 + season * 1000;
  let idCounter79 = 7900000 + season * 1000;

  // ----------------------------------------------------
  // BUNDESLIGA (78) - 18 Squadre
  // ----------------------------------------------------
  const bundesligaRounds: {
    round: number;
    date: string;
    timestamp: number;
    matches: {
      home: { id: number; name: string };
      away: { id: number; name: string };
      goalsHome: number | null;
      goalsAway: number | null;
      isFinished: boolean;
    }[];
  }[] = [
    {
      round: 1,
      date: new Date(Date.UTC(season, 7, 23, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 18, 30, 0),
      matches: [
        { home: { id: 163, name: 'Borussia Monchengladbach' }, away: { id: 168, name: 'Bayer Leverkusen' }, goalsHome: 2, goalsAway: 3, isFinished: true },
        { home: { id: 173, name: 'RB Leipzig' }, away: { id: 176, name: 'VfL Bochum' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 167, name: 'TSG Hoffenheim' }, away: { id: 183, name: 'Holstein Kiel' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 160, name: 'SC Freiburg' }, away: { id: 172, name: 'VfB Stuttgart' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 170, name: 'FC Augsburg' }, away: { id: 162, name: 'Werder Bremen' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 164, name: 'FSV Mainz 05' }, away: { id: 182, name: 'Union Berlin' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 165, name: 'Borussia Dortmund' }, away: { id: 169, name: 'Eintracht Frankfurt' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 161, name: 'VfL Wolfsburg' }, away: { id: 157, name: 'Bayern Munich' }, goalsHome: 2, goalsAway: 3, isFinished: true },
        { home: { id: 181, name: 'FC St. Pauli' }, away: { id: 180, name: 'FC Heidenheim' }, goalsHome: 0, goalsAway: 2, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 30, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 18, 30, 0),
      matches: [
        { home: { id: 182, name: 'Union Berlin' }, away: { id: 181, name: 'FC St. Pauli' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 172, name: 'VfB Stuttgart' }, away: { id: 164, name: 'FSV Mainz 05' }, goalsHome: 3, goalsAway: 3, isFinished: true }, // Draw
        { home: { id: 169, name: 'Eintracht Frankfurt' }, away: { id: 167, name: 'TSG Hoffenheim' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 162, name: 'Werder Bremen' }, away: { id: 165, name: 'Borussia Dortmund' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 176, name: 'VfL Bochum' }, away: { id: 163, name: 'Borussia Monchengladbach' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 183, name: 'Holstein Kiel' }, away: { id: 161, name: 'VfL Wolfsburg' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 168, name: 'Bayer Leverkusen' }, away: { id: 173, name: 'RB Leipzig' }, goalsHome: 2, goalsAway: 3, isFinished: true },
        { home: { id: 180, name: 'FC Heidenheim' }, away: { id: 170, name: 'FC Augsburg' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 157, name: 'Bayern Munich' }, away: { id: 160, name: 'SC Freiburg' }, goalsHome: 2, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 8, 13, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 13, 18, 30, 0),
      matches: [
        { home: { id: 165, name: 'Borussia Dortmund' }, away: { id: 180, name: 'FC Heidenheim' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 173, name: 'RB Leipzig' }, away: { id: 182, name: 'Union Berlin' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 167, name: 'TSG Hoffenheim' }, away: { id: 168, name: 'Bayer Leverkusen' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 160, name: 'SC Freiburg' }, away: { id: 176, name: 'VfL Bochum' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 161, name: 'VfL Wolfsburg' }, away: { id: 169, name: 'Eintracht Frankfurt' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 163, name: 'Borussia Monchengladbach' }, away: { id: 172, name: 'VfB Stuttgart' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 183, name: 'Holstein Kiel' }, away: { id: 157, name: 'Bayern Munich' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 170, name: 'FC Augsburg' }, away: { id: 181, name: 'FC St. Pauli' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 164, name: 'FSV Mainz 05' }, away: { id: 162, name: 'Werder Bremen' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  bundesligaRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter78++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 2 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures78.push({
        id: idCounter78,
        apiFixtureId: idCounter78,
        apiLeagueId: 78,
        leagueId: 'de-bundesliga',
        leagueName: 'Bundesliga',
        countryFlag: '🇩🇪',
        season,
        round: `Giornata ${r.round}`,
        date: r.date,
        timestamp: r.timestamp,
        status: isFinished ? 'Match Finished' : 'Not Started',
        statusShort: isFinished ? 'FT' : 'NS',
        homeTeam: m.home,
        awayTeam: m.away,
        goalsHome,
        goalsAway,
        isFinished,
        isDraw,
      });
    });
  });

  const teams78 = [
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
  ];

  for (let round = 4; round <= 34; round++) {
    const roundTimestamp = Date.UTC(season, 7, 23, 18, 30, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams78.length / 2; matchIndex++) {
      idCounter78++;
      const homeIndex = (round + matchIndex) % teams78.length;
      let awayIndex = (round + teams78.length - matchIndex - 1) % teams78.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams78.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams78[homeIndex] : teams78[awayIndex];
      const away = isOdd ? teams78[awayIndex] : teams78[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures78.push({
        id: idCounter78,
        apiFixtureId: idCounter78,
        apiLeagueId: 78,
        leagueId: 'de-bundesliga',
        leagueName: 'Bundesliga',
        countryFlag: '🇩🇪',
        season,
        round: `Giornata ${round}`,
        date: new Date(roundTimestamp).toISOString(),
        timestamp: roundTimestamp,
        status: isFinished ? 'Match Finished' : 'Not Started',
        statusShort: isFinished ? 'FT' : 'NS',
        homeTeam: { id: home.id, name: home.name },
        awayTeam: { id: away.id, name: away.name },
        goalsHome,
        goalsAway,
        isFinished,
        isDraw,
      });
    }
  }

  // ----------------------------------------------------
  // 2. BUNDESLIGA (79) - 18 Squadre
  // ----------------------------------------------------
  const bundesliga2Rounds: {
    round: number;
    date: string;
    timestamp: number;
    matches: {
      home: { id: number; name: string };
      away: { id: number; name: string };
      goalsHome: number | null;
      goalsAway: number | null;
      isFinished: boolean;
    }[];
  }[] = [
    {
      round: 1,
      date: new Date(Date.UTC(season, 7, 2, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 2, 18, 30, 0),
      matches: [
        { home: { id: 192, name: '1. FC Köln' }, away: { id: 185, name: 'Hamburger SV' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 187, name: 'Hannover 96' }, away: { id: 183, name: 'Holstein Kiel' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 190, name: 'Hertha BSC' }, away: { id: 188, name: 'SC Paderborn 07' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 197, name: '1. FC Magdeburg' }, away: { id: 194, name: 'SV Elversberg' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 191, name: 'FC Schalke 04' }, away: { id: 198, name: 'Eintracht Braunschweig' }, goalsHome: 5, goalsAway: 1, isFinished: true },
        { home: { id: 186, name: 'Karlsruher SC' }, away: { id: 195, name: '1. FC Nürnberg' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 189, name: 'SpVgg Greuther Fürth' }, away: { id: 200, name: 'Preußen Münster' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 193, name: 'SV Darmstadt 98' }, away: { id: 184, name: 'Fortuna Düsseldorf' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 199, name: 'SSV Ulm 1846' }, away: { id: 196, name: '1. FC Kaiserslautern' }, goalsHome: 1, goalsAway: 2, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 9, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 9, 18, 30, 0),
      matches: [
        { home: { id: 196, name: '1. FC Kaiserslautern' }, away: { id: 189, name: 'SpVgg Greuther Fürth' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 185, name: 'Hamburger SV' }, away: { id: 186, name: 'Karlsruher SC' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 194, name: 'SV Elversberg' }, away: { id: 188, name: 'SC Paderborn 07' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 195, name: '1. FC Nürnberg' }, away: { id: 191, name: 'FC Schalke 04' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 184, name: 'Fortuna Düsseldorf' }, away: { id: 200, name: 'Preußen Münster' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 183, name: 'Holstein Kiel' }, away: { id: 199, name: 'SSV Ulm 1846' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 190, name: 'Hertha BSC' }, away: { id: 193, name: 'SV Darmstadt 98' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 198, name: 'Eintracht Braunschweig' }, away: { id: 197, name: '1. FC Magdeburg' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 192, name: '1. FC Köln' }, away: { id: 187, name: 'Hannover 96' }, goalsHome: 2, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 23, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 18, 30, 0),
      matches: [
        { home: { id: 193, name: 'SV Darmstadt 98' }, away: { id: 189, name: 'SpVgg Greuther Fürth' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 194, name: 'SV Elversberg' }, away: { id: 185, name: 'Hamburger SV' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 188, name: 'SC Paderborn 07' }, away: { id: 186, name: 'Karlsruher SC' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 196, name: '1. FC Kaiserslautern' }, away: { id: 190, name: 'Hertha BSC' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 187, name: 'Hannover 96' }, away: { id: 199, name: 'SSV Ulm 1846' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 195, name: '1. FC Nürnberg' }, away: { id: 200, name: 'Preußen Münster' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 184, name: 'Fortuna Düsseldorf' }, away: { id: 191, name: 'FC Schalke 04' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 197, name: '1. FC Magdeburg' }, away: { id: 183, name: 'Holstein Kiel' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 198, name: 'Eintracht Braunschweig' }, away: { id: 192, name: '1. FC Köln' }, goalsHome: 0, goalsAway: 3, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 1, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 1, 18, 30, 0),
      matches: [
        { home: { id: 191, name: 'FC Schalke 04' }, away: { id: 192, name: '1. FC Köln' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 184, name: 'Fortuna Düsseldorf' }, away: { id: 187, name: 'Hannover 96' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 185, name: 'Hamburger SV' }, away: { id: 200, name: 'Preußen Münster' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 196, name: '1. FC Kaiserslautern' }, away: { id: 190, name: 'Hertha BSC' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 188, name: 'SC Paderborn 07' }, away: { id: 199, name: 'SSV Ulm 1846' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 194, name: 'SV Elversberg' }, away: { id: 193, name: 'SV Darmstadt 98' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 195, name: '1. FC Nürnberg' }, away: { id: 197, name: '1. FC Magdeburg' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 198, name: 'Eintracht Braunschweig' }, away: { id: 186, name: 'Karlsruher SC' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 183, name: 'Holstein Kiel' }, away: { id: 189, name: 'SpVgg Greuther Fürth' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  bundesliga2Rounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter79++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 1 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 0 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures79.push({
        id: idCounter79,
        apiFixtureId: idCounter79,
        apiLeagueId: 79,
        leagueId: 'de-2-bundesliga',
        leagueName: '2. Bundesliga',
        countryFlag: '🇩🇪',
        season,
        round: `Giornata ${r.round}`,
        date: r.date,
        timestamp: r.timestamp,
        status: isFinished ? 'Match Finished' : 'Not Started',
        statusShort: isFinished ? 'FT' : 'NS',
        homeTeam: m.home,
        awayTeam: m.away,
        goalsHome,
        goalsAway,
        isFinished,
        isDraw,
      });
    });
  });

  const teams79 = [
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
  ];

  for (let round = 5; round <= 34; round++) {
    const roundTimestamp = Date.UTC(season, 7, 2, 18, 30, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams79.length / 2; matchIndex++) {
      idCounter79++;
      const homeIndex = (round + matchIndex) % teams79.length;
      let awayIndex = (round + teams79.length - matchIndex - 1) % teams79.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams79.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams79[homeIndex] : teams79[awayIndex];
      const away = isOdd ? teams79[awayIndex] : teams79[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures79.push({
        id: idCounter79,
        apiFixtureId: idCounter79,
        apiLeagueId: 79,
        leagueId: 'de-2-bundesliga',
        leagueName: '2. Bundesliga',
        countryFlag: '🇩🇪',
        season,
        round: `Giornata ${round}`,
        date: new Date(roundTimestamp).toISOString(),
        timestamp: roundTimestamp,
        status: isFinished ? 'Match Finished' : 'Not Started',
        statusShort: isFinished ? 'FT' : 'NS',
        homeTeam: { id: home.id, name: home.name },
        awayTeam: { id: away.id, name: away.name },
        goalsHome,
        goalsAway,
        isFinished,
        isDraw,
      });
    }
  }

  return {
    78: fixtures78,
    79: fixtures79,
  };
}
