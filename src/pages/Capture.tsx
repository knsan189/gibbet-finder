import { Box, Button, Divider, Grid, Paper, styled, Typography } from "@mui/material";
import { Screenshot, Translate } from "@mui/icons-material";
import { createWorker } from "tesseract.js";
import React, { useEffect, useRef, useState, useContext } from "react";
import { screenCapture } from "../lib/capture";
import { OpenCv } from "../App";
import UserService from "../service/UserService";
import CaptureName from "../components/Capture/CaptureName";
import { getOCRString } from "../utils/ocr";

const HiddenVideo = styled("video")(() => ({
  position: "absolute",
  top: -100000,
  left: -100000,
}));

const templateUrl = "./images/template.png";

const setCanvasImage = (canvas: HTMLCanvasElement, url: string, x?: number, y?: number) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const img = new Image();
  img.src = url;
  img.onload = () => {
    const { width, height } = img;
    const { devicePixelRatio } = window;
    canvas.width = x || width;
    canvas.height = y || height;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    // ctx.save();
    ctx.drawImage(img, 0, 0, x || width, y || height);
    ctx.restore();
  };
};

const Capture = () => {
  const cv = useContext(OpenCv);
  const [status, setStatus] = useState({
    screenShot: false,
    target: false,
    result: false,
  });
  const [nicknames, setNicknames] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tempRef = useRef<HTMLCanvasElement>(null);
  const srcRef = useRef<HTMLCanvasElement>(null);
  const dstRef = useRef<HTMLCanvasElement>(null);

  const handleClick = async () => {
    if (videoRef.current) {
      screenCapture(videoRef.current, (base64: string) => {
        const src = srcRef.current;
        if (src) setCanvasImage(src, base64);
        setStatus((prev) => ({ ...prev, screenShot: true }));
      });
    }
  };

  const handleOCR = async () => {
    const dst = dstRef.current;
    const ctx = dst?.getContext("2d");
    if (!dst || !ctx) return;
    const base64 = dst.toDataURL("image/png");
    const kor = await getOCRString(base64, "kor");
    const korPromiseArray: Promise<User | null>[] = kor.map((name) => UserService.getChar(name));
    const korResponses = await Promise.all(korPromiseArray);
    console.log(kor);
    console.log(korResponses);

    const indexArr: number[] = [];
    korResponses.forEach((res, index) => {
      if (res === null) {
        indexArr.push(index);
      }
    });

    // if (indexArr.length > 0) {
    //   const eng = await getOCRString(base64);
    //   const engPromiseArray: Promise<User | null>[] = eng.map((name) => UserService.getChar(name));
    //   const engResponses = await Promise.all(engPromiseArray);
    //   console.log(eng);
    //   console.log(engResponses);
    // }

    // setUsers(responses);
  };

  useEffect(() => {
    if (srcRef.current) {
      setCanvasImage(srcRef.current, "./images/screenshot.jpg", 1920, 1080);
      setStatus((prev) => ({ ...prev, screenShot: true }));
    }
    if (tempRef.current) {
      setCanvasImage(tempRef.current, templateUrl);
    }
  }, []);

  const handleCv = async () => {
    if (!cv) return;

    await new Promise((resolve) => {
      const src = cv.imread(srcRef.current);
      const temp = cv.imread(tempRef.current);
      let dst = new cv.Mat();
      const mask = new cv.Mat();
      cv.matchTemplate(src, temp, dst, cv.TM_CCOEFF_NORMED, mask);
      const result = cv.minMaxLoc(dst, mask);
      const maxPoint = result.maxLoc;
      const rect = new cv.Rect(
        maxPoint.x + 50,
        maxPoint.y + temp.rows,
        temp.cols + 100,
        temp.rows + 80,
      );
      dst = src.roi(rect);
      const test = new cv.Mat();
      cv.bitwise_not(dst, test);
      cv.cvtColor(test, test, cv.COLOR_BGR2GRAY);
      cv.convertScaleAbs(test, test, 1.2, 0);
      cv.imshow(dstRef.current, test);
      src.delete();
      dst.delete();
      mask.delete();
      test.delete();
      resolve("ok");
    });
    setStatus((prev) => ({ ...prev, target: true }));
    handleOCR();
  };

  return (
    <Box>
      <Box p={2}>
        <Button onClick={handleClick} variant="outlined" sx={{ mr: 1 }} startIcon={<Screenshot />}>
          스크린샷 찍기
        </Button>
        <Button
          onClick={handleCv}
          variant="contained"
          startIcon={<Translate />}
          disabled={!status.screenShot}
        >
          글자 추출
        </Button>
      </Box>
      <Box
        p={2}
        sx={{
          background: (theme) =>
            theme.palette.mode === "light" ? "#eee" : theme.palette.grey[900],
        }}
      >
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">1번 파티 이미지</Typography>
              </Box>
              <Divider />
              <Box p={2}>
                <canvas ref={dstRef} style={{ width: "100%" }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">1번 파티 결과</Typography>
              </Box>
              <Divider />
              <Box p={2}>
                {/* {users.map((user, index) =>
                  index > 3 ? null : <CaptureName key={index} user={user} />,
                )} */}
              </Box>
            </Paper>
          </Grid>
          <Grid item sm={12}>
            <Paper>
              <Box p={2}>
                <Typography variant="h6">원본 스크린샷</Typography>
              </Box>
              <Divider />
              <Box p={2}>
                <canvas ref={srcRef} style={{ width: "100%" }} />
              </Box>
            </Paper>
          </Grid>
          <Box pt={2}>
            <Typography variant="body2">템플릿</Typography>
            <canvas ref={tempRef} />
          </Box>
        </Grid>
      </Box>

      <HiddenVideo ref={videoRef} />
    </Box>
  );
};

export default Capture;
