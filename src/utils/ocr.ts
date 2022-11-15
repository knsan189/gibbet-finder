import { createWorker } from "tesseract.js";

export async function getOCRString(
  base64: string,
  locale: "eng" | "kor" = "eng",
): Promise<string[]> {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage(locale);
  await worker.initialize(locale);
  const result = await worker.recognize(base64);
  await worker.terminate();
  return result.data.text
    .replaceAll(" ", "")
    .split("\n")
    .filter((text) => text.length > 0);
}
