import { exercises } from "../data";
import type { WorkoutExercise } from "../types";

type WorkoutPanelProps = {
  workout: WorkoutExercise[];
  onRemove: (id: number) => void;
};

function WorkoutPanel({ workout, onRemove }: WorkoutPanelProps) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-surface p-5 lg:sticky lg:top-6 lg:self-start">
      <h2 className="text-xl font-bold">Today's workout</h2>

      {workout.length === 0 ? (
        <p className="mt-3 text-sm text-muted">
          Nothing yet. Add an exercise from the library.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {workout.map((entry) => {
            const exercise = exercises.find((e) => e.id === entry.exerciseId);
            if (!exercise) return null;

            return (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2"
              >
                <span>
                  {exercise.emoji} {exercise.name}
                </span>
                <button
                  onClick={() => onRemove(entry.id)}
                  className="text-sm text-danger hover:underline"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}

export default WorkoutPanel;