import express from "express";
import dotenv from "dotenv";
import { loadPdf } from "./pdfLoader";
import { chunkText } from "./chunker";
import { storeChunks, search } from "./vectorStore";
import { ask } from "./rag";

dotenv.config();

const app = express();
app.use(express.json());

app.post("/ingest", async (req, res) => {
  const { filePath } = req.body;
  if (!filePath) {
    res.status(400).json({ error: "filePath is required" });
    return;
  }

  const text = await loadPdf(filePath);
  const chunks = chunkText(text, 200, 20);
  await storeChunks(chunks);

  res.json({ message: `Ingested ${chunks.length} chunks` });
});

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) {
    res.status(400).json({ error: "question is required" });
    return;
  }

  const answer = await ask(question);
  res.json({ answer });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
