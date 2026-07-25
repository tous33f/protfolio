// Animated avatar decoration frames from avatardecoration.com (APNG, self-looping).
// These are served directly from their CDN. Each URL was verified to return 200.
// To self-host instead, download each to src/assets and import them here.
const BASE = 'https://img.avatardecoration.com/decorations'

const SLUGS = [
  'aurora',
  'arcane_sigil',
  'black_hole',
  'magic_portal_blue',
  'magic_portal_purple',
  'phoenix',
  'solar_orbit',
  'constellations',
  'glowing_runes',
  'hex_lights',
  'radiating_energy',
  'spirit_embers',
  'stardust',
  'string_lights_aurora',
  'lunar_lanterns',
  'eldritch_ring',
  'flux_alchemy',
  'the_hexcore',
  'cybernetic',
  'ki_energy',
]

export const decorations = SLUGS.map((slug) => ({
  slug,
  url: `${BASE}/${slug}.png`,
}))
