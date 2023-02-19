import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration)

const app = express();
app.use(cors());
// will all to pass json from the frontend to the backend
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Astro🚀🚀🚀🤖',
  })
});


app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      // prompt is been passed in from the frontend.
      prompt: `${prompt}`,
      // how we want the model to take risk in giving us results.
      temperature: 1,
      // maximum numbers to tokens to generate in a complettion.
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 1.25,
    });

    res.status(200).send({
      bot: response.data.choices[0].text
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error })
  }
})

app.listen(5000, () => console.log('listening on port http://localhost:5000'));