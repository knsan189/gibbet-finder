import { Box, Button, styled, Typography } from "@mui/material";
import React, { useEffect, useRef, useState, useContext } from "react";
import { screenCapture } from "../lib/capture";
import { createWorker } from "tesseract.js";
import { OpenCv } from "../App";

const HiddenVideo = styled("video")(() => ({
  position: "absolute",
  top: -100000,
  left: -100000,
}));

const templateUrl = "./images/template.png";

const setCanvasImage = (canvas: HTMLCanvasElement, url: string) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new Image();
  img.src = url;
  img.onload = () => {
    const { width, height } = img;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  };
};

const Capture = () => {
  const cv = useContext(OpenCv);
  const [image, setImage] = useState("./images/test.jpg");
  const videoRef = useRef<HTMLVideoElement>(null);
  const tempRef = useRef<HTMLCanvasElement>(null);
  const srcRef = useRef<HTMLCanvasElement>(null);
  const dstRef = useRef<HTMLCanvasElement>(null);

  const callback = (base64: string) => {
    setImage(base64);
  };

  const handleClick = async () => {
    if (videoRef.current) {
      screenCapture(videoRef.current, callback);
    }
  };

  const handleOCR = async () => {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage("kor");
    await worker.initialize("kor");
    const {
      data: { text },
    } = await worker.recognize(image);
    console.log(text);
    worker.terminate();
  };

  useEffect(() => {
    if (srcRef.current) {
      setCanvasImage(srcRef.current, "./images/test.jpg");
    }

    if (tempRef.current) {
      setCanvasImage(tempRef.current, templateUrl);
    }
  }, []);

  const handleCv = () => {
    if (!cv) return;
    const src = cv.imread(srcRef.current);
    const temp = cv.imread(tempRef.current);
    let dst = new cv.Mat();
    const mask = new cv.Mat();
    cv.matchTemplate(src, temp, dst, cv.TM_CCOEFF_NORMED, mask);
    const result = cv.minMaxLoc(dst, mask);
    const maxPoint = result.maxLoc;
    const rect = new cv.Rect(maxPoint.x, maxPoint.y + temp.rows, temp.cols + 300, temp.rows + 80);
    dst = src.roi(rect);
    cv.imshow(dstRef.current, dst);
    src.delete();
    dst.delete();
    mask.delete();
  };

  return (
    <Box p={2}>
      <HiddenVideo ref={videoRef} />
      <Button onClick={handleClick} variant="outlined" sx={{ mr: 1 }}>
        스크린샷 찍기
      </Button>
      <Button onClick={handleOCR} variant="contained" sx={{ mr: 1 }} disabled>
        OCR
      </Button>
      <Button onClick={handleCv} variant="outlined">
        OpenCv
      </Button>
      <Box pt={2}>
        <Typography variant="body2">Before</Typography>
        <canvas ref={srcRef} style={{ width: "100%" }} />
      </Box>
      <Box pt={2}>
        <Typography variant="body2">템플릿</Typography>
        <canvas ref={tempRef} />
      </Box>
      <Box pt={2}>
        <Typography variant="body2">after</Typography>
        <canvas ref={dstRef} style={{ width: "100%" }} />
      </Box>
    </Box>
  );
};

export default Capture;
