export async function generateWithGroq(prompt: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a senior product manager and technical writer. Generate comprehensive Product Requirement Documents (PRDs) and vibe coding prompts. Always respond in the exact format requested, with bilingual content (English and Indonesian) for each section.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${response.status} ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}
