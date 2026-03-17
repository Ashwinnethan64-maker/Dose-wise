export const runtime = "edge";

export default async function handler(req) {
    try {
        const { message } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return new Response(JSON.stringify({ error: "Missing OpenAI API Key" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are the DoseWise Assistant, a helpful medical companion. You provide information about medications, schedules, and health. Always remind users to consult a doctor." },
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

        return new Response(JSON.stringify({ message: aiMessage }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("AI Proxy Error:", error);
        return new Response(JSON.stringify({ error: "Interal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}