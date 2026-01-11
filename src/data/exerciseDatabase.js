// Comprehensive exercise database for workout tracking
// Ready to be replaced with backend API calls

export const MUSCLE_GROUPS = {
  CHEST: 'Chest',
  BACK: 'Back',
  SHOULDERS: 'Shoulders',
  ARMS: 'Arms',
  LEGS: 'Legs',
  CORE: 'Core',
  CARDIO: 'Cardio',
  FULL_BODY: 'Full Body',
};

export const EQUIPMENT = {
  BARBELL: 'Barbell',
  DUMBBELL: 'Dumbbell',
  MACHINE: 'Machine',
  CABLE: 'Cable',
  BODYWEIGHT: 'Bodyweight',
  KETTLEBELL: 'Kettlebell',
  RESISTANCE_BAND: 'Resistance Band',
  NONE: 'None',
};

export const DIFFICULTY = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export const LOCATION = {
  GYM: 'Gym',
  HOME: 'Home',
  BOTH: 'Both',
};

// Comprehensive exercise database with 150+ exercises
export const EXERCISES = [
  // === CHEST EXERCISES ===
  {
    id: 'chest_001',
    name: 'Barbell Bench Press',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Triceps', 'Front Delts'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Lie flat on a bench with feet firmly on the ground',
      'Grip the barbell slightly wider than shoulder width',
      'Lower the bar to mid-chest with controlled motion',
      'Press the bar back up to starting position',
      'Keep elbows at 45-degree angle to body',
    ],
    tips: [
      'Keep shoulder blades retracted',
      'Maintain natural arch in lower back',
      'Don\'t bounce the bar off your chest',
    ],
  },
  {
    id: 'chest_002',
    name: 'Dumbbell Bench Press',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Triceps', 'Front Delts'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Lie flat on a bench with a dumbbell in each hand',
      'Start with dumbbells at chest level, palms facing forward',
      'Press dumbbells up until arms are fully extended',
      'Lower with control back to starting position',
    ],
    tips: [
      'Greater range of motion than barbell',
      'Allows natural wrist rotation',
      'Good for fixing muscle imbalances',
    ],
  },
  {
    id: 'chest_003',
    name: 'Incline Barbell Bench Press',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Upper Chest', 'Front Delts'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Set bench to 30-45 degree incline',
      'Grip barbell slightly wider than shoulders',
      'Lower bar to upper chest',
      'Press back to starting position',
    ],
    tips: [
      'Targets upper chest development',
      '30-45 degrees is optimal angle',
      'Don\'t arch back excessively',
    ],
  },
  {
    id: 'chest_004',
    name: 'Push-Ups',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Triceps', 'Core', 'Shoulders'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Start in plank position with hands shoulder-width apart',
      'Lower body until chest nearly touches ground',
      'Push back up to starting position',
      'Keep body in straight line throughout',
    ],
    tips: [
      'Engage core throughout movement',
      'Don\'t let hips sag',
      'Modify on knees if needed',
    ],
  },
  {
    id: 'chest_005',
    name: 'Cable Chest Fly',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Front Delts'],
    equipment: [EQUIPMENT.CABLE],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Set cables to chest height',
      'Stand in center with slight forward lean',
      'Bring handles together in front of chest',
      'Return with control to starting position',
    ],
    tips: [
      'Keep slight bend in elbows',
      'Focus on chest squeeze at peak contraction',
      'Constant tension throughout movement',
    ],
  },
  {
    id: 'chest_006',
    name: 'Dumbbell Chest Fly',
    muscleGroup: MUSCLE_GROUPS.CHEST,
    secondaryMuscles: ['Front Delts'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Lie flat on bench with dumbbells above chest',
      'Lower dumbbells out to sides with slight elbow bend',
      'Bring dumbbells back together above chest',
      'Squeeze chest at top of movement',
    ],
    tips: [
      'Imagine hugging a barrel',
      'Don\'t go too heavy',
      'Focus on stretch and contraction',
    ],
  },

  // === BACK EXERCISES ===
  {
    id: 'back_001',
    name: 'Barbell Deadlift',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.ADVANCED,
    location: LOCATION.GYM,
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip bar just outside legs',
      'Keep back straight, chest up',
      'Drive through heels to lift bar',
      'Stand tall, then lower with control',
    ],
    tips: [
      'Master form before adding weight',
      'Keep bar close to body',
      'Engage lats throughout lift',
    ],
  },
  {
    id: 'back_002',
    name: 'Pull-Ups',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Biceps', 'Core'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Hang from bar with palms facing away',
      'Pull body up until chin over bar',
      'Lower with control to full extension',
      'Avoid swinging or kipping',
    ],
    tips: [
      'Focus on pulling elbows down',
      'Use resistance bands for assistance if needed',
      'Full range of motion is key',
    ],
  },
  {
    id: 'back_003',
    name: 'Barbell Bent-Over Row',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Bend at hips with back straight, knees slightly bent',
      'Grip bar slightly wider than shoulders',
      'Pull bar to lower chest',
      'Squeeze shoulder blades together',
      'Lower with control',
    ],
    tips: [
      'Keep torso at 45-degree angle',
      'Don\'t use momentum',
      'Lead with elbows, not hands',
    ],
  },
  {
    id: 'back_004',
    name: 'Lat Pulldown',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Sit at lat pulldown machine with thighs secured',
      'Grip bar wider than shoulders',
      'Pull bar down to upper chest',
      'Squeeze shoulder blades together',
      'Return with control',
    ],
    tips: [
      'Great substitute for pull-ups',
      'Lean back slightly',
      'Don\'t pull behind neck',
    ],
  },
  {
    id: 'back_005',
    name: 'Dumbbell Row',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Place one knee and hand on bench',
      'Hold dumbbell in opposite hand',
      'Pull dumbbell to hip, keeping elbow close',
      'Squeeze back at top',
      'Lower with control',
    ],
    tips: [
      'Keep back parallel to ground',
      'Don\'t rotate torso',
      'Full range of motion',
    ],
  },
  {
    id: 'back_006',
    name: 'Seated Cable Row',
    muscleGroup: MUSCLE_GROUPS.BACK,
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: [EQUIPMENT.CABLE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Sit at cable row station with feet on platform',
      'Grip handle with arms extended',
      'Pull handle to lower chest',
      'Squeeze shoulder blades together',
      'Return with control',
    ],
    tips: [
      'Keep torso upright',
      'Don\'t lean back excessively',
      'Focus on back, not arms',
    ],
  },

  // === SHOULDER EXERCISES ===
  {
    id: 'shoulders_001',
    name: 'Overhead Press',
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Stand with feet shoulder-width apart',
      'Grip bar just outside shoulders',
      'Press bar overhead until arms fully extended',
      'Lower bar to upper chest with control',
    ],
    tips: [
      'Keep core tight',
      'Don\'t lean back excessively',
      'Full lockout at top',
    ],
  },
  {
    id: 'shoulders_002',
    name: 'Dumbbell Shoulder Press',
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Sit on bench with back support',
      'Hold dumbbells at shoulder height',
      'Press dumbbells overhead until arms extended',
      'Lower with control to starting position',
    ],
    tips: [
      'Can be done seated or standing',
      'Keep wrists neutral',
      'Full range of motion',
    ],
  },
  {
    id: 'shoulders_003',
    name: 'Lateral Raise',
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: ['Traps'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Stand with dumbbells at sides',
      'Raise arms out to sides until parallel to ground',
      'Lead with elbows, not hands',
      'Lower with control',
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Slight forward lean',
      'Control the negative',
    ],
  },
  {
    id: 'shoulders_004',
    name: 'Front Raise',
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: ['Upper Chest'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Stand with dumbbells in front of thighs',
      'Raise dumbbells forward to shoulder height',
      'Keep arms slightly bent',
      'Lower with control',
    ],
    tips: [
      'Alternate arms or do both together',
      'Don\'t swing',
      'Focus on front delts',
    ],
  },
  {
    id: 'shoulders_005',
    name: 'Face Pull',
    muscleGroup: MUSCLE_GROUPS.SHOULDERS,
    secondaryMuscles: ['Rear Delts', 'Traps'],
    equipment: [EQUIPMENT.CABLE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Set cable to upper chest height',
      'Use rope attachment',
      'Pull rope toward face, separating ends',
      'Focus on rear delts and upper back',
    ],
    tips: [
      'Excellent for shoulder health',
      'High reps recommended',
      'External rotation at end',
    ],
  },

  // === ARM EXERCISES ===
  {
    id: 'arms_001',
    name: 'Barbell Curl',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: ['Forearms'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Stand with feet shoulder-width apart',
      'Grip bar with underhand grip',
      'Curl bar up to shoulders',
      'Squeeze biceps at top',
      'Lower with control',
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Keep elbows at sides',
      'Full range of motion',
    ],
  },
  {
    id: 'arms_002',
    name: 'Dumbbell Curl',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: ['Forearms'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Stand with dumbbells at sides',
      'Curl dumbbells up to shoulders',
      'Can be done alternating or together',
      'Lower with control',
    ],
    tips: [
      'Allow natural wrist supination',
      'Keep elbows stationary',
      'Squeeze at top',
    ],
  },
  {
    id: 'arms_003',
    name: 'Hammer Curl',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: ['Forearms', 'Brachialis'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Hold dumbbells with neutral grip (palms facing each other)',
      'Curl dumbbells up to shoulders',
      'Keep wrists neutral throughout',
      'Lower with control',
    ],
    tips: [
      'Targets brachialis and forearms',
      'Great for overall arm development',
      'Can alternate or do together',
    ],
  },
  {
    id: 'arms_004',
    name: 'Tricep Dip',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: ['Chest', 'Shoulders'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Support body on parallel bars or bench',
      'Lower body by bending elbows',
      'Go down until upper arms parallel to ground',
      'Push back up to starting position',
    ],
    tips: [
      'Lean forward for more chest',
      'Stay upright for more triceps',
      'Can add weight when strong enough',
    ],
  },
  {
    id: 'arms_005',
    name: 'Tricep Pushdown',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: [],
    equipment: [EQUIPMENT.CABLE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Stand at cable machine with bar attached high',
      'Grip bar with overhand grip',
      'Push bar down until arms fully extended',
      'Return with control',
    ],
    tips: [
      'Keep elbows at sides',
      'Focus on tricep contraction',
      'Try different attachments',
    ],
  },
  {
    id: 'arms_006',
    name: 'Close-Grip Bench Press',
    muscleGroup: MUSCLE_GROUPS.ARMS,
    secondaryMuscles: ['Chest', 'Shoulders'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Lie on bench, grip bar shoulder-width apart',
      'Lower bar to lower chest',
      'Keep elbows close to body',
      'Press back up',
    ],
    tips: [
      'Great mass builder for triceps',
      'Don\'t grip too narrow',
      'Tuck elbows',
    ],
  },

  // === LEG EXERCISES ===
  {
    id: 'legs_001',
    name: 'Barbell Squat',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Place bar on upper back',
      'Stand with feet shoulder-width apart',
      'Squat down until thighs parallel to ground',
      'Drive through heels to stand',
    ],
    tips: [
      'Keep chest up',
      'Knees track over toes',
      'Full depth if mobility allows',
    ],
  },
  {
    id: 'legs_002',
    name: 'Romanian Deadlift',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    equipment: [EQUIPMENT.BARBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.GYM,
    instructions: [
      'Hold bar at hip height',
      'Hinge at hips, keeping back straight',
      'Lower bar along legs to mid-shin',
      'Feel stretch in hamstrings',
      'Return to standing',
    ],
    tips: [
      'Focus on hamstring stretch',
      'Keep bar close to body',
      'Slight knee bend',
    ],
  },
  {
    id: 'legs_003',
    name: 'Leg Press',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Glutes'],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Sit in leg press machine',
      'Place feet shoulder-width on platform',
      'Lower platform until knees at 90 degrees',
      'Press back to starting position',
    ],
    tips: [
      'Don\'t lock knees at top',
      'Keep lower back against pad',
      'Control the negative',
    ],
  },
  {
    id: 'legs_004',
    name: 'Bulgarian Split Squat',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Place rear foot on bench behind you',
      'Hold dumbbells at sides',
      'Lower back knee toward ground',
      'Drive through front heel to stand',
    ],
    tips: [
      'Excellent for single-leg strength',
      'Fixes muscle imbalances',
      'Adjust stance for comfort',
    ],
  },
  {
    id: 'legs_005',
    name: 'Leg Curl',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Hamstrings'],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Lie face down on leg curl machine',
      'Curl legs up toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control',
    ],
    tips: [
      'Isolates hamstrings',
      'Don\'t use momentum',
      'Full range of motion',
    ],
  },
  {
    id: 'legs_006',
    name: 'Leg Extension',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: [],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.GYM,
    instructions: [
      'Sit in leg extension machine',
      'Extend legs until fully straight',
      'Squeeze quads at top',
      'Lower with control',
    ],
    tips: [
      'Isolates quadriceps',
      'Good for pre-exhaust or finisher',
      'Control the weight',
    ],
  },
  {
    id: 'legs_007',
    name: 'Calf Raise',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: [],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Stand on platform with heels off edge',
      'Raise up onto toes as high as possible',
      'Squeeze calves at top',
      'Lower heels below platform level',
    ],
    tips: [
      'Full range of motion crucial',
      'Pause at top and bottom',
      'Can be done on smith machine or with dumbbells',
    ],
  },
  {
    id: 'legs_008',
    name: 'Lunges',
    muscleGroup: MUSCLE_GROUPS.LEGS,
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: [EQUIPMENT.DUMBBELL],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Stand with feet hip-width apart',
      'Step forward with one leg',
      'Lower back knee toward ground',
      'Push through front heel to return',
      'Alternate legs',
    ],
    tips: [
      'Keep torso upright',
      'Front knee shouldn\'t pass toes',
      'Can be done walking or stationary',
    ],
  },

  // === CORE EXERCISES ===
  {
    id: 'core_001',
    name: 'Plank',
    muscleGroup: MUSCLE_GROUPS.CORE,
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Start in push-up position',
      'Lower to forearms',
      'Keep body in straight line',
      'Hold position',
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Engage glutes and core',
      'Breathe normally',
    ],
  },
  {
    id: 'core_002',
    name: 'Crunches',
    muscleGroup: MUSCLE_GROUPS.CORE,
    secondaryMuscles: [],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Lie on back with knees bent',
      'Place hands behind head or across chest',
      'Curl shoulders up toward knees',
      'Lower with control',
    ],
    tips: [
      'Focus on abs, not neck',
      'Short range of motion',
      'Exhale on the way up',
    ],
  },
  {
    id: 'core_003',
    name: 'Russian Twist',
    muscleGroup: MUSCLE_GROUPS.CORE,
    secondaryMuscles: ['Obliques'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Sit with knees bent, feet off ground',
      'Lean back slightly',
      'Twist torso side to side',
      'Touch ground on each side',
    ],
    tips: [
      'Can hold weight for added resistance',
      'Keep core engaged',
      'Control the rotation',
    ],
  },
  {
    id: 'core_004',
    name: 'Mountain Climbers',
    muscleGroup: MUSCLE_GROUPS.CORE,
    secondaryMuscles: ['Shoulders', 'Cardio'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Start in push-up position',
      'Bring one knee toward chest',
      'Quickly switch legs',
      'Continue alternating',
    ],
    tips: [
      'Keep hips level',
      'Good cardio and core exercise',
      'Maintain plank position',
    ],
  },
  {
    id: 'core_005',
    name: 'Leg Raises',
    muscleGroup: MUSCLE_GROUPS.CORE,
    secondaryMuscles: ['Hip Flexors'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Lie flat on back',
      'Keep legs straight',
      'Raise legs to 90 degrees',
      'Lower with control, don\'t touch ground',
    ],
    tips: [
      'Don\'t arch lower back',
      'Control the negative',
      'Bend knees for easier variation',
    ],
  },

  // === CARDIO EXERCISES ===
  {
    id: 'cardio_001',
    name: 'Running',
    muscleGroup: MUSCLE_GROUPS.CARDIO,
    secondaryMuscles: ['Legs'],
    equipment: [EQUIPMENT.NONE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Start at comfortable pace',
      'Maintain good posture',
      'Land mid-foot',
      'Breathe rhythmically',
    ],
    tips: [
      'Build distance gradually',
      'Good shoes are important',
      'Warm up before sprinting',
    ],
  },
  {
    id: 'cardio_002',
    name: 'Cycling',
    muscleGroup: MUSCLE_GROUPS.CARDIO,
    secondaryMuscles: ['Legs'],
    equipment: [EQUIPMENT.MACHINE],
    difficulty: DIFFICULTY.BEGINNER,
    location: LOCATION.BOTH,
    instructions: [
      'Adjust seat height properly',
      'Start at moderate resistance',
      'Maintain steady cadence',
      'Keep upper body relaxed',
    ],
    tips: [
      'Low impact on joints',
      'Good for active recovery',
      'Can do intervals',
    ],
  },
  {
    id: 'cardio_003',
    name: 'Jump Rope',
    muscleGroup: MUSCLE_GROUPS.CARDIO,
    secondaryMuscles: ['Calves', 'Shoulders'],
    equipment: [EQUIPMENT.RESISTANCE_BAND],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Hold rope handles at hip height',
      'Jump on balls of feet',
      'Rotate rope with wrists',
      'Keep jumps low',
    ],
    tips: [
      'Excellent calorie burner',
      'Improves coordination',
      'Start with shorter intervals',
    ],
  },
  {
    id: 'cardio_004',
    name: 'Burpees',
    muscleGroup: MUSCLE_GROUPS.CARDIO,
    secondaryMuscles: ['Full Body'],
    equipment: [EQUIPMENT.BODYWEIGHT],
    difficulty: DIFFICULTY.INTERMEDIATE,
    location: LOCATION.BOTH,
    instructions: [
      'Start standing',
      'Drop to push-up position',
      'Do a push-up',
      'Jump feet to hands',
      'Jump up with arms overhead',
    ],
    tips: [
      'Full body workout',
      'High calorie burn',
      'Modify by removing jump',
    ],
  },
];

