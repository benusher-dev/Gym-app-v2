// Static content for the Training and Pre-Workout tabs.
//
// Block types the renderer understands:
//   text     — a paragraph
//   note     — highlighted callout
//   list     — bullets, optionally with a bold lead-in via { k, v }
//   timeline — a labelled sequence (time before kickoff, phase of a week, etc.)

export const TRAINING = {
  title: 'Train For Rugby',
  blurb:
    'Rugby asks for size that can still sprint at eighty minutes. The lifting builds ' +
    'the frame, the sprinting keeps it fast, and the conditioning makes sure neither ' +
    'disappears in the last quarter.',
  sections: [
    {
      label: 'Weekly Structure',
      heading: 'How the week fits together',
      blocks: [
        {
          type: 'timeline',
          items: [
            { when: '2x / week', what: 'Two full-body strength sessions', detail: 'Every session covers a squat, a hinge, a push and a pull. Nothing gets skipped because there is nowhere to skip it to.' },
            { when: '3–4x / week', what: 'Two strength, one speed, one conditioning', detail: 'Split upper and lower once you have two lifting days that are not fighting each other for recovery.' },
            { when: '5–6x / week', what: 'Three strength, two speed, one conditioning', detail: 'Upper, lower and full body. Sprint work goes on its own day or immediately before lifting — never after.' },
            { when: 'Daily / pre-season', what: 'Four strength plus speed, conditioning and skills', detail: 'This only works with the food and sleep to match. Volume without recovery is just accumulated fatigue.' },
          ],
        },
        {
          type: 'note',
          body: 'Hard days hard, easy days easy. The most common mistake is a week of moderate sessions that are too heavy to recover from and too light to drive an adaptation.',
        },
      ],
    },
    {
      label: 'The Lifts',
      heading: 'What actually earns its place',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Trap bar deadlift or back squat', v: 'The base of lower-body force. Everything in a collision traces back to how much force you put into the ground.' },
            { k: 'Bench press or weighted dip', v: 'Contact strength through the chest and triceps — fending, cleaning out, holding a scrum.' },
            { k: 'Chin-up and barbell row', v: 'Pull volume keeps shoulders healthy under a season of tackling. Match or beat your pressing volume.' },
            { k: 'Romanian deadlift and hip thrust', v: 'Posterior chain drives top speed. Sprinters are built at the back, not the front.' },
            { k: 'Nordic hamstring curl', v: 'The highest-value single exercise in rugby. Consistent use roughly halves hamstring injury rates — and hamstrings are the injury that costs the most weeks.' },
            { k: 'Farmer and suitcase carries', v: 'Trunk stiffness under load. Carries transfer to staying upright in contact better than any floor-based core work.' },
          ],
        },
      ],
    },
    {
      label: 'Speed & Power',
      heading: 'You cannot get fast running at 80%',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Sprint properly once a week', v: '6–10 efforts over 20–40 m at 95–100%, with two to four minutes between. Full recovery is the point, not a luxury.' },
            { k: 'Jumps and throws go first', v: 'Put explosive work at the front of a session while the nervous system is fresh. After the lifting it is just tired jumping.' },
            { k: 'Heavy sled pushes', v: 'Build the acceleration phase — the first ten metres that decide most line breaks.' },
            { k: 'Exposure protects you', v: 'Most hamstring injuries happen at high speed. Regular high-speed running is how the tissue learns to tolerate it.' },
          ],
        },
      ],
    },
    {
      label: 'Conditioning',
      heading: 'Fit for the eightieth minute',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Repeat sprint ability', v: '10 × 40 m leaving every 30 seconds. This is the quality the game actually tests — how good the tenth sprint is, not the first.' },
            { k: 'Extensive intervals', v: '4 × 4 minutes at 85–90% of max heart rate, three minutes easy between. Raises the aerobic ceiling that everything else recovers under.' },
            { k: 'Keep some of it off the feet', v: 'Bike or rower when lifting and running volume is already high. The heart does not know the difference; your joints do.' },
          ],
        },
      ],
    },
    {
      label: 'Progression',
      heading: 'Where you start depends on your training age',
      blocks: [
        {
          type: 'timeline',
          items: [
            { when: 'Never trained', what: 'Eight to twelve weeks of technique', detail: 'Three sets of eight to ten, adding a little load each week. Progress comes almost for free here — do not waste it on complicated programming.' },
            { when: 'Under 3 years', what: 'Heavier main lifts', detail: 'Four to six sets of three to six reps on the primary lifts, eight to twelve on accessories. Track the numbers or you are guessing.' },
            { when: '3+ years', what: 'Blocks with a peak', detail: 'Alternate accumulation and intensification, and time the peak into the season rather than into the off-season.' },
          ],
        },
        {
          type: 'note',
          body: 'Deload every four to six weeks — halve the volume, keep the intensity. Adaptation happens in the recovery, not in the session.',
        },
      ],
    },
    {
      label: 'Recovery',
      heading: 'The part nobody posts about',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Seven to nine hours of sleep', v: 'The single biggest performance lever available, and the cheapest. Nothing in this app matters as much.' },
            { k: 'Protein across four or five feeds', v: 'Spread beats stacking. Roughly 0.4 g/kg per feed keeps muscle protein synthesis topped up through the day.' },
            { k: 'Eat most on the hardest days', v: 'Calories should follow training load. A rest-day appetite on a double-session day is how people stall.' },
          ],
        },
      ],
    },
  ],
}

