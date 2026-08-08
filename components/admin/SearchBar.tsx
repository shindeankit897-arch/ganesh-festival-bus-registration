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
    <div className="mb-6">

      <input
        type="text"
        placeholder="🔍 Search by Name, Mobile or Aadhaar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-3 shadow-sm outline-none focus:border-orange-500"
      />

    </div>
  );
}