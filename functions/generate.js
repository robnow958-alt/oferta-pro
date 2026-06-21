export async function onRequestPost(context) {
  try {
    const requestData = await context.request.json();
    const apiKey = context.env.GROQ_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Brak klucza API" }), { status: 500 });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Jesteś profesjonalnym copywriterem.' },
          { role: 'user', content: `Napisz ofertę dla: ${requestData.client}, opis: ${requestData.desc}` }
        ]
      })
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}