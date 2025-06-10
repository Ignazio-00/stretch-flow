import type { StretchExercise } from "@/types";

export const stretchExercises: StretchExercise[] = [
  // Neck exercises
  {
    id: "neck-side-stretch",
    name: "Neck Side Stretch",
    description: "Gentle stretch for the sides of your neck",
    duration: 30,
    category: "neck",
    targetMuscles: ["Upper trapezius", "Levator scapulae"],
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format",
    instructions: [
      "Sit or stand with your spine straight",
      "Slowly tilt your head to the right, bringing your ear toward your shoulder",
      "Hold the stretch and breathe deeply",
      "Return to center and repeat on the left side",
    ],
  },
  {
    id: "neck-forward-stretch",
    name: "Neck Forward Stretch",
    description: "Stretch for the back of your neck",
    duration: 30,
    category: "neck",
    targetMuscles: ["Upper cervical muscles", "Suboccipital muscles"],
    difficulty: "beginner",
    instructions: [
      "Sit with your back straight",
      "Slowly lower your chin toward your chest",
      "Place your hands gently on the back of your head",
      "Apply light pressure and hold the stretch",
    ],
  },

  // Shoulder exercises
  {
    id: "shoulder-rolls",
    name: "Shoulder Rolls",
    description: "Dynamic movement to loosen shoulder tension",
    duration: 45,
    category: "shoulders",
    targetMuscles: ["Deltoids", "Trapezius", "Rhomboids"],
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&auto=format",
    instructions: [
      "Stand with feet hip-width apart",
      "Lift your shoulders up toward your ears",
      "Roll them back and down in a circular motion",
      "Repeat 10 times forward, then 10 times backward",
    ],
  },
  {
    id: "cross-body-shoulder-stretch",
    name: "Cross-Body Shoulder Stretch",
    description: "Stretch for the posterior deltoid and shoulder capsule",
    duration: 60,
    category: "shoulders",
    targetMuscles: ["Posterior deltoid", "Infraspinatus"],
    difficulty: "beginner",
    instructions: [
      "Bring your right arm across your chest",
      "Use your left hand to gently pull your right arm closer",
      "Hold for 30 seconds",
      "Switch arms and repeat",
    ],
  },

  // Back exercises
  {
    id: "cat-cow-stretch",
    name: "Cat-Cow Stretch",
    description: "Dynamic stretch for spinal mobility",
    duration: 60,
    category: "back",
    targetMuscles: ["Erector spinae", "Multifidus", "Abdominals"],
    difficulty: "beginner",
    imageUrl:
      "https://images.unsplash.com/photo-1506629905877-4d8c9f92ddb0?w=400&h=400&fit=crop&auto=format",
    instructions: [
      "Get on your hands and knees",
      "Arch your back and look up (Cow pose)",
      "Round your back toward the ceiling (Cat pose)",
      "Continue alternating between positions slowly",
    ],
  },
  {
    id: "seated-spinal-twist",
    name: "Seated Spinal Twist",
    description: "Gentle twist to improve spinal rotation",
    duration: 60,
    category: "back",
    targetMuscles: ["Obliques", "Erector spinae", "Quadratus lumborum"],
    difficulty: "beginner",
    instructions: [
      "Sit tall in your chair",
      "Place your right hand on your left knee",
      "Slowly twist your torso to the left",
      "Hold for 30 seconds, then repeat on the other side",
    ],
  },

  // Wrist exercises
  {
    id: "wrist-circles",
    name: "Wrist Circles",
    description: "Improve wrist mobility and circulation",
    duration: 30,
    category: "wrists",
    targetMuscles: ["Wrist flexors", "Wrist extensors"],
    difficulty: "beginner",
    instructions: [
      "Extend your arms in front of you",
      "Make slow circles with your wrists",
      "Circle 10 times in each direction",
      "Keep movements smooth and controlled",
    ],
  },
  {
    id: "prayer-stretch",
    name: "Prayer Stretch",
    description: "Stretch for wrist flexors",
    duration: 45,
    category: "wrists",
    targetMuscles: ["Wrist flexors", "Forearm muscles"],
    difficulty: "beginner",
    instructions: [
      "Press your palms together in front of your chest",
      "Lower your hands while keeping palms pressed together",
      "Stop when you feel a gentle stretch in your wrists",
      "Hold the position and breathe deeply",
    ],
  },

  // Hip exercises
  {
    id: "hip-flexor-stretch",
    name: "Standing Hip Flexor Stretch",
    description: "Stretch tight hip flexors from prolonged sitting",
    duration: 60,
    category: "hips",
    targetMuscles: ["Hip flexors", "Psoas", "Rectus femoris"],
    difficulty: "intermediate",
    instructions: [
      "Step your right foot forward into a lunge position",
      "Keep your left leg straight behind you",
      "Push your hips forward gently",
      "Hold for 30 seconds, then switch sides",
    ],
  },
  {
    id: "figure-four-stretch",
    name: "Figure-Four Hip Stretch",
    description: "Stretch for the piriformis and hip external rotators",
    duration: 90,
    category: "hips",
    targetMuscles: ["Piriformis", "Glutes", "Hip external rotators"],
    difficulty: "intermediate",
    instructions: [
      "Sit in a chair with your back straight",
      "Place your right ankle on your left knee",
      "Gently lean forward until you feel a stretch",
      "Hold for 45 seconds, then switch sides",
    ],
  },

  // Full-body exercises
  {
    id: "morning-energizer",
    name: "Morning Energizer",
    description: "Full-body wake-up stretch sequence",
    duration: 120,
    category: "full-body",
    targetMuscles: ["Multiple muscle groups"],
    difficulty: "beginner",
    instructions: [
      "Stand tall and reach your arms overhead",
      "Gently lean to each side",
      "Roll your shoulders and neck",
      "Touch your toes with a forward fold",
      "Return to standing with arms overhead",
    ],
  },
];