export const PREWORKOUT = {
  title: 'Pre-Workout & Game Day',
  blurb:
    'What you eat in the four hours before kickoff will not make you fitter, but ' +
    'getting it wrong will absolutely make you slower. Here is the timing that works.',
  sections: [
    {
      label: 'The Timeline',
      heading: 'Fuelling into a session or a match',
      blocks: [
        {
          type: 'timeline',
          items: [
            { when: '3–4 h before', what: 'Full meal', detail: '1–2 g of carbohydrate per kg with moderate protein. Keep fat and fibre low — both slow gastric emptying and sit heavy through a warm-up.' },
            { when: '90 min before', what: 'Top-up', detail: 'Around 0.5 g/kg of fast carbohydrate. Banana with honey, white toast and jam, or rice cakes.' },
            { when: '30–45 min before', what: 'Liquid carbs and caffeine', detail: '250 ml orange juice with a tablespoon of honey. If you use caffeine, take it here — 3–6 mg/kg.' },
            { when: 'During, past 60 min', what: '30–60 g carbs per hour', detail: 'A carbohydrate drink is easier than food when your heart rate is high. Add electrolytes in heat.' },
            { when: 'Within 45 min after', what: 'Protein and fast carbs', detail: '0.4 g/kg protein with around 1 g/kg carbohydrate. Liquid works best while appetite is still switched off.' },
            { when: '2 h after', what: 'Full meal', detail: 'The real recovery feed. Protein, a large carbohydrate serve, and now the fat and vegetables you kept out earlier.' },
          ],
        },
      ],
    },
    {
      label: 'Game Day',
      heading: 'Worked example — 3pm kickoff',
      blocks: [
        {
          type: 'timeline',
          items: [
            { when: '7:00', what: 'Wake', detail: '500 ml water with electrolytes before anything else. You are already down a litre from overnight.' },
            { when: '8:00', what: 'Breakfast', detail: 'Your biggest carbohydrate meal of the day. Oats, honey, banana, eggs or yoghurt.' },
            { when: '11:30', what: 'Pre-match meal', detail: 'Roughly 2 g/kg carbohydrate. Chicken and white rice is the standard for a reason — low fat, low fibre, clears the gut in time.' },
            { when: '13:30', what: 'Top-up', detail: 'Banana, rice cakes and honey. Small, sweet, and gone by kickoff.' },
            { when: '14:15', what: 'Nitrates and caffeine', detail: 'Pomegranate or beetroot concentrate, plus caffeine if you use it.' },
            { when: '14:45', what: 'Final sip', detail: '200 ml water. Enough to arrive hydrated, not enough to slosh.' },
            { when: 'Half time', what: '30 g carbohydrate', detail: 'A sports drink or a gel with water. The second half is where fuelling shows up.' },
            { when: 'Full time +30 min', what: 'Shake and fast carbs', detail: 'Do not wait for the changing room to clear. This window is real, even if it is wider than people claim.' },
            { when: 'Full time +2 h', what: 'Full meal', detail: 'Protein, carbohydrate, salt and fluid. Weigh yourself — every kilo lost needs about 1.5 litres back.' },
          ],
        },
      ],
    },
    {
      label: 'Nitrates',
      heading: 'Pomegranate and beetroot juice',
      blocks: [
        {
          type: 'text',
          body:
            'Dietary nitrate widens blood vessels and lowers the oxygen cost of hard efforts. ' +
            'The effect is small but real, and it shows up most in exactly what rugby demands — ' +
            'repeated high-intensity efforts with short recovery.',
        },
        {
          type: 'list',
          items: [
            { k: 'Dose', v: '500 ml of juice or one concentrate shot, 2–3 hours before kickoff.' },
            { k: 'Load it, do not spot-use it', v: 'Three to six days of daily intake beats a single dose on game day.' },
            { k: 'Skip antibacterial mouthwash', v: 'The bacteria in your mouth convert nitrate to nitrite. Kill them and you throw away the benefit.' },
          ],
        },
      ],
    },
    {
      label: 'The OJ & Honey Hit',
      heading: 'Why this specific combination',
      blocks: [
        {
          type: 'text',
          body:
            '250 ml of orange juice with one to two tablespoons of honey gives roughly 50–60 g ' +
            'of carbohydrate that hits the bloodstream fast. It works because it pairs glucose ' +
            'with fructose, and the two use separate intestinal transporters — together they ' +
            'absorb faster than the same amount of either one alone.',
        },
        {
          type: 'note',
          body: 'Take it 30–45 minutes out. Any closer and you are still absorbing it during the warm-up.',
        },
      ],
    },
    {
      label: 'Hydration',
      heading: 'Fluid and salt',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Baseline', v: '35–40 ml per kg of bodyweight per day, before you add training losses.' },
            { k: 'Before', v: '500 ml two hours out, then 200–300 ml twenty minutes out.' },
            { k: 'After', v: 'Weigh in and out. Every kilogram lost needs about 1.5 litres to replace it properly.' },
            { k: 'Sodium', v: '300–700 mg per litre in heat or if you finish sessions crusted in salt. Water alone will not hold.' },
          ],
        },
      ],
    },
    {
      label: 'Supplements',
      heading: 'The short list that survives scrutiny',
      blocks: [
        {
          type: 'list',
          items: [
            { k: 'Creatine monohydrate', v: '5 g every day, timing irrelevant. The best-evidenced supplement in sport for power and repeat efforts, and the cheapest.' },
            { k: 'Caffeine', v: '3–6 mg/kg, 45–60 minutes before. Reliable for both power output and how hard the session feels.' },
            { k: 'Beta-alanine', v: '3–6 g daily, taken consistently. Buffers the burn in repeated high-intensity efforts. The tingling is harmless.' },
            { k: 'Whey protein', v: 'Convenience, not magic. Useful when whole food is impractical, which after training it usually is.' },
          ],
        },
        {
          type: 'note',
          body: 'Everything past this list is noise until the food, sleep and training are already in order. Supplements are the last few per cent, not the first.',
        },
      ],
    },
  ],
}
