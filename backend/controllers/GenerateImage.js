import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from "openai";

dotenv.config();

// Initialize OpenAI client directly with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return next(createError(400, "Prompt is required to generate an image"));
    }

    const resp = await fetch('https://api.limewire.com/api/image/generation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': 'v1',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`, // Use 'Bearer' token for Authorization
      },
      body: JSON.stringify({
        prompt: prompt,         // Pass 'prompt' in the request body
        aspect_ratio: '1:1'     // Pass 'aspect_ratio' as part of the body
      }),
    });
    const data = await resp.json(); // Parse the JSON response
    console.log(data);

    if (data && data.data && data.data[0]) {
      const generatedImage = data.data[0].asset_url; // Access the base64 image
      res.status(200).json({ photo: generatedImage });
    } else {
      throw new Error('No image data returned from API');
    }
  
  } catch (error) {
    const statusCode = error.status || 500;
    const errorMessage = error?.response?.data?.error?.message || error.message;
    next(createError(statusCode, errorMessage));
  }
};
