import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const LINE_TOKEN = process.env.LINE_TOKEN;

app.post('/send', async (req, res) => {
  const { groupId, message } = req.body;

  if (!groupId || !message) {
    return res.status(400).send('groupId 和 message 是必填欄位');
  }

  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: groupId,
        messages: [
          {
            type: 'text',
            text: message
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LINE_TOKEN}`
        }
      }
    );

    res.send('訊息已成功發送到 LINE');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('發送失敗');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
