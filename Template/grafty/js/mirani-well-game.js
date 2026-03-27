/**
 * Mirani Well — Elemental Healing Game
 * Developed by StynerDev (Kishana Stiner)
 *
 * localStorage-based game state for the Duolingo-style
 * elemental healing journey. No backend required.
 */

(function () {
  'use strict';

  // ── Default game state ──
  var DEFAULT_STATE = {
    user: null,
    streak: 0,
    xp: 0,
    level: 1,
    completedRituals: 0,
    lastPlayed: null,
    paths: {
      earth: [false, false, false, false],
      water: [false, false, false, false],
      fire: [false, false, false, false],
      air: [false, false, false, false]
    }
  };

  var ELEMENT_ORDER = ['earth', 'water', 'fire', 'air'];

  var ELEMENT_COLORS = {
    earth: '#FFE5BB',
    water: '#D3E4FF',
    fire: '#FFBCF1',
    air: '#CFFFD7'
  };

  var AFFIRMATIONS = {
    earth: 'You are rooted in purpose.',
    water: 'Let it flow through you. You are allowed to release.',
    fire: 'Your spark is sacred. Let it glow again.',
    air: 'You are light enough to rise again.'
  };

  // ── Medal images for gamification ──
  var MEDALS = {
    complete: 'images/medals/medal-gold-ribbon.png',      // ritual completion reward
    perfect: 'images/medals/medal-gold-sun.png',           // perfect score (no hearts lost)
    nodeDone: 'images/medals/medal-purple-circle.png',     // completed path node
    quizCorrect: 'images/medals/medal-purple-sun.png',     // quiz streak
    pathBadge: 'images/medals/medal-purple-ribbon.png',    // element path badge
    activeNode: 'images/medals/medal-gold-circle.png'      // active node on path
  };

  // ── Gaming path decorative icons (from gaming-paths-main) ──
  var PATH_ICONS = [
    'images/gaming-paths-main/path-decore-images/021-navigation.png',
    'images/gaming-paths-main/path-decore-images/024-gps.png',
    'images/gaming-paths-main/path-decore-images/025-navigation.png',
    'images/gaming-paths-main/path-decore-images/026-direction.png',
    'images/gaming-paths-main/path-decore-images/027-direction.png',
    'images/gaming-paths-main/path-decore-images/022-satellite.png',
    'images/gaming-paths-main/path-decore-images/023-globe.png',
    'images/gaming-paths-main/path-decore-images/028-highway.png',
    'images/gaming-paths-main/path-decore-images/029-highway sign.png',
    'images/gaming-paths-main/path-decore-images/030-traffic lights.png'
  ];

  // Helper to resolve asset path from any page depth
  function medalPath(key, depth) {
    var prefix = '';
    for (var i = 0; i < (depth || 0); i++) prefix += '../';
    return prefix + MEDALS[key];
  }

  function assetPath(relativePath, depth) {
    var prefix = '';
    for (var i = 0; i < (depth || 0); i++) prefix += '../';
    return prefix + relativePath;
  }

  // ── Illustration scenes for each ritual (maps to self-care-illustrations) ──
  var RITUAL_SCENES = {
    earth: [
      'images/assets/mirani-well-illustrations/self-care-illustrations/008-breathing.png',   // Grounding Breath
      'images/assets/mirani-well-illustrations/self-care-illustrations/003-meditation.png',   // Root Visualization
      'images/assets/mirani-well-illustrations/self-care-illustrations/010-flower.png',       // Soil Ritual
      'images/assets/mirani-well-illustrations/self-care-illustrations/015-peace.png'         // Forest Sanctuary
    ],
    water: [
      'images/assets/mirani-well-illustrations/self-care-illustrations/001-water.png',        // Wave Release
      'images/assets/mirani-well-illustrations/self-care-illustrations/007-calm.png',         // River Meditation
      'images/assets/mirani-well-illustrations/self-care-illustrations/016-sleep.png',        // Ocean Immersion
      'images/assets/mirani-well-illustrations/self-care-illustrations/020-love-yourself.png' // Tidal Affirmation
    ],
    fire: [
      'images/assets/mirani-well-illustrations/self-care-illustrations/019-heart.png',        // Spark Activation
      'images/assets/mirani-well-illustrations/self-care-illustrations/006-journaling.png',   // Ember Journaling
      'images/assets/mirani-well-illustrations/self-care-illustrations/009-sun.png',          // Flame Ceremony
      'images/assets/mirani-well-illustrations/self-care-illustrations/014-self%20care.png'   // Renewal Ritual
    ],
    air: [
      'images/assets/mirani-well-illustrations/self-care-illustrations/013-flowers.png',      // Breath of Sky
      'images/assets/mirani-well-illustrations/self-care-illustrations/011-music.png',        // Cloud Gazing
      'images/assets/mirani-well-illustrations/self-care-illustrations/005-facial%20mask.png', // Wind Affirmation
      'images/assets/mirani-well-illustrations/self-care-illustrations/002-self%20care.png'   // Ascension Journey
    ]
  };


  // ── Ritual step content for each node ──
  var RITUALS = {
    earth: [
      {
        name: 'Grounding Breath',
        xp: 10,
        steps: [
          { type: 'intro', title: 'Grounding Breath', text: 'This practice will anchor you to the present moment. Find a comfortable position. You may sit or stand.' },
          { type: 'breathe', title: 'Settle In', text: 'Close your eyes gently. Feel your feet pressing against the ground beneath you. Notice the weight of your body.' },
          { type: 'breathe', title: 'Breathe In', text: 'Inhale slowly through your nose for 4 counts. Feel your chest and belly expand. You are drawing in steadiness.' },
          { type: 'breathe', title: 'Hold', text: 'Hold your breath for 4 counts. In this pause, you are still. You are present. You are here.' },
          { type: 'breathe', title: 'Release', text: 'Exhale slowly through your mouth for 6 counts. Let the tension leave your shoulders, your jaw, your hands.' },
          { type: 'repeat', title: 'Again', text: 'Repeat this cycle two more times. Inhale for 4. Hold for 4. Exhale for 6. There is no rush.' },
          { type: 'reflect', title: 'Reflection', text: 'How do you feel now compared to when you started? Notice any shifts — even small ones. They matter.' },
          { type: 'affirmation', title: 'Affirmation', text: 'Say quietly to yourself: "I am grounded. I am steady. I am rooted in this moment."' },
          { type: 'complete', title: 'Ritual Complete', text: 'You have completed Grounding Breath. The earth holds you. Return whenever you need steadiness.' }
        ]
      },
      {
        name: 'Root Visualization',
        xp: 15,
        steps: [
          { type: 'intro', title: 'Root Visualization', text: 'In this practice, you will imagine roots extending from your body deep into the earth. Find a quiet moment.' },
          { type: 'breathe', title: 'Ground Yourself', text: 'Take three slow breaths. Feel gravity. Feel the surface beneath you supporting your weight completely.' },
          { type: 'visualize', title: 'See the Roots', text: 'Imagine roots growing from the base of your spine, through your legs, through the soles of your feet, deep into the soil below.' },
          { type: 'visualize', title: 'Deeper', text: 'The roots travel through layers of earth — past stones, through clay, into warm, dark soil. They anchor you to something ancient.' },
          { type: 'visualize', title: 'Draw Strength', text: 'Through these roots, feel the earth sending you steadiness. Warmth rises through your body. You are supported.' },
          { type: 'reflect', title: 'Reflection', text: 'What does it feel like to be held by something larger than yourself? Sit with that feeling for a moment.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I am connected to the ground beneath me. I draw strength from the earth. I am held."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Root Visualization is complete. You carry this connection with you, even when you rise and walk away.' }
        ]
      },
      {
        name: 'Soil Ritual',
        xp: 20,
        steps: [
          { type: 'intro', title: 'Soil Ritual', text: 'This practice reconnects you to the natural world through touch and gratitude. If possible, touch something natural — a plant, wood, stone.' },
          { type: 'action', title: 'Touch the Earth', text: 'Place your hands on a natural surface. A houseplant, a wooden table, a stone, the ground itself. Feel its texture.' },
          { type: 'action', title: 'Notice', text: 'What do you feel? Temperature, texture, weight. There is no right answer. Just notice what your hands tell you.' },
          { type: 'reflect', title: 'Three Gifts', text: 'Name three things you are grateful the earth gives you. They can be simple — food, shade, the ground you walk on.' },
          { type: 'reflect', title: 'Receive', text: 'The earth gives without asking. Let yourself receive today. You do not need to earn rest. You do not need to earn peace.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I am grateful for what sustains me. I receive with open hands. I am part of this earth."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Soil Ritual is complete. The earth has always been here for you. You can return to it anytime.' }
        ]
      },
      {
        name: 'Forest Sanctuary',
        xp: 30,
        steps: [
          { type: 'intro', title: 'Forest Sanctuary', text: 'This is the deepest Earth practice. You will create a place of safety in your mind — a forest clearing that belongs only to you.' },
          { type: 'breathe', title: 'Arrive', text: 'Close your eyes. Take five slow breaths. With each exhale, let the world around you soften and fade.' },
          { type: 'visualize', title: 'The Path', text: 'You are walking along a quiet forest path. Tall trees surround you. Sunlight filters through the leaves in soft, golden patches.' },
          { type: 'visualize', title: 'The Clearing', text: 'The path opens into a small clearing. Moss covers the ground. The air smells of earth and rain. This place is yours.' },
          { type: 'visualize', title: 'Sit Down', text: 'Find a place to sit in your clearing. Feel the soft ground beneath you. The forest is quiet. You are safe here.' },
          { type: 'breathe', title: 'Two Minutes of Stillness', text: 'Spend two minutes here in stillness. Let the ground hold your weight. You do not need to think. You do not need to do. Just be.' },
          { type: 'reflect', title: 'What Did You Find?', text: 'In the stillness, what did you notice? A feeling, a memory, a sense of quiet? Whatever it was, it is valid.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I have a place of peace within me. I can return here whenever I need to rest. The earth holds me."' },
          { type: 'complete', title: 'Earth Path Complete', text: 'You have completed every ritual on the Earth Path. You have earned deep grounding. The Water Path now awaits you.' }
        ]
      }
    ],
    water: [
      {
        name: 'Wave Release',
        xp: 10,
        steps: [
          { type: 'intro', title: 'Wave Release', text: 'Water teaches us to let go. In this practice, you will use your breath and imagination to release what you no longer need.' },
          { type: 'breathe', title: 'Settle', text: 'Breathe in slowly. As you exhale, soften your shoulders. Let your hands rest open on your lap or by your sides.' },
          { type: 'visualize', title: 'The Shore', text: 'Imagine yourself standing at the edge of a calm ocean. The water is warm. Gentle waves lap at your feet.' },
          { type: 'action', title: 'Name It', text: 'Think of one thing you are carrying that feels heavy. A worry, a frustration, an expectation. You do not need to solve it. Just name it.' },
          { type: 'breathe', title: 'Release', text: 'On your next exhale, imagine that wave pulling the heaviness from your feet, carrying it out to sea. Watch it dissolve in the water.' },
          { type: 'repeat', title: 'Again', text: 'If you wish, name another weight. Let another wave take it. The ocean is vast enough to hold it all.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I release what is not mine to carry. I am fluid. I am allowed to let go."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Wave Release is complete. The water does not judge what you give it. It simply carries it away.' }
        ]
      },
      {
        name: 'River Meditation',
        xp: 15,
        steps: [
          { type: 'intro', title: 'River Meditation', text: 'Thoughts come and go like leaves on a river. This practice helps you observe without clinging.' },
          { type: 'breathe', title: 'Arrive at the River', text: 'Close your eyes. Imagine you are sitting beside a gentle river. The water moves steadily, unhurried.' },
          { type: 'visualize', title: 'Leaves on Water', text: 'Each thought that arises — a plan, a worry, a memory — place it gently on a leaf and set it on the water. Watch it drift.' },
          { type: 'visualize', title: 'Let Them Go', text: 'Do not follow the leaves downstream. Simply watch them pass. Some will circle back. Place them on the water again.' },
          { type: 'breathe', title: 'Stay Here', text: 'Spend a minute just watching. You are not the thoughts. You are the one sitting by the river.' },
          { type: 'reflect', title: 'Reflection', text: 'What was the hardest thought to place on a leaf? That is often where the healing is needed most.' },
          { type: 'affirmation', title: 'Affirmation', text: '"My thoughts pass through me. I am the stillness beneath them. I flow."' },
          { type: 'complete', title: 'Ritual Complete', text: 'River Meditation is complete. You can always return to the riverbank.' }
        ]
      },
      {
        name: 'Ocean Immersion',
        xp: 20,
        steps: [
          { type: 'intro', title: 'Ocean Immersion', text: 'You are vast like the sea. This practice helps you hold all of your emotions without being overwhelmed by any one wave.' },
          { type: 'breathe', title: 'Become the Ocean', text: 'Close your eyes. You are no longer beside the water. You are the ocean itself — deep, wide, immeasurable.' },
          { type: 'visualize', title: 'Waves Rise', text: 'Emotions are waves on your surface. Some are gentle. Some are large. But the deep water beneath is always calm.' },
          { type: 'visualize', title: 'Hold It All', text: 'You can hold joy and grief at the same time. You can hold exhaustion and hope. You are large enough for all of it.' },
          { type: 'breathe', title: 'The Depths', text: 'Breathe into the deepest part of yourself. There is stillness there that no storm can reach.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I am the ocean. My feelings are waves — they rise, they pass, they return to calm. I hold it all."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Ocean Immersion is complete. Remember: the surface may churn, but your depths are still.' }
        ]
      },
      {
        name: 'Tidal Affirmation',
        xp: 30,
        steps: [
          { type: 'intro', title: 'Tidal Affirmation', text: 'The final Water practice. The tide returns and recedes, again and again. So does your strength.' },
          { type: 'breathe', title: 'The Rhythm', text: 'Match your breath to a tide. Inhale as the water rushes in. Exhale as it pulls back. Find the rhythm.' },
          { type: 'action', title: 'Speak', text: 'Say these words aloud or in your heart: "I release what is not mine to carry."' },
          { type: 'action', title: 'Speak Again', text: '"I am fluid. I adapt. I do not break — I flow around what blocks me."' },
          { type: 'action', title: 'One More', text: '"I am allowed to let go. I am allowed to begin again. The tide always returns."' },
          { type: 'reflect', title: 'Reflection', text: 'Which of those affirmations resonated most deeply? Hold it with you today.' },
          { type: 'affirmation', title: 'Final Affirmation', text: '"I do not carry it alone. I am remembered. I am restoring."' },
          { type: 'complete', title: 'Water Path Complete', text: 'You have completed every ritual on the Water Path. You have learned to flow and release. The Fire Path now awaits you.' }
        ]
      }
    ],
    fire: [
      {
        name: 'Spark Activation',
        xp: 10,
        steps: [
          { type: 'intro', title: 'Spark Activation', text: 'Even the smallest spark can reignite a fire. This practice reconnects you to the warmth inside you.' },
          { type: 'action', title: 'Feel the Warmth', text: 'Place one hand on your chest. Feel the warmth there — your heartbeat, your breath, your aliveness.' },
          { type: 'breathe', title: 'Breathe Into It', text: 'Breathe warmth into your chest. Imagine a small, golden light glowing where your hand rests.' },
          { type: 'visualize', title: 'The Spark', text: 'This light is your spark — your inner fire. It may be dim today, and that is okay. It has not gone out.' },
          { type: 'action', title: 'Speak', text: 'Say quietly: "My spark is sacred. I let it glow again."' },
          { type: 'affirmation', title: 'Affirmation', text: '"I carry fire within me. It is quiet, but it is alive. I tend to it with gentleness."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Spark Activation is complete. Your fire does not need to roar. It only needs to glow.' }
        ]
      },
      {
        name: 'Ember Journaling',
        xp: 15,
        steps: [
          { type: 'intro', title: 'Ember Journaling', text: 'Joy often hides in small moments. This practice helps you find and tend to the embers of daily warmth.' },
          { type: 'reflect', title: 'Today', text: 'Think of one thing that sparked warmth in you today. It can be anything — a kind word, a color, a taste, a sound.' },
          { type: 'action', title: 'Name It', text: 'Name that spark clearly in your mind. Give it detail. Where were you? What did you feel? Let it come alive.' },
          { type: 'action', title: 'Fan the Ember', text: 'Imagine breathing gently on that ember. Watch it glow brighter. This small joy deserves your attention.' },
          { type: 'reflect', title: 'Why It Matters', text: 'Joy is not a luxury. It is fuel. Noticing small sparks keeps the fire burning through difficult seasons.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I notice the warmth in my day. I tend to it. My joy is fuel for my healing."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Ember Journaling is complete. Carry your spark with you into the rest of this day.' }
        ]
      },
      {
        name: 'Flame Ceremony',
        xp: 20,
        steps: [
          { type: 'intro', title: 'Flame Ceremony', text: 'Fire transforms. In this practice, you will offer something to the flame and watch it change.' },
          { type: 'action', title: 'Light a Flame', text: 'If you can, light a candle or imagine a steady flame. Watch it flicker. Notice its movement, its warmth, its light.' },
          { type: 'breathe', title: 'Breathe With It', text: 'Match your breath to the flame. Slow, steady, alive. The flame does not rush. Neither will you.' },
          { type: 'reflect', title: 'What to Release', text: 'Think of something weighing on your spirit. A resentment, a fear, a harsh word you said to yourself.' },
          { type: 'visualize', title: 'Offer It', text: 'Imagine placing that weight into the flame. Watch it burn. It does not disappear — it transforms into light and warmth.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I transform what burdens me. My fire turns pain into light. I am resilient."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Flame Ceremony is complete. What the fire takes, it returns as warmth.' }
        ]
      },
      {
        name: 'Renewal Ritual',
        xp: 30,
        steps: [
          { type: 'intro', title: 'Renewal Ritual', text: 'The final Fire practice. Like a phoenix, you rise from what has ended. This ritual marks a new beginning.' },
          { type: 'breathe', title: 'Arrive', text: 'Close your eyes. Take five deep breaths. With each exhale, release the ashes of what has passed.' },
          { type: 'reflect', title: 'What Has Ended', text: 'Think of something that has come to an end — a chapter, a pattern, a season. Honor it without clinging to it.' },
          { type: 'visualize', title: 'The Fire', text: 'Imagine a great, warm fire. Place what has ended gently into it. Watch it glow, crack, and transform.' },
          { type: 'visualize', title: 'Rising', text: 'From the embers, something new is forming. You do not need to know what it is yet. Just trust that it is coming.' },
          { type: 'action', title: 'Declare', text: 'Say: "I am not what happened to me. I am what I choose to become. I am renewed."' },
          { type: 'affirmation', title: 'Final Affirmation', text: '"I rise. I transform. My fire is unbreakable."' },
          { type: 'complete', title: 'Fire Path Complete', text: 'You have completed every ritual on the Fire Path. Your inner flame burns steady and bright. The Air Path now awaits you.' }
        ]
      }
    ],
    air: [
      {
        name: 'Breath of Sky',
        xp: 10,
        steps: [
          { type: 'intro', title: 'Breath of Sky', text: 'Air is freedom. This practice reconnects you to openness, lightness, and the space above.' },
          { type: 'action', title: 'Look Up', text: 'Step outside or look through a window. Find the sky. It is always there, even behind clouds.' },
          { type: 'breathe', title: 'Breathe the Sky In', text: 'Inhale deeply. Imagine you are breathing in the open sky — its vastness, its lightness, its clarity.' },
          { type: 'breathe', title: 'Exhale Weight', text: 'On the exhale, let heaviness fall from your shoulders like shedding a coat. You are lighter now.' },
          { type: 'reflect', title: 'Space', text: 'Notice the space around you. Above you. Between your thoughts. There is more room than you think.' },
          { type: 'affirmation', title: 'Affirmation', text: '"I am light enough to rise again. I choose openness. I breathe in clarity."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Breath of Sky is complete. The sky is always above you, always open.' }
        ]
      },
      {
        name: 'Cloud Gazing',
        xp: 15,
        steps: [
          { type: 'intro', title: 'Cloud Gazing', text: 'Clouds drift without purpose or plan. This practice helps you observe your thoughts the same way.' },
          { type: 'action', title: 'Find a Cloud', text: 'Look at the sky and find a single cloud. Watch it move. Notice its shape, its edges, how it changes.' },
          { type: 'visualize', title: 'Your Thoughts', text: 'Your thoughts are like that cloud — always moving, always shifting, never permanent. They pass through you.' },
          { type: 'breathe', title: 'Watch and Release', text: 'For the next minute, watch the sky. Each time a thought pulls you away, return to the clouds. No judgment.' },
          { type: 'reflect', title: 'Impermanence', text: 'Nothing stays. Not the cloud, not the worry, not this moment. And that is not sad — it is freedom.' },
          { type: 'affirmation', title: 'Affirmation', text: '"My thoughts pass like clouds. I am the sky behind them — vast, clear, and still."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Cloud Gazing is complete. Remember: you are not the weather. You are the sky.' }
        ]
      },
      {
        name: 'Wind Affirmation',
        xp: 20,
        steps: [
          { type: 'intro', title: 'Wind Affirmation', text: 'The wind carries seeds to new places. Your words carry intention. This practice gives voice to your healing.' },
          { type: 'breathe', title: 'Feel the Air', text: 'Take a deep breath and feel the air move through your nostrils, your throat, your lungs. It is alive.' },
          { type: 'action', title: 'First Words', text: 'Whisper or speak aloud: "I release heaviness."' },
          { type: 'action', title: 'Second Words', text: '"I choose clarity."' },
          { type: 'action', title: 'Third Words', text: '"I am rising."' },
          { type: 'breathe', title: 'Let the Words Travel', text: 'Imagine the wind carrying your words outward — into the world, into the future. They are seeds now.' },
          { type: 'affirmation', title: 'Affirmation', text: '"My voice matters. My words plant healing. I speak myself into freedom."' },
          { type: 'complete', title: 'Ritual Complete', text: 'Wind Affirmation is complete. Your words have been released. Trust where they land.' }
        ]
      },
      {
        name: 'Ascension Journey',
        xp: 30,
        steps: [
          { type: 'intro', title: 'Ascension Journey', text: 'The final Air practice and the final ritual of your elemental journey. You will rise above it all — with compassion, not escape.' },
          { type: 'breathe', title: 'Prepare', text: 'Close your eyes. Take seven slow breaths. With each one, feel yourself becoming lighter.' },
          { type: 'visualize', title: 'Lifting', text: 'Imagine yourself gently lifting off the ground. Not flying — floating. Rising slowly above the room, the building, the streets.' },
          { type: 'visualize', title: 'The View', text: 'You see everything below — the places you have been, the people you care for, the paths you have walked. It is all still there.' },
          { type: 'visualize', title: 'Compassion', text: 'From up here, everything looks softer. The struggles look smaller. Not because they do not matter, but because you can see the whole picture.' },
          { type: 'reflect', title: 'What Do You See?', text: 'Looking down at your life from this height, what do you notice? What deserves more tenderness? What can you finally set down?' },
          { type: 'action', title: 'Return', text: 'Slowly descend. Return to your body, to this moment. You carry the perspective with you.' },
          { type: 'affirmation', title: 'Final Affirmation', text: '"I am free. I have walked through Earth, Water, Fire, and Air. I am whole. I am restoring."' },
          { type: 'complete', title: 'All Paths Complete', text: 'You have completed the Ascension Journey and all four elemental paths. You are a healer who has healed yourself. Return anytime.' }
        ]
      }
    ]
  };


  // ── localStorage helpers ──
  function getState() {
    try {
      var raw = localStorage.getItem('miraniwell_game');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveState(state) {
    localStorage.setItem('miraniwell_game', JSON.stringify(state));
  }

  function isLoggedIn() {
    var state = getState();
    return state && state.user;
  }


  // ── Streak logic ──
  function checkStreak(state) {
    if (!state.lastPlayed) return state;
    var last = new Date(state.lastPlayed);
    var now = new Date();
    var lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var diff = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));
    if (diff > 1) { state.streak = 0; }
    return state;
  }


  // ── Level calculation ──
  function calculateLevel(xp) {
    if (xp < 50) return 1;
    if (xp < 120) return 2;
    if (xp < 200) return 3;
    if (xp < 300) return 4;
    if (xp < 450) return 5;
    if (xp < 650) return 6;
    if (xp < 900) return 7;
    return 8;
  }


  // ── Check if a node is unlockable ──
  function isNodeUnlocked(state, element, nodeIndex) {
    if (nodeIndex === 0) {
      var elemIndex = ELEMENT_ORDER.indexOf(element);
      if (elemIndex === 0) return true;
      var prevElement = ELEMENT_ORDER[elemIndex - 1];
      return state.paths[prevElement].every(function (v) { return v; });
    }
    return state.paths[element][nodeIndex - 1] === true;
  }


  // ── LOGIN PAGE LOGIC ──
  function initLoginPage() {
    var loginForm = document.getElementById('login-form');
    var signupForm = document.getElementById('signup-form');
    var toggleText = document.getElementById('toggle-text');

    if (!loginForm || !signupForm) return;

    // Never auto-redirect from login page — user chose to come here
    // They can navigate to /play/ themselves

    var showingLogin = true;

    function showLogin() {
      showingLogin = true;
      loginForm.classList.remove('d-none');
      signupForm.classList.add('d-none');
      toggleText.innerHTML = 'New here? <a href="#" class="line-bg toggle-link">Create an account</a>';
    }

    function showSignup() {
      showingLogin = false;
      loginForm.classList.add('d-none');
      signupForm.classList.remove('d-none');
      toggleText.innerHTML = 'Already have an account? <a href="#" class="line-bg toggle-link">Sign in</a>';
    }

    // Use event delegation so we don't have to rebind
    toggleText.addEventListener('click', function (e) {
      if (e.target.classList.contains('toggle-link')) {
        e.preventDefault();
        if (showingLogin) {
          showSignup();
        } else {
          showLogin();
        }
      }
    });

    // If URL has #signup, show signup form directly
    if (window.location.hash === '#signup') {
      showSignup();
    }

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = loginForm.querySelector('input[name="email"]').value;
      var password = loginForm.querySelector('input[name="password"]').value;
      if (!email || !password) return;

      var state = getState();
      if (state && state.user && state.user.email === email) {
        window.location.href = '../play/';
      } else {
        var newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        newState.user = { name: email.split('@')[0], email: email, element: 'earth' };
        saveState(newState);
        window.location.href = '../play/';
      }
    });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = signupForm.querySelector('input[name="name"]').value;
      var email = signupForm.querySelector('input[name="email"]').value;
      var password = signupForm.querySelector('input[name="password"]').value;
      var element = signupForm.querySelector('select[name="element"]').value;
      if (!name || !email || !password) return;

      var newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      newState.user = { name: name, email: email, element: element };
      saveState(newState);
      window.location.href = '../play/';
    });
  }


  // ── GAME DASHBOARD LOGIC ──
  function initGameDashboard() {
    var playerName = document.getElementById('player-name');
    if (!playerName) return;

    if (!isLoggedIn()) {
      window.location.href = '../login/';
      return;
    }

    var state = getState();
    state = checkStreak(state);
    saveState(state);
    updateStats(state);
    updateAllNodes(state);

    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('miraniwell_game');
        window.location.href = '../login/';
      });
    }

    // Node click — navigate to ritual experience page
    var nodes = document.querySelectorAll('.game-node');
    nodes.forEach(function (node) {
      node.addEventListener('click', function () {
        var element = node.getAttribute('data-element');
        var nodeIndex = parseInt(node.getAttribute('data-node'));
        var currentState = getState();

        if (currentState.paths[element][nodeIndex]) return;
        if (!isNodeUnlocked(currentState, element, nodeIndex)) return;

        // Store which ritual to load
        localStorage.setItem('miraniwell_active_ritual', JSON.stringify({
          element: element,
          node: nodeIndex
        }));

        // Navigate to ritual experience page
        window.location.href = 'ritual/';
      });
    });
  }

  function updateStats(state) {
    var nameEl = document.getElementById('player-name');
    var affirmEl = document.getElementById('player-affirmation');
    var streakEl = document.getElementById('stat-streak');
    var xpEl = document.getElementById('stat-xp');
    var completedEl = document.getElementById('stat-completed');
    var levelEl = document.getElementById('stat-level');

    if (nameEl && state.user) nameEl.textContent = state.user.name;
    if (affirmEl && state.user) affirmEl.textContent = AFFIRMATIONS[state.user.element] || AFFIRMATIONS.earth;
    if (streakEl) streakEl.textContent = state.streak;
    if (xpEl) xpEl.textContent = state.xp;
    if (completedEl) completedEl.textContent = state.completedRituals;
    if (levelEl) levelEl.textContent = state.level;
  }

  function updateAllNodes(state) {
    var nodes = document.querySelectorAll('.game-node');
    nodes.forEach(function (node) {
      var element = node.getAttribute('data-element');
      var nodeIndex = parseInt(node.getAttribute('data-node'));
      var statusEl = node.querySelector('.node-status');

      if (state.paths[element][nodeIndex]) {
        // Show medal on completed card
        if (!node.querySelector('.card-medal')) {
          var medalImg = document.createElement('img');
          medalImg.src = medalPath('complete', 2);
          medalImg.alt = 'Completed';
          medalImg.className = 'card-medal';
          node.appendChild(medalImg);
        }
        statusEl.textContent = 'Completed';
        node.classList.add('node-completed');
        node.classList.remove('node-locked', 'node-available');
      } else if (isNodeUnlocked(state, element, nodeIndex)) {
        statusEl.textContent = 'Begin';
        node.classList.add('node-available');
        node.classList.remove('node-locked', 'node-completed');
      } else {
        statusEl.textContent = 'Locked';
        node.classList.add('node-locked');
        node.classList.remove('node-available', 'node-completed');
      }
    });
  }


  // ── QUIZ QUESTIONS — injected between guided steps for each ritual ──
  var QUIZ_BANK = {
    earth: [
      // Node 0: Grounding Breath
      [
        { question: 'What is the inhale count for the Grounding Breath?', options: ['2 counts', '4 counts', '6 counts', '8 counts'], correct: 1 },
        { question: 'How long do you hold your breath in this practice?', options: ['2 counts', '4 counts', '6 counts', '10 counts'], correct: 1 },
        { question: 'What is the exhale count?', options: ['4 counts', '5 counts', '6 counts', '8 counts'], correct: 2 },
        { question: 'How many times do you repeat the breath cycle?', options: ['Once', 'Twice', 'Three times', 'Five times'], correct: 2 }
      ],
      // Node 1: Root Visualization
      [
        { question: 'Where do the roots grow from in this practice?', options: ['Your hands', 'Your head', 'The base of your spine', 'Your heart'], correct: 2 },
        { question: 'The roots travel into warm, dark...', options: ['Water', 'Soil', 'Air', 'Light'], correct: 1 },
        { question: 'What rises through your body from the roots?', options: ['Cold energy', 'Steadiness and warmth', 'Electric current', 'Sound'], correct: 1 },
        { question: '"I am connected to the _____ beneath me."', options: ['Sky', 'People', 'Ground', 'Future'], correct: 2 }
      ],
      // Node 2: Soil Ritual
      [
        { question: 'What should you touch during this ritual?', options: ['Your phone', 'Something natural', 'A mirror', 'A book'], correct: 1 },
        { question: 'How many gifts from the earth do you name?', options: ['One', 'Two', 'Three', 'Five'], correct: 2 },
        { question: '"The earth gives without..."', options: ['Stopping', 'Asking', 'Caring', 'Thinking'], correct: 1 },
        { question: 'You do not need to earn...', options: ['Money', 'Respect', 'Rest and peace', 'Knowledge'], correct: 2 }
      ],
      // Node 3: Forest Sanctuary
      [
        { question: 'What do you visualize in the Forest Sanctuary?', options: ['A desert', 'A quiet forest clearing', 'An ocean', 'A mountain peak'], correct: 1 },
        { question: 'What covers the ground in your clearing?', options: ['Sand', 'Snow', 'Moss', 'Leaves'], correct: 2 },
        { question: 'How many minutes of stillness are guided?', options: ['One', 'Two', 'Five', 'Ten'], correct: 1 },
        { question: 'Completing Earth Path unlocks which path?', options: ['Fire Path', 'Air Path', 'Water Path', 'No new path'], correct: 2 }
      ]
    ],
    water: [
      // Node 0: Wave Release
      [
        { question: 'What carries away your heaviness?', options: ['The wind', 'A wave', 'A bird', 'A cloud'], correct: 1 },
        { question: 'Where are you standing in this practice?', options: ['On a mountain', 'In a forest', 'At the edge of a calm ocean', 'In a garden'], correct: 2 },
        { question: 'Water teaches us to...', options: ['Fight harder', 'Hold on tighter', 'Let go', 'Run faster'], correct: 2 },
        { question: '"I release what is not mine to..."', options: ['Keep', 'Carry', 'Forget', 'Share'], correct: 1 }
      ],
      // Node 1: River Meditation
      [
        { question: 'Thoughts are placed on...', options: ['Stones', 'Leaves', 'Boats', 'Fish'], correct: 1 },
        { question: 'You are not your thoughts. You are...', options: ['The leaf', 'The river', 'The one sitting by the river', 'The current'], correct: 2 },
        { question: 'The hardest thought to release shows where...', options: ['Joy lives', 'Healing is needed most', 'Anger hides', 'Fear begins'], correct: 1 },
        { question: '"I am the _____ beneath my thoughts."', options: ['Storm', 'Wave', 'Stillness', 'Wind'], correct: 2 }
      ],
      // Node 2: Ocean Immersion
      [
        { question: 'In this practice, you become...', options: ['A fish', 'The ocean itself', 'A sailor', 'A wave'], correct: 1 },
        { question: 'Emotions are described as...', options: ['Anchors', 'Waves on your surface', 'Ships at sea', 'Currents below'], correct: 1 },
        { question: 'The deep water beneath is always...', options: ['Turbulent', 'Cold', 'Calm', 'Moving'], correct: 2 },
        { question: 'No storm can reach your...', options: ['Surface', 'Depths', 'Shore', 'Horizon'], correct: 1 }
      ],
      // Node 3: Tidal Affirmation
      [
        { question: 'Your breath should match the rhythm of...', options: ['A heartbeat', 'The tide', 'A drum', 'A clock'], correct: 1 },
        { question: '"I do not break — I..."', options: ['Stop', 'Flow around what blocks me', 'Push through', 'Retreat'], correct: 1 },
        { question: 'The tide always...', options: ['Stops eventually', 'Returns', 'Goes one way', 'Disappears'], correct: 1 },
        { question: 'Completing Water Path unlocks which path?', options: ['Earth Path', 'Air Path', 'Fire Path', 'No path'], correct: 2 }
      ]
    ],
    fire: [
      // Node 0: Spark Activation
      [
        { question: 'Where do you place your hand?', options: ['On your head', 'On your chest', 'On your stomach', 'On your knee'], correct: 1 },
        { question: 'What do you imagine glowing there?', options: ['A blue crystal', 'A small golden light', 'A red flame', 'A white star'], correct: 1 },
        { question: 'Your spark may be dim today, and that is...', options: ['A problem', 'A failure', 'Okay', 'Permanent'], correct: 2 },
        { question: 'Your fire only needs to...', options: ['Survive', 'Glow', 'Burn hotter', 'Spread'], correct: 1 }
      ],
      // Node 1: Ember Journaling
      [
        { question: 'What should you name in this practice?', options: ['A fear', 'Something that sparked joy', 'A regret', 'A plan'], correct: 1 },
        { question: 'How do you tend to the ember?', options: ['Pour water on it', 'Breathe gently on it', 'Step on it', 'Cover it'], correct: 1 },
        { question: 'Joy is not a luxury. It is...', options: ['Rare', 'Fuel', 'Selfish', 'Temporary'], correct: 1 },
        { question: 'A spark of joy can be as small as...', options: ['Only big events', 'A smile, a color, a sound', 'Nothing counts', 'Only relationships'], correct: 1 }
      ],
      // Node 2: Flame Ceremony
      [
        { question: 'You light or imagine...', options: ['A bonfire', 'A candle', 'A torch', 'Lightning'], correct: 1 },
        { question: 'What the flame takes, it transforms into...', options: ['Ash only', 'Nothing', 'Light and warmth', 'Smoke'], correct: 2 },
        { question: 'The flame reminds you of your own...', options: ['Weakness', 'Anger', 'Resilience', 'Sadness'], correct: 2 },
        { question: '"My fire turns pain into..."', options: ['More pain', 'Anger', 'Light', 'Emptiness'], correct: 2 }
      ],
      // Node 3: Renewal Ritual
      [
        { question: 'Like a phoenix, you...', options: ['Disappear', 'Rise from what has ended', 'Forget everything', 'Start over completely'], correct: 1 },
        { question: 'From the embers, something new is...', options: ['Impossible', 'Forming', 'Dangerous', 'Lost'], correct: 1 },
        { question: '"I am what I _____ to become."', options: ['Was meant', 'Choose', 'Cannot', 'Remember'], correct: 1 },
        { question: 'Completing Fire Path unlocks which path?', options: ['Water Path', 'Earth Path', 'Air Path', 'No path'], correct: 2 }
      ]
    ],
    air: [
      // Node 0: Breath of Sky
      [
        { question: 'What should you look for?', options: ['The ground', 'The sky', 'A tree', 'A star'], correct: 1 },
        { question: 'Heaviness falls from your shoulders like shedding a...', options: ['Skin', 'Coat', 'Layer of dust', 'Burden'], correct: 1 },
        { question: '"I am light enough to..."', options: ['Float away', 'Rise again', 'Disappear', 'Forget'], correct: 1 },
        { question: 'The sky is always there, even behind...', options: ['Mountains', 'Buildings', 'Clouds', 'Trees'], correct: 2 }
      ],
      // Node 1: Cloud Gazing
      [
        { question: 'Clouds drift without...', options: ['Shape', 'Purpose or plan', 'Color', 'Movement'], correct: 1 },
        { question: 'Your thoughts are like clouds because they are...', options: ['Heavy', 'Never permanent', 'Invisible', 'Dangerous'], correct: 1 },
        { question: 'Impermanence is described as...', options: ['Sad', 'Frightening', 'Freedom', 'A weakness'], correct: 2 },
        { question: '"I am the _____ behind the clouds."', options: ['Wind', 'Sun', 'Sky', 'Moon'], correct: 2 }
      ],
      // Node 2: Wind Affirmation
      [
        { question: 'The wind carries seeds to...', options: ['Destruction', 'New places', 'The ocean', 'Nowhere'], correct: 1 },
        { question: 'The first affirmation is: "I release..."', options: ['Control', 'Heaviness', 'People', 'Ambition'], correct: 1 },
        { question: 'Your words carry...', options: ['No weight', 'Intention', 'Only sound', 'Obligation'], correct: 1 },
        { question: '"My words plant..."', options: ['Doubt', 'Fear', 'Healing', 'Distance'], correct: 2 }
      ],
      // Node 3: Ascension Journey
      [
        { question: 'You rise above with _____, not escape.', options: ['Power', 'Speed', 'Compassion', 'Indifference'], correct: 2 },
        { question: 'From above, the struggles look...', options: ['Bigger', 'Scarier', 'Smaller and softer', 'Invisible'], correct: 2 },
        { question: 'You are not flying — you are...', options: ['Running', 'Falling', 'Floating', 'Climbing'], correct: 2 },
        { question: '"I have walked through Earth, Water, Fire, and Air. I am..."', options: ['Done', 'Exhausted', 'Whole', 'Perfect'], correct: 2 }
      ]
    ]
  };


  // ── Build a gamified step sequence: guided steps + quiz steps interleaved ──
  function buildGameSteps(ritual, quizzes) {
    var steps = [];
    var originalSteps = ritual.steps;
    var quizIndex = 0;

    for (var i = 0; i < originalSteps.length; i++) {
      var s = originalSteps[i];

      // Add the guided step
      steps.push({
        mode: 'guided',
        type: s.type,
        title: s.title,
        text: s.text,
        icon: s.type === 'breathe' ? '&#127756;' : s.type === 'visualize' ? '&#128065;' : s.type === 'reflect' ? '&#128173;' : s.type === 'action' ? '&#9995;' : s.type === 'affirmation' ? '&#10024;' : s.type === 'complete' ? '&#127942;' : '&#127793;'
      });

      // Inject a quiz after certain step types (not after intro or complete)
      if (quizIndex < quizzes.length && (s.type === 'breathe' || s.type === 'visualize' || s.type === 'action' || s.type === 'reflect')) {
        steps.push({
          mode: 'quiz',
          question: quizzes[quizIndex].question,
          options: quizzes[quizIndex].options,
          correct: quizzes[quizIndex].correct,
          icon: '&#10067;'
        });
        quizIndex++;
      }
    }

    return steps;
  }


  // ── RITUAL EXPERIENCE PAGE LOGIC (Gamified Winding Path) ──
  function initRitualPage() {
    var pathMap = document.getElementById('path-map');
    if (!pathMap) return;

    if (!isLoggedIn()) {
      window.location.href = '../../login/';
      return;
    }

    var activeRaw = localStorage.getItem('miraniwell_active_ritual');
    if (!activeRaw) {
      window.location.href = '../';
      return;
    }

    var active = JSON.parse(activeRaw);
    var ritual = RITUALS[active.element] && RITUALS[active.element][active.node];
    var quizzes = QUIZ_BANK[active.element] && QUIZ_BANK[active.element][active.node];
    if (!ritual) {
      window.location.href = '../';
      return;
    }
    if (!quizzes) quizzes = [];

    var color = ELEMENT_COLORS[active.element];
    var gameSteps = buildGameSteps(ritual, quizzes);
    var totalSteps = gameSteps.length;
    var currentStep = 0;
    var hearts = 5;
    var correctCount = 0;
    var wrongCount = 0;
    var selectedOption = -1;
    var quizAnswered = false;

    // UI references
    var progressBar = document.getElementById('ritual-progress-bar');
    var xpDisplayEl = document.getElementById('ritual-xp-display');
    var heartsEl = document.querySelectorAll('#ritual-hearts .heart-icon');
    var exitBtn = document.getElementById('ritual-exit');

    // Guided screen elements
    var guidedScreen = document.getElementById('guided-screen');
    var titleEl = document.getElementById('ritual-title');
    var instructionEl = document.getElementById('ritual-instruction');
    var interactiveEl = document.getElementById('ritual-interactive');
    var guidedDoneBtn = document.getElementById('guided-done-btn');

    // Quiz screen elements
    var quizScreen = document.getElementById('quiz-screen');
    var quizTitleEl = document.getElementById('quiz-title');
    var quizQuestionEl = document.getElementById('quiz-question');
    var quizOptionsEl = document.getElementById('quiz-options');
    var quizFeedback = document.getElementById('quiz-feedback');
    var quizFeedbackCard = document.getElementById('quiz-feedback-card');
    var quizFeedbackText = document.getElementById('quiz-feedback-text');
    var quizCheckBtn = document.getElementById('quiz-check-btn');
    var quizContinueBtn = document.getElementById('quiz-continue-btn');

    // Result screens
    var completeScreen = document.getElementById('complete-screen');
    var failedScreen = document.getElementById('failed-screen');
    var completeReturnBtn = document.getElementById('complete-return-btn');
    var failedReturnBtn = document.getElementById('failed-return-btn');
    var failedRetryBtn = document.getElementById('failed-retry-btn');

    xpDisplayEl.textContent = '+' + ritual.xp + ' XP';

    // ── Build game board path map using colorful SVG illustration ──
    // Winding S-curve across the game board (coordinates match 1440x810 viewBox)
    var BOARD_VB = '0 0 1440 810';
    var BOARD_PATH = 'M 120 680 C 200 680, 280 500, 380 440 C 480 380, 480 580, 600 560 C 720 540, 700 350, 800 300 C 900 250, 900 480, 1020 440 C 1140 400, 1100 280, 1200 230 C 1300 180, 1340 200, 1380 180';

    // Persistent references for the board image and SVG trail (built once)
    var _boardImg = null;
    var _trailPath = null;
    var _mapReady = false;

    function buildPathMap() {
      // ── First call: create the board image and SVG overlay once ──
      if (!_boardImg) {
        pathMap.innerHTML = '';
        pathMap.style.position = 'relative';

        var board = document.createElement('img');
        board.src = assetPath('images/gaming-paths-main/svg-paths/Green-Yellow-and-Brown-Illustrative-Goal-Tracker-Map-Whiteboard .svg', 3);
        board.alt = 'Your healing journey map';
        board.style.cssText = 'width:100%;height:auto;display:block;border-radius:18px;pointer-events:none;';
        pathMap.appendChild(board);

        var svgNS = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', BOARD_VB);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';

        var trail = document.createElementNS(svgNS, 'path');
        trail.setAttribute('d', BOARD_PATH);
        trail.setAttribute('fill', 'none');
        trail.setAttribute('stroke', 'none');
        svg.appendChild(trail);

        pathMap.appendChild(svg);

        _boardImg = board;
        _trailPath = trail;

        board.onload = function() {
          _mapReady = true;
          placeNodes();
        };
        if (board.complete) {
          _mapReady = true;
          placeNodes();
        }
        return;
      }

      // ── Subsequent calls: only update nodes, never touch the board image ──
      if (_mapReady) {
        placeNodes();
      }
    }

    function placeNodes() {
      // Remove old nodes but keep the board image and SVG
      var oldNodes = pathMap.querySelectorAll('.snake-node-wrap');
      for (var n = 0; n < oldNodes.length; n++) {
        oldNodes[n].parentNode.removeChild(oldNodes[n]);
      }

      var fullLen = _trailPath.getTotalLength();
      var containerW = pathMap.offsetWidth;
      var containerH = _boardImg.offsetHeight;

      for (var i = 0; i < totalSteps; i++) {
        var step = gameSteps[i];
        var lengthAt = totalSteps > 1 ? (i / (totalSteps - 1)) * fullLen : 0;
        var pt = _trailPath.getPointAtLength(lengthAt);

        var pixelX = (pt.x / 1440) * containerW;
        var pixelY = (pt.y / 810) * containerH;

        var nodeWrap = document.createElement('div');
        nodeWrap.className = 'snake-node-wrap';
        nodeWrap.style.left = pixelX + 'px';
        nodeWrap.style.top = pixelY + 'px';

        var pathIcon = PATH_ICONS[i % PATH_ICONS.length];

        var node = document.createElement('div');
        node.className = 'path-node';
        node.setAttribute('data-step', i);

        if (i < currentStep) {
          node.classList.add('node-done');
          node.style.background = color;
          node.style.borderColor = color;
          node.innerHTML = '<img src="' + assetPath(pathIcon, 3) + '" alt="Done" class="path-node-medal">';
        } else if (i === currentStep) {
          node.classList.add('node-active');
          node.style.background = color;
          node.style.borderColor = color;
          node.style.color = '#1a1a1a';
          node.style.boxShadow = '0 0 0 8px ' + color + '40';
          node.innerHTML = '<img src="' + assetPath(pathIcon, 3) + '" alt="Current" class="path-node-medal">';
          var tooltip = document.createElement('div');
          tooltip.className = 'path-node-tooltip';
          tooltip.style.background = color;
          tooltip.textContent = step.mode === 'quiz' ? 'Quiz!' : 'Go!';
          node.appendChild(tooltip);
        } else {
          node.classList.add('node-locked');
          node.innerHTML = '<img src="' + assetPath(pathIcon, 3) + '" alt="Locked" class="path-node-medal">';
        }

        nodeWrap.appendChild(node);

        var label = document.createElement('div');
        label.className = 'path-node-label';
        label.textContent = step.mode === 'guided'
          ? (step.title.length > 10 ? step.title.substring(0, 9) + '...' : step.title)
          : 'Quiz';
        nodeWrap.appendChild(label);

        pathMap.appendChild(nodeWrap);
      }
    }

    // ── Update hearts display ──
    function updateHearts() {
      heartsEl.forEach(function (h, i) {
        if (i >= hearts) {
          h.classList.add('heart-lost');
        } else {
          h.classList.remove('heart-lost');
        }
      });
    }

    // ── Update progress bar ──
    function updateProgress() {
      var pct = ((currentStep) / totalSteps) * 100;
      var fill = progressBar.querySelector('.progress-fill');
      if (fill) fill.style.width = pct + '%';
    }

    // ── Show guided step ──
    // Scene illustration for this ritual
    var sceneImg = RITUAL_SCENES[active.element] && RITUAL_SCENES[active.element][active.node];
    var ritualIllustration = document.getElementById('ritual-illustration');
    var ritualCardFrame = document.getElementById('ritual-card-frame');

    // Set the illustration once
    if (ritualIllustration && sceneImg) {
      ritualIllustration.src = assetPath(sceneImg, 3);
      ritualIllustration.alt = ritual.name;
    }
    // Set card frame color to element color
    if (ritualCardFrame) {
      ritualCardFrame.style.background = color;
    }

    // Hide all external buttons and feedback
    function hideAllControls() {
      guidedDoneBtn.classList.add('d-none');
      quizCheckBtn.classList.add('d-none');
      quizContinueBtn.classList.add('d-none');
      completeReturnBtn.classList.add('d-none');
      failedReturnBtn.classList.add('d-none');
      failedRetryBtn.classList.add('d-none');
      quizFeedback.classList.add('d-none');
    }

    function showGuidedStep(step) {
      guidedScreen.classList.remove('d-none');
      guidedScreen.classList.add('step-animate-in');
      quizScreen.classList.add('d-none');
      completeScreen.classList.add('d-none');
      failedScreen.classList.add('d-none');
      hideAllControls();

      titleEl.innerHTML = '<span class="position-relative">' + step.title + '<span class="sticker" style="background: ' + color + ';"></span></span>';
      instructionEl.textContent = step.text;
      interactiveEl.innerHTML = '';

      if (step.type === 'breathe') {
        interactiveEl.innerHTML = '<div class="breathing-circle" style="background: ' + color + ';"></div>';
        guidedDoneBtn.textContent = 'I Breathed';
      } else if (step.type === 'visualize') {
        interactiveEl.innerHTML = '<div class="card-block position-relative z-1 p-4 reflect-prompt" style="background: ' + color + ';"><p class="fs-20 mb-0">Close your eyes and visualize...</p></div>';
        guidedDoneBtn.textContent = 'I See It';
      } else if (step.type === 'reflect') {
        interactiveEl.innerHTML = '<div class="card-block position-relative z-1 p-4 reflect-prompt" style="background: ' + color + ';"><p class="fs-20 mb-0">' + step.text + '</p></div>';
        guidedDoneBtn.textContent = 'I Reflected';
      } else if (step.type === 'action') {
        interactiveEl.innerHTML = '<div class="card-block position-relative z-1 p-4 reflect-prompt" style="background: ' + color + ';"><p class="fs-20 mb-0">' + step.text + '</p></div>';
        guidedDoneBtn.textContent = 'Done';
      } else if (step.type === 'affirmation') {
        interactiveEl.innerHTML = '<div class="affirmation-card" style="background: ' + color + ';"><p class="fs-24 fw-500 mb-0">' + step.text + '</p></div>';
        guidedDoneBtn.textContent = 'I Spoke It';
      } else if (step.type === 'repeat') {
        interactiveEl.innerHTML = '<div class="breathing-circle" style="background: ' + color + ';"></div>';
        guidedDoneBtn.textContent = 'I Repeated It';
      } else if (step.type === 'complete') {
        // Don't show guided done for complete — we handle it separately
        guidedDoneBtn.classList.add('d-none');
        showCompleteScreen();
        return;
      } else {
        // intro or other
        guidedDoneBtn.textContent = "Let's Begin";
      }

      guidedDoneBtn.classList.remove('d-none');

      // Remove animation class after it plays so it can re-trigger
      setTimeout(function () { guidedScreen.classList.remove('step-animate-in'); }, 400);
    }

    // ── Show quiz step ──
    function showQuizStep(step) {
      quizScreen.classList.remove('d-none');
      quizScreen.classList.add('step-animate-in');
      guidedScreen.classList.add('d-none');
      completeScreen.classList.add('d-none');
      failedScreen.classList.add('d-none');
      hideAllControls();

      quizAnswered = false;
      selectedOption = -1;

      quizTitleEl.innerHTML = '<span class="position-relative">Quick Check<span class="sticker" style="background: ' + color + ';"></span></span>';
      quizQuestionEl.textContent = step.question;

      // Build options
      quizOptionsEl.innerHTML = '';
      step.options.forEach(function (opt, i) {
        var div = document.createElement('div');
        div.className = 'quiz-option';
        div.textContent = opt;
        div.setAttribute('data-index', i);
        div.addEventListener('click', function () {
          if (quizAnswered) return;
          selectedOption = i;
          var allOpts = quizOptionsEl.querySelectorAll('.quiz-option');
          allOpts.forEach(function (o) { o.classList.remove('selected'); });
          div.classList.add('selected');
          quizCheckBtn.classList.remove('d-none');
        });
        quizOptionsEl.appendChild(div);
      });

      quizFeedback.classList.add('d-none');
      quizCheckBtn.classList.add('d-none');
      quizContinueBtn.classList.add('d-none');

      setTimeout(function () { quizScreen.classList.remove('step-animate-in'); }, 400);
    }

    // ── Check quiz answer ──
    function checkQuizAnswer() {
      if (selectedOption < 0 || quizAnswered) return;
      quizAnswered = true;

      var step = gameSteps[currentStep];
      var allOpts = quizOptionsEl.querySelectorAll('.quiz-option');
      var isCorrect = selectedOption === step.correct;

      allOpts.forEach(function (o) { o.classList.add('disabled'); });
      allOpts[step.correct].classList.add('correct');

      if (isCorrect) {
        correctCount++;
        quizFeedbackCard.style.background = '#CFFFD7';
        quizFeedbackText.textContent = getCorrectMessage();
      } else {
        wrongCount++;
        allOpts[selectedOption].classList.add('wrong');
        hearts--;
        var lostIndex = hearts;
        if (heartsEl[lostIndex]) {
          heartsEl[lostIndex].classList.add('heart-breaking');
        }
        setTimeout(function () { updateHearts(); }, 600);

        quizFeedbackCard.style.background = '#FFE0E0';
        quizFeedbackText.textContent = 'The answer is: ' + step.options[step.correct];
      }

      quizFeedback.classList.remove('d-none');
      quizCheckBtn.classList.add('d-none');

      if (hearts <= 0) {
        setTimeout(showFailScreen, 1200);
      } else {
        quizContinueBtn.classList.remove('d-none');
      }
    }

    // ── Fun correct messages ──
    function getCorrectMessage() {
      var msgs = [
        'Nailed it!',
        'You are in tune.',
        'Beautiful. Keep going.',
        'Exactly right.',
        'Your awareness is growing.',
        'Yes! You remember.',
        'Healer\'s instinct!',
        'Spot on.',
        'Wisdom flows through you.',
        'That\'s the one.'
      ];
      return msgs[Math.floor(Math.random() * msgs.length)];
    }

    // ── Advance to next step ──
    function advanceStep() {
      currentStep++;
      if (currentStep >= totalSteps) {
        showCompleteScreen();
      } else {
        renderCurrentStep();
      }
    }

    // ── Render whatever the current step is ──
    function renderCurrentStep() {
      updateProgress();
      buildPathMap();

      var step = gameSteps[currentStep];
      if (step.mode === 'quiz') {
        showQuizStep(step);
      } else {
        showGuidedStep(step);
      }

      // Scroll path map to active node
      var activeNode = pathMap.querySelector('.node-active');
      if (activeNode) {
        activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // ── Completion screen ──
    function showCompleteScreen() {
      guidedScreen.classList.add('d-none');
      quizScreen.classList.add('d-none');
      failedScreen.classList.add('d-none');
      completeScreen.classList.remove('d-none');
      hideAllControls();
      completeReturnBtn.classList.remove('d-none');

      // 100% progress
      var fill = progressBar.querySelector('.progress-fill');
      if (fill) fill.style.width = '100%';

      // Build final path map (all done)
      currentStep = totalSteps;
      buildPathMap();

      document.getElementById('complete-xp-earned').textContent = '+' + ritual.xp;
      document.getElementById('result-correct').textContent = correctCount;
      document.getElementById('result-missed').textContent = wrongCount;
      document.getElementById('result-hearts').textContent = hearts;
      document.getElementById('complete-affirmation').textContent = AFFIRMATIONS[active.element];

      // Show the medal — perfect score gets gold sun, otherwise gold ribbon
      var medalImg = document.getElementById('complete-medal-img');
      if (medalImg) {
        if (wrongCount === 0) {
          medalImg.src = medalPath('perfect', 3);
          medalImg.alt = 'Perfect Score!';
        } else {
          medalImg.src = medalPath('complete', 3);
          medalImg.alt = 'Ritual Complete!';
        }
        medalImg.classList.remove('d-none');
      }

      var resultsCard = document.getElementById('complete-results-card');
      if (resultsCard) resultsCard.style.background = color;

      // Save to game state
      var state = getState();
      state.paths[active.element][active.node] = true;
      state.xp += ritual.xp;
      state.completedRituals += 1;
      state.level = calculateLevel(state.xp);

      var now = new Date();
      var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      if (state.lastPlayed !== today) {
        state.streak += 1;
      }
      state.lastPlayed = today;

      saveState(state);
      localStorage.removeItem('miraniwell_active_ritual');
    }

    // ── Fail screen ──
    function showFailScreen() {
      guidedScreen.classList.add('d-none');
      quizScreen.classList.add('d-none');
      completeScreen.classList.add('d-none');
      failedScreen.classList.remove('d-none');
      hideAllControls();
      failedReturnBtn.classList.remove('d-none');
      failedRetryBtn.classList.remove('d-none');
    }

    // ── Reset for retry ──
    function resetGame() {
      currentStep = 0;
      hearts = 5;
      correctCount = 0;
      wrongCount = 0;
      selectedOption = -1;
      quizAnswered = false;
      updateHearts();
      failedScreen.classList.add('d-none');
      renderCurrentStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Event listeners ──
    guidedDoneBtn.addEventListener('click', function () {
      advanceStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    quizCheckBtn.addEventListener('click', checkQuizAnswer);

    quizContinueBtn.addEventListener('click', function () {
      advanceStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    completeReturnBtn.addEventListener('click', function () {
      window.location.href = '../';
    });

    failedReturnBtn.addEventListener('click', function () {
      localStorage.removeItem('miraniwell_active_ritual');
      window.location.href = '../';
    });

    failedRetryBtn.addEventListener('click', resetGame);

    exitBtn.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('miraniwell_active_ritual');
      window.location.href = '../';
    });

    // ── Start ──
    updateHearts();
    renderCurrentStep();


  }


  // ── STANDALONE SIGNUP PAGE LOGIC ──
  function initSignupPage() {
    var signupForm = document.getElementById('signup-form');
    var loginForm = document.getElementById('login-form');

    // Only run on the standalone signup page (no login form present)
    if (!signupForm || loginForm) return;

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = signupForm.querySelector('input[name="name"]').value;
      var email = signupForm.querySelector('input[name="email"]').value;
      var password = signupForm.querySelector('input[name="password"]').value;
      var element = signupForm.querySelector('select[name="element"]').value;
      if (!name || !email || !password) return;

      var newState = JSON.parse(JSON.stringify(DEFAULT_STATE));
      newState.user = { name: name, email: email, element: element };
      saveState(newState);
      window.location.href = '../play/';
    });
  }


  // ── Init on DOM ready ──
  document.addEventListener('DOMContentLoaded', function () {
    initLoginPage();
    initSignupPage();
    initGameDashboard();
    initRitualPage();
  });

})();
