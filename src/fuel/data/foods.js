// Food database.
//
// per100 — macros per 100 g (or per 100 ml for liquids), raw/dry weight as sold.
// aud    — indicative Australian supermarket price per kg / per litre.
// diet   — which "foods you eat" group this belongs to. null = always allowed.
// avoid  — flags matched against the user's intolerances list.
// prep   — 0 no cook, 1 quick (<10 min), 2 longer (20 min+).
// step   — sensible rounding increment for a portion, in grams.
// min    — smallest portion worth putting on a plate. Without this the solver
//          happily prescribes 25 g of yoghurt when the oats already carried the
//          protein; the floor keeps servings recognisable as food.
// max    — ceiling where a large quantity stops being realistic. Four bananas in
//          one shake hits the carb target and nobody eats it.

export const FOODS = {
  // ── Protein ────────────────────────────────────────────────────────────────
  beef_mince: {
    name: 'Lean beef mince', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 137, p: 21, c: 0, f: 5.5 }, aud: 16, prep: 1, step: 25, min: 100,
  },
  rump_steak: {
    name: 'Rump steak', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 190, p: 29, c: 0, f: 8 }, aud: 28, prep: 1, step: 25, min: 120,
  },
  kangaroo: {
    name: 'Kangaroo fillet', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 98, p: 22, c: 0, f: 1 }, aud: 22, prep: 1, step: 25, min: 100,
  },
  lamb_leg: {
    name: 'Lamb leg', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 201, p: 25, c: 0, f: 11 }, aud: 26, prep: 2, step: 25, min: 100,
  },
  pork_loin: {
    name: 'Pork loin', cat: 'protein', diet: 'red-meat', avoid: ['pork'],
    per100: { kcal: 143, p: 26, c: 0, f: 4 }, aud: 14, prep: 1, step: 25, min: 100,
  },
  chicken_breast: {
    name: 'Chicken breast', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 165, p: 31, c: 0, f: 3.6 }, aud: 13, prep: 1, step: 25, min: 100,
  },
  chicken_thigh: {
    name: 'Chicken thigh', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 209, p: 26, c: 0, f: 11 }, aud: 11, prep: 1, step: 25, min: 100,
  },
  turkey_mince: {
    name: 'Turkey mince', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 148, p: 27, c: 0, f: 4 }, aud: 17, prep: 1, step: 25, min: 100,
  },
  salmon: {
    name: 'Salmon fillet', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 208, p: 20, c: 0, f: 13 }, aud: 34, prep: 1, step: 25, min: 100,
  },
  white_fish: {
    name: 'Barramundi', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 110, p: 23, c: 0, f: 2 }, aud: 26, prep: 1, step: 25, min: 100,
  },
  tuna_tin: {
    name: 'Tinned tuna', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 116, p: 26, c: 0, f: 1 }, aud: 14, prep: 0, step: 20, min: 95, max: 200,
  },
  prawns: {
    name: 'Prawns', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 99, p: 24, c: 0, f: 0.3 }, aud: 32, prep: 1, step: 25, min: 100,
  },
  eggs: {
    name: 'Eggs', cat: 'protein', diet: 'eggs', avoid: [],
    per100: { kcal: 143, p: 13, c: 1, f: 10 }, aud: 9, prep: 1, step: 50, min: 100, max: 200,
    unit: 'each', gPerUnit: 50,
  },
  greek_yog: {
    name: 'Greek yoghurt', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 59, p: 10, c: 3.6, f: 0.4 }, aud: 8, prep: 0, step: 25, min: 150, max: 400,
  },
  cottage: {
    name: 'Cottage cheese', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 98, p: 11, c: 3.4, f: 4.3 }, aud: 11, prep: 0, step: 25, min: 150, max: 300,
  },
  whey: {
    name: 'Whey protein', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 400, p: 80, c: 8, f: 6 }, aud: 45, prep: 0, step: 10, min: 30, max: 60,
    unit: 'scoop', gPerUnit: 30,
  },
  pea_protein: {
    name: 'Pea protein', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 375, p: 78, c: 5, f: 5 }, aud: 42, prep: 0, step: 10, min: 30, max: 60,
    unit: 'scoop', gPerUnit: 30,
  },
  tofu: {
    name: 'Firm tofu', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 144, p: 17, c: 3, f: 9 }, aud: 9, prep: 1, step: 25, min: 100,
  },
  tempeh: {
    name: 'Tempeh', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 192, p: 20, c: 8, f: 11 }, aud: 18, prep: 1, step: 25, min: 100,
  },
  lentils: {
    name: 'Lentils (dry)', cat: 'protein', diet: 'plant', avoid: ['fodmap'],
    per100: { kcal: 353, p: 25, c: 60, f: 1 }, aud: 4.5, prep: 2, step: 20, min: 50, max: 150,
  },
  chickpeas: {
    name: 'Chickpeas (tinned)', cat: 'protein', diet: 'plant', avoid: ['fodmap'],
    per100: { kcal: 139, p: 7, c: 22, f: 2 }, aud: 4, prep: 0, step: 25, min: 100, max: 250,
  },

  // ── Carbs ──────────────────────────────────────────────────────────────────
  white_rice: {
    name: 'White rice (dry)', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 360, p: 7, c: 79, f: 1 }, aud: 2.8, prep: 2, step: 10, min: 50,
  },
  basmati: {
    name: 'Basmati rice (dry)', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 356, p: 8, c: 78, f: 1 }, aud: 3.6, prep: 2, step: 10, min: 50,
  },
  sweet_potato: {
    name: 'Sweet potato', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 86, p: 1.6, c: 20, f: 0.1 }, aud: 4, prep: 2, step: 25, min: 150,
  },
  potato: {
    name: 'Potato', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 77, p: 2, c: 17, f: 0.1 }, aud: 3, prep: 2, step: 25, min: 150,
  },
  oats: {
    name: 'Rolled oats', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 379, p: 13, c: 67, f: 7 }, aud: 3, prep: 1, step: 10, min: 40, max: 200,
  },
  gf_oats: {
    name: 'Gluten-free oats', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 375, p: 12, c: 68, f: 7 }, aud: 8, prep: 1, step: 10, min: 40, max: 200,
  },
  pasta: {
    name: 'Pasta (dry)', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 371, p: 13, c: 75, f: 1.5 }, aud: 2.8, prep: 2, step: 10, min: 60, max: 200,
  },
  wholemeal_bread: {
    name: 'Wholemeal bread', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 247, p: 9, c: 41, f: 3.4 }, aud: 5.5, prep: 0, step: 40, min: 40, max: 160,
    unit: 'slice', gPerUnit: 40,
  },
  gf_bread: {
    name: 'Gluten-free bread', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 250, p: 5, c: 45, f: 4 }, aud: 10, prep: 0, step: 40, min: 40, max: 160,
    unit: 'slice', gPerUnit: 40,
  },
  quinoa: {
    name: 'Quinoa (dry)', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 368, p: 14, c: 64, f: 6 }, aud: 10, prep: 2, step: 10, min: 50, max: 200,
  },
  rice_cakes: {
    name: 'Rice cakes', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 387, p: 8, c: 82, f: 3 }, aud: 13, prep: 0, step: 9, min: 18, max: 54,
    unit: 'cake', gPerUnit: 9,
  },
  banana: {
    name: 'Banana', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 89, p: 1.1, c: 23, f: 0.3 }, aud: 4, prep: 0, step: 60, min: 60, max: 240,
    unit: 'each', gPerUnit: 120,
  },
  honey: {
    name: 'Honey', cat: 'carb', diet: null, avoid: ['fodmap'],
    per100: { kcal: 304, p: 0.3, c: 82, f: 0 }, aud: 13, prep: 0, step: 5, min: 10, max: 40,
  },
  maple: {
    name: 'Maple syrup', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 260, p: 0, c: 67, f: 0 }, aud: 20, prep: 0, step: 5, min: 10, max: 40,
  },

  // ── Fats ───────────────────────────────────────────────────────────────────
  olive_oil: {
    name: 'Olive oil', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 884, p: 0, c: 0, f: 100 }, aud: 13, prep: 0, step: 5, min: 5, max: 30,
  },
  peanut_butter: {
    name: 'Peanut butter', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 588, p: 25, c: 20, f: 50 }, aud: 11, prep: 0, step: 5, min: 15, max: 60,
  },
  almonds: {
    name: 'Almonds', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 579, p: 21, c: 22, f: 50 }, aud: 24, prep: 0, step: 10, min: 20, max: 60,
  },
  avocado: {
    name: 'Avocado', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 160, p: 2, c: 9, f: 15 }, aud: 9, prep: 0, step: 25, min: 50, max: 100,
  },
  cheddar: {
    name: 'Cheddar', cat: 'fat', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 402, p: 25, c: 1.3, f: 33 }, aud: 13, prep: 0, step: 10, min: 15, max: 60,
  },

  // ── Veg & fruit ────────────────────────────────────────────────────────────
  broccoli: {
    name: 'Broccoli', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 34, p: 2.8, c: 7, f: 0.4 }, aud: 6, prep: 1, step: 25,
  },
  spinach: {
    name: 'Baby spinach', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 23, p: 2.9, c: 3.6, f: 0.4 }, aud: 14, prep: 0, step: 25,
  },
  mixed_veg: {
    name: 'Frozen mixed veg', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 60, p: 3, c: 11, f: 0.5 }, aud: 3.5, prep: 1, step: 25,
  },
  capsicum: {
    name: 'Capsicum', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 31, p: 1, c: 6, f: 0.3 }, aud: 8, prep: 0, step: 25,
  },
  carrot: {
    name: 'Carrot', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 41, p: 0.9, c: 10, f: 0.2 }, aud: 2.5, prep: 0, step: 25,
  },
  berries: {
    name: 'Frozen berries', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 50, p: 1, c: 12, f: 0.3 }, aud: 10, prep: 0, step: 25,
  },
  orange_juice: {
    liquid: true,
    name: 'Orange juice', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 45, p: 0.7, c: 10, f: 0.2 }, aud: 3.5, prep: 0, step: 50,
  },
  pom_juice: {
    liquid: true,
    name: 'Pomegranate juice', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 54, p: 0.15, c: 13, f: 0.3 }, aud: 9, prep: 0, step: 50,
  },
}

