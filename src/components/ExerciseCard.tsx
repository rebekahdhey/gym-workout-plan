import type { Exercise } from "../types";

type ExerciseCardProps = {
  exercise: Exercise;
  onAdd: () => void;
};

function ExerciseCard({ exercise, onAdd }: ExerciseCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-white/10 bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent/50">
      <span className="text-3xl">{exercise.emoji}</span>

      <div className="flex-1">
        <h3 className="font-semibold">{exercise.name}</h3>
        <small className="capitalize text-muted">{exercise.muscle}</small>
      </div>

      <button
        onClick={onAdd}
        className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-text transition hover:brightness-110"
      >
        + Add
      </button>
    </article>
  );
}

export default ExerciseCard;