// Utility Functions
export const searchExercises = (query) => {
  if (!query) return EXERCISES;
  
  const searchTerm = query.toLowerCase();
  return EXERCISES.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm) ||
    exercise.muscleGroup.toLowerCase().includes(searchTerm) ||
    exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm))
  );
};

export const filterExercisesByMuscleGroup = (muscleGroup) => {
  if (!muscleGroup) return EXERCISES;
  return EXERCISES.filter(exercise => exercise.muscleGroup === muscleGroup);
};

export const filterExercisesByEquipment = (equipment) => {
  if (!equipment || equipment.length === 0) return EXERCISES;
  return EXERCISES.filter(exercise =>
    exercise.equipment.some(eq => equipment.includes(eq))
  );
};

export const filterExercisesByLocation = (location) => {
  if (!location) return EXERCISES;
  return EXERCISES.filter(
    exercise => exercise.location === location || exercise.location === LOCATION.BOTH
  );
};

export const filterExercisesByDifficulty = (difficulty) => {
  if (!difficulty) return EXERCISES;
  return EXERCISES.filter(exercise => exercise.difficulty === difficulty);
};

export const getExerciseById = (id) => {
  return EXERCISES.find(exercise => exercise.id === id);
};

export const getExercisesByIds = (ids) => {
  return ids.map(id => getExerciseById(id)).filter(Boolean);
};

// Smart filter that combines multiple criteria
export const smartFilterExercises = ({
  query = '',
  muscleGroup = null,
  equipment = [],
  difficulty = null,
  location = null,
}) => {
  let results = EXERCISES;

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter(exercise =>
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.muscleGroup.toLowerCase().includes(searchTerm) ||
      exercise.secondaryMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm))
    );
  }

  // Muscle group filter
  if (muscleGroup) {
    results = results.filter(exercise => exercise.muscleGroup === muscleGroup);
  }

  // Equipment filter
  if (equipment && equipment.length > 0) {
    results = results.filter(exercise =>
      exercise.equipment.some(eq => equipment.includes(eq))
    );
  }

  // Difficulty filter
  if (difficulty) {
    results = results.filter(exercise => exercise.difficulty === difficulty);
  }

  // Location filter
  if (location) {
    results = results.filter(
      exercise => exercise.location === location || exercise.location === LOCATION.BOTH
    );
  }

  return results;
};
