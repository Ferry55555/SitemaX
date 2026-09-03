import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// STRICT CENTRALIZED WHITELIST: Only the 10 monitored competitions are accepted
const ALLOWED_API_LEAGUE_IDS = [135, 136, 61, 62, 39, 40, 140, 141, 78, 79];

// In-memory cache for API-Football requests to save quota
interface CacheEntry {
  data: any;
  timestamp: number;
  rateLimit?: {
    remaining?: number;
    limit?: number;
  };
}

const cache: Record<string, CacheEntry> = {};
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes default cache

function getApiKey(req?: express.Request): string | null {
  const headerKey =
    req?.headers['x-custom-api-key'] ||
    req?.headers['x-apisports-key'] ||
    req?.headers['x-rapidapi-key'];
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }
  const queryKey = req?.query?.apiKey;
  if (typeof queryKey === 'string' && queryKey.trim()) {
    return queryKey.trim();
  }
  return (
    process.env.API_FOOTBALL_KEY ||
    process.env.FOOTBALL_API_KEY ||
    process.env.RAPIDAPI_KEY ||
    null
  );
}

interface FetchOptions {
  ttlMs?: number;
  timeoutMs?: number;
  forceFresh?: boolean;
}

// Robust Helper to call API-Football with Timeout, Rate-Limit tracking, Caching & Error handling
async function fetchApiFootball(
  endpoint: string,
  params: Record<string, string | number> = {},
  options: FetchOptions = {},
  req?: express.Request
) {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    const error: any = new Error('API_KEY_NOT_CONFIGURED');
    error.statusCode = 401;
    throw error;
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      query.append(k, String(v));
    }
  });

  const url = `https://v3.football.api-sports.io/${endpoint}${query.toString() ? '?' + query.toString() : ''}`;
  const cacheKey = `${apiKey.slice(0, 6)}_${url}`;
  const ttl = options.ttlMs ?? CACHE_TTL_MS;

  if (!options.forceFresh && cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < ttl) {
    return {
      data: cache[cacheKey].data,
      fromCache: true,
      rateLimit: cache[cacheKey].rateLimit,
    };
  }

  const headers: Record<string, string> = {
    'x-apisports-key': apiKey.trim(),
  };

  if (process.env.RAPIDAPI_KEY || req?.headers['x-rapidapi-key']) {
    headers['x-rapidapi-key'] = (
      (req?.headers['x-rapidapi-key'] as string) || process.env.RAPIDAPI_KEY || ''
    ).trim();
    headers['x-rapidapi-host'] = 'v3.football.api-sports.io';
  }

  // 10s timeout handling with AbortController
  const timeoutMs = options.timeoutMs ?? 10000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      headers,
      signal: controller.signal,
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      const error: any = new Error(`Richiesta ad API-Football scaduta (timeout di ${timeoutMs}ms)`);
      error.statusCode = 504;
      throw error;
    }
    const error: any = new Error(`Impossibile connettersi ad api-football.com: ${err.message}`);
    error.statusCode = 502;
    throw error;
  } finally {
    clearTimeout(timer);
  }

  // Extract rate-limit headers
  const remainingHeader = res.headers.get('x-ratelimit-requests-remaining');
  const limitHeader = res.headers.get('x-ratelimit-requests-limit');
  const rateLimit = {
    remaining: remainingHeader ? parseInt(remainingHeader, 10) : undefined,
    limit: limitHeader ? parseInt(limitHeader, 10) : undefined,
  };

  if (res.status === 429) {
    const error: any = new Error('Rate limit superato su API-Football (Troppe richieste o quota giornaliera esaurita).');
    error.statusCode = 429;
    error.rateLimit = rateLimit;
    throw error;
  }

  if (!res.ok) {
    const errorText = await res.text();
    const error: any = new Error(`API-Football ha risposto con codice HTTP ${res.status}: ${errorText}`);
    error.statusCode = res.status;
    throw error;
  }

  const json = await res.json();

  // API-Football specific error format in payload
  if (json.errors) {
    const hasErrors =
      Array.isArray(json.errors) ? json.errors.length > 0 : Object.keys(json.errors).length > 0;
    if (hasErrors) {
      const errString = typeof json.errors === 'object' ? JSON.stringify(json.errors) : String(json.errors);
      const error: any = new Error(`API-Football error: ${errString}`);
      error.statusCode = 400;
      error.details = json.errors;
      throw error;
    }
  }

  cache[cacheKey] = {
    data: json,
    timestamp: Date.now(),
    rateLimit,
  };

  return {
    data: json,
    fromCache: false,
    rateLimit,
  };
}

// 1. Health check & API Key presence
app.get('/api/health', (req, res) => {
  const apiKey = getApiKey(req);
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey),
    provider: 'api-football.com',
    allowedLeagues: ALLOWED_API_LEAGUE_IDS,
  });
});

