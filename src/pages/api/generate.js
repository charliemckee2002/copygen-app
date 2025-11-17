export const config = {
  runtime: "nodejs",
};

import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    const prompt = `
You are a marketing copy expert. For each product listed, generate:
1. Tagline
2. Description
3. FAQ (2–3 questions)
4. Thumbnail prompt

Products:
${products.join(", ")}
    `;

    const completion = await client.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "You generate marketing copy." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const output = completion.choices?.[0]?.message?.content || "";

    return res.status(200).json({ text: output });
  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({
      error: error.message || "Server error",
    });
  }
}
