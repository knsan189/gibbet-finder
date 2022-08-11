import { Crop as CropIcon } from "@mui/icons-material";
import { Box, Button, styled } from "@mui/material";
import React, { useRef, useState } from "react";
import { screenCapture } from "../lib/capture";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { createWorker } from "tesseract.js";

const HiddenVideo = styled("video")(() => ({
  position: "absolute",
  top: -100000,
  left: -100000,
}));

const Capture = () => {
  const [crop, setCrop] = useState<Crop | undefined>({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [image, setImage] = useState("./images/test.jpg");
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const callback = (base64: string) => {
    setImage(base64);
  };

  const handleClick = async () => {
    if (videoRef.current) {
      screenCapture(videoRef.current, callback);
    }
  };

  const handleChangeCrop = (pixelCrop: PixelCrop) => {
    setCrop(pixelCrop);
  };

  const handleCrop = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!imageRef.current || !ctx || !crop) return;

    const { naturalWidth, naturalHeight, width, height } = imageRef.current;
    const scaleX = naturalWidth / width;
    const scaleY = naturalHeight / height;
    const pixelRatio = window.devicePixelRatio;

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const centerX = naturalWidth / 2;
    const centerY = naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      imageRef.current,
      0,
      0,
      naturalWidth,
      naturalHeight,
      0,
      0,
      naturalWidth,
      naturalHeight,
    );

    const base64 = canvas.toDataURL("image/png");
    ctx.restore();

    setCrop(undefined);
    setImage(base64);
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
    await worker.terminate();
  };

  return (
    <Box p={2}>
      <HiddenVideo ref={videoRef} />
      <Button onClick={handleClick} variant="outlined" sx={{ mr: 1 }}>
        스크린샷 찍기
      </Button>
      <Button variant="contained" onClick={handleCrop}>
        <CropIcon />
      </Button>
      <Box pt={2}>
        {image && (
          <ReactCrop crop={crop} onChange={handleChangeCrop}>
            <img ref={imageRef} src={image} alt="screen" />
          </ReactCrop>
        )}
      </Box>
      <Button onClick={handleOCR} variant="contained">
        OCR
      </Button>
    </Box>
  );
};

export default Capture;
