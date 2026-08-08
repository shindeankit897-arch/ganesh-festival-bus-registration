"use client";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
    >
      🖨 Print
    </button>
  );
}