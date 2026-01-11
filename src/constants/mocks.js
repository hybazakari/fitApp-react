export const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    hasCompletedOnboarding: true,
  },
  {
    id: '2',
    name: 'New User',
    email: 'new@test.com',
    password: 'password123',
    hasCompletedOnboarding: false,
  }
];

export const MOCK_NUTRITION = {
  caloriesGoal: 2500,
  caloriesConsumed: 1850,
  macros: { protein: 120, carbs: 200, fats: 65 },
  meals: [
    { id: 1, name: 'Petit Déjeuner', calories: 450 },
    { id: 2, name: 'Déjeuner', calories: 800 },
  ]
};

export const MOCK_WORKOUTS = [
  { id: 1, name: 'Full Body A', date: '2024-05-20', exercises: 5 },
  { id: 2, name: 'Cardio HIIT', date: '2024-05-22', exercises: 3 },
];