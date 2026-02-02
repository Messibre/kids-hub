import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "back-endd", "server", ".env") });

const ai = new GoogleGenAI({});

async function translateStory(title, content) {
  const prompt = `Translate the following English story title and content to Amharic. Keep the structure and emojis if any. Respond with only the translated title on the first line, followed by the translated content on the next lines. Do not include any other text, formatting, or code blocks.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    const text = response.text.trim();

    const lines = text.split("\n");
    const translatedTitle = lines[0].trim();
    const translatedContent = lines.slice(1).join("\n").trim();

    return { title: translatedTitle, content: translatedContent };
  } catch (error) {
    console.error(`Error translating "${title}":`, error);
    return null;
  }
}

async function translateStories() {
  const storiesDataPath = path.join(
    __dirname,
    "src",
    "Components",
    "storiesData.js",
  );
  const fileContent = fs.readFileSync(storiesDataPath, "utf8");

  const jsonMatch = fileContent.match(/const storiesData = (\{[\s\S]*?\});/);
  if (!jsonMatch) {
    throw new Error("Could not parse storiesData from file");
  }
  const storiesData = eval(`(${jsonMatch[1]})`);

  const englishStories = storiesData.english.filter((story) =>
    [
      "The Girl Who Planted Stars",
      "The Boy Who Cried Wolf",
      "The Three Little Pigs",
      "Cinderella",
      "The Tortoise and the Hare",
    ].includes(story.title),
  );

  for (const story of englishStories) {
    console.log(`Translating: ${story.title}`);
    const translated = await translateStory(story.title, story.content);
    if (translated) {
      storiesData.amharic.push(translated);
      console.log(`Translated: ${translated.title}`);
    } else {
      console.log(`Failed to translate: ${story.title}`);
    }
  }

  const updatedContent = `const storiesData = ${JSON.stringify(storiesData, null, 2)};

export default storiesData;`;

  fs.writeFileSync(storiesDataPath, updatedContent, "utf8");
  console.log("Translation complete. Updated storiesData.js");
}

translateStories().catch(console.error);
