// OFF SZN programme — Ben Usher 8-week block
// Seeded once via useTemplates.js; never re-seeded after gwt_offszn_seeded is set.

function ex(id, name, sets, reps, weight, category, supersetId, restSeconds, notes, isCardio = false, exerciseType = 'weight') {
  return { id, name, sets, reps, weight, isCardio, supersetId, category, restSeconds, notes: notes ?? null, exerciseType }
}

function wu(id, name, reps, exerciseType, notes) {
  return ex(id, name, 1, reps, null, 'warmup', null, 0, notes ?? null, exerciseType === 'cardio', exerciseType)
}

// Exported so the migration in useTemplates.js can replace old single warm-up exercises.
export const SEED_WARMUPS = {
  'offszn-lower1': [
    wu('l1-wu-1', 'Single Leg Calf Raises',            15, 'bw',    'Per side'),
    wu('l1-wu-2', '90/90 Hip Switches',                10, 'bw',    null),
    wu('l1-wu-3', 'Hip Thrusts',                       10, 'bw',    null),
    wu('l1-wu-4', 'Single Leg RDLs',                    5, 'bw',    'Per side'),
    wu('l1-wu-5', 'Squats',                            10, 'bw',    null),
    wu('l1-wu-6', 'Side Lunges',                       10, 'bw',    'Per side'),
    wu('l1-wu-7', 'Split Squats',                      10, 'bw',    'Per side'),
  ],
  'offszn-upper1': [
    wu('u1-wu-1', 'Hang from Bar',                     30, 'hold',  '30 seconds'),
    wu('u1-wu-2', 'Half-Kneeling Thoracic Rotations',  10, 'bw',    'Per side'),
    wu('u1-wu-3', 'Prone T-Lifts',                     20, 'bw',    null),
    wu('u1-wu-4', 'Yoga Push-Ups',                     10, 'bw',    null),
    wu('u1-wu-5', '90/90 Shoulder Cable Rotation',     10, 'bw',    'Per arm'),
    wu('u1-wu-6', 'KB Overhead Press Bottoms-Up',      10, 'bw',    'Per side'),
    wu('u1-wu-7', 'Drop & Catch Push-Up Position',      5, 'bw',    null),
  ],
  'offszn-sprints': [
    wu('sp-wu-1', '2 Min Jog',                          2, 'cardio', null),
    wu('sp-wu-2', 'Squats',                            10, 'bw',    null),
    wu('sp-wu-3', 'Walking Lunges',                    10, 'bw',    null),
    wu('sp-wu-4', 'Single Leg RDL',                     5, 'bw',    'Per side'),
    wu('sp-wu-5', 'Side Lunge',                         5, 'bw',    'Per side'),
    wu('sp-wu-6', 'Leg Swings',                         5, 'bw',    'Per side — front/back + lateral'),
    wu('sp-wu-7', 'A-March',                           10, 'bw',    '10m'),
    wu('sp-wu-8', 'Single A-Switches',                 20, 'bw',    null),
    wu('sp-wu-9', 'Lateral Hop and Stick',             10, 'bw',    null),
  ],
  'offszn-lower2': [
    wu('l2-wu-1', 'Single Leg Calf Raises',            15, 'bw',    'Per side'),
    wu('l2-wu-2', '90/90 Hip Switches',                10, 'bw',    null),
    wu('l2-wu-3', 'Hip Thrusts',                       10, 'bw',    null),
    wu('l2-wu-4', 'Single Leg RDLs',                    5, 'bw',    'Per side'),
    wu('l2-wu-5', 'Squats',                            10, 'bw',    null),
    wu('l2-wu-6', 'Side Lunges',                       10, 'bw',    'Per side'),
    wu('l2-wu-7', 'Split Squats',                      10, 'bw',    'Per side'),
  ],
  'offszn-upper2': [
    wu('u2-wu-1', 'Hang from Bar',                     30, 'hold',  '30 seconds'),
    wu('u2-wu-2', 'Half-Kneeling Thoracic Rotations',  10, 'bw',    'Per side'),
    wu('u2-wu-3', 'Prone T-Lifts',                     20, 'bw',    null),
    wu('u2-wu-4', 'Yoga Push-Ups',                     10, 'bw',    null),
    wu('u2-wu-5', '90/90 Shoulder Cable Rotation',     10, 'bw',    'Per arm'),
    wu('u2-wu-6', 'KB Overhead Press Bottoms-Up',      10, 'bw',    'Per side'),
    wu('u2-wu-7', 'Drop & Catch Push-Up Position',      5, 'bw',    null),
  ],
  'offszn-norwegian': [
    wu('nw-wu-1', 'Warm-Up Cardio', 10, 'cardio', 'Easy effort — 60-65% max HR.'),
  ],
}

