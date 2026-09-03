import { MatchFixture } from '../../types';

export function getFranceFixtures(season: number, isCurrentSeason: boolean): { [key: number]: MatchFixture[] } {
  const fixtures61: MatchFixture[] = [];
  const fixtures62: MatchFixture[] = [];

  let idCounter61 = 6100000 + season * 1000;
  let idCounter62 = 6200000 + season * 1000;

  // ----------------------------------------------------
  // LIGUE 1 (61) - 18 Squadre
  // ----------------------------------------------------
  const ligue1Rounds: {
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
      date: new Date(Date.UTC(season, 7, 16, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 16, 19, 0, 0),
      matches: [
        { home: { id: 105, name: 'Le Havre' }, away: { id: 85, name: 'Paris Saint Germain' }, goalsHome: 1, goalsAway: 4, isFinished: true },
        { home: { id: 106, name: 'Brest' }, away: { id: 81, name: 'Marseille' }, goalsHome: 1, goalsAway: 5, isFinished: true },
        { home: { id: 93, name: 'Stade de Reims' }, away: { id: 79, name: 'Lille' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 91, name: 'Monaco' }, away: { id: 113, name: 'Saint Etienne' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 112, name: 'Angers' }, away: { id: 116, name: 'Lens' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 82, name: 'Montpellier' }, away: { id: 95, name: 'Strasbourg' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 96, name: 'Toulouse' }, away: { id: 83, name: 'Nantes' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 111, name: 'Auxerre' }, away: { id: 84, name: 'Nice' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 94, name: 'Rennes' }, away: { id: 80, name: 'Lyon' }, goalsHome: 3, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 23, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 19, 0, 0),
      matches: [
        { home: { id: 85, name: 'Paris Saint Germain' }, away: { id: 82, name: 'Montpellier' }, goalsHome: 6, goalsAway: 0, isFinished: true },
        { home: { id: 80, name: 'Lyon' }, away: { id: 91, name: 'Monaco' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 79, name: 'Lille' }, away: { id: 112, name: 'Angers' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 113, name: 'Saint Etienne' }, away: { id: 105, name: 'Le Havre' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 116, name: 'Lens' }, away: { id: 106, name: 'Brest' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 95, name: 'Strasbourg' }, away: { id: 94, name: 'Rennes' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 83, name: 'Nantes' }, away: { id: 111, name: 'Auxerre' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 84, name: 'Nice' }, away: { id: 96, name: 'Toulouse' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 81, name: 'Marseille' }, away: { id: 93, name: 'Stade de Reims' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 30, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 19, 0, 0),
      matches: [
        { home: { id: 80, name: 'Lyon' }, away: { id: 95, name: 'Strasbourg' }, goalsHome: 4, goalsAway: 3, isFinished: true },
        { home: { id: 106, name: 'Brest' }, away: { id: 113, name: 'Saint Etienne' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 82, name: 'Montpellier' }, away: { id: 83, name: 'Nantes' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 96, name: 'Toulouse' }, away: { id: 81, name: 'Marseille' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 91, name: 'Monaco' }, away: { id: 116, name: 'Lens' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 112, name: 'Angers' }, away: { id: 84, name: 'Nice' }, goalsHome: 1, goalsAway: 4, isFinished: true },
        { home: { id: 105, name: 'Le Havre' }, away: { id: 111, name: 'Auxerre' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 93, name: 'Stade de Reims' }, away: { id: 94, name: 'Rennes' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 79, name: 'Lille' }, away: { id: 85, name: 'Paris Saint Germain' }, goalsHome: 1, goalsAway: 3, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 13, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 13, 19, 0, 0),
      matches: [
        { home: { id: 113, name: 'Saint Etienne' }, away: { id: 79, name: 'Lille' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 81, name: 'Marseille' }, away: { id: 84, name: 'Nice' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 111, name: 'Auxerre' }, away: { id: 91, name: 'Monaco' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 85, name: 'Paris Saint Germain' }, away: { id: 106, name: 'Brest' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 94, name: 'Rennes' }, away: { id: 82, name: 'Montpellier' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 83, name: 'Nantes' }, away: { id: 93, name: 'Stade de Reims' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 95, name: 'Strasbourg' }, away: { id: 112, name: 'Angers' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 96, name: 'Toulouse' }, away: { id: 105, name: 'Le Havre' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 116, name: 'Lens' }, away: { id: 80, name: 'Lyon' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  ligue1Rounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter61++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 2 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures61.push({
        id: idCounter61,
        apiFixtureId: idCounter61,
        apiLeagueId: 61,
        leagueId: 'fr-ligue-1',
        leagueName: 'Ligue 1',
        countryFlag: '🇫🇷',
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

  const teams61 = [
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
  ];

  for (let round = 5; round <= 34; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 19, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams61.length / 2; matchIndex++) {
      idCounter61++;
      const homeIndex = (round + matchIndex) % teams61.length;
      let awayIndex = (round + teams61.length - matchIndex - 1) % teams61.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams61.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams61[homeIndex] : teams61[awayIndex];
      const away = isOdd ? teams61[awayIndex] : teams61[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures61.push({
        id: idCounter61,
        apiFixtureId: idCounter61,
        apiLeagueId: 61,
        leagueId: 'fr-ligue-1',
        leagueName: 'Ligue 1',
        countryFlag: '🇫🇷',
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
  // LIGUE 2 (62) - 18 Squadre
  // ----------------------------------------------------
  const teams62 = [
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
  ];

  const ligue2Rounds: {
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
      date: new Date(Date.UTC(season, 7, 16, 18, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 16, 18, 0, 0),
      matches: [
        { home: { id: 125, name: 'Ajaccio' }, away: { id: 115, name: 'Rodez' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 122, name: 'Amiens' }, away: { id: 129, name: 'Red Star' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 114, name: 'Clermont' }, away: { id: 118, name: 'Pau FC' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 127, name: 'Dunkerque' }, away: { id: 126, name: 'Annecy' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 124, name: 'Grenoble' }, away: { id: 119, name: 'Laval' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 120, name: 'Guingamp' }, away: { id: 128, name: 'Troyes' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 130, name: 'Martigues' }, away: { id: 97, name: 'Lorient' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 110, name: 'Metz' }, away: { id: 123, name: 'Bastia' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 121, name: 'Caen' }, away: { id: 117, name: 'Paris FC' }, goalsHome: 0, goalsAway: 2, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 23, 18, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 18, 0, 0),
      matches: [
        { home: { id: 128, name: 'Troyes' }, away: { id: 114, name: 'Clermont' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 117, name: 'Paris FC' }, away: { id: 127, name: 'Dunkerque' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 118, name: 'Pau FC' }, away: { id: 121, name: 'Caen' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 123, name: 'Bastia' }, away: { id: 122, name: 'Amiens' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 119, name: 'Laval' }, away: { id: 120, name: 'Guingamp' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 97, name: 'Lorient' }, away: { id: 124, name: 'Grenoble' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 129, name: 'Red Star' }, away: { id: 125, name: 'Ajaccio' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 115, name: 'Rodez' }, away: { id: 110, name: 'Metz' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 126, name: 'Annecy' }, away: { id: 130, name: 'Martigues' }, goalsHome: 2, goalsAway: 4, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 30, 18, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 18, 0, 0),
      matches: [
        { home: { id: 124, name: 'Grenoble' }, away: { id: 118, name: 'Pau FC' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 120, name: 'Guingamp' }, away: { id: 129, name: 'Red Star' }, goalsHome: 3, goalsAway: 4, isFinished: true },
        { home: { id: 114, name: 'Clermont' }, away: { id: 117, name: 'Paris FC' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 122, name: 'Amiens' }, away: { id: 197, name: 'Lorient' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 125, name: 'Ajaccio' }, away: { id: 128, name: 'Troyes' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 127, name: 'Dunkerque' }, away: { id: 115, name: 'Rodez' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 121, name: 'Caen' }, away: { id: 126, name: 'Annecy' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 130, name: 'Martigues' }, away: { id: 123, name: 'Bastia' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 110, name: 'Metz' }, away: { id: 119, name: 'Laval' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 13, 18, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 13, 18, 0, 0),
      matches: [
        { home: { id: 123, name: 'Bastia' }, away: { id: 128, name: 'Troyes' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 126, name: 'Annecy' }, away: { id: 122, name: 'Amiens' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 119, name: 'Laval' }, away: { id: 125, name: 'Ajaccio' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 97, name: 'Lorient' }, away: { id: 129, name: 'Red Star' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 118, name: 'Pau FC' }, away: { id: 130, name: 'Martigues' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 115, name: 'Rodez' }, away: { id: 120, name: 'Guingamp' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 114, name: 'Clermont' }, away: { id: 127, name: 'Dunkerque' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 117, name: 'Paris FC' }, away: { id: 110, name: 'Metz' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 124, name: 'Grenoble' }, away: { id: 121, name: 'Caen' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  ligue2Rounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter62++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 1 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 0 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures62.push({
        id: idCounter62,
        apiFixtureId: idCounter62,
        apiLeagueId: 62,
        leagueId: 'fr-ligue-2',
        leagueName: 'Ligue 2',
        countryFlag: '🇫🇷',
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

  for (let round = 5; round <= 34; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 18, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams62.length / 2; matchIndex++) {
      idCounter62++;
      const homeIndex = (round + matchIndex) % teams62.length;
      let awayIndex = (round + teams62.length - matchIndex - 1) % teams62.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams62.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams62[homeIndex] : teams62[awayIndex];
      const away = isOdd ? teams62[awayIndex] : teams62[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures62.push({
        id: idCounter62,
        apiFixtureId: idCounter62,
        apiLeagueId: 62,
        leagueId: 'fr-ligue-2',
        leagueName: 'Ligue 2',
        countryFlag: '🇫🇷',
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
    61: fixtures61,
    62: fixtures62,
  };
}
