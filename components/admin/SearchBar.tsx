"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="mb-4 sm:mb-6">

      <input
        type="text"
        placeholder="🔍 Search by Name, Mobile or Aadhaar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-orange-100 bg-white px-4 text-sm shadow-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 sm:text-base"
      />

    </div>
  );
}