const OLD_WARMUP_IDS = new Set(['l1-wu', 'u1-wu', 'sp-wu', 'l2-wu', 'u2-wu'])

export const SEED_TEMPLATES = [
  // ─── Lower 1 (Monday) ───────────────────────────────────────────────────────
  {
    id: 'offszn-lower1',
    name: 'Lower 1 — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-lower1'],

      // Block A — circuit, 4 rounds no rest
      ex('l1-a1', 'Pogos',             4, 10, null, 'legs',  'l1-A', 60, 'Start 10 reps — add 2 reps/week. Circuit A: no rest between exercises or rounds (4 rounds).'),
      ex('l1-a2', 'Sprint Stance ISO', 4, 10, null, 'other', 'l1-A', 60, '10s each side. Start 10s — add 1s/week.'),
      ex('l1-a3', 'Hanging Leg Raises',4,  8, null, 'core',  'l1-A', 60, 'Start 8 reps — add 1 rep/week.'),

      // Block B
      ex('l1-b1', 'Trap Bar Jumps', 3, 3, null, 'legs', null, 120,
        'Start with empty trap bar. Add ~2.5kg every 2 weeks.'),

      // Block C — progressive overload main lift
      ex('l1-c1', 'Squat', 2, 12, null, 'legs', null, 180,
        '~60% 1RM to start, +5kg/week. Progression: Wk1 2×12 · Wk2 2×10 · Wk3 3×8 · Wk4 3×6 · Wk5 4×5 · Wk6 4×4 · Wk7 5×3 · Wk8 5×2'),

      // Block D
      ex('l1-d1', 'Romanian Deadlift', 3, 9, null, 'legs', null, 120,
        'Target RPE 8. Increase weight when you hit 10 reps; decrease if RPE drops below 8. (3 × 8–10)'),
    ],
  },

  // ─── Upper 1 (Tuesday) ──────────────────────────────────────────────────────
  {
    id: 'offszn-upper1',
    name: 'Upper 1 — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-upper1'],

      // Block A — circuit, 3 rounds no rest
      ex('u1-a1', 'Supine Med Ball Throws',  3, 3, null, 'other', 'u1-A', 60, '4kg med ball. Circuit A: no rest between exercises or rounds (3 rounds).'),
      ex('u1-a2', 'Slingshot Cable Rows',    3, 3, null, 'back',  'u1-A', 60, '3/side. Pull with intent — really drive it.'),
      ex('u1-a3', 'Cable Woodchops',         3, 8, null, 'core',  'u1-A', 60, '8/side.'),

      // Block B — progressive overload main lift
      ex('u1-b1', 'Horizontal Press', 2, 12, null, 'chest', null, 180,
        'BB Bench / Incline Press / Machine — pick one, keep for 8 weeks. ~60% 1RM, +5kg/week. Progression: Wk1 2×12 · Wk2 2×10 · Wk3 3×8 · Wk4 3×6 · Wk5 4×5 · Wk6 4×4 · Wk7 5×3 · Wk8 5×2'),

      // Block C
      ex('u1-c1', 'Vertical Pull',   4, 9,  null, 'back',      null, 90, 'Pull-Ups or Lat Pulldown — pick one, keep for 8 weeks. (4 × 8–10)'),
      ex('u1-c2', 'DB Cuban Press',  4, 11, null, 'shoulders', null, 90, 'Shoulder health. (4 × 10–12)'),

      // Block D — circuit, 4 rounds, rest 1:30 after each round
      ex('u1-d1', 'Biceps',     4, 10, null, 'arms', 'u1-D', 90, 'Your choice. 10/side. Circuit D: run D1–D3 × 4 rounds, rest 1:30 after each round.'),
      ex('u1-d2', 'Triceps',    4, 12, null, 'arms', 'u1-D', 90, 'Your choice.'),
      ex('u1-d3', 'Face Pulls', 4, 12, null, 'back', 'u1-D', 90, null),
    ],
  },

  // ─── Sprint Day (Wednesday) ──────────────────────────────────────────────────
  {
    id: 'offszn-sprints',
    name: 'Sprint Day — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-sprints'],

      // Block A — sprint prep circuit
      ex('sp-a1', 'Wall Drive',           3, 5,  null, 'other', 'sp-A', 90, '5/leg — add 1 rep every 2 weeks. Sprint prep circuit.'),
      ex('sp-a2', 'Staggered Pogos',      3, 20, null, 'legs',  'sp-A', 90, 'Start 20 reps — add 1 rep/week.'),
      ex('sp-a3', 'Single Broad Jumps',   3, 3,  null, 'legs',  'sp-A', 90, null),

      // Block B — acceleration
      ex('sp-b1', 'Kneeling 5m Acceleration (uphill)', 1, 6, null, 'other', null, 180,
        '6 reps. Kneeling start, sprint uphill. Full rest between reps.'),

      // Block C — COD + sprint
      ex('sp-c1', 'Side Shuffle 5m → Sprint 10m (uphill)', 1, 2, null, 'other', null, 180,
        '1 rep left + 1 rep right = 2 total. Add 2 reps (1/side) every 2 weeks.'),
    ],
  },

  // ─── Lower 2 (Friday) ───────────────────────────────────────────────────────
  {
    id: 'offszn-lower2',
    name: 'Lower 2 — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-lower2'],

      // Block A — circuit, 4 rounds no rest
      ex('l2-a1', 'Lateral Wall ISOs',       4, 10, null, 'legs', 'l2-A', 60, '10s each side. Circuit A: no rest between exercises or rounds (4 rounds).'),
      ex('l2-a2', 'Lunge Jump Switches',     4,  4, null, 'legs', 'l2-A', 60, '4/side. Really jump — get in the air.'),
      ex('l2-a3', 'Copenhagen Short Lever',  4, 10, null, 'legs', 'l2-A', 60, '10s each side — add 1s/week.'),

      // Block B
      ex('l2-b1', 'Banded Broad Jumps', 3, 3, null, 'legs', null, 120, null),

      // Block C — progressive overload main lift
      ex('l2-c1', 'Deadlift', 2, 12, null, 'legs', null, 180,
        'Trap bar recommended; hip thrusts if back issues. ~60% 1RM, +5kg/week. Progression: Wk1 2×12 · Wk2 2×10 · Wk3 3×8 · Wk4 3×6 · Wk5 4×5 · Wk6 4×4 · Wk7 5×3 · Wk8 5×2'),

      // Block D
      ex('l2-d1', 'Split Squats',    3, 9,  null, 'legs', null, 90, 'BB/DB or SL Leg Press. (3 × 8–10)'),
      ex('l2-d2', 'Hamstring Curls', 3, 11, null, 'legs', null, 90, '3 × 10–12.'),
    ],
  },

  // ─── Upper 2 (Saturday) ─────────────────────────────────────────────────────
  {
    id: 'offszn-upper2',
    name: 'Upper 2 — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-upper2'],

      // Block A — circuit
      ex('u2-a1', 'Plyometric Push-Ups',              3, 5, null, 'chest', 'u2-A', 60, 'Start 5 reps — add 1 rep every 2 weeks.'),
      ex('u2-a2', 'Overhead Rotate & Med Ball Slam',  3, 2, null, 'other', 'u2-A', 60, '4kg med ball. 2/side.'),
      ex('u2-a3', 'Quadruped Shoulder Touches',       3, 5, null, 'core',  'u2-A', 60, '5/side — add 1 rep/week.'),

      // Block B — progressive overload main lift
      ex('u2-b1', 'Shoulder Press', 2, 12, null, 'shoulders', null, 180,
        'Pick one variation, keep for 8 weeks. ~60% 1RM, +5kg/week. Progression: Wk1 2×12 · Wk2 2×10 · Wk3 3×8 · Wk4 3×6 · Wk5 4×5 · Wk6 4×4 · Wk7 5×3 · Wk8 5×2'),

      // Block C
      ex('u2-c1', 'Row Variation',  4, 9,  null, 'back',  null, 90, 'Your choice. (4 × 8–10)'),

      // Block D
      ex('u2-d1', 'Chest Flies',  4, 13, null, 'chest', null, 90, 'Your choice. (4 × 12–15)'),
      ex('u2-d2', 'DB Shrugs',    4, 12, null, 'back',  null, 90, null),

      // Block E — optional finisher
      ex('u2-e1', 'Biceps',    4, 13, null, 'arms',      null, 60, 'Your choice. Optional finisher. (4 × 12–15)'),
      ex('u2-e2', 'Triceps',   4, 13, null, 'arms',      null, 60, 'Your choice. Optional finisher. (4 × 12–15)'),
      ex('u2-e3', 'LU Raises', 4, 11, null, 'shoulders', null, 60, 'Optional finisher. (4 × 10–12)'),
    ],
  },

  // ─── Norwegian 4×4 (Thursday / any cardio day) ──────────────────────────────
  {
    id: 'offszn-norwegian',
    name: 'Norwegian 4×4 — Off Szn',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      ...SEED_WARMUPS['offszn-norwegian'],

      ex('nw-i1', 'Interval 1', 1, 4, null, null, null, 0,
        'Progression: Wk 1-2 → 3 intervals; Wk 3-6 → 4 intervals; Wk 7-8 → 5 intervals.\n4 min @ 85-95% max HR.',
        true, 'cardio'),
      ex('nw-r1', 'Active Recovery 1', 1, 3, null, null, null, 0,
        '3 min easy — 60-70% max HR.',
        true, 'cardio'),

      ex('nw-i2', 'Interval 2', 1, 4, null, null, null, 0,
        '4 min @ 85-95% max HR.',
        true, 'cardio'),
      ex('nw-r2', 'Active Recovery 2', 1, 3, null, null, null, 0,
        '3 min easy — 60-70% max HR.',
        true, 'cardio'),

      ex('nw-i3', 'Interval 3', 1, 4, null, null, null, 0,
        '4 min @ 85-95% max HR. Wk 1-2: this is your final interval.',
        true, 'cardio'),
      ex('nw-r3', 'Active Recovery 3', 1, 3, null, null, null, 0,
        '3 min easy — 60-70% max HR. Wk 1-2: skip interval 4 below.',
        true, 'cardio'),

      ex('nw-i4', 'Interval 4', 1, 4, null, null, null, 0,
        '4 min @ 85-95% max HR. Wk 1-2: skip. Wk 5-6: push to 90-95% HR. Wk 7-8: add a 5th interval + 3 min recovery after this.',
        true, 'cardio'),

      ex('nw-cd', 'Cool-Down', 1, 8, null, null, null, 0,
        '5-10 min easy effort — bring HR below 120 bpm.',
        true, 'cardio'),
    ],
  },

  // ─── Threshold Work (sustained pace conditioning) ───────────────────────────
  {
    id: 'threshold-work',
    name: 'Threshold Work',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    exercises: [
      wu('tw-wu-1', '5 Min Easy Warm-Up', 5, 'cardio', 'Easy jog, row, or cycle — 60-65% max HR. Build pace slightly in the final minute.'),

      ex('tw-intervals', 'Threshold Intervals', 6, 5, null, null, null, 60,
        'RPE 7–8 — strong, controlled pace. 5 min on / 1 min rest.\nHold a pace you can sustain across all rounds without significant drop-off. Each round should feel similar to the last — if pace drops >5%, end the session.\nRounds 4–8: start with 4 rounds; add 1 per week up to 8.',
        true, 'cardio'),

      ex('tw-cd', 'Cool-Down', 1, 5, null, null, null, 0,
        '5 min easy effort — bring HR below 130 bpm.',
        true, 'cardio'),
    ],
  },
]
