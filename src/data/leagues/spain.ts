import { MatchFixture } from '../../types';

export function getSpainFixtures(season: number, isCurrentSeason: boolean): { [key: number]: MatchFixture[] } {
  const fixtures140: MatchFixture[] = [];
  const fixtures141: MatchFixture[] = [];

  let idCounter140 = 14000000 + season * 1000;
  let idCounter141 = 14100000 + season * 1000;

  // ----------------------------------------------------
  // LA LIGA (140) - 20 Squadre
  // ----------------------------------------------------
  const laLigaRounds: {
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
        { home: { id: 531, name: 'Athletic Club' }, away: { id: 534, name: 'Getafe' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 543, name: 'Real Betis' }, away: { id: 546, name: 'Girona' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 538, name: 'Celta Vigo' }, away: { id: 542, name: 'Alaves' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 535, name: 'Las Palmas' }, away: { id: 536, name: 'Sevilla' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 727, name: 'Osasuna' }, away: { id: 537, name: 'Leganes' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 532, name: 'Valencia' }, away: { id: 529, name: 'Barcelona' }, goalsHome: 1, goalsAway: 2, isFinished: true }, // Barca Win
        { home: { id: 548, name: 'Real Sociedad' }, away: { id: 728, name: 'Rayo Vallecano' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 798, name: 'Mallorca' }, away: { id: 541, name: 'Real Madrid' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Real Draw
        { home: { id: 720, name: 'Valladolid' }, away: { id: 540, name: 'Espanyol' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 533, name: 'Villarreal' }, away: { id: 530, name: 'Atletico Madrid' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Atletico Draw
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 23, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 19, 0, 0),
      matches: [
        { home: { id: 538, name: 'Celta Vigo' }, away: { id: 532, name: 'Valencia' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 536, name: 'Sevilla' }, away: { id: 533, name: 'Villarreal' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 727, name: 'Osasuna' }, away: { id: 798, name: 'Mallorca' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 529, name: 'Barcelona' }, away: { id: 531, name: 'Athletic Club' }, goalsHome: 2, goalsAway: 1, isFinished: true }, // Barca Win
        { home: { id: 540, name: 'Espanyol' }, away: { id: 548, name: 'Real Sociedad' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 534, name: 'Getafe' }, away: { id: 728, name: 'Rayo Vallecano' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 537, name: 'Leganes' }, away: { id: 535, name: 'Las Palmas' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 542, name: 'Alaves' }, away: { id: 543, name: 'Real Betis' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 530, name: 'Atletico Madrid' }, away: { id: 546, name: 'Girona' }, goalsHome: 3, goalsAway: 0, isFinished: true }, // Atletico Win
        { home: { id: 541, name: 'Real Madrid' }, away: { id: 720, name: 'Valladolid' }, goalsHome: 3, goalsAway: 0, isFinished: true }, // Real Win
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 30, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 19, 0, 0),
      matches: [
        { home: { id: 533, name: 'Villarreal' }, away: { id: 538, name: 'Celta Vigo' }, goalsHome: 4, goalsAway: 3, isFinished: true },
        { home: { id: 798, name: 'Mallorca' }, away: { id: 536, name: 'Sevilla' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 728, name: 'Rayo Vallecano' }, away: { id: 529, name: 'Barcelona' }, goalsHome: 1, goalsAway: 2, isFinished: true }, // Barca Win
        { home: { id: 531, name: 'Athletic Club' }, away: { id: 532, name: 'Valencia' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 720, name: 'Valladolid' }, away: { id: 537, name: 'Leganes' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 548, name: 'Real Sociedad' }, away: { id: 542, name: 'Alaves' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 530, name: 'Atletico Madrid' }, away: { id: 540, name: 'Espanyol' }, goalsHome: 2, goalsAway: 0, isFinished: true }, // Atletico Win (2W, 1D)
        { home: { id: 546, name: 'Girona' }, away: { id: 727, name: 'Osasuna' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 535, name: 'Las Palmas' }, away: { id: 541, name: 'Real Madrid' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Real Draw
        { home: { id: 543, name: 'Real Betis' }, away: { id: 534, name: 'Getafe' }, goalsHome: 2, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 14, 19, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 14, 19, 0, 0),
      matches: [
        { home: { id: 529, name: 'Barcelona' }, away: { id: 720, name: 'Valladolid' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 531, name: 'Athletic Club' }, away: { id: 530, name: 'Atletico Madrid' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 540, name: 'Espanyol' }, away: { id: 728, name: 'Rayo Vallecano' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 537, name: 'Leganes' }, away: { id: 798, name: 'Mallorca' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 532, name: 'Valencia' }, away: { id: 533, name: 'Villarreal' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 542, name: 'Alaves' }, away: { id: 535, name: 'Las Palmas' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 727, name: 'Osasuna' }, away: { id: 538, name: 'Celta Vigo' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 536, name: 'Sevilla' }, away: { id: 546, name: 'Girona' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 534, name: 'Getafe' }, away: { id: 548, name: 'Real Sociedad' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 541, name: 'Real Madrid' }, away: { id: 543, name: 'Real Betis' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  laLigaRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter140++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 2 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures140.push({
        id: idCounter140,
        apiFixtureId: idCounter140,
        apiLeagueId: 140,
        leagueId: 'es-la-liga',
        leagueName: 'La Liga',
        countryFlag: '🇪🇸',
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

  // Genera round-robin 5-38 per La Liga
  const teams140 = [
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
  ];

  for (let round = 5; round <= 38; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 19, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams140.length / 2; matchIndex++) {
      idCounter140++;
      const homeIndex = (round + matchIndex) % teams140.length;
      let awayIndex = (round + teams140.length - matchIndex - 1) % teams140.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams140.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams140[homeIndex] : teams140[awayIndex];
      const away = isOdd ? teams140[awayIndex] : teams140[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures140.push({
        id: idCounter140,
        apiFixtureId: idCounter140,
        apiLeagueId: 140,
        leagueId: 'es-la-liga',
        leagueName: 'La Liga',
        countryFlag: '🇪🇸',
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
  // SEGUNDA DIVISIÓN (141) - 22 Squadre
  // ----------------------------------------------------
  const teams141 = [
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
  ];

  const segundaRounds: {
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
      date: new Date(Date.UTC(season, 7, 16, 17, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 16, 17, 0, 0),
      matches: [
        { home: { id: 715, name: 'Granada' }, away: { id: 732, name: 'Albacete' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 737, name: 'Mirandes' }, away: { id: 738, name: 'Cordoba' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 724, name: 'Cadiz' }, away: { id: 734, name: 'Zaragoza' }, goalsHome: 0, goalsAway: 4, isFinished: true },
        { home: { id: 730, name: 'Racing Ferrol' }, away: { id: 739, name: 'Malaga' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 539, name: 'Eibar' }, away: { id: 740, name: 'Castellon' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 741, name: 'Deportivo La Coruna' }, away: { id: 545, name: 'Oviedo' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 547, name: 'Racing Santander' }, away: { id: 723, name: 'Almeria' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 729, name: 'Burgos' }, away: { id: 733, name: 'Cartagena' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 544, name: 'Sporting Gijon' }, away: { id: 536, name: 'Levante' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 735, name: 'Eldense' }, away: { id: 731, name: 'Tenerife' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 797, name: 'Elche' }, away: { id: 736, name: 'Huesca' }, goalsHome: 0, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 23, 17, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 23, 17, 0, 0),
      matches: [
        { home: { id: 547, name: 'Racing Santander' }, away: { id: 539, name: 'Eibar' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 736, name: 'Huesca' }, away: { id: 741, name: 'Deportivo La Coruna' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 544, name: 'Sporting Gijon' }, away: { id: 735, name: 'Eldense' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 536, name: 'Levante' }, away: { id: 724, name: 'Cadiz' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 739, name: 'Malaga' }, away: { id: 737, name: 'Mirandes' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 731, name: 'Tenerife' }, away: { id: 723, name: 'Almeria' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 732, name: 'Albacete' }, away: { id: 797, name: 'Elche' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 740, name: 'Castellon' }, away: { id: 545, name: 'Oviedo' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 733, name: 'Cartagena' }, away: { id: 734, name: 'Zaragoza' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 738, name: 'Cordoba' }, away: { id: 729, name: 'Burgos' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 730, name: 'Racing Ferrol' }, away: { id: 715, name: 'Granada' }, goalsHome: 0, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 30, 17, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 30, 17, 0, 0),
      matches: [
        { home: { id: 715, name: 'Granada' }, away: { id: 736, name: 'Huesca' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 545, name: 'Oviedo' }, away: { id: 730, name: 'Racing Ferrol' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 724, name: 'Cadiz' }, away: { id: 731, name: 'Tenerife' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 723, name: 'Almeria' }, away: { id: 544, name: 'Sporting Gijon' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 729, name: 'Burgos' }, away: { id: 740, name: 'Castellon' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 741, name: 'Deportivo La Coruna' }, away: { id: 730, name: 'Racing Ferrol' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 737, name: 'Mirandes' }, away: { id: 734, name: 'Zaragoza' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 739, name: 'Malaga' }, away: { id: 732, name: 'Albacete' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 735, name: 'Eldense' }, away: { id: 733, name: 'Cartagena' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 539, name: 'Eibar' }, away: { id: 536, name: 'Levante' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 797, name: 'Elche' }, away: { id: 738, name: 'Cordoba' }, goalsHome: 3, goalsAway: 1, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 13, 17, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 13, 17, 0, 0),
      matches: [
        { home: { id: 544, name: 'Sporting Gijon' }, away: { id: 545, name: 'Oviedo' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 734, name: 'Zaragoza' }, away: { id: 797, name: 'Elche' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 736, name: 'Huesca' }, away: { id: 729, name: 'Burgos' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 730, name: 'Racing Ferrol' }, away: { id: 737, name: 'Mirandes' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 731, name: 'Tenerife' }, away: { id: 547, name: 'Racing Santander' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 738, name: 'Cordoba' }, away: { id: 739, name: 'Malaga' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 740, name: 'Castellon' }, away: { id: 724, name: 'Cadiz' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 733, name: 'Cartagena' }, away: { id: 536, name: 'Levante' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 735, name: 'Eldense' }, away: { id: 723, name: 'Almeria' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 715, name: 'Granada' }, away: { id: 741, name: 'Deportivo La Coruna' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 732, name: 'Albacete' }, away: { id: 539, name: 'Eibar' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  segundaRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter141++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 1 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 0 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures141.push({
        id: idCounter141,
        apiFixtureId: idCounter141,
        apiLeagueId: 141,
        leagueId: 'es-segunda-division',
        leagueName: 'Segunda División',
        countryFlag: '🇪🇸',
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

  for (let round = 5; round <= 42; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 17, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams141.length / 2; matchIndex++) {
      idCounter141++;
      const homeIndex = (round + matchIndex) % teams141.length;
      let awayIndex = (round + teams141.length - matchIndex - 1) % teams141.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams141.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams141[homeIndex] : teams141[awayIndex];
      const away = isOdd ? teams141[awayIndex] : teams141[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures141.push({
        id: idCounter141,
        apiFixtureId: idCounter141,
        apiLeagueId: 141,
        leagueId: 'es-segunda-division',
        leagueName: 'Segunda División',
        countryFlag: '🇪🇸',
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
    140: fixtures140,
    141: fixtures141,
  };
}
