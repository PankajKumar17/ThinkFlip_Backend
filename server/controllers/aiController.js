import { textOnly } from "../utils/textOnly.js";
import { textAndImage } from "../utils/textAndImage.js";

export const aiController = async (req, res) => {
  const modelType = req.body.modelType;

  if (modelType === "text_only") {
    const botReply = await textOnly(`${req.body.prompt} \n  Summarize the given text to generate flashcards as a JSON array. Each flashcard should have the following structure:
      {title: "Short title of the flashcard",description: "5-sentence description of the topic"}
      Ensure the output is a valid JSON array without use of /n.`);
      
      try {
        const flashcards = JSON.parse(botReply.result);
        res.status(200).json({ result: flashcards });
      } catch (error) {
        res.status(500).json({ error: "Invalid JSON response from the bot"});
      }
      
  } else if (modelType === "text_and_image") {
    const botReply = await textAndImage(req.body.prompt, req.body.imageParts);

    if (botReply?.Error) {
      return res.status(404).json({ Error: botReply.Error });
    }
    const flashcards = JSON.parse(botReply.result);
    res.status(200).json({ result: flashcards });
  } else {
    res.status(404).json({ result: "Invalid Model Selected" });
  }
};
