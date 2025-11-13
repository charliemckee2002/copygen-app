import Head from "next/head";
import { useState } from "react";
import GeneratorForm from "../components/GeneratorForm";

export default function Home() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (productNames) => {
    setLoading(true);
    setOutput("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productNames }),
      });

      const data = await response.json();
      setOutput(data.text || "⚠️ No response from AI.");
    } catch (err) {
      setOutput("❌ Error generating text.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <Head>
        <title>CopyGen App</title>
      </Head>

      <h1 className="text-3xl font-bold mb-4 text-gray-800">CopyGen App</h1>
      <p className="text-gray-600 mb-6 text-center max-w-xl">
        Enter product names, and AI will write taglines, descriptions, FAQs, and
        thumbnail prompts for each.
      </p>

      <GeneratorForm onGenerate={handleGenerate} />

      {loading && (
        <div className="mt-8 text-blue-500 animate-pulse">Generating...</div>
      )}

      {output && (
        <pre className="mt-8 bg-white p-4 rounded-lg shadow-md w-full max-w-2xl text-sm overflow-auto whitespace-pre-wrap">
          {output}
        </pre>
      )}
    </div>
  );
}
