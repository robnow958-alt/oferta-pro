export async function onRequestPost(context) {
  try {
    const { prompt } = await context.request.json();
    const apiKey = context.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Brak skonfigurowanego klucza GROQ_API_KEY w panelu Cloudflare." } }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Jesteś ekspertem od ofert handlowych B2B. Piszesz po polsku. Twoje oferty są konkretne, profesjonalne i przekonujące. Bez lania wody.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.75
      })
    });

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json();
      return new Response(
        JSON.stringify({ error: { message: errorData.error?.message || "Błąd komunikacji z Groq" } }),
        { status: groqResponse.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await groqResponse.json();
    const generatedText = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ body: generatedText }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}