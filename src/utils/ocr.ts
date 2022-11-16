import { createWorker, Line } from "tesseract.js";

export async function getOCRString(base64: string, locale: "eng" | "kor" = "eng"): Promise<Line[]> {
  const worker = createWorker();
  await worker.load();
  await worker.loadLanguage(locale);
  await worker.initialize(locale);
  const result = await worker.recognize(base64);
  await worker.terminate();
  return result.data.lines;
}
