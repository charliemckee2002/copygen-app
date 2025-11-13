import { useState } from "react";

export default function GeneratorForm({ onGenerate }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const productNames = input
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    onGenerate(productNames);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
    >
      <label className="block text-gray-700 font-medium mb-2">
        Product names (comma separated):
      </label>
      <input
        type="text"
        placeholder="Example: Cold Email Arsenal, One-Page Funnel Kit"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Generate Copy
      </button>
    </form>
  );
}
