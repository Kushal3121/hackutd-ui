import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

const run = async () => {
  const res = await fetch(url);
  const data = await res.json();
  console.log('🔍 Model list response:\n', JSON.stringify(data, null, 2));
};

run();
