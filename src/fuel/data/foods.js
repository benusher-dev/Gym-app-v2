// Food database — UK products and prices.
//
// per100  — macros per 100 g (or per 100 ml), at the weight the food is SOLD:
//           raw for meat and fish, dry for rice, pasta and couscous.
// gbp     — indicative UK supermarket price per kg / per litre.
// diet    — which "foods you eat" group this belongs to. null = always allowed.
// avoid   — flags matched against the athlete's intolerances list.
// prep    — 0 no cook, 1 quick (<10 min), 2 longer (20 min+).
// step    — sensible rounding increment for a portion, in grams.
// min/max — smallest and largest portion worth putting on a plate. Without these
//           the solver prescribes 25 g of yoghurt, or four bananas in one shake.
// cooked  — cooked weight ÷ as-sold weight. Meat loses about 25% and fish 20%;
//           rice roughly triples. Factors match the ones used in the 7-day diary
//           so the two documents agree. 1 means the food is eaten as sold.
// weighAs — what the as-sold number represents, where the distinction matters.

export const FOODS = {
  // ── Protein ────────────────────────────────────────────────────────────────
  beef_mince: {
    name: 'Beef mince 5%', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 176, p: 27, c: 0, f: 8 }, gbp: 9, prep: 1, step: 25,
    min: 100, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  rump_steak: {
    name: 'Rump steak', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 190, p: 29, c: 0, f: 8 }, gbp: 16, prep: 1, step: 25,
    min: 120, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  venison: {
    name: 'Venison steak', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 120, p: 23, c: 0, f: 3 }, gbp: 20, prep: 1, step: 25,
    min: 100, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  lamb_leg: {
    name: 'Lamb leg', cat: 'protein', diet: 'red-meat', avoid: [],
    per100: { kcal: 201, p: 25, c: 0, f: 11 }, gbp: 12, prep: 2, step: 25,
    min: 100, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  pork_loin: {
    name: 'Pork loin', cat: 'protein', diet: 'red-meat', avoid: ['pork'],
    per100: { kcal: 143, p: 26, c: 0, f: 4 }, gbp: 7, prep: 1, step: 25,
    min: 100, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  chicken_breast: {
    name: 'Chicken breast', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 124, p: 23, c: 0, f: 3 }, gbp: 7, prep: 1, step: 25,
    min: 100, max: 320, cooked: 0.75, weighAs: 'raw',
  },
  chicken_thigh: {
    name: 'Chicken thigh', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 157, p: 20, c: 0, f: 8 }, gbp: 5, prep: 1, step: 25,
    min: 100, max: 320, cooked: 0.75, weighAs: 'raw',
  },
  turkey_mince: {
    name: 'Turkey mince 5%', cat: 'protein', diet: 'poultry', avoid: [],
    per100: { kcal: 116, p: 22, c: 0, f: 3 }, gbp: 8, prep: 1, step: 25,
    min: 100, max: 300, cooked: 0.75, weighAs: 'raw',
  },
  salmon: {
    name: 'Salmon fillet', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 166, p: 18, c: 0, f: 10 }, gbp: 18, prep: 1, step: 25,
    min: 100, max: 250, cooked: 0.8, weighAs: 'raw',
  },
  cod: {
    name: 'Cod loin', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 84, p: 18, c: 0, f: 1 }, gbp: 14, prep: 1, step: 25,
    min: 100, max: 300, cooked: 0.8, weighAs: 'raw',
  },
  tuna_tin: {
    name: 'Tuna in springwater', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 116, p: 26, c: 0, f: 1 }, gbp: 8, prep: 0, step: 20,
    min: 95, max: 200, cooked: 1,
  },
  prawns: {
    name: 'King prawns', cat: 'protein', diet: 'fish', avoid: [],
    per100: { kcal: 84, p: 20, c: 0, f: 0.5 }, gbp: 14, prep: 1, step: 25,
    min: 100, max: 250, cooked: 0.85, weighAs: 'raw',
  },
  eggs: {
    name: 'Whole eggs', cat: 'protein', diet: 'eggs', avoid: [],
    per100: { kcal: 143, p: 13, c: 1, f: 10 }, gbp: 5, prep: 1, step: 50,
    min: 100, max: 200, cooked: 1,
    unit: 'each', gPerUnit: 50,
  },
  greek_yog: {
    name: '0% Greek yoghurt', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 57, p: 10, c: 3.6, f: 0.4 }, gbp: 3, prep: 0, step: 25,
    min: 150, max: 400, cooked: 1,
  },
  cottage: {
    name: 'Cottage cheese', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 98, p: 11, c: 3.4, f: 4.3 }, gbp: 4, prep: 0, step: 25,
    min: 150, max: 300, cooked: 1,
  },
  whey: {
    name: 'Whey protein', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 400, p: 80, c: 8, f: 6 }, gbp: 20, prep: 0, step: 10,
    min: 30, max: 60, cooked: 1,
    unit: 'scoop', gPerUnit: 30,
  },
  protein_bar: {
    // A specific convenience product bought for its convenience — swapping it for
    // cheaper protein by weight misses the point of it.
    noSwap: true,
    name: 'Protein bar', cat: 'protein', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 358, p: 33, c: 33, f: 13 }, gbp: 33, prep: 0, step: 60,
    min: 60, max: 60, cooked: 1,
    unit: 'bar', gPerUnit: 60,
  },
  pea_protein: {
    name: 'Pea protein', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 375, p: 78, c: 5, f: 5 }, gbp: 22, prep: 0, step: 10,
    min: 30, max: 60, cooked: 1,
    unit: 'scoop', gPerUnit: 30,
  },
  tofu: {
    name: 'Firm tofu', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 144, p: 17, c: 3, f: 9 }, gbp: 5, prep: 1, step: 25,
    min: 100, max: 300, cooked: 1,
  },
  tempeh: {
    name: 'Tempeh', cat: 'protein', diet: 'plant', avoid: [],
    per100: { kcal: 192, p: 20, c: 8, f: 11 }, gbp: 12, prep: 1, step: 25,
    min: 100, max: 250, cooked: 1,
  },
  lentils: {
    name: 'Lentils', cat: 'protein', diet: 'plant', avoid: ['fodmap'],
    per100: { kcal: 353, p: 25, c: 60, f: 1 }, gbp: 2, prep: 2, step: 20,
    min: 50, max: 150, cooked: 2.4, weighAs: 'dry',
  },
  chickpeas: {
    name: 'Chickpeas (tinned)', cat: 'protein', diet: 'plant', avoid: ['fodmap'],
    per100: { kcal: 139, p: 7, c: 22, f: 2 }, gbp: 1.2, prep: 0, step: 25,
    min: 100, max: 250, cooked: 1,
  },

  // ── Carbs ──────────────────────────────────────────────────────────────────
  basmati: {
    name: 'Basmati rice', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 356, p: 8, c: 78, f: 1 }, gbp: 2.2, prep: 2, step: 10,
    min: 50, max: 300, cooked: 2.8, weighAs: 'dry',
  },
  white_rice: {
    name: 'Long grain rice', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 360, p: 7, c: 79, f: 1 }, gbp: 1.5, prep: 2, step: 10,
    min: 50, max: 300, cooked: 2.8, weighAs: 'dry',
  },
  couscous: {
    name: 'Couscous', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 376, p: 13, c: 77, f: 1 }, gbp: 2.5, prep: 1, step: 10,
    min: 50, max: 300, cooked: 2.45, weighAs: 'dry',
  },
  new_potatoes: {
    name: 'New potatoes', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 82, p: 2, c: 18, f: 0.1 }, gbp: 1.4, prep: 2, step: 25,
    min: 150, max: 800, cooked: 0.95, weighAs: 'raw',
  },
  sweet_potato: {
    name: 'Sweet potato', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 86, p: 1.6, c: 20, f: 0.1 }, gbp: 1.5, prep: 2, step: 25,
    min: 150, max: 700, cooked: 0.83, weighAs: 'raw',
  },
  oats: {
    name: 'Porridge oats', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 379, p: 13, c: 67, f: 7 }, gbp: 1.2, prep: 1, step: 10,
    min: 40, max: 200, cooked: 1, weighAs: 'dry',
  },
  gf_oats: {
    name: 'Gluten-free oats', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 375, p: 12, c: 68, f: 7 }, gbp: 3, prep: 1, step: 10,
    min: 40, max: 200, cooked: 1, weighAs: 'dry',
  },
  pasta: {
    name: 'Pasta', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 371, p: 13, c: 75, f: 1.5 }, gbp: 1.1, prep: 2, step: 10,
    min: 60, max: 300, cooked: 2.33, weighAs: 'dry',
  },
  wholemeal_bread: {
    name: 'Wholemeal bread', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 247, p: 9, c: 41, f: 3.4 }, gbp: 1.6, prep: 0, step: 40,
    min: 40, max: 240, cooked: 1,
    unit: 'slice', gPerUnit: 40,
  },
  tortilla: {
    name: 'Tortilla wraps', cat: 'carb', diet: null, avoid: ['gluten'],
    per100: { kcal: 275, p: 8, c: 47, f: 6 }, gbp: 3.5, prep: 0, step: 65,
    min: 65, max: 260, cooked: 1,
    unit: 'wrap', gPerUnit: 65,
  },
  gf_bread: {
    name: 'Gluten-free bread', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 250, p: 5, c: 45, f: 4 }, gbp: 5, prep: 0, step: 40,
    min: 40, max: 240, cooked: 1,
    unit: 'slice', gPerUnit: 40,
  },
  quinoa: {
    name: 'Quinoa', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 368, p: 14, c: 64, f: 6 }, gbp: 5, prep: 2, step: 10,
    min: 50, max: 300, cooked: 2.9, weighAs: 'dry',
  },
  rice_cakes: {
    name: 'Rice cakes', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 387, p: 8, c: 82, f: 3 }, gbp: 6, prep: 0, step: 9,
    min: 18, max: 90, cooked: 1,
    unit: 'cake', gPerUnit: 9,
  },
  banana: {
    name: 'Banana', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 89, p: 1.1, c: 23, f: 0.3 }, gbp: 1, prep: 0, step: 60,
    min: 60, max: 240, cooked: 1,
    unit: 'each', gPerUnit: 120,
  },
  honey: {
    name: 'Honey', cat: 'carb', diet: null, avoid: ['fodmap'],
    per100: { kcal: 304, p: 0.3, c: 82, f: 0 }, gbp: 5, prep: 0, step: 5,
    min: 10, max: 40, cooked: 1,
  },
  maple: {
    name: 'Maple syrup', cat: 'carb', diet: null, avoid: [],
    per100: { kcal: 260, p: 0, c: 67, f: 0 }, gbp: 10, prep: 0, step: 5,
    min: 10, max: 40, cooked: 1,
  },

  // ── Fats ───────────────────────────────────────────────────────────────────
  olive_oil: {
    name: 'Olive oil', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 884, p: 0, c: 0, f: 100 }, gbp: 7, prep: 0, step: 5,
    min: 5, max: 40, cooked: 1,
  },
  peanut_butter: {
    name: 'Peanut butter', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 588, p: 25, c: 20, f: 50 }, gbp: 5, prep: 0, step: 5,
    min: 15, max: 60, cooked: 1,
  },
  almonds: {
    name: 'Almonds', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 579, p: 21, c: 22, f: 50 }, gbp: 10, prep: 0, step: 10,
    min: 20, max: 60, cooked: 1,
  },
  avocado: {
    name: 'Avocado', cat: 'fat', diet: null, avoid: [],
    per100: { kcal: 160, p: 2, c: 9, f: 15 }, gbp: 4, prep: 0, step: 25,
    min: 50, max: 100, cooked: 1,
  },
  cheddar: {
    name: 'Reduced-fat cheddar', cat: 'fat', diet: 'dairy', avoid: ['dairy'],
    per100: { kcal: 273, p: 33, c: 0.1, f: 15 }, gbp: 7, prep: 0, step: 10,
    min: 15, max: 60, cooked: 1,
  },

  // ── Veg & fruit ────────────────────────────────────────────────────────────
  broccoli: {
    name: 'Broccoli', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 35, p: 2.8, c: 7, f: 0.4 }, gbp: 2, prep: 1, step: 25, cooked: 1,
  },
  spinach: {
    name: 'Salad veg', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 20, p: 1.5, c: 3, f: 0.3 }, gbp: 4, prep: 0, step: 25, cooked: 1,
  },
  mixed_veg: {
    name: 'Frozen mixed veg', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 42, p: 2, c: 8, f: 0.5 }, gbp: 1.5, prep: 1, step: 25, cooked: 1,
  },
  onion_pepper: {
    name: 'Onion & pepper mix', cat: 'veg', diet: null, avoid: ['fodmap'],
    per100: { kcal: 33, p: 1, c: 6.5, f: 0.2 }, gbp: 3, prep: 1, step: 25, cooked: 1,
  },
  passata: {
    name: 'Passata', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 30, p: 1.3, c: 5.5, f: 0.2 }, gbp: 1.2, prep: 0, step: 50, cooked: 1,
  },
  carrot: {
    name: 'Carrots', cat: 'veg', diet: null, avoid: [],
    per100: { kcal: 41, p: 0.9, c: 10, f: 0.2 }, gbp: 0.7, prep: 0, step: 25, cooked: 1,
  },
  berries: {
    name: 'Frozen berries', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 50, p: 1, c: 12, f: 0.3 }, gbp: 4, prep: 0, step: 25, cooked: 1,
  },
  orange_juice: {
    liquid: true,
    name: 'Orange juice', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 45, p: 0.7, c: 10, f: 0.2 }, gbp: 1.2, prep: 0, step: 50, cooked: 1,
  },
  pom_juice: {
    liquid: true,
    name: 'Pomegranate juice', cat: 'fruit', diet: null, avoid: [],
    per100: { kcal: 54, p: 0.15, c: 13, f: 0.3 }, gbp: 4, prep: 0, step: 50, cooked: 1,
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

/** First allowed food from a preference-ordered list. `cheapest` flips to lowest £/kg. */
export function pickFood(ids, eats, avoids, cheapest = false) {
  const ok = ids.filter(id => foodAllowed(id, eats, avoids))
  if (ok.length === 0) return null
  if (!cheapest) return ok[0]
  return ok.reduce((best, id) => (FOODS[id].gbp < FOODS[best].gbp ? id : best), ok[0])
}
