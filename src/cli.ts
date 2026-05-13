import { Command } from "commander";
import dotenv from "dotenv";
import { loadPdf } from "./pdfLoader";
import { chunkText } from "./chunker";
import { storeChunks } from "./vectorStore";
import { ask } from "./rag";

dotenv.config();

const program = new Command();

program.name("rag").description("RAG CLI tool").version("1.0.0");

program
  .command("ingest <filePaths...>")
  .description("Ingest one or more PDFs into the vector store")
  .action(async (filePaths: string[]) => {
    for (const filePath of filePaths) {
      console.log(`Ingesting ${filePath}...`);
      const text = await loadPdf(filePath);
      const chunks = chunkText(text, 200, 20);
      await storeChunks(chunks, filePath);
    }
    console.log("Done.");
  });

program
  .command("ask <question>")
  .description("Ask a question about ingested documents")
  .action(async (question: string) => {
    const answer = await ask(question);
    console.log("\nAnswer:", answer);
  });

program.parse();
