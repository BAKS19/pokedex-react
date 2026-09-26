import React, { useState, useEffect, useMemo, useCallback } from 'react';

const TYPE_COLORS = {
  normal: '#9C9482', fire: '#E0682F', water: '#3E7FC1', electric: '#E0AB18',
  grass: '#4C8B4A', ice: '#5FB9B0', fighting: '#A0473A', poison: '#8455A3',
  ground: '#B8934B', flying: '#7C93C9', psychic: '#D0577E', bug: '#8BA23A',
  rock: '#9C8552', ghost: '#5C5487', dragon: '#5B4FBF', dark: '#4F4438',
  steel: '#7C8B93', fairy: '#D693B4',
};

const STYLES = `
.pokedex-app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 28px 20px 48px;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  color: #2B2318;
  background: #061814;
  background: linear-gradient(135deg, #0a2e23 0%, #061814 60%, #020b08 100%);
}

.pokedex-header {
  margin-bottom: 18px;
}

.pokedex-header h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 36px;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
}

.subtitle {
  color: #5B5140;
  font-size: 13px;
  margin: 0;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.search-bar input {
  flex: 1;
  padding: 12px 14px;
  font-family: inherit;
  font-size: 15px;
  border: 1.5px solid #D8CBA6;
  border-radius: 3px;
  background: #F8F2E1;
  color: #2B2318;
  outline: none;
}

.search-bar input:focus {
  border-color: #3F6C51;
}

.search-btn {
  padding: 12px 20px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  background: #3F6C51;
  color: #F8F2E1;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.search-btn:hover {
  background: #345a43;
}

.error-banner {
  background: #f4d9d0;
  color: #7a2e1d;
  padding: 10px 14px;
  border-radius: 3px;
  margin-bottom: 16px;
  font-size: 13px;
}

.pokedex-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: start;
}

@media (max-width: 780px) {
  .pokedex-layout {
    grid-template-columns: 1fr;
  }
}

.pokedex-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 4px;
}

.grid-state {
  grid-column: 1 / -1;
  padding: 24px;
  text-align: center;
  color: #5B5140;
  font-size: 13px;
}

.poke-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #F8F2E1;
  border: 1px solid #D8CBA6;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.poke-card:hover {
  border-color: #3F6C51;
}

.poke-card.active {
  background: #3F6C51;
  border-color: #3F6C51;
}

.poke-card.active .poke-card-num,
.poke-card.active .poke-card-name {
  color: #F8F2E1;
}

.poke-card-num {
  font-size: 11px;
  color: #5B5140;
}

.poke-card-name {
  font-size: 13.5px;
  font-weight: 500;
  text-transform: capitalize;
  color: #5B5140;
}

.load-more-btn {
  grid-column: 1 / -1;
  padding: 12px;
  background: none;
  border: 1.5px dashed #C98A2C;
  border-radius: 4px;
  color: #C98A2C;
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}

.detail-panel {
  background: #F8F2E1;
  border: 1px solid #D8CBA6;
  border-radius: 4px;
  padding: 22px;
  position: relative;
  min-height: 320px;
}

.detail-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5B5140;
  font-size: 13px;
  text-align: center;
}

.detail-state.error {
  color: #7a2e1d;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #5B5140;
  line-height: 1;
}

.detail-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.detail-artwork {
  width: 88px;
  height: 88px;
  object-fit: contain;
  flex-shrink: 0;
}

.detail-number {
  font-size: 12px;
  color: #5B5140;
}

.detail-name {
  font-family: Georgia, serif;
  font-size: 24px;
  margin: 2px 0 8px;
  text-transform: capitalize;
}

.type-row {
  display: flex;
  gap: 6px;
}

.type-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  text-transform: capitalize;
}

.meta-row {
  display: flex;
  gap: 22px;
  margin-bottom: 18px;
  font-size: 13px;
}

.meta-row div span {
  display: block;
  color: #5B5140;
  font-size: 11px;
  margin-bottom: 2px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.stat-row {
  display: grid;
  grid-template-columns: 62px 1fr 32px;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
}

.stat-label {
  color: #5B5140;
}

.stat-track {
  height: 7px;
  background: #e4d9b8;
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: #3F6C51;
  border-radius: 4px;
}

.stat-value {
  text-align: right;
  color: #5B5140;
}

.abilities .ability-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.ability-chip {
  background: #ECE3CC;
  border: 1px solid #D8CBA6;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  text-transform: capitalize;
}

`;

function DexStyles() {
  return <style>{STYLES}</style>;
}

const API_BASE = 'https://pokeapi.co/api/v2';
const PAGE_SIZE = 30;

function extractId(url) {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ background: TYPE_COLORS[type] || '#999' }}>
      {type}
    </span>
  );
}

function StatBar({ label, value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="stat-value">{value}</span>
    </div>
  );
}

