import * as lancedb from "vectordb";
import { embed } from "./embeddings";

let db: any = null;
let table: any = null;

async function initializeDb() {
  if (!db) {
    db = await lancedb.connect("./data/vectors");
  }
}

async function getTable() {
  await initializeDb();
  const tableNames = await db.tableNames();
  if (tableNames.includes("documents")) {
    table = await db.openTable("documents");
  }

  return table;
}

export async function storeChunks(
  chunks: string[],
  source: string,
): Promise<void> {
  await initializeDb();

  const tableNames = await db.tableNames();

  console.log("Embeding chunks...");
  const records = await Promise.all(
    chunks.map(async (chunk, i) => ({
      id: `${source}-${i}`,
      source,
      text: chunk,
      vector: await embed(chunk),
    })),
  );

  if (tableNames.includes("documents")) {
    table = await db.openTable("documents");
    await table.add(records);
  } else {
    table = await db.createTable("documents", records);
  }

  console.log(`Stored ${records.length} chunks from ${source}`);
}

export async function search(query: string, limit = 3): Promise<string[]> {
  const t = await getTable();
  if (!t) throw new Error("No documents stored yet");
  const queryVector = await embed(query);
  const results = await t.search(queryVector).limit(limit).execute();
  return results.map((r: any) => r.text);
}
