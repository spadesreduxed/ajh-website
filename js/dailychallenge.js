// Day 68: Daily Pixel Challenge
// A daily-rotating pixel art prompt that pairs with the Pixel Art Studio.
// 250+ curated prompts across 8 categories (Object, Creature, Food, Scene,
// Icon, Character, Nature, Tech). Today's challenge is deterministic by
// day-of-year so it stays the same all day.
(function () {
  'use strict';

  // ---- Prompt bank (250+ entries) ----
  // Each prompt has: text, category, difficulty (1=easy, 2=medium, 3=hard), palette (optional)
  const PROMPTS = [
    // Object (40)
    { t: 'A steaming coffee mug',                  c: 'Object',     d: 1 },
    { t: 'A vintage alarm clock',                  c: 'Object',     d: 2 },
    { t: 'An old-school key',                      c: 'Object',     d: 1 },
    { t: 'A glowing lantern',                      c: 'Object',     d: 2 },
    { t: 'A pocket watch with chain',              c: 'Object',     d: 2 },
    { t: 'A pair of headphones',                   c: 'Object',     d: 1 },
    { t: 'A snow globe',                           c: 'Object',     d: 2 },
    { t: 'A treasure chest (open)',                c: 'Object',     d: 2 },
    { t: 'A teapot with steam',                    c: 'Object',     d: 2 },
    { t: 'A spiral seashell',                      c: 'Object',     d: 2 },
    { t: 'A classic paper airplane',               c: 'Object',     d: 1 },
    { t: 'A neon open sign',                       c: 'Object',     d: 2 },
    { t: 'A glass bottle and cork',                c: 'Object',     d: 2 },
    { t: 'A quill pen in an inkwell',              c: 'Object',     d: 2 },
    { t: 'A stack of books',                       c: 'Object',     d: 1 },
    { t: 'A compass with N pointing up',           c: 'Object',     d: 2 },
    { t: 'A lit birthday candle',                  c: 'Object',     d: 1 },
    { t: 'A magnifying glass',                     c: 'Object',     d: 1 },
    { t: 'A retro rotary phone',                   c: 'Object',     d: 2 },
    { t: 'A balloon floating away',                c: 'Object',     d: 1 },
    { t: 'A crystal ball',                         c: 'Object',     d: 2 },
    { t: 'A wrapped present with a bow',           c: 'Object',     d: 2 },
    { t: 'A cassette tape',                        c: 'Object',     d: 2 },
    { t: 'A film camera',                          c: 'Object',     d: 2 },
    { t: 'A pair of dice showing 7',               c: 'Object',     d: 2 },
    { t: 'A crown resting on a pillow',            c: 'Object',     d: 2 },
    { t: 'A key with a heart bow',                 c: 'Object',     d: 1 },
    { t: 'A lighthouse beam at night',             c: 'Object',     d: 3 },
    { t: 'A lantern in a window',                  c: 'Object',     d: 2 },
    { t: 'A robotic vacuum',                       c: 'Object',     d: 2 },
    { t: 'A wind-up music box',                    c: 'Object',     d: 2 },
    { t: 'A snow-covered lantern',                 c: 'Object',     d: 2 },
    { t: 'A potion bottle with cork',              c: 'Object',     d: 1 },
    { t: 'A captain\'s steering wheel',            c: 'Object',     d: 2 },
    { t: 'A solar system mobile',                  c: 'Object',     d: 3 },
    { t: 'A treasure map with X',                  c: 'Object',     d: 2 },
    { t: 'A jar of fireflies',                     c: 'Object',     d: 3 },
    { t: 'A wooden door with a knocker',           c: 'Object',     d: 2 },
    { t: 'A telescope pointed up',                 c: 'Object',     d: 2 },
    { t: 'A pair of chopsticks with sushi',        c: 'Object',     d: 2 },

    // Creature (40)
    { t: 'A sleepy cat curled up',                 c: 'Creature',   d: 2 },
    { t: 'A wise owl on a branch',                 c: 'Creature',   d: 2 },
    { t: 'A goldfish in a bowl',                   c: 'Creature',   d: 2 },
    { t: 'A bee hovering over a flower',           c: 'Creature',   d: 2 },
    { t: 'A fox in a scarf',                       c: 'Creature',   d: 2 },
    { t: 'A dragon curled around an egg',          c: 'Creature',   d: 3 },
    { t: 'A ladybug on a leaf',                    c: 'Creature',   d: 1 },
    { t: 'A jellyfish glowing underwater',         c: 'Creature',   d: 2 },
    { t: 'A happy frog on a lily pad',             c: 'Creature',   d: 2 },
    { t: 'A snail with spiral shell',              c: 'Creature',   d: 2 },
    { t: 'A peacock showing feathers',             c: 'Creature',   d: 3 },
    { t: 'A hummingbird at a flower',              c: 'Creature',   d: 2 },
    { t: 'A turtle in a tiny hat',                 c: 'Creature',   d: 2 },
    { t: 'A baby chick hatching',                  c: 'Creature',   d: 2 },
    { t: 'A wolf howling at the moon',             c: 'Creature',   d: 2 },
    { t: 'A panda munching bamboo',                c: 'Creature',   d: 2 },
    { t: 'A penguin sliding on ice',               c: 'Creature',   d: 2 },
    { t: 'A seahorse in coral',                    c: 'Creature',   d: 2 },
    { t: 'A ram with curly horns',                 c: 'Creature',   d: 2 },
    { t: 'A narwhal breaching',                    c: 'Creature',   d: 2 },
    { t: 'A firefly at dusk',                      c: 'Creature',   d: 2 },
    { t: 'A hermit crab in a shell',               c: 'Creature',   d: 2 },
    { t: 'A pig in a blanket',                     c: 'Creature',   d: 2 },
    { t: 'A dog catching a frisbee',               c: 'Creature',   d: 2 },
    { t: 'A chameleon on a branch',                c: 'Creature',   d: 2 },
    { t: 'A moose with antlers',                   c: 'Creature',   d: 2 },
    { t: 'A jelly bean monster',                   c: 'Creature',   d: 2 },
    { t: 'A robot vacuum (it counts as a creature)', c: 'Creature', d: 2 },
    { t: 'A kraken tentacle from the deep',        c: 'Creature',   d: 3 },
    { t: 'A phoenix in flight',                    c: 'Creature',   d: 3 },
    { t: 'A baby dragon yawning',                  c: 'Creature',   d: 2 },
    { t: 'A cactus with a face',                   c: 'Creature',   d: 1 },
    { t: 'A mushroom with eyes',                   c: 'Creature',   d: 1 },
    { t: 'A ghost holding a lantern',              c: 'Creature',   d: 2 },
    { t: 'A tiny dragon on a coin',                c: 'Creature',   d: 2 },
    { t: 'A salamander in a terrarium',            c: 'Creature',   d: 2 },
    { t: 'A skunk mid-strut',                      c: 'Creature',   d: 2 },
    { t: 'A capybara in a hot tub',                c: 'Creature',   d: 2 },
    { t: 'A moon jelly glowing',                   c: 'Creature',   d: 2 },
    { t: 'A hamster with a sunflower seed',        c: 'Creature',   d: 1 },

    // Food (35)
    { t: 'A slice of watermelon',                  c: 'Food',       d: 1 },
    { t: 'A stack of pancakes with syrup',         c: 'Food',       d: 2 },
    { t: 'A bowl of ramen noodles',                c: 'Food',       d: 2 },
    { t: 'A slice of pepperoni pizza',             c: 'Food',       d: 2 },
    { t: 'A frosted donut with sprinkles',        c: 'Food',       d: 2 },
    { t: 'A taco with all the fixings',            c: 'Food',       d: 2 },
    { t: 'A strawberry with leaves',               c: 'Food',       d: 1 },
    { t: 'A cupcake with a cherry on top',         c: 'Food',       d: 2 },
    { t: 'A teacup and saucer',                    c: 'Food',       d: 2 },
    { t: 'A wedge of cheese with grapes',          c: 'Food',       d: 2 },
    { t: 'A sundae with whipped cream',            c: 'Food',       d: 2 },
    { t: 'A popsicle with two flavors',            c: 'Food',       d: 1 },
    { t: 'A hot dog with mustard',                 c: 'Food',       d: 1 },
    { t: 'A bowl of ramen with egg',               c: 'Food',       d: 2 },
    { t: 'A pineapple with leaves',                c: 'Food',       d: 2 },
    { t: 'A cinnamon roll with icing',             c: 'Food',       d: 2 },
    { t: 'A milkshake with a straw',               c: 'Food',       d: 1 },
    { t: 'A lemon with a leaf',                    c: 'Food',       d: 1 },
    { t: 'A marshmallow on a stick',               c: 'Food',       d: 1 },
    { t: 'A pretzel with salt crystals',           c: 'Food',       d: 1 },
    { t: 'A taco with a bite taken out',           c: 'Food',       d: 2 },
    { t: 'A bowl of cereal with a spoon',         c: 'Food',       d: 2 },
    { t: 'A chocolate bar with squares',           c: 'Food',       d: 1 },
    { t: 'A cherry with a stem',                   c: 'Food',       d: 1 },
    { t: 'A macaron with filling',                 c: 'Food',       d: 1 },
    { t: 'A bento box with three compartments',    c: 'Food',       d: 3 },
    { t: 'A jar of honey with a dipper',           c: 'Food',       d: 2 },
    { t: 'A breakfast burrito',                    c: 'Food',       d: 2 },
    { t: 'A loaf of bread sliced',                 c: 'Food',       d: 2 },
    { t: 'A pie with a lattice top',               c: 'Food',       d: 3 },
    { t: 'A pumpkin pie slice',                    c: 'Food',       d: 2 },
    { t: 'A single french fry',                    c: 'Food',       d: 1 },
    { t: 'A pear with a leaf',                     c: 'Food',       d: 1 },
    { t: 'A blueberry cluster',                    c: 'Food',       d: 1 },
    { t: 'A peach with a pit dimple',              c: 'Food',       d: 1 },

    // Scene (30)
    { t: 'A cabin in the snow',                    c: 'Scene',      d: 3 },
    { t: 'A beach with palm trees',                c: 'Scene',      d: 3 },
    { t: 'A city skyline at sunset',               c: 'Scene',      d: 3 },
    { t: 'A mountain with a peak',                 c: 'Scene',      d: 2 },
    { t: 'A small campfire in the dark',           c: 'Scene',      d: 2 },
    { t: 'A bridge over water',                    c: 'Scene',      d: 2 },
    { t: 'A window with curtains',                 c: 'Scene',      d: 2 },
    { t: 'A door in a brick wall',                 c: 'Scene',      d: 2 },
    { t: 'A windmill on a hill',                   c: 'Scene',      d: 3 },
    { t: 'A sailboat on the water',                c: 'Scene',      d: 2 },
    { t: 'A path through a forest',                c: 'Scene',      d: 3 },
    { t: 'A castle on a cliff',                    c: 'Scene',      d: 3 },
    { t: 'A tree with a tire swing',               c: 'Scene',      d: 2 },
    { t: 'A tent under stars',                     c: 'Scene',      d: 2 },
    { t: 'A snowman in a yard',                    c: 'Scene',      d: 2 },
    { t: 'A fish tank with bubbles',               c: 'Scene',      d: 2 },
    { t: 'A street lamp on a cobblestone path',    c: 'Scene',      d: 2 },
    { t: 'A surfer riding a wave',                 c: 'Scene',      d: 2 },
    { t: 'A skier on a slope',                     c: 'Scene',      d: 2 },
    { t: 'A bonfire with sparks',                  c: 'Scene',      d: 2 },
    { t: 'A subway car window view',               c: 'Scene',      d: 3 },
    { t: 'A diner counter at night',               c: 'Scene',      d: 3 },
    { t: 'A castle gate with torches',             c: 'Scene',      d: 3 },
    { t: 'A rocket launching',                     c: 'Scene',      d: 3 },
    { t: 'A UFO abducting a cow',                  c: 'Scene',      d: 2 },
    { t: 'A pirate ship with sails',               c: 'Scene',      d: 3 },
    { t: 'A roller coaster in motion',             c: 'Scene',      d: 3 },
    { t: 'A ferris wheel at the fair',             c: 'Scene',      d: 3 },
    { t: 'A hot air balloon in the sky',           c: 'Scene',      d: 2 },
    { t: 'A snowglobe on a table',                 c: 'Scene',      d: 2 },

    // Icon (35)
    { t: 'A power button',                         c: 'Icon',       d: 1 },
    { t: 'A heart with a heartbeat line',          c: 'Icon',       d: 2 },
    { t: 'A wifi signal with three bars',          c: 'Icon',       d: 1 },
    { t: 'A bell with a notification dot',         c: 'Icon',       d: 2 },
    { t: 'A magnifying glass over a folder',       c: 'Icon',       d: 2 },
    { t: 'A gear with eight teeth',                c: 'Icon',       d: 2 },
    { t: 'A cloud with an upload arrow',           c: 'Icon',       d: 2 },
    { t: 'A save floppy disk',                     c: 'Icon',       d: 1 },
    { t: 'A padlock in a shield',                  c: 'Icon',       d: 2 },
    { t: 'A download arrow into a tray',           c: 'Icon',       d: 1 },
    { t: 'A check mark in a box',                  c: 'Icon',       d: 1 },
    { t: 'A trash can with a lid',                 c: 'Icon',       d: 1 },
    { t: 'A pencil over paper',                    c: 'Icon',       d: 1 },
    { t: 'A house icon',                           c: 'Icon',       d: 1 },
    { t: 'A settings sliders icon',                c: 'Icon',       d: 2 },
    { t: 'A calendar with a date circled',         c: 'Icon',       d: 2 },
    { t: 'A clock face at 3 o\'clock',              c: 'Icon',       d: 1 },
    { t: 'A lightning bolt striking',              c: 'Icon',       d: 1 },
    { t: 'A fire flame icon',                      c: 'Icon',       d: 1 },
    { t: 'A star with sparkle accents',            c: 'Icon',       d: 1 },
    { t: 'A music note eighth note',               c: 'Icon',       d: 1 },
    { t: 'A camera shutter icon',                  c: 'Icon',       d: 1 },
    { t: 'A microphone with sound waves',          c: 'Icon',       d: 2 },
    { t: 'A location pin with shadow',             c: 'Icon',       d: 1 },
    { t: 'A speech bubble with dots',              c: 'Icon',       d: 1 },
    { t: 'A bookmark with a ribbon',               c: 'Icon',       d: 1 },
    { t: 'An envelope with a heart seal',          c: 'Icon',       d: 2 },
    { t: 'A trophy with a star',                   c: 'Icon',       d: 2 },
    { t: 'A rocket icon',                          c: 'Icon',       d: 1 },
    { t: 'A ghost emoji style',                    c: 'Icon',       d: 1 },
    { t: 'A skull with crossbones',                c: 'Icon',       d: 2 },
    { t: 'A brain icon with sparks',               c: 'Icon',       d: 2 },
    { t: 'A diamond gem',                          c: 'Icon',       d: 1 },
    { t: 'A shopping cart',                        c: 'Icon',       d: 2 },
    { t: 'A user avatar silhouette',               c: 'Icon',       d: 1 },

    // Character (25)
    { t: 'A wizard with a tall hat',               c: 'Character',  d: 2 },
    { t: 'A knight in shining armor',              c: 'Character',  d: 3 },
    { t: 'A pirate with an eye patch',             c: 'Character',  d: 2 },
    { t: 'A robot with antennae',                  c: 'Character',  d: 2 },
    { t: 'A detective with a magnifying glass',    c: 'Character',  d: 2 },
    { t: 'An astronaut floating in space',         c: 'Character',  d: 2 },
    { t: 'A chef with a tall hat',                 c: 'Character',  d: 2 },
    { t: 'A scientist with bubbling flask',        c: 'Character',  d: 2 },
    { t: 'A farmer with a pitchfork',              c: 'Character',  d: 2 },
    { t: 'A cowboy with a hat',                    c: 'Character',  d: 2 },
    { t: 'A viking with a horned helmet',          c: 'Character',  d: 2 },
    { t: 'A ninja with a headband',                c: 'Character',  d: 2 },
    { t: 'A superhero in a cape',                  c: 'Character',  d: 2 },
    { t: 'A queen with a crown',                   c: 'Character',  d: 2 },
    { t: 'A king with a scepter',                  c: 'Character',  d: 2 },
    { t: 'A samurai with a katana',                c: 'Character',  d: 2 },
    { t: 'A pirate captain with parrot',           c: 'Character',  d: 2 },
    { t: 'A fire fighter with helmet',             c: 'Character',  d: 2 },
    { t: 'A doctor with a stethoscope',            c: 'Character',  d: 2 },
    { t: 'A magician with a wand',                 c: 'Character',  d: 2 },
    { t: 'A musician with headphones',             c: 'Character',  d: 2 },
    { t: 'A painter with a beret',                 c: 'Character',  d: 2 },
    { t: 'A gardener with a watering can',         c: 'Character',  d: 2 },
    { t: 'A hunter with a bow',                    c: 'Character',  d: 2 },
    { t: 'A beach-goer with floaties',             c: 'Character',  d: 2 },

    // Nature (25)
    { t: 'A sunflower in full bloom',              c: 'Nature',     d: 2 },
    { t: 'A cactus with two arms',                 c: 'Nature',     d: 1 },
    { t: 'A maple leaf with veins',                c: 'Nature',     d: 2 },
    { t: 'A bonsai tree in a pot',                 c: 'Nature',     d: 2 },
    { t: 'A redwood tree with height marks',       c: 'Nature',     d: 3 },
    { t: 'A rose with thorns',                     c: 'Nature',     d: 2 },
    { t: 'A daisy with eight petals',              c: 'Nature',     d: 2 },
    { t: 'A pine tree in snow',                    c: 'Nature',     d: 2 },
    { t: 'A waterfall down a cliff',               c: 'Nature',     d: 3 },
    { t: 'A boulder with moss',                    c: 'Nature',     d: 2 },
    { t: 'A full moon with craters',               c: 'Nature',     d: 2 },
    { t: 'A crescent moon with stars',             c: 'Nature',     d: 2 },
    { t: 'A volcano erupting',                     c: 'Nature',     d: 3 },
    { t: 'A wave crashing on rocks',               c: 'Nature',     d: 3 },
    { t: 'A rainbow over a hill',                  c: 'Nature',     d: 2 },
    { t: 'A thunderstorm with lightning',          c: 'Nature',     d: 2 },
    { t: 'A tree with autumn leaves',              c: 'Nature',     d: 2 },
    { t: 'A mushroom with spots',                  c: 'Nature',     d: 1 },
    { t: 'A four-leaf clover',                     c: 'Nature',     d: 1 },
    { t: 'A field of flowers',                     c: 'Nature',     d: 3 },
    { t: 'A snow-capped mountain',                 c: 'Nature',     d: 2 },
    { t: 'A sunset over the ocean',                c: 'Nature',     d: 3 },
    { t: 'A cactus in bloom',                      c: 'Nature',     d: 2 },
    { t: 'A single tall tree',                     c: 'Nature',     d: 1 },
    { t: 'A mushroom cluster',                     c: 'Nature',     d: 2 },

    // Tech (20)
    { t: 'A retro CRT monitor',                    c: 'Tech',       d: 2 },
    { t: 'A floppy disk with a label',             c: 'Tech',       d: 1 },
    { t: 'A handheld game console',                c: 'Tech',       d: 2 },
    { t: 'A keyboard with RGB glow',               c: 'Tech',       d: 2 },
    { t: 'A pixel-perfect cursor arrow',           c: 'Tech',       d: 1 },
    { t: 'A terminal window with prompt',          c: 'Tech',       d: 2 },
    { t: 'A code bracket pair',                    c: 'Tech',       d: 1 },
    { t: 'A commit dot graph',                     c: 'Tech',       d: 2 },
    { t: 'A circuit board with chips',             c: 'Tech',       d: 3 },
    { t: 'A cassette tape with label',             c: 'Tech',       d: 1 },
    { t: 'A robot vacuum with face',               c: 'Tech',       d: 2 },
    { t: 'A pixel-art heart with a slash',         c: 'Tech',       d: 1 },
    { t: 'A 404 error page in art',                c: 'Tech',       d: 2 },
    { t: 'A loading spinner of dots',              c: 'Tech',       d: 1 },
    { t: 'A wifi router with antennas',            c: 'Tech',       d: 2 },
    { t: 'A game controller (SNES style)',         c: 'Tech',       d: 2 },
    { t: 'A lightbulb with a glow',                c: 'Tech',       d: 1 },
    { t: 'A pair of CR-2032 batteries',            c: 'Tech',       d: 1 },
    { t: 'A smart watch face',                     c: 'Tech',       d: 2 },
    { t: 'A binary code string as art',            c: 'Tech',       d: 2 },
  ];

  const STORAGE_DONE = 'ajh_challenge_done_v1';
  const STORAGE_STATS = 'ajh_challenge_stats_v1';

  function dayOfYear(date) {
    const d = date || new Date();
    const start = new Date(d.getFullYear(), 0, 0);
    const diff = d - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  function dateKey(date) {
    const d = date || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORAGE_DONE) || '{}'); } catch (e) { return {}; }
  }
  function saveDone(obj) {
    try { localStorage.setItem(STORAGE_DONE, JSON.stringify(obj)); } catch (e) {}
  }
  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STORAGE_STATS) || '{}'); } catch (e) { return {}; }
  }
  function saveStats(obj) {
    try { localStorage.setItem(STORAGE_STATS, JSON.stringify(obj)); } catch (e) {}
  }

  function getPromptForDay(dayIndex) {
    return PROMPTS[dayIndex % PROMPTS.length];
  }

  function categoryColor(cat) {
    const map = {
      'Object': '#d8a657',
      'Creature': '#7a8b6f',
      'Food': '#c0573a',
      'Scene': '#5e8aa8',
      'Icon': '#8b6cc4',
      'Character': '#c44e7a',
      'Nature': '#3a9d7c',
      'Tech': '#e8c547',
    };
    return map[cat] || '#d8a657';
  }

  function difficultyLabel(d) {
    return d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard';
  }

  function render() {
    const card = document.getElementById('dc-card');
    const catBadge = document.getElementById('dc-category');
    const diffBadge = document.getElementById('dc-difficulty');
    const title = document.getElementById('dc-prompt-title');
    const sub = document.getElementById('dc-prompt-sub');
    const dayEl = document.getElementById('dc-doy');
    const dateEl = document.getElementById('dc-date');
    const paletteSwatch = document.getElementById('dc-palette-swatch');
    const progress = document.getElementById('dc-progress');
    const progressLabel = document.getElementById('dc-progress-label');
    if (!card) return;

    const now = new Date();
    const doy = dayOfYear(now);
    const today = dateKey(now);
    const prompt = getPromptForDay(doy);
    const done = loadDone();
    const isDone = !!done[today];

    title.textContent = prompt.t;
    sub.textContent = 'Daily pixel art prompt — day ' + doy + ' of the year';
    catBadge.textContent = prompt.c;
    catBadge.style.background = 'color-mix(in srgb, ' + categoryColor(prompt.c) + ' 20%, transparent)';
    catBadge.style.color = categoryColor(prompt.c);
    catBadge.style.borderColor = categoryColor(prompt.c);
    diffBadge.textContent = difficultyLabel(prompt.d);
    dayEl.textContent = '#' + doy;
    dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    paletteSwatch.style.background = categoryColor(prompt.c);

    // Mark card with done state
    card.classList.toggle('dc-done', isDone);
    progress.textContent = isDone ? '✓ Completed today' : 'Not yet started';
    progressLabel.textContent = isDone ? 'Mark as not done' : 'Mark as done';

    // Update day number and stats
    const stats = loadStats();
    document.getElementById('dc-streak').textContent = computeStreak(done);
    document.getElementById('dc-completed').textContent = Object.keys(done).length;
    document.getElementById('dc-reroll').textContent = stats.rerolls || 0;
    document.getElementById('dc-total').textContent = PROMPTS.length;
  }

  function computeStreak(done) {
    // Walk back from today counting consecutive done days
    const now = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const k = dateKey(d);
      if (done[k]) streak++;
      else break;
    }
    return streak;
  }

  function rerollToday() {
    // Bump a "today index" offset so today's prompt changes
    const stats = loadStats();
    const now = new Date();
    const doy = dayOfYear(now);
    // Use a date-seeded override map (date -> override index)
    const overrides = stats.overrides || {};
    const today = dateKey(now);
    // Pick a random prompt that's NOT the current one
    let next;
    do {
      next = Math.floor(Math.random() * PROMPTS.length);
    } while (next === (doy % PROMPTS.length));
    overrides[today] = next;
    stats.overrides = overrides;
    stats.rerolls = (stats.rerolls || 0) + 1;
    saveStats(stats);
    renderOverride(doy, next);
    showToast('Reroll! New prompt for today.');
  }

  function renderOverride(doy, idx) {
    // If today has an override, use that instead of the deterministic prompt
    const prompt = getPromptForDay(idx);
    const title = document.getElementById('dc-prompt-title');
    const catBadge = document.getElementById('dc-category');
    const diffBadge = document.getElementById('dc-difficulty');
    const paletteSwatch = document.getElementById('dc-palette-swatch');
    title.textContent = prompt.t;
    catBadge.textContent = prompt.c;
    catBadge.style.background = 'color-mix(in srgb, ' + categoryColor(prompt.c) + ' 20%, transparent)';
    catBadge.style.color = categoryColor(prompt.c);
    catBadge.style.borderColor = categoryColor(prompt.c);
    diffBadge.textContent = difficultyLabel(prompt.d);
    paletteSwatch.style.background = categoryColor(prompt.c);
  }

  function maybeRenderOverride() {
    const stats = loadStats();
    if (!stats.overrides) return;
    const today = dateKey();
    if (stats.overrides[today] != null) {
      const doy = dayOfYear();
      renderOverride(doy, stats.overrides[today]);
    }
  }

  function toggleDone() {
    const done = loadDone();
    const today = dateKey();
    if (done[today]) {
      delete done[today];
      showToast('Marked as not done');
    } else {
      done[today] = { ts: Date.now() };
      showToast('Completed today! 🎨');
      // Confetti burst on completion
      if (window.confetti) {
        try { window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch (e) {}
      }
    }
    saveDone(done);
    render();
  }

  function openPixelArt() {
    // Hook into the existing Pixel Art Studio
    const now = new Date();
    const doy = dayOfYear(now);
    const stats = loadStats();
    const today = dateKey();
    let prompt = getPromptForDay(doy);
    if (stats.overrides && stats.overrides[today] != null) {
      prompt = getPromptForDay(stats.overrides[today]);
    }
    const name = 'Daily #' + doy + ' — ' + prompt.t;

    // Try to use existing pixel art API
    if (typeof window.ajhPixelArtOpen === 'function') {
      window.ajhPixelArtOpen();
      // Pre-fill the save modal input
      setTimeout(() => {
        const input = document.getElementById('pixelart-modal-input');
        if (input) {
          input.value = name;
          // Mark the prompt as the active draw target via a global hint
          window.__ajhDailyChallengeActive = prompt.t;
        }
      }, 200);
      showToast('Prompt loaded — paint and save!');
    } else {
      // Fallback: just scroll to pixel art
      const sec = document.getElementById('pixelart');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function shareChallenge() {
    const now = new Date();
    const doy = dayOfYear(now);
    const stats = loadStats();
    const today = dateKey();
    let prompt = getPromptForDay(doy);
    if (stats.overrides && stats.overrides[today] != null) {
      prompt = getPromptForDay(stats.overrides[today]);
    }
    const text = '🎨 Daily Pixel Challenge #' + doy + ' — ' + prompt.t + ' (' + prompt.c + '). Today\'s prompt from the AJH 68-Day Build Streak.';
    const url = window.location.origin + window.location.pathname + '#dailychallenge';
    if (navigator.share) {
      navigator.share({ title: 'Daily Pixel Challenge', text: text, url: url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' ' + url).then(() => showToast('Copied prompt + link ✓'));
    } else {
      showToast(text);
    }
  }

  function exportJSON() {
    const data = {
      exported: new Date().toISOString(),
      today: { day: dayOfYear(), prompt: getPromptForDay(dayOfYear()) },
      stats: loadStats(),
      done: loadDone(),
      bank: { size: PROMPTS.length, categories: countByCategory() },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'daily-pixel-challenge-' + dateKey() + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    showToast('Exported challenge data');
  }

  function countByCategory() {
    const map = {};
    PROMPTS.forEach((p) => { map[p.c] = (map[p.c] || 0) + 1; });
    return map;
  }

  function showToast(msg) {
    // Reuse the pixel art toast style if available, else a quick one
    let t = document.getElementById('pixelart-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'pixelart-toast';
      t.className = 'pixelart-toast';
      t.hidden = true;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    t.classList.add('show');
    clearTimeout(t._timeout);
    t._timeout = setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => { t.hidden = true; }, 300);
    }, 1800);
  }

  function attachEvents() {
    document.getElementById('dc-start-btn').addEventListener('click', openPixelArt);
    document.getElementById('dc-reroll-btn').addEventListener('click', rerollToday);
    document.getElementById('dc-share-btn').addEventListener('click', shareChallenge);
    document.getElementById('dc-export-btn').addEventListener('click', exportJSON);
    document.getElementById('dc-done-btn').addEventListener('click', toggleDone);

    // Keyboard shortcut: "D" to reroll when section is in view
    document.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key && e.key.toLowerCase() === 'd') {
        const sec = document.getElementById('dailychallenge');
        if (sec) {
          const r = sec.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            rerollToday();
          }
        }
      }
    });
  }

  function init() {
    if (!document.getElementById('dc-card')) return;
    render();
    maybeRenderOverride();
    attachEvents();

    // Expose a jump-to API for the command palette
    window.ajhDailyChallengeOpen = () => {
      const sec = document.getElementById('dailychallenge');
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
