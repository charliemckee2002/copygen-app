export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { productNames } = req.body;
  if (!productNames || !Array.isArray(productNames)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const prompt = `
  You are a marketing copy expert. For each product name below, write:
  1️⃣ Tagline
  2️⃣ Description (1–2 sentences)
  3️⃣ 3 FAQs with answers
  4️⃣ Thumbnail prompt idea (short visual concept)
  Product names: ${productNames.join(", ")}
  `;

  try {
    console.log("🔑 Key found:", !!process.env.GROQ_API_KEY);
    console.log("🧠 Prompt preview:", prompt.slice(0, 100));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",   // ✅ WORKING GROQ MODEL
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    console.log("📦 API raw response:", JSON.stringify(data).slice(0, 400));

    if (!data?.choices?.[0]?.message?.content) {
      console.log("❌ No content returned", data);
      return res.status(500).json({ message: "Groq returned no content." });
    }

    const text = data.choices[0].message.content;
    res.status(200).json({ text });
  } catch (err) {
    console.error("❌ Error calling GROQ API:", err);
    res.status(500).json({ message: "Error calling GROQ API." });
  }
}
