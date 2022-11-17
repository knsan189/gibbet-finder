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

export async function getMatchTemplatePoint(cv: any, source: any, template: any): Promise<any> {
  return new Promise((resolve) => {
    const dst = new cv.Mat();
    const mask = new cv.Mat();
    cv.matchTemplate(source, template, dst, cv.TM_CCOEFF_NORMED, mask);
    const result = cv.minMaxLoc(dst, mask);
    dst.delete();
    mask.delete();
    resolve(result.maxLoc);
  });
}

export async function setMatchPoint(
  cv: any,
  source: any,
  sourceCanvas: HTMLCanvasElement | null,
  templateCanvas: HTMLCanvasElement | null,
  resultCanvas: HTMLCanvasElement | null,
  sourceImageData: Screenshot,
) {
  const template = cv.imread(templateCanvas);
  const matchPoint = await getMatchTemplatePoint(cv, source, template);

  let partyBoxHeight = 130;
  let partyIconWidth = 65;

  if (sourceImageData.gcd === 40) {
    partyBoxHeight = 100;
    partyIconWidth = 55;
  }

  // 원본 이미지에 박스 그리기
  const color = new cv.Scalar(255, 0, 0, 255);
  const point = new cv.Point(matchPoint.x + template.cols, matchPoint.y + template.rows);
  cv.rectangle(source, matchPoint, point, color, 2, cv.LINE_8, 0);
  cv.imshow(sourceCanvas, source);

  // 파티 선택 영역
  const rect = new cv.Rect(
    matchPoint.x + partyIconWidth,
    matchPoint.y + template.rows,
    template.cols - partyIconWidth,
    template.rows + partyBoxHeight,
  );

  // 파티 잘라낸 영역
  const cropped = source.roi(rect);
  // 색 반전
  cv.bitwise_not(cropped, cropped);
  // 색 그레이스케일
  cv.cvtColor(cropped, cropped, cv.COLOR_BGR2GRAY);
  // 대비 증가
  cv.convertScaleAbs(cropped, cropped, 1.2, 0);

  cv.imshow(resultCanvas, cropped);
  cropped.delete();
}