export const DIET_GROUPS = [
  { id: 'red-meat', label: 'Red Meat' },
  { id: 'poultry', label: 'Poultry' },
  { id: 'fish', label: 'Fish & Seafood' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'plant', label: 'Plant-Based' },
]

export const AVOID_FLAGS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Dairy Intolerant' },
  { id: 'eggs', label: 'No Eggs' },
  { id: 'pork', label: 'No Pork' },
  { id: 'fodmap', label: 'Gut Issues' },
]

/** Is this food usable given the athlete's food preferences and intolerances? */
export function foodAllowed(id, eats, avoids) {
  const f = FOODS[id]
  if (!f) return false
  if (f.diet && !eats.includes(f.diet)) return false
  if (f.avoid.some(a => avoids.includes(a))) return false
  // "No Eggs" removes the eggs group even if it was ticked under foods you eat.
  if (f.diet === 'eggs' && avoids.includes('eggs')) return false
  return true
}

/** First allowed food from a preference-ordered list. `cheapest` flips to lowest $/kg. */
export function pickFood(ids, eats, avoids, cheapest = false) {
  const ok = ids.filter(id => foodAllowed(id, eats, avoids))
  if (ok.length === 0) return null
  if (!cheapest) return ok[0]
  return ok.reduce((best, id) => (FOODS[id].aud < FOODS[best].aud ? id : best), ok[0])
}
