import { BookMarked } from "lucide-react";

export default function VocabularyItem({ word, explanation, exampleSentence }) {
  return (
    <li className="rounded-xl border border-line bg-white p-4">
      <div className="flex items-start gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-brand-700">
          <BookMarked className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-brand-800">{word}</p>
          <p className="mt-1 text-sm leading-relaxed text-ink/80">
            {explanation}
          </p>
          {exampleSentence ? (
            <p className="mt-2 border-l-2 border-brand-200 pl-3 text-xs italic leading-relaxed text-muted">
              {exampleSentence}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}
