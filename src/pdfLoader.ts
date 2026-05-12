import fs from "fs";
import { extractText } from "unpdf";

export async function loadPdf(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const { text } = await extractText(new Uint8Array(buffer), {
    mergePages: true,
  });
  return text;
}
