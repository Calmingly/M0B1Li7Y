export const MUSCLE_GROUPS = ["All", "Shoulders", "Core", "Back", "Hips", "Legs"];
export const PHASES = ["All", "Warmup", "Reset", "Strength", "Mobility", "Cooldown", "Finish"];

export const movementLibrary = [
  {
    id: "armcircles",
    name: "Arm Circles",
    phase: "Warmup",
    muscles: ["Shoulders"],
    cue: "Smooth shoulder circles.",
    howto: "Keep circles smooth and controlled in both directions. Start small and gradually widen.",
    image: "armcircles.png",
    durationSec: 30
  },
  {
    id: "trunkrotation",
    name: "Trunk Rotations",
    phase: "Warmup",
    muscles: ["Back", "Core"],
    cue: "Rotate gently side to side.",
    howto: "Keep hips squared forward as you rotate your upper body. Breathe out on each rotation.",
    image: "trunkrotation.png",
    durationSec: 30
  },
  {
    id: "sidebends",
    name: "Side Bends",
    phase: "Warmup",
    muscles: ["Back", "Core"],
    cue: "Reach and lengthen each side.",
    howto: "Slide your hand down your thigh, keep your core engaged. Hold briefly at the bottom.",
    image: "sidebends.png",
    durationSec: 30
  },
  {
    id: "legswings",
    name: "Leg Swings",
    phase: "Warmup",
    muscles: ["Hips", "Legs"],
    cue: "Keep hips stable and controlled.",
    howto: "Hold a wall for balance, swing leg forward and back in a controlled arc. Build amplitude gradually.",
    image: "legswings.png",
    durationSec: 30
  },
  {
    id: "overheadreach",
    name: "Overhead Reach",
    phase: "Reset",
    muscles: ["Shoulders", "Back"],
    cue: "Stand tall and reach up smoothly.",
    howto: "Interlace fingers and press palms upward, hold at top for a beat. Breathe into your ribcage.",
    image: "overheadreach.png",
    durationSec: 30
  },
  {
    id: "counterpushups",
    name: "Counter Pushups",
    phase: "Strength",
    muscles: ["Shoulders", "Core"],
    cue: "Complete 10–15 quality reps.",
    howto: "Keep body in a plank line, lower chest toward surface with control. Elbows at 45°.",
    image: "counterpushups.png",
    durationSec: null
  },
  {
    id: "plank",
    name: "Plank",
    phase: "Strength",
    muscles: ["Core", "Shoulders"],
    cue: "Brace core and keep a straight line.",
    howto: "Stack shoulders over wrists, press floor away, breathe steady. Don't let hips sag.",
    image: "plank.png",
    durationSec: 60
  },
  {
    id: "kneestochest",
    name: "Knees To Chest",
    phase: "Mobility",
    muscles: ["Hips", "Back"],
    cue: "Alternate sides with steady posture.",
    howto: "Lie on back, pull one knee at a time toward chest, hold briefly. Keep lower back pressed flat.",
    image: "kneestochest.png",
    durationSec: 30
  },
  {
    id: "toetouchtwist",
    name: "Toe Touch Twist",
    phase: "Mobility",
    muscles: ["Hips", "Legs", "Back"],
    cue: "Move slowly and avoid bouncing.",
    howto: "Reach opposite hand to foot in a controlled rotation. Pause at the bottom of each reach.",
    image: "toetouchtwist.png",
    durationSec: 30
  },
  {
    id: "figurefour",
    name: "Figure Four",
    phase: "Mobility",
    muscles: ["Hips", "Legs"],
    cue: "Switch sides halfway and breathe.",
    howto: "Cross ankle over knee, gently push knee outward to feel the hip stretch. Breathe into the tension.",
    image: "lyingfigurefour.png",
    durationSec: 40
  },
  {
    id: "childpose",
    name: "Child Pose",
    phase: "Cooldown",
    muscles: ["Back", "Shoulders", "Hips"],
    cue: "Relax your neck and breathe deeply.",
    howto: "Kneel and reach arms forward, let your chest drop toward the floor. Walk hands out for a deeper stretch.",
    image: "childspose.png",
    durationSec: 45
  },
  {
    id: "briskwalk",
    name: "Brisk Walk",
    phase: "Finish",
    muscles: ["Legs"],
    cue: "Walk with intent to finish strong.",
    howto: "Swing arms and keep a purposeful upright pace. Eyes forward, shoulders relaxed.",
    image: "briskwalk.png",
    durationSec: 180
  },
  {
    id: "hipCircles",
    name: "Hip Circles",
    phase: "Warmup",
    muscles: ["Hips", "Core"],
    cue: "Large slow circles each direction.",
    howto: "Feet hip-width, hands on hips. Draw slow wide circles, 5 each direction. Keep knees soft.",
    image: "armcircles.png",
    durationSec: 30
  },
  {
    id: "catcow",
    name: "Cat-Cow",
    phase: "Mobility",
    muscles: ["Back", "Core"],
    cue: "Sync breath with movement.",
    howto: "On all fours: arch back on inhale (Cow), round spine on exhale (Cat). Keep movement fluid.",
    image: "childspose.png",
    durationSec: 40
  },
  {
    id: "shoulderRolls",
    name: "Shoulder Rolls",
    phase: "Cooldown",
    muscles: ["Shoulders", "Back"],
    cue: "Roll back then forward slowly.",
    howto: "Let arms hang, roll shoulders up toward ears, back, down. Reverse after 5. Keep breathing.",
    image: "armcircles.png",
    durationSec: 30
  },
  {
    id: "standingHamstring",
    name: "Standing Hamstring",
    phase: "Cooldown",
    muscles: ["Legs", "Back"],
    cue: "Hinge and breathe into the stretch.",
    howto: "Stand tall, hinge at hips with soft knees, reach toward shins. Hold 3 breaths each side.",
    image: "toetouchtwist.png",
    durationSec: 40
  },
  {
    id: "lateralLunge",
    name: "Lateral Lunge",
    phase: "Mobility",
    muscles: ["Legs", "Hips"],
    cue: "Shift weight side to side slowly.",
    howto: "Wide stance, shift weight onto one leg bending that knee. Keep chest up. Alternate sides.",
    image: "legswings.png",
    durationSec: 40
  },
  {
    id: "deadBug",
    name: "Dead Bug",
    phase: "Strength",
    muscles: ["Core"],
    cue: "Opposite arm and leg, low back flat.",
    howto: "Lie on back, arms up, knees at 90°. Extend opposite arm/leg toward floor. Press low back down throughout.",
    image: "plank.png",
    durationSec: 45
  },
  {
    id: "neckRolls",
    name: "Neck Rolls",
    phase: "Warmup",
    muscles: ["Shoulders"],
    cue: "Slow half-circles, no full rotation.",
    howto: "Drop ear to shoulder, roll chin toward chest, up to other shoulder. Gentle, no crunching.",
    image: "armcircles.png",
    durationSec: 30
  },
  {
    id: "thoracicRotation",
    name: "Thoracic Rotation",
    phase: "Reset",
    muscles: ["Back", "Shoulders"],
    cue: "Rotate from the mid-back, not the neck.",
    howto: "Seated or on all fours, place hand behind head, rotate elbow toward ceiling. 5 each side.",
    image: "trunkrotation.png",
    durationSec: 35
  }
];

export function filterMovements({ muscle = "All", phase = "All" } = {}) {
  return movementLibrary.filter(
    (m) =>
      (muscle === "All" || m.muscles.includes(muscle)) &&
      (phase === "All" || m.phase === phase)
  );
}

export function getMovementById(id) {
  return movementLibrary.find((m) => m.id === id) || null;
}

export const BODY_FOCUS_OPTIONS = [
  { value: "full",      label: "Full Body",  muscles: [] },
  { value: "shoulders", label: "Shoulders",  muscles: ["Shoulders"] },
  { value: "core",      label: "Core",       muscles: ["Core"] },
  { value: "back",      label: "Back",       muscles: ["Back"] },
  { value: "hips",      label: "Hips",       muscles: ["Hips"] },
  { value: "legs",      label: "Legs",       muscles: ["Legs"] }
];