function DetailPanel({ pokemon, loading, error, onClose }) {
  if (loading) return <div className="detail-panel detail-state">Loading entry…</div>;
  if (error) return <div className="detail-panel detail-state error">Couldn't load that Pokémon. Try again.</div>;
  if (!pokemon) return <div className="detail-panel detail-state">Select a Pokémon to see its details.</div>;

  const stats = pokemon.stats.reduce((acc, s) => {
    acc[s.stat.name] = s.base_stat;
    return acc;
  }, {});

  const artwork =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default;

  return (
    <div className="detail-panel">
      <button className="close-btn" onClick={onClose} aria-label="Close details">×</button>
      <div className="detail-header">
        <img src={artwork} alt={pokemon.name} className="detail-artwork" />
        <div>
          <div className="detail-number">No. {String(pokemon.id).padStart(4, '0')}</div>
          <h2 className="detail-name">{pokemon.name}</h2>
          <div className="type-row">
            {pokemon.types.map((t) => (
              <TypeBadge key={t.type.name} type={t.type.name} />
            ))}
          </div>
        </div>
      </div>

      <div className="meta-row">
        <div><span>Height</span>{(pokemon.height / 10).toFixed(1)} m</div>
        <div><span>Weight</span>{(pokemon.weight / 10).toFixed(1)} kg</div>
        <div><span>Base XP</span>{pokemon.base_experience ?? '—'}</div>
      </div>

      <div className="stats">
        <StatBar label="HP" value={stats.hp || 0} max={255} />
        <StatBar label="Attack" value={stats.attack || 0} max={190} />
        <StatBar label="Defense" value={stats.defense || 0} max={230} />
        <StatBar label="Sp. Atk" value={stats['special-attack'] || 0} max={194} />
        <StatBar label="Sp. Def" value={stats['special-defense'] || 0} max={230} />
        <StatBar label="Speed" value={stats.speed || 0} max={180} />
      </div>

      <div className="abilities">
        <span className="stat-label">Abilities</span>
        <div className="ability-list">
          {pokemon.abilities.map((a) => (
            <span key={a.ability.name} className="ability-chip">
              {a.ability.name.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PokemonDex() {
  const [allPokemon, setAllPokemon] = useState([]); // { name, url, id }
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(false);

  // Fetch the full list of 1000+ Pokemon names once. This is a single
  // lightweight call (just names + urls) — we do NOT fetch full stats for
  // all of them, since that would mean 1000+ requests up front.
  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    fetch(`${API_BASE}/pokemon?limit=100000&offset=0`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const withIds = data.results.map((p) => ({ ...p, id: extractId(p.url) }));
        setAllPokemon(withIds);
        setListLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setListError(err.message);
        setListLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPokemon;
    return allPokemon.filter(
      (p) => p.name.includes(q) || String(p.id).includes(q)
    );
  }, [allPokemon, query]);

  const visible = filtered.slice(0, visibleCount);

  const runSearch = useCallback(() => {
    setQuery(inputValue);
    setVisibleCount(PAGE_SIZE);
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') runSearch();
  };

  const handleSelect = useCallback((pokemon) => {
    setDetailLoading(true);
    setDetailError(false);
    setSelected(null);
    fetch(pokemon.url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setSelected(data);
        setDetailLoading(false);
      })
      .catch(() => {
        setDetailError(true);
        setDetailLoading(false);
      });
  }, []);

  return (
    <div className="pokedex-app">
      <DexStyles />
      <header className="pokedex-header">
        <h1>PokéDex</h1>
        <p className="subtitle">
          {listLoading ? 'Loading the national dex…' : `${allPokemon.length} Pokémon available`}
        </p>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or number…"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search Pokémon"
        />
        <button className="search-btn" onClick={runSearch}>
          Search
        </button>
      </div>

      {listError && <div className="error-banner">Couldn't load the Pokémon list: {listError}</div>}

      <div className="pokedex-layout">
        <div className="pokedex-grid">
          {listLoading && <div className="grid-state">Loading…</div>}

          {!listLoading && visible.length === 0 && (
            <div className="grid-state">No Pokémon match "{query}".</div>
          )}

          {visible.map((p) => (
            <button
              key={p.id}
              className={`poke-card ${selected?.id === p.id ? 'active' : ''}`}
              onClick={() => handleSelect(p)}
            >
              <span className="poke-card-num">#{String(p.id).padStart(4, '0')}</span>
              <span className="poke-card-name">{p.name}</span>
            </button>
          ))}

          {!listLoading && visibleCount < filtered.length && (
            <button className="load-more-btn" onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
              Load more ({filtered.length - visibleCount} remaining)
            </button>
          )}
        </div>

        <DetailPanel
          pokemon={selected}
          loading={detailLoading}
          error={detailError}
          onClose={() => setSelected(null)}
        />
      </div>
    </div>
  );
}