export const quickStretchSessions = {
  deskBreak: {
    name: "Desk Break",
    duration: 120,
    exercises: stretchExercises.filter((ex) =>
      ["neck-side-stretch", "shoulder-rolls", "wrist-circles"].includes(ex.id)
    ),
  },
  meetingPrep: {
    name: "Pre-Meeting Energizer",
    duration: 90,
    exercises: stretchExercises.filter((ex) =>
      [
        "neck-forward-stretch",
        "shoulder-rolls",
        "seated-spinal-twist",
      ].includes(ex.id)
    ),
  },
  afternoonBoost: {
    name: "Afternoon Energy Boost",
    duration: 180,
    exercises: stretchExercises.filter((ex) =>
      [
        "cat-cow-stretch",
        "hip-flexor-stretch",
        "cross-body-shoulder-stretch",
      ].includes(ex.id)
    ),
  },
};

export function getExercisesByCategory(category: string): StretchExercise[] {
  return stretchExercises.filter((exercise) => exercise.category === category);
}

export function getExerciseById(id: string): StretchExercise | undefined {
  return stretchExercises.find((exercise) => exercise.id === id);
}

export function getRandomQuickStretch(): StretchExercise[] {
  const quickExercises = stretchExercises.filter((ex) => ex.duration <= 60);
  const shuffled = [...quickExercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2); // Return 2 random quick exercises
}

export function getQuickSession(type: string) {
  switch (type) {
    case "quick":
      return {
        name: "Quick Stretch",
        exercises: getRandomQuickStretch(),
      };
    case "desk":
      return quickStretchSessions.deskBreak;
    case "morning":
      return {
        name: "Morning Flow",
        exercises: stretchExercises.filter((ex) =>
          ["morning-energizer", "neck-side-stretch", "shoulder-rolls"].includes(
            ex.id
          )
        ),
      };
    case "evening":
      return {
        name: "Evening Wind-Down",
        exercises: stretchExercises.filter((ex) =>
          [
            "neck-forward-stretch",
            "seated-spinal-twist",
            "figure-four-stretch",
          ].includes(ex.id)
        ),
      };
    case "posture":
      return {
        name: "Posture Reset",
        exercises: stretchExercises.filter((ex) =>
          [
            "cat-cow-stretch",
            "cross-body-shoulder-stretch",
            "hip-flexor-stretch",
          ].includes(ex.id)
        ),
      };
    default:
      return null;
  }
}
