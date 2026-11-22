import { SearchIcon } from 'lucide-react';

type Props = {
  suggestions: string[];
  onSuggestion: (name: string) => void;
};

export function NoResults({ suggestions, onSuggestion }: Props) {
  return (
    <section className="w-full max-w-4xl mb-8 rounded-2xl border border-silverMist bg-white p-8 text-center" aria-live="polite">
      <SearchIcon className="mx-auto mb-3 h-8 w-8 text-arcticNavy" aria-hidden="true" />
      <h2 className="text-xl font-black text-arcticNavy">No in-stock pharmacies found</h2>
      <p className="mt-2 text-steelBlue">
        {suggestions.length ? 'Did you mean one of these kits?' : 'Try another kit name or a common abbreviation.'}
      </p>
      {suggestions.length > 0 && <div className="mt-5 flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => <button
          key={suggestion}
          type="button"
          onClick={() => onSuggestion(suggestion)}
          className="rounded-full border border-arcticNavy/30 bg-arcticNavy/5 px-4 py-2 text-sm font-bold text-arcticNavy hover:bg-arcticNavy hover:text-white"
        >{suggestion}</button>)}
      </div>}
    </section>
  );
}
