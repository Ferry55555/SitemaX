import { MatchFixture } from '../../types';

export function getEnglandFixtures(season: number, isCurrentSeason: boolean): { [key: number]: MatchFixture[] } {
  const fixtures39: MatchFixture[] = [];
  const fixtures40: MatchFixture[] = [];

  let idCounter39 = 3900000 + season * 1000;
  let idCounter40 = 4000000 + season * 1000;

  // ----------------------------------------------------
  // PREMIER LEAGUE (39) - 20 Squadre
  // ----------------------------------------------------
  const plRounds: {
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
      date: new Date(Date.UTC(season, 7, 16, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 16, 14, 0, 0),
      matches: [
        { home: { id: 33, name: 'Manchester United' }, away: { id: 36, name: 'Fulham' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 71, name: 'Ipswich' }, away: { id: 40, name: 'Liverpool' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 42, name: 'Arsenal' }, away: { id: 38, name: 'Wolverhampton' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 45, name: 'Everton' }, away: { id: 51, name: 'Brighton' }, goalsHome: 0, goalsAway: 3, isFinished: true },
        { home: { id: 34, name: 'Newcastle' }, away: { id: 41, name: 'Southampton' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 65, name: 'Nottingham Forest' }, away: { id: 35, name: 'Bournemouth' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 48, name: 'West Ham' }, away: { id: 66, name: 'Aston Villa' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 55, name: 'Brentford' }, away: { id: 52, name: 'Crystal Palace' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 49, name: 'Chelsea' }, away: { id: 50, name: 'Manchester City' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 46, name: 'Leicester' }, away: { id: 47, name: 'Tottenham' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 24, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 24, 14, 0, 0),
      matches: [
        { home: { id: 51, name: 'Brighton' }, away: { id: 33, name: 'Manchester United' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 52, name: 'Crystal Palace' }, away: { id: 48, name: 'West Ham' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 36, name: 'Fulham' }, away: { id: 46, name: 'Leicester' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 50, name: 'Manchester City' }, away: { id: 71, name: 'Ipswich' }, goalsHome: 4, goalsAway: 1, isFinished: true },
        { home: { id: 41, name: 'Southampton' }, away: { id: 65, name: 'Nottingham Forest' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 47, name: 'Tottenham' }, away: { id: 45, name: 'Everton' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 66, name: 'Aston Villa' }, away: { id: 42, name: 'Arsenal' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 35, name: 'Bournemouth' }, away: { id: 34, name: 'Newcastle' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 38, name: 'Wolverhampton' }, away: { id: 49, name: 'Chelsea' }, goalsHome: 2, goalsAway: 6, isFinished: true },
        { home: { id: 40, name: 'Liverpool' }, away: { id: 55, name: 'Brentford' }, goalsHome: 2, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 31, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 31, 14, 0, 0),
      matches: [
        { home: { id: 42, name: 'Arsenal' }, away: { id: 51, name: 'Brighton' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 55, name: 'Brentford' }, away: { id: 41, name: 'Southampton' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 45, name: 'Everton' }, away: { id: 35, name: 'Bournemouth' }, goalsHome: 2, goalsAway: 3, isFinished: true },
        { home: { id: 71, name: 'Ipswich' }, away: { id: 36, name: 'Fulham' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 46, name: 'Leicester' }, away: { id: 66, name: 'Aston Villa' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 65, name: 'Nottingham Forest' }, away: { id: 38, name: 'Wolverhampton' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 48, name: 'West Ham' }, away: { id: 50, name: 'Manchester City' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 49, name: 'Chelsea' }, away: { id: 52, name: 'Crystal Palace' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 34, name: 'Newcastle' }, away: { id: 47, name: 'Tottenham' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 33, name: 'Manchester United' }, away: { id: 40, name: 'Liverpool' }, goalsHome: 0, goalsAway: 3, isFinished: true },
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 8, 14, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 14, 14, 0, 0),
      matches: [
        { home: { id: 41, name: 'Southampton' }, away: { id: 33, name: 'Manchester United' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 51, name: 'Brighton' }, away: { id: 71, name: 'Ipswich' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 52, name: 'Crystal Palace' }, away: { id: 46, name: 'Leicester' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 36, name: 'Fulham' }, away: { id: 48, name: 'West Ham' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 40, name: 'Liverpool' }, away: { id: 65, name: 'Nottingham Forest' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 50, name: 'Manchester City' }, away: { id: 55, name: 'Brentford' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 66, name: 'Aston Villa' }, away: { id: 45, name: 'Everton' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 35, name: 'Bournemouth' }, away: { id: 49, name: 'Chelsea' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 47, name: 'Tottenham' }, away: { id: 42, name: 'Arsenal' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 38, name: 'Wolverhampton' }, away: { id: 34, name: 'Newcastle' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  plRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter39++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 2 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 1 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures39.push({
        id: idCounter39,
        apiFixtureId: idCounter39,
        apiLeagueId: 39,
        leagueId: 'en-premier-league',
        leagueName: 'Premier League',
        countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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

  const teams39 = [
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
  ];

  for (let round = 5; round <= 38; round++) {
    const roundTimestamp = Date.UTC(season, 7, 16, 14, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams39.length / 2; matchIndex++) {
      idCounter39++;
      const homeIndex = (round + matchIndex) % teams39.length;
      let awayIndex = (round + teams39.length - matchIndex - 1) % teams39.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams39.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams39[homeIndex] : teams39[awayIndex];
      const away = isOdd ? teams39[awayIndex] : teams39[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures39.push({
        id: idCounter39,
        apiFixtureId: idCounter39,
        apiLeagueId: 39,
        leagueId: 'en-premier-league',
        leagueName: 'Premier League',
        countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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
  // CHAMPIONSHIP (40) - 24 Squadre
  // ----------------------------------------------------
  const teams40 = [
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
  ];

  const championshipRounds: {
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
      date: new Date(Date.UTC(season, 7, 10, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 10, 14, 0, 0),
      matches: [
        { home: { id: 67, name: 'Blackburn' }, away: { id: 80, name: 'Derby County' }, goalsHome: 4, goalsAway: 2, isFinished: true },
        { home: { id: 62, name: 'Sheffield United' }, away: { id: 70, name: 'Preston' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 69, name: 'Cardiff' }, away: { id: 746, name: 'Sunderland' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 64, name: 'Hull City' }, away: { id: 73, name: 'Bristol City' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 63, name: 'Leeds' }, away: { id: 81, name: 'Portsmouth' }, goalsHome: 3, goalsAway: 3, isFinished: true }, // Draw
        { home: { id: 57, name: 'Middlesbrough' }, away: { id: 74, name: 'Swansea' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 58, name: 'Millwall' }, away: { id: 37, name: 'Watford' }, goalsHome: 2, goalsAway: 3, isFinished: true },
        { home: { id: 79, name: 'Oxford United' }, away: { id: 72, name: 'Norwich' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 76, name: 'QPR' }, away: { id: 60, name: 'West Brom' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 75, name: 'Stoke' }, away: { id: 1077, name: 'Coventry' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 77, name: 'Sheffield Wednesday' }, away: { id: 78, name: 'Plymouth' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 43, name: 'Luton' }, away: { id: 44, name: 'Burnley' }, goalsHome: 1, goalsAway: 4, isFinished: true },
      ],
    },
    {
      round: 2,
      date: new Date(Date.UTC(season, 7, 17, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 17, 14, 0, 0),
      matches: [
        { home: { id: 1077, name: 'Coventry' }, away: { id: 79, name: 'Oxford United' }, goalsHome: 3, goalsAway: 2, isFinished: true },
        { home: { id: 81, name: 'Portsmouth' }, away: { id: 43, name: 'Luton' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 73, name: 'Bristol City' }, away: { id: 58, name: 'Millwall' }, goalsHome: 4, goalsAway: 3, isFinished: true },
        { home: { id: 44, name: 'Burnley' }, away: { id: 69, name: 'Cardiff' }, goalsHome: 5, goalsAway: 0, isFinished: true },
        { home: { id: 80, name: 'Derby County' }, away: { id: 57, name: 'Middlesbrough' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 72, name: 'Norwich' }, away: { id: 67, name: 'Blackburn' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 78, name: 'Plymouth' }, away: { id: 64, name: 'Hull City' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 62, name: 'Sheffield United' }, away: { id: 76, name: 'QPR' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 746, name: 'Sunderland' }, away: { id: 77, name: 'Sheffield Wednesday' }, goalsHome: 4, goalsAway: 0, isFinished: true },
        { home: { id: 74, name: 'Swansea' }, away: { id: 70, name: 'Preston' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 37, name: 'Watford' }, away: { id: 75, name: 'Stoke' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 60, name: 'West Brom' }, away: { id: 63, name: 'Leeds' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
      ],
    },
    {
      round: 3,
      date: new Date(Date.UTC(season, 7, 24, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 24, 14, 0, 0),
      matches: [
        { home: { id: 77, name: 'Sheffield Wednesday' }, away: { id: 63, name: 'Leeds' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 73, name: 'Bristol City' }, away: { id: 1077, name: 'Coventry' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 64, name: 'Hull City' }, away: { id: 58, name: 'Millwall' }, goalsHome: 0, goalsAway: 0, isFinished: true }, // Draw
        { home: { id: 76, name: 'QPR' }, away: { id: 78, name: 'Plymouth' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 67, name: 'Blackburn' }, away: { id: 79, name: 'Oxford United' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 70, name: 'Preston' }, away: { id: 43, name: 'Luton' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 75, name: 'Stoke' }, away: { id: 60, name: 'West Brom' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 746, name: 'Sunderland' }, away: { id: 44, name: 'Burnley' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 37, name: 'Watford' }, away: { id: 80, name: 'Derby County' }, goalsHome: 2, goalsAway: 1, isFinished: true },
        { home: { id: 72, name: 'Norwich' }, away: { id: 62, name: 'Sheffield United' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 57, name: 'Middlesbrough' }, away: { id: 81, name: 'Portsmouth' }, goalsHome: 2, goalsAway: 2, isFinished: true }, // Draw
        { home: { id: 74, name: 'Swansea' }, away: { id: 69, name: 'Cardiff' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
      ],
    },
    {
      round: 4,
      date: new Date(Date.UTC(season, 7, 31, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 7, 31, 14, 0, 0),
      matches: [
        { home: { id: 43, name: 'Luton' }, away: { id: 76, name: 'QPR' }, goalsHome: 1, goalsAway: 2, isFinished: true },
        { home: { id: 44, name: 'Burnley' }, away: { id: 67, name: 'Blackburn' }, goalsHome: 1, goalsAway: 1, isFinished: true }, // Draw
        { home: { id: 69, name: 'Cardiff' }, away: { id: 57, name: 'Middlesbrough' }, goalsHome: 0, goalsAway: 2, isFinished: true },
        { home: { id: 1077, name: 'Coventry' }, away: { id: 72, name: 'Norwich' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 80, name: 'Derby County' }, away: { id: 73, name: 'Bristol City' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 63, name: 'Leeds' }, away: { id: 64, name: 'Hull City' }, goalsHome: 2, goalsAway: 0, isFinished: true },
        { home: { id: 58, name: 'Millwall' }, away: { id: 77, name: 'Sheffield Wednesday' }, goalsHome: 3, goalsAway: 0, isFinished: true },
        { home: { id: 79, name: 'Oxford United' }, away: { id: 70, name: 'Preston' }, goalsHome: 3, goalsAway: 1, isFinished: true },
        { home: { id: 78, name: 'Plymouth' }, away: { id: 75, name: 'Stoke' }, goalsHome: 0, goalsAway: 1, isFinished: true },
        { home: { id: 81, name: 'Portsmouth' }, away: { id: 746, name: 'Sunderland' }, goalsHome: 1, goalsAway: 3, isFinished: true },
        { home: { id: 60, name: 'West Brom' }, away: { id: 74, name: 'Swansea' }, goalsHome: 1, goalsAway: 0, isFinished: true },
        { home: { id: 62, name: 'Sheffield United' }, away: { id: 37, name: 'Watford' }, goalsHome: 1, goalsAway: 0, isFinished: true },
      ],
    },
    {
      round: 5,
      date: new Date(Date.UTC(season, 8, 14, 14, 0, 0)).toISOString(),
      timestamp: Date.UTC(season, 8, 14, 14, 0, 0),
      matches: [
        { home: { id: 64, name: 'Hull City' }, away: { id: 62, name: 'Sheffield United' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 63, name: 'Leeds' }, away: { id: 44, name: 'Burnley' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 58, name: 'Millwall' }, away: { id: 43, name: 'Luton' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 79, name: 'Oxford United' }, away: { id: 75, name: 'Stoke' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 76, name: 'QPR' }, away: { id: 77, name: 'Sheffield Wednesday' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 67, name: 'Blackburn' }, away: { id: 73, name: 'Bristol City' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 80, name: 'Derby County' }, away: { id: 69, name: 'Cardiff' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 57, name: 'Middlesbrough' }, away: { id: 70, name: 'Preston' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 746, name: 'Sunderland' }, away: { id: 78, name: 'Plymouth' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 74, name: 'Swansea' }, away: { id: 72, name: 'Norwich' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 37, name: 'Watford' }, away: { id: 1077, name: 'Coventry' }, goalsHome: null, goalsAway: null, isFinished: false },
        { home: { id: 81, name: 'Portsmouth' }, away: { id: 60, name: 'West Brom' }, goalsHome: null, goalsAway: null, isFinished: false },
      ],
    },
  ];

  championshipRounds.forEach((r) => {
    r.matches.forEach((m) => {
      idCounter40++;
      const isFinished = !isCurrentSeason || m.isFinished;
      const goalsHome = !isCurrentSeason && m.goalsHome === null ? 1 : m.goalsHome;
      const goalsAway = !isCurrentSeason && m.goalsAway === null ? 0 : m.goalsAway;
      const isDraw = isFinished && goalsHome !== null && goalsAway !== null && goalsHome === goalsAway;

      fixtures40.push({
        id: idCounter40,
        apiFixtureId: idCounter40,
        apiLeagueId: 40,
        leagueId: 'en-championship',
        leagueName: 'Championship',
        countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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

  for (let round = 6; round <= 46; round++) {
    const roundTimestamp = Date.UTC(season, 7, 10, 14, 0, 0) + (round - 1) * 7 * 24 * 60 * 60 * 1000;
    const isFinished = !isCurrentSeason;
    for (let matchIndex = 0; matchIndex < teams40.length / 2; matchIndex++) {
      idCounter40++;
      const homeIndex = (round + matchIndex) % teams40.length;
      let awayIndex = (round + teams40.length - matchIndex - 1) % teams40.length;
      if (homeIndex === awayIndex) awayIndex = (homeIndex + 1) % teams40.length;

      const isOdd = round % 2 !== 0;
      const home = isOdd ? teams40[homeIndex] : teams40[awayIndex];
      const away = isOdd ? teams40[awayIndex] : teams40[homeIndex];

      const goalsHome = isFinished ? (round % 2 === 0 ? 1 : 2) : null;
      const goalsAway = isFinished ? (round % 3 === 0 ? 1 : 0) : null;
      const isDraw = isFinished && goalsHome === goalsAway;

      fixtures40.push({
        id: idCounter40,
        apiFixtureId: idCounter40,
        apiLeagueId: 40,
        leagueId: 'en-championship',
        leagueName: 'Championship',
        countryFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
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
    39: fixtures39,
    40: fixtures40,
  };
}
