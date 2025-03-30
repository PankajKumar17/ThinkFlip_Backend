import { textOnly } from "../utils/textOnly.js";
import { textAndImage } from "../utils/textAndImage.js";
import { fetchImage } from "../utils/fetchImage.js";

const preprocess = (result) => {
  try {
    const match = result.match(/\[.*?\]/s);
    if (!match) throw new Error("No JSON array found in the result");
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("Invalid JSON response from the bot", error);
    return null;
  }
};

// Function to add images to flashcards
const addImagesToFlashcards = async (flashcards) => {
  return Promise.all(
    flashcards.map(async (flashcard) => {
      const imageUrl = await fetchImage(flashcard.title);
      return { ...flashcard, imageUrl };
    })
  );
};

export const aiController = async (req, res) => {
  const modelType = req.body.modelType;
  const number = req.body.number? req.body.number : null;

  if (modelType === "text_only") {
    const botReply = await textOnly(`${req.body.prompt.replace(/(\r\n|\n|\r)/g, " ")} \n  Summarize the given text to generate ${number!=null ? number : 'as many as possible'} flashcards  based strictly on its content as a JSON array. Each flashcard should have the following structure:
      {title: "Short title of the flashcard",description: "5-sentence description of the topic",accuracy:"(number between 0 and 100 like (98)) of similarity of content of flashcard with the text given"}.Avoid incorporating any information beyond what is present in the text given.Ensure the output is a valid JSON array without use of /n.`);
    
    try {
      let flashcards = preprocess(botReply.result);
      if (!flashcards) throw new Error("Failed to parse flashcards");

      // Add images to flashcards
      flashcards = await addImagesToFlashcards(flashcards);
      
      res.status(200).json({ result: flashcards });
    } catch (error) {
      res.status(500).json({ error: "Invalid JSON response from the bot", result: botReply.result });
    }

  } else if (modelType === "text_and_image") {
    const botReply = await textAndImage(`Summarize the given image to generate ${number!=null ? number:'as many as possible'} flashcards based strictly on its content as a JSON array. Each flashcard should have the following structure:{title:Short title of the flashcard,description: 5-sentence description of the topic,accuracy:(number between 0 and 100 like (98))  of similarity of content of flashcard with the text given}.Ensure the JSON output is properly formatted, valid, and does not include newline characters (\n). Avoid incorporating any information beyond what is present in the image.`, req.body.imageParts);

    try {
      let flashcards = preprocess(botReply.result);
      if (!flashcards) throw new Error("Failed to parse flashcards");

      // Add images to flashcards
      flashcards = await addImagesToFlashcards(flashcards);

      res.status(200).json({ result: flashcards });
    } catch (error) {
      res.status(500).json({ error: "Invalid JSON response from the bot", result: botReply.result });
    }
  } else {
    res.status(404).json({ result: "Invalid Model Selected" });
  }
};
