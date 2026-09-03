import { MatchFixture } from '../../types';

export function getItalyFixtures(season: number, isCurrentSeason: boolean): { [key: number]: MatchFixture[] } {
  const fixtures135: MatchFixture[] = [];
  const fixtures136: MatchFixture[] = [];

  let idCounter135 = 13500000 + season * 1000;
  let idCounter136 = 13600000 + season * 1000;

  // ----------------------------------------------------
  // SERIE A (135) - 20 Squadre
  // ----------------------------------------------------
  const serieARounds: {
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
      date: new Date(Date.UTC(season, 7, 17, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 17, 18, 30, 0),
      matches: [
        { home: { id: 520, name: 'Genoa' }, away: { id: 505, name: 'Inter' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 507, name: 'Parma' }, away: { id: 502, name: 'Fiorentina' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 511, name: 'Empoli' }, away: { id: 506, name: 'Monza' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 489, name: 'Milan' }, away: { id: 503, name: 'Torino' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 500, name: 'Bologna' }, away: { id: 494, name: 'Udinese' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 523, name: 'Verona' }, away: { id: 492, name: 'Napoli' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 518, name: 'Cagliari' }, away: { id: 497, name: 'Roma' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 487, name: 'Lazio' }, away: { id: 509, name: 'Venezia' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 522, name: 'Lecce' }, away: { id: 499, name: 'Atalanta' }, goalsHome: 0, goalsAway: 4, isFinished: true },
        { home: { id: 496, name: 'Juventus' }, away: { id: 508, name: 'Como' }, goalsHome: 3, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 24, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 24, 18, 30, 0),
      matches: [
        { home: { id: 507, name: 'Parma' }, away: { id: 489, name: 'Milan' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 494, name: 'Udinese' }, away: { id: 487, name: 'Lazio' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 505, name: 'Inter' }, away: { id: 522, name: 'Lecce' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 506, name: 'Monza' }, away: { id: 520, name: 'Genoa' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 502, name: 'Fiorentina' }, away: { id: 509, name: 'Venezia' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 503, name: 'Torino' }, away: { id: 499, name: 'Atalanta' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 492, name: 'Napoli' }, away: { id: 500, name: 'Bologna' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 497, name: 'Roma' }, away: { id: 511, name: 'Empoli' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 518, name: 'Cagliari' }, away: { id: 508, name: 'Como' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 523, name: 'Verona' }, away: { id: 496, name: 'Juventus' }, goalsHome: 0, goalsAway: 3, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 30, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 18, 30, 0),
      matches: [
        { home: { id: 509, name: 'Venezia' }, away: { id: 503, name: 'Torino' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 505, name: 'Inter' }, away: { id: 499, name: 'Atalanta' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 500, name: 'Bologna' }, away: { id: 511, name: 'Empoli' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 522, name: 'Lecce' }, away: { id: 518, name: 'Cagliari' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 487, name: 'Lazio' }, away: { id: 489, name: 'Milan' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 492, name: 'Napoli' }, away: { id: 507, name: 'Parma' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 520, name: 'Genoa' }, away: { id: 523, name: 'Verona' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 502, name: 'Fiorentina' }, away: { id: 506, name: 'Monza' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 496, name: 'Juventus' }, away: { id: 497, name: 'Roma' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 494, name: 'Udinese' }, away: { id: 508, name: 'Como' }, goalsHome: 1, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 14, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 14, 18, 30, 0),
      matches: [
        { home: { id: 508, name: 'Como' }, away: { id: 500, name: 'Bologna' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 511, name: 'Empoli' }, away: { id: 496, name: 'Juventus' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 489, name: 'Milan' }, away: { id: 509, name: 'Venezia' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 520, name: 'Genoa' }, away: { id: 497, name: 'Roma' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 499, name: 'Atalanta' }, away: { id: 502, name: 'Fiorentina' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 503, name: 'Torino' }, away: { id: 522, name: 'Lecce' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 518, name: 'Cagliari' }, away: { id: 492, name: 'Napoli' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 506, name: 'Monza' }, away: { id: 505, name: 'Inter' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 507, name: 'Parma' }, away: { id: 494, name: 'Udinese' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 487, name: 'Lazio' }, away: { id: 523, name: 'Verona' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  serieARounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter135++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 2 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures135.push({
        id: idCounter135,
        apiFixtureId: idCounter135,
        apiLeagueId: 135,
        leagueId: 'it-serie-a',
        leagueName: 'Serie A',
        countryFlag: '🇮🇹',
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

  const teams135 = [
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
  ];

  for (let round = 5; round <= 38; round++) {
    const roundTimestamp = Date.UTC(season, 7, 17, 18, 30, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams135.length / 2; matchIndex++) {
      idCounter135++;
      const homeIndex = (round + matchIndex) % teams135.length;
      let awayIndex = (round + teams135.length - matchIndex - 1) % teams135.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams135.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams135[homeIndex] : teams135[awayIndex];
      const away = isOdd ? teams135[awayIndex] : teams135[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures135.push({
        id: idCounter135,
        apiFixtureId: idCounter135,
        apiLeagueId: 135,
        leagueId: 'it-serie-a',
        leagueName: 'Serie A',
        countryFlag: '🇮🇹',
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
  // SERIE B (136) - 20 Squadre
  // ----------------------------------------------------
  const serieBRounds: {
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
      date: new Date(Date.UTC(season, 7, 16, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 16, 18, 30, 0),
      matches: [
        { home: { id: 519, name: 'Brescia' }, away: { id: 513, name: 'Palermo' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 524, name: 'Bari' }, away: { id: 535, name: 'Juve Stabia' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 501, name: 'Pisa' }, away: { id: 504, name: 'Spezia' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 514, name: 'Salernitana' }, away: { id: 534, name: 'Cittadella' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 528, name: 'Südtirol' }, away: { id: 526, name: 'Modena' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 512, name: 'Catanzaro' }, away: { id: 515, name: 'Sassuolo' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 525, name: 'Cesena' }, away: { id: 549, name: 'Carrarese' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 521, name: 'Cosenza' }, away: { id: 510, name: 'Cremonese' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 517, name: 'Frosinone' }, away: { id: 516, name: 'Sampdoria' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 527, name: 'Reggiana' }, away: { id: 550, name: 'Mantova' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 24, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 24, 18, 30, 0),
      matches: [
        { home: { id: 526, name: 'Modena' }, away: { id: 524, name: 'Bari' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 528, name: 'Südtirol' }, away: { id: 514, name: 'Salernitana' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 510, name: 'Cremonese' }, away: { id: 549, name: 'Carrarese' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 515, name: 'Sassuolo' }, away: { id: 525, name: 'Cesena' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 504, name: 'Spezia' }, away: { id: 517, name: 'Frosinone' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 512, name: 'Catanzaro' }, away: { id: 535, name: 'Juve Stabia' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 550, name: 'Mantova' }, away: { id: 521, name: 'Cosenza' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 501, name: 'Pisa' }, away: { id: 513, name: 'Palermo' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 516, name: 'Sampdoria' }, away: { id: 527, name: 'Reggiana' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 534, name: 'Cittadella' }, away: { id: 519, name: 'Brescia' }, goalsHome: 0, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 27, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 27, 18, 30, 0),
      matches: [
        { home: { id: 524, name: 'Bari' }, away: { id: 515, name: 'Sassuolo' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 549, name: 'Carrarese' }, away: { id: 528, name: 'Südtirol' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 534, name: 'Cittadella' }, away: { id: 501, name: 'Pisa' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 510, name: 'Cremonese' }, away: { id: 513, name: 'Palermo' }, goalsHome: 1, goalsAway: 4, isFinished: true },
        { home: { id: 517, name: 'Frosinone' }, away: { id: 526, name: 'Modena' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 527, name: 'Reggiana' }, away: { id: 519, name: 'Brescia' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 514, name: 'Salernitana' }, away: { id: 516, name: 'Sampdoria' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 525, name: 'Cesena' }, away: { id: 512, name: 'Catanzaro' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 521, name: 'Cosenza' }, away: { id: 504, name: 'Spezia' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 535, name: 'Juve Stabia' }, away: { id: 550, name: 'Mantova' }, goalsHome: 1, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 1, 18, 30, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 1, 18, 30, 0),
      matches: [
        { home: { id: 516, name: 'Sampdoria' }, away: { id: 524, name: 'Bari' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 526, name: 'Modena' }, away: { id: 534, name: 'Cittadella' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 501, name: 'Pisa' }, away: { id: 527, name: 'Reggiana' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 515, name: 'Sassuolo' }, away: { id: 510, name: 'Cremonese' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 528, name: 'Südtirol' }, away: { id: 519, name: 'Brescia' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 512, name: 'Catanzaro' }, away: { id: 549, name: 'Carrarese' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 517, name: 'Frosinone' }, away: { id: 535, name: 'Juve Stabia' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 550, name: 'Mantova' }, away: { id: 514, name: 'Salernitana' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 513, name: 'Palermo' }, away: { id: 521, name: 'Cosenza' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 504, name: 'Spezia' }, away: { id: 525, name: 'Cesena' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  serieBRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter136++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 1 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures136.push({
        id: idCounter136,
        apiFixtureId: idCounter136,
        apiLeagueId: 136,
        leagueId: 'it-serie-b',
        leagueName: 'Serie B',
        countryFlag: '🇮🇹',
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

  const teams136 = [
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
  ];

  for (let round = 5; round <= 38; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 18, 30, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams136.length / 2; matchIndex++) {
      idCounter136++;
      const homeIndex = (round + matchIndex) % teams136.length;
      let awayIndex = (round + teams136.length - matchIndex - 1) % teams136.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams136.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams136[homeIndex] : teams136[awayIndex];
      const away = isOdd ? teams136[awayIndex] : teams136[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures136.push({
        id: idCounter136,
        apiFixtureId: idCounter136,
        apiLeagueId: 136,
        leagueId: 'it-serie-b',
        leagueName: 'Serie B',
        countryFlag: '🇮🇹',
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
    135: fixtures135,
    136: fixtures136,
  };
}
