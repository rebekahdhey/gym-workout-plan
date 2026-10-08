export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";

export type Exercise = {
  id: number;
  name: string;
  muscle: MuscleGroup;
  emoji: string;
};

export type SetEntry = {
  id: number;
  reps: number;
  weight: number;
};

export type WorkoutExercise = {
  id: number;
  exerciseId: number;
  sets: SetEntry[];
};