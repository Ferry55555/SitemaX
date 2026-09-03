/**
 * Helper per il calcolo deterministico della stagione calcistica europea attiva.
 * 
 * Regola:
 * - Le stagioni calcistiche europee iniziano tipicamente ad Agosto e terminano a Giugno/Luglio dell'anno successivo.
 * - Da Agosto (mese 7, 0-indexed) a Dicembre (mese 11): la stagione attiva è [AnnoCorrente]/[AnnoCorrente + 1] (es. Agosto 2026 -> 2026/2027, valore numerico 2026).
 * - Da Gennaio (mese 0) a Luglio (mese 6): la stagione attiva è [AnnoCorrente - 1]/[AnnoCorrente] (es. Marzo 2027 -> 2026/2027, valore numerico 2026).
 */
export function getCurrentFootballSeason(date: Date = new Date()): number {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Gennaio, 7 = Agosto, 11 = Dicembre
  return month >= 7 ? year : year - 1;
}

export function formatSeasonLabel(seasonYear: number): string {
  return `${seasonYear}/${seasonYear + 1}`;
}

export interface SeasonOption {
  value: number;
  label: string;
}

/**
 * Genera la lista delle stagioni disponibili centrate sulla stagione corrente dinamica.
 */
export function getAvailableSeasons(count: number = 5): SeasonOption[] {
  const currentSeason = getCurrentFootballSeason();
  const seasons: SeasonOption[] = [];

  for (let i = 0; i < count; i++) {
    const seasonYear = currentSeason - i;
    seasons.push({
      value: seasonYear,
      label: i === 0 ? `${formatSeasonLabel(seasonYear)} (Stagione Corrente)` : formatSeasonLabel(seasonYear),
    });
  }

  return seasons;
}
