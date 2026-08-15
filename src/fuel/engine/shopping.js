import { FOODS, foodAllowed } from '../data/foods'

const CAT_ORDER = ['protein', 'carb', 'fat', 'veg', 'fruit']
const CAT_LABEL = {
  protein: 'Protein', carb: 'Carbs', fat: 'Fats & Oils',
  veg: 'Vegetables', fruit: 'Fruit & Juice',
}

/**
 * Roll the rotating day plan up into one week of shopping.
 * The plan covers three days, so each food's daily average is scaled to seven.
 *
 * Quantities are always as-sold — raw meat and fish, dry rice and pasta — because
 * that is what you put in the trolley, regardless of how the meal plan is being
 * displayed. Same convention as the 7-day diary.
 */
export function buildShoppingList(plan) {
  const grams = {}
  plan.forEach(day => {
    day.meals.forEach(meal => {
      meal.entries.forEach(e => {
        grams[e.food] = (grams[e.food] || 0) + e.grams
      })
    })
  })

  const scale = 7 / plan.length
  const items = Object.entries(grams)
    .map(([food, g]) => {
      const weekly = g * scale
      return {
        food,
        name: FOODS[food].name,
        cat: FOODS[food].cat,
        grams: weekly,
        cost: (weekly / 1000) * FOODS[food].gbp,
      }
    })
    .sort((a, b) => b.cost - a.cost)

  const total = items.reduce((s, i) => s + i.cost, 0)

  const groups = CAT_ORDER.map(cat => ({
    cat,
    label: CAT_LABEL[cat],
    items: items.filter(i => i.cat === cat),
  })).filter(g => g.items.length > 0)

  return { items, groups, total, perDay: total / 7 }
}

/**
 * Cheaper like-for-like alternatives, ranked by what they actually save per week.
 * A swap only qualifies if it stays in the same category and keeps the macro that
 * made the food useful in the first place within 40% — so chicken can replace
 * steak, but rice cannot replace salmon.
 */
export function cheaperSwaps(shopping, eats, avoids) {
  const KEY_MACRO = { protein: 'p', carb: 'c', fat: 'f', veg: 'c', fruit: 'c' }

  const swaps = shopping.items
    .filter(item => !FOODS[item.food].noSwap)
    .map(item => {
      const cur = FOODS[item.food]
      const key = KEY_MACRO[cur.cat]
      const target = cur.per100[key]

      const alt = Object.keys(FOODS)
        .filter(id => id !== item.food)
        .filter(id => FOODS[id].cat === cur.cat)
        .filter(id => FOODS[id].gbp < cur.gbp)
        .filter(id => foodAllowed(id, eats, avoids))
        // Saving money by replacing whole fruit with juice is a bad trade even
        // when the carbohydrate matches, so juices are never a swap target.
        .filter(id => !FOODS[id].liquid || cur.liquid)
        // Nor is replacing a grab-and-go item with something that needs cooking.
        // A protein bar and a raw chicken thigh are not the same purchase.
        .filter(id => FOODS[id].prep <= cur.prep)
        .filter(id => target === 0 || Math.abs(FOODS[id].per100[key] - target) / target <= 0.4)
        .sort((a, b) => FOODS[a].gbp - FOODS[b].gbp)[0]

      if (!alt) return null
      const saving = (item.grams / 1000) * (cur.gbp - FOODS[alt].gbp)
      if (saving < 1) return null
      return { from: item.food, fromName: cur.name, to: alt, toName: FOODS[alt].name, saving }
    })
    .filter(Boolean)
    .sort((a, b) => b.saving - a.saving)

  return swaps.slice(0, 5)
}

export function budgetStatus(total, budget) {
  if (!budget || budget <= 0) return null
  const diff = budget - total
  return {
    budget,
    diff,
    over: diff < 0,
    pct: Math.round((total / budget) * 100),
  }
}
