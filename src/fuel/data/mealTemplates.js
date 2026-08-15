// Meal templates.
//
// Each item is either scalable (role protein / carb / fat — the solver sizes it
// to hit that meal's macro target) or fixed (a set portion that just goes in).
// Option lists are preference-ordered; the builder takes the first one the
// athlete's food preferences and intolerances allow, so every list ends with a
// plant-based or allergen-free fallback and no filter combination can strand a meal.

export const MEAL_TEMPLATES = [
  // ── Breakfast ──────────────────────────────────────────────────────────────
  {
    id: 'oat_bowl', name: 'Protein Oats & Berries', slots: ['breakfast'], prep: 1,
    items: [
      { role: 'protein', options: ['greek_yog', 'whey', 'pea_protein', 'cottage'] },
      { role: 'carb', options: ['oats', 'gf_oats'] },
      { role: 'fat', options: ['peanut_butter', 'almonds'] },
      { role: 'fixed', food: 'berries', grams: 80 },
    ],
    note: 'Make it the night before if mornings are tight.',
  },
  {
    id: 'eggs_toast', name: 'Eggs, Toast & Avocado', slots: ['breakfast'], prep: 1,
    items: [
      { role: 'protein', options: ['eggs', 'tofu'] },
      { role: 'carb', options: ['wholemeal_bread', 'gf_bread'] },
      { role: 'fat', options: ['avocado', 'olive_oil'] },
      { role: 'fixed', food: 'spinach', grams: 50 },
    ],
  },
  {
    id: 'big_scramble', name: 'Scramble & Potato Hash', slots: ['breakfast'], prep: 2,
    items: [
      { role: 'protein', options: ['eggs', 'tofu'] },
      { role: 'carb', options: ['potato', 'sweet_potato'] },
      { role: 'fat', options: ['olive_oil', 'cheddar'] },
      { role: 'fixed', food: 'capsicum', grams: 80 },
    ],
  },
  {
    id: 'shake_banana', name: 'Shake, Banana & Nut Butter', slots: ['breakfast', 'snack'], prep: 0,
    items: [
      { role: 'protein', options: ['whey', 'pea_protein', 'greek_yog'] },
      { role: 'carb', options: ['banana', 'oats', 'gf_oats'] },
      { role: 'fat', options: ['peanut_butter', 'almonds'] },
    ],
    note: 'The fallback when you are out the door in five minutes.',
  },

  // ── Lunch & dinner ─────────────────────────────────────────────────────────
  {
    id: 'chicken_rice', name: 'Chicken & Rice Bowl', slots: ['lunch', 'dinner'], prep: 2,
    items: [
      { role: 'protein', options: ['chicken_breast', 'chicken_thigh', 'turkey_mince', 'tofu', 'tempeh'] },
      { role: 'carb', options: ['white_rice', 'basmati', 'quinoa'] },
      { role: 'fat', options: ['olive_oil', 'avocado'] },
      { role: 'veg', options: ['broccoli', 'mixed_veg'], grams: 150 },
    ],
    note: 'Cook the rice and protein in bulk — this is your batch meal.',
  },
  {
    id: 'steak_potato', name: 'Steak, Potato & Greens', slots: ['dinner'], prep: 2,
    items: [
      { role: 'protein', options: ['rump_steak', 'kangaroo', 'lamb_leg', 'chicken_thigh', 'tempeh'] },
      { role: 'carb', options: ['potato', 'sweet_potato'] },
      { role: 'fat', options: ['olive_oil'] },
      { role: 'veg', options: ['broccoli', 'mixed_veg'], grams: 180 },
    ],
  },
  {
    id: 'mince_pasta', name: 'Beef Mince Pasta', slots: ['lunch', 'dinner'], prep: 2,
    items: [
      { role: 'protein', options: ['beef_mince', 'turkey_mince', 'lentils', 'tofu'] },
      { role: 'carb', options: ['pasta', 'white_rice', 'quinoa'] },
      { role: 'fat', options: ['olive_oil', 'cheddar'] },
      { role: 'veg', options: ['mixed_veg', 'capsicum'], grams: 150 },
    ],
  },
  {
    id: 'salmon_sweet', name: 'Salmon & Sweet Potato', slots: ['lunch', 'dinner'], prep: 2,
    items: [
      { role: 'protein', options: ['salmon', 'white_fish', 'chicken_breast', 'tofu'] },
      { role: 'carb', options: ['sweet_potato', 'basmati', 'quinoa'] },
      { role: 'fat', options: ['olive_oil'] },
      { role: 'veg', options: ['broccoli', 'spinach'], grams: 150 },
    ],
    note: 'Oily fish twice a week does more for recovery than any supplement.',
  },
  {
    id: 'tuna_sandwich', name: 'Tuna Sandwich & Fruit', slots: ['lunch'], prep: 0,
    items: [
      { role: 'protein', options: ['tuna_tin', 'chicken_breast', 'eggs', 'chickpeas'] },
      { role: 'carb', options: ['wholemeal_bread', 'gf_bread', 'rice_cakes'] },
      { role: 'fat', options: ['avocado', 'olive_oil'] },
      { role: 'fixed', food: 'carrot', grams: 80 },
    ],
    note: 'The no-kitchen option — build it the night before.',
  },
  {
    id: 'stirfry', name: 'Stir Fry & Rice', slots: ['lunch', 'dinner'], prep: 2,
    items: [
      { role: 'protein', options: ['chicken_thigh', 'prawns', 'beef_mince', 'tofu', 'tempeh'] },
      { role: 'carb', options: ['white_rice', 'basmati'] },
      { role: 'fat', options: ['olive_oil', 'almonds'] },
      { role: 'veg', options: ['mixed_veg', 'capsicum', 'broccoli'], grams: 200 },
    ],
  },
  {
    id: 'quick_bowl', name: 'Fast Protein & Rice', slots: ['lunch', 'dinner'], prep: 1,
    items: [
      { role: 'protein', options: ['tuna_tin', 'chicken_breast', 'eggs', 'chickpeas', 'tofu'] },
      { role: 'carb', options: ['white_rice', 'basmati', 'rice_cakes'] },
      { role: 'fat', options: ['avocado', 'olive_oil'] },
      { role: 'veg', options: ['spinach', 'mixed_veg'], grams: 120 },
    ],
  },

  // ── Snacks ─────────────────────────────────────────────────────────────────
  {
    id: 'yog_honey', name: 'Yoghurt, Honey & Almonds', slots: ['snack'], prep: 0,
    items: [
      { role: 'protein', options: ['greek_yog', 'cottage', 'whey', 'pea_protein'] },
      { role: 'carb', options: ['honey', 'maple', 'banana'] },
      { role: 'fat', options: ['almonds', 'peanut_butter'] },
    ],
  },
  {
    id: 'pb_cakes', name: 'Nut Butter Rice Cakes', slots: ['snack'], prep: 0,
    items: [
      { role: 'protein', options: ['whey', 'pea_protein', 'greek_yog'] },
      { role: 'carb', options: ['rice_cakes', 'wholemeal_bread', 'gf_bread'] },
      { role: 'fat', options: ['peanut_butter', 'almonds'] },
      { role: 'fixed', food: 'banana', grams: 60 },
    ],
  },
  {
    id: 'cottage_fruit', name: 'Cottage Cheese & Fruit', slots: ['snack'], prep: 0,
    items: [
      { role: 'protein', options: ['cottage', 'greek_yog', 'whey', 'pea_protein'] },
      { role: 'carb', options: ['banana', 'honey', 'oats', 'gf_oats'] },
      { role: 'fat', options: ['almonds', 'peanut_butter'] },
      { role: 'fixed', food: 'berries', grams: 80 },
    ],
    note: 'Slow-digesting protein — the best of the snacks before bed.',
  },

  // ── Pre-training — high carb, low fat and fibre so it clears the gut ───────
  {
    id: 'pre_banana', name: 'Banana, Honey & Rice Cakes', slots: ['prefuel'], prep: 0,
    items: [
      { role: 'carb', options: ['rice_cakes', 'wholemeal_bread', 'gf_bread'] },
      { role: 'protein', options: ['whey', 'pea_protein', 'greek_yog'] },
      { role: 'fixed', food: 'banana', grams: 120 },
    ],
    note: 'Low fat and low fibre on purpose — this needs to be out of your stomach by kickoff.',
  },
  {
    id: 'pre_oj', name: 'Juice & Toast', slots: ['prefuel'], prep: 0,
    items: [
      { role: 'carb', options: ['wholemeal_bread', 'gf_bread', 'rice_cakes'] },
      { role: 'protein', options: ['whey', 'pea_protein', 'greek_yog'] },
      { role: 'fixed', food: 'orange_juice', grams: 250 },
    ],
  },
  {
    id: 'pre_rice', name: 'White Rice & Lean Protein', slots: ['prefuel'], prep: 1,
    items: [
      { role: 'carb', options: ['white_rice', 'basmati'] },
      { role: 'protein', options: ['chicken_breast', 'tuna_tin', 'eggs', 'tofu'] },
    ],
  },

  // ── Post-training — fast carbs plus protein, fat kept out of the way ──────
  {
    id: 'post_shake', name: 'Shake, Banana & Honey', slots: ['post'], prep: 0,
    items: [
      { role: 'protein', options: ['whey', 'pea_protein', 'greek_yog'] },
      { role: 'carb', options: ['banana', 'honey', 'maple', 'oats'] },
    ],
    note: 'Get this in within 45 minutes. Liquid goes down when appetite has not returned yet.',
  },
  {
    id: 'post_chicken_rice', name: 'Chicken & White Rice', slots: ['post'], prep: 1,
    items: [
      { role: 'protein', options: ['chicken_breast', 'turkey_mince', 'tuna_tin', 'tofu'] },
      { role: 'carb', options: ['white_rice', 'basmati'] },
      { role: 'veg', options: ['mixed_veg', 'spinach'], grams: 100 },
    ],
  },
  {
    id: 'post_yog', name: 'Yoghurt, Berries & Honey', slots: ['post'], prep: 0,
    items: [
      { role: 'protein', options: ['greek_yog', 'whey', 'pea_protein', 'cottage'] },
      { role: 'carb', options: ['honey', 'banana', 'oats', 'gf_oats'] },
      { role: 'fixed', food: 'berries', grams: 100 },
    ],
  },
]