// 2. Status check with API-Football /status endpoint
app.get('/api/football/status', async (req, res) => {
  const apiKey = getApiKey(req);
  if (!apiKey) {
    return res.json({
      configured: false,
      message: 'API Key non configurata. Inserisci API_FOOTBALL_KEY o FOOTBALL_API_KEY nei Secrets di AI Studio o tramite interfaccia.',
    });
  }

  try {
    const result = await fetchApiFootball(
      'status',
      {},
      { ttlMs: 60 * 1000, forceFresh: req.query.fresh === 'true' },
      req
    );
    const data = result.data;
    return res.json({
      configured: true,
      valid: true,
      data: data.response || data,
      rateLimit: result.rateLimit,
      fromCache: result.fromCache,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      configured: true,
      valid: false,
      error: error.message || 'Errore durante la connessione ad api-football.com',
      rateLimit: error.rateLimit,
    });
  }
});

// 3. Test Connection function: Tests fetching a specific allowed competition
app.get('/api/football/test', async (req, res) => {
  const targetLeague = Number(req.query.league || 135); // Default: Serie A (135)
  const season = Number(req.query.season || new Date().getFullYear());
  const startTime = Date.now();

  if (!ALLOWED_API_LEAGUE_IDS.includes(targetLeague)) {
    return res.status(400).json({
      success: false,
      error: `Lega ID ${targetLeague} non ammessa. Sono ammesse solo le 10 leghe ufficiali (${ALLOWED_API_LEAGUE_IDS.join(', ')})`,
    });
  }

  try {
    // 1. Fetch fixtures sample for this league
    const result = await fetchApiFootball(
      'fixtures',
      {
        league: targetLeague,
        season,
        last: 5,
      },
      { ttlMs: 60 * 1000, forceFresh: true, timeoutMs: 12000 },
      req
    );

    const latencyMs = Date.now() - startTime;
    const fixtures = result.data.response || [];
    const sample = fixtures[0];

    return res.json({
      success: true,
      timestamp: new Date().toISOString(),
      apiLeagueId: targetLeague,
      seasonUsed: season,
      latencyMs,
      requestsRemaining: result.rateLimit?.remaining,
      requestsLimit: result.rateLimit?.limit,
      fixturesFound: fixtures.length,
      sampleFixture: sample
        ? {
            home: sample.teams?.home?.name,
            away: sample.teams?.away?.name,
            date: sample.fixture?.date,
            status: sample.fixture?.status?.short,
            score: `${sample.goals?.home ?? '-'} - ${sample.goals?.away ?? '-'}`,
          }
        : undefined,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      success: false,
      apiLeagueId: targetLeague,
      seasonUsed: season,
      latencyMs: Date.now() - startTime,
      error: error.message || 'Errore durante il test di connessione con API-Football',
      rateLimit: error.rateLimit,
    });
  }
});

// 4. Proxy for league standings (strictly validated against whitelist)
app.get('/api/football/standings', async (req, res) => {
  const leagueId = Number(req.query.league || 135);
  const currentSeason = Number(req.query.season || new Date().getFullYear());

  if (!ALLOWED_API_LEAGUE_IDS.includes(leagueId)) {
    return res.status(400).json({
      error: `Competizione non autorizzata. ID ${leagueId} non fa parte delle 10 competizioni consentite.`,
    });
  }

  try {
    const result = await fetchApiFootball(
      'standings',
      {
        league: leagueId,
        season: currentSeason,
      },
      { ttlMs: 30 * 60 * 1000 },
      req
    );
    return res.json({
      ...result.data,
      rateLimit: result.rateLimit,
      fromCache: result.fromCache,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      rateLimit: error.rateLimit,
    });
  }
});

// 5. Proxy for league fixtures (strictly validated against whitelist)
app.get('/api/football/fixtures', async (req, res) => {
  const leagueId = Number(req.query.league || 135);
  const currentSeason = Number(req.query.season || new Date().getFullYear());
  const next = req.query.next ? Number(req.query.next) : undefined;
  const last = req.query.last ? Number(req.query.last) : undefined;
  const from = req.query.from ? String(req.query.from) : undefined;
  const to = req.query.to ? String(req.query.to) : undefined;

  if (!ALLOWED_API_LEAGUE_IDS.includes(leagueId)) {
    return res.status(400).json({
      error: `Competizione non autorizzata. ID ${leagueId} non fa parte delle 10 competizioni consentite.`,
    });
  }

  const params: Record<string, string | number> = {
    league: leagueId,
    season: currentSeason,
  };
  if (next) params.next = next;
  if (last) params.last = last;
  if (from) params.from = from;
  if (to) params.to = to;

  try {
    const result = await fetchApiFootball('fixtures', params, { ttlMs: 15 * 60 * 1000 }, req);
    return res.json({
      ...result.data,
      rateLimit: result.rateLimit,
      fromCache: result.fromCache,
    });
  } catch (error: any) {
    return res.status(error.statusCode || 500).json({
      error: error.message,
      rateLimit: error.rateLimit,
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
