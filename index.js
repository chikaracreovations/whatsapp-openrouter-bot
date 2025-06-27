import venom from 'venom-bot';
import axios from 'axios';

// Replace with your OpenRouter key
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

venom
  .create({
    session: 'whatsapp-session',
    headless: 'new', // Use modern headless mode
  })
  .then((client) => start(client))
  .catch((error) => console.error('Error starting bot:', error));

function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      try {
        const reply = await askOpenRouter(message.body);
        await client.sendText(message.from, reply);
      } catch (err) {
        console.error('AI error:', err.message);
        await client.sendText(message.from, '❌ Error with AI response.');
      }
    }
  });
}

async function askOpenRouter(prompt) {
  const res = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: 'mistral/mistral-7b-instruct',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data.choices[0].message.content.trim();
}
