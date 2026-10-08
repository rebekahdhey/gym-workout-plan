import { useMemo, useState } from "react";
import ExerciseCard from "./components/ExerciseCard";
import { exercises } from "./data";
import type { Exercise, MuscleGroup, SetEntry, WorkoutExercise } from "./types";

const muscles: (MuscleGroup | "all")[] = [
  "all",
  "chest",
  "back",
  "legs",
  "shoulders",
  "arms",
  "core",
];

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createSet = (reps = 10, weight = 0): SetEntry => ({
  id: Number(makeId().replace(/\D/g, "")) || Date.now(),
  reps,
  weight,
});

const createWorkoutExercise = (exercise: Exercise): WorkoutExercise => ({
  id: Number(makeId().replace(/\D/g, "")) || Date.now(),
  exerciseId: exercise.id,
  sets: [createSet(10, 0), createSet(10, 0), createSet(10, 0)],
});

function App() {
  const [query, setQuery] = useState("");
  const [muscle, setMuscle] = useState<MuscleGroup | "all">("all");
  const [workout, setWorkout] = useState<WorkoutExercise[]>([]);

  const visible = useMemo(
    () =>
      exercises.filter((ex) => {
        const matchesName = ex.name.toLowerCase().includes(query.toLowerCase());
        const matchesMuscle = muscle === "all" || ex.muscle === muscle;
        return matchesName && matchesMuscle;
      }),
    [muscle, query],
  );

  const workoutExercises = workout
    .map((entry) => ({
      ...entry,
      exercise: exercises.find((ex) => ex.id === entry.exerciseId),
    }))
    .filter((entry): entry is WorkoutExercise & { exercise: Exercise } => Boolean(entry.exercise));

  const totalSets = workout.reduce((sum, entry) => sum + entry.sets.length, 0);

  const handleAddExercise = (exercise: Exercise) => {
    setWorkout((current) => {
      const exists = current.some((entry) => entry.exerciseId === exercise.id);
      if (exists) return current;
      return [...current, createWorkoutExercise(exercise)];
    });
  };

  const addSet = (workoutId: number) => {
    setWorkout((current) =>
      current.map((entry) =>
        entry.id === workoutId
          ? { ...entry, sets: [...entry.sets, createSet(10, 0)] }
          : entry,
      ),
    );
  };

  const removeSet = (workoutId: number, setId: number) => {
    setWorkout((current) =>
      current.map((entry) => {
        if (entry.id !== workoutId) return entry;

        if (entry.sets.length <= 1) return entry;
        return {
          ...entry,
          sets: entry.sets.filter((set) => set.id !== setId),
        };
      }),
    );
  };

  const updateSetValue = (
    workoutId: number,
    setId: number,
    field: "reps" | "weight",
    value: number,
  ) => {
    setWorkout((current) =>
      current.map((entry) =>
        entry.id === workoutId
          ? {
              ...entry,
              sets: entry.sets.map((set) =>
                set.id === setId ? { ...set, [field]: Math.max(0, value) } : set,
              ),
            }
          : entry,
      ),
    );
  };

  const removeExercise = (workoutId: number) => {
    setWorkout((current) => current.filter((entry) => entry.id !== workoutId));
  };

  const clearWorkout = () => setWorkout([]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          🏋️ Pulse <span className="text-accent">Gym</span>
        </h1>

        <div className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
          {workout.length} exercises planned
        </div>
      </header>

      <div className="mb-6 rounded-3xl border border-white/10 bg-surface p-4 shadow-lg shadow-black/10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search exercises..."
          className="w-full rounded-2xl border border-white/10 bg-surface-2 px-4 py-3 text-base text-ink placeholder:text-muted focus:outline-2 focus:outline-accent"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {muscles.map((m) => (
          <button
            key={m}
            onClick={() => setMuscle(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
              muscle === m
                ? "bg-accent text-accent-text"
                : "bg-surface-2 text-ink hover:bg-surface-2/70"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted">{visible.length} exercises</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visible.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} onAdd={() => handleAddExercise(ex)} />
            ))}
          </div>

          {visible.length === 0 && (
            <p className="mt-6 rounded-2xl border border-dashed border-white/10 bg-surface p-8 text-center text-muted">
              No exercises found.
            </p>
          )}
        </section>

        <aside className="rounded-3xl border border-white/10 bg-surface p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Workout plan</h2>
            {workout.length > 0 && (
              <button
                type="button"
                onClick={clearWorkout}
                className="text-sm font-medium text-muted hover:text-ink"
              >
                Clear
              </button>
            )}
          </div>

          {workoutExercises.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface-2 p-4 text-sm text-muted">
              Add an exercise to start building your session.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl bg-surface-2 px-3 py-2 text-sm text-muted">
                {totalSets} total sets across {workoutExercises.length} exercises
              </div>

              {workoutExercises.map(({ exercise, id, sets }) => (
                <div key={id} className="rounded-2xl border border-white/10 bg-surface-2 p-3">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{exercise.emoji}</span>
                      <div>
                        <h3 className="font-semibold">{exercise.name}</h3>
                        <p className="text-xs capitalize text-muted">{exercise.muscle}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeExercise(id)}
                      className="text-xs font-semibold text-danger hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2">
                    {sets.map((set, index) => (
                      <div key={set.id} className="grid grid-cols-[42px_72px_82px_auto] items-center gap-2 rounded-xl bg-bg/60 p-2">
                        <span className="text-xs font-semibold text-muted">Set {index + 1}</span>

                        <label className="flex items-center gap-1 text-xs text-muted">
                          <span>Reps</span>
                          <input
                            type="number"
                            min={0}
                            value={set.reps}
                            onChange={(e) =>
                              updateSetValue(id, set.id, "reps", Number(e.target.value) || 0)
                            }
                            className="w-full rounded-lg border border-white/10 bg-surface px-2 py-1 text-right text-ink"
                          />
                        </label>

                        <label className="flex items-center gap-1 text-xs text-muted">
                          <span>Wt</span>
                          <input
                            type="number"
                            min={0}
                            value={set.weight}
                            onChange={(e) =>
                              updateSetValue(id, set.id, "weight", Number(e.target.value) || 0)
                            }
                            className="w-full rounded-lg border border-white/10 bg-surface px-2 py-1 text-right text-ink"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => removeSet(id, set.id)}
                          disabled={sets.length <= 1}
                          className="justify-self-end text-xs text-muted disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addSet(id)}
                    className="mt-3 w-full rounded-xl border border-dashed border-accent/40 bg-accent/5 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/10"
                  >
                    + Add set
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;