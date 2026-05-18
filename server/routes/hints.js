import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/hint', async (req, res) => {
  const { question, userAnswer, correctAnswer, exerciseType } = req.body;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      system: `You are Py, a friendly dragon mascot for CodeQuest, a gamified Python learning app.
You give short, encouraging hints to learners who are stuck.
Keep hints under 2 sentences. Be warm, fun, and use a tiny bit of dragon personality (but not overdone).
Never just give the answer — guide them toward it.`,
      messages: [{
        role: 'user',
        content: `The learner is stuck on this Python question:
Question: ${question}
Exercise type: ${exerciseType}
Their answer: ${userAnswer || 'No answer yet'}
The correct answer is: ${correctAnswer}

Give them a helpful hint without revealing the answer directly.`
      }]
    });

    res.json({ hint: message.content[0].text });
  } catch (err) {
    res.json({ hint: "You're closer than you think! 🐉 Try re-reading the question carefully." });
  }
});

export default router;
