import {
  AppBar,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { ClearAll, ScreenshotMonitor, Translate } from "@mui/icons-material";
import React, { useEffect, useRef, useState, useContext } from "react";
import { Line } from "tesseract.js";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { screenCapture } from "../lib/capture";
import { OpenCv } from "../App";
import { getOCRString } from "../utils/ocr";
import { enqueueSnackbar } from "../redux/reducers/snackbar";
import CaptureResult from "../components/Capture/CaptureResult";

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
    canvas.width = x || width;
    canvas.height = y || height;
    ctx.save();
    ctx.drawImage(img, 0, 0, x || width, y || height);
    ctx.restore();
  };
};

const Capture = () => {
  const dispatch = useDispatch();
  const cv = useContext(OpenCv);
  const [raidType, setRaidType] = useState<string>("4");
  const [status, setStatus] = useState({
    screenShot: false,
    target: false,
    result: false,
  });
  const [words, setWords] = useState<CaptureWord[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tempRef = useRef<HTMLCanvasElement>(null);
  const srcRef = useRef<HTMLCanvasElement>(null);
  const dstRef = useRef<HTMLCanvasElement>(null);

  const handleChangeRaid = (event: any, value: string) => {
    setRaidType(value);
  };

  const handleClick = async () => {
    if (videoRef.current && srcRef.current) {
      try {
        const imageData = await screenCapture(videoRef.current);
        setCanvasImage(srcRef.current, imageData);
        setStatus((prev) => ({ ...prev, screenShot: true }));
      } catch (error: any) {
        dispatch(enqueueSnackbar({ message: error.message, options: { variant: "error" } }));
      }
    }
  };

  const handleOCR = async () => {
    const dst = dstRef.current;
    const ctx = dst?.getContext("2d");
    if (!dst || !ctx) return;
    const base64 = dst.toDataURL("image/png");
    const korLines: Line[] = await getOCRString(base64, "kor");
    const korWords: CaptureWord[] = [];

    korLines.forEach((line) => {
      let totalConfidence = 0;
      line.words.forEach((word) => {
        totalConfidence += word.confidence;
      });
      korWords.push({
        text: line.text.replaceAll(" ", "").replace("\n", ""),
        confidence: totalConfidence / line.words.length,
      });
    });

    const engLines: Line[] = await getOCRString(base64);
    const engWords: CaptureWord[] = [];

    engLines.forEach((line) => {
      let totalConfidence = 0;
      line.words.forEach((word) => {
        totalConfidence += word.confidence;
      });
      engWords.push({
        text: line.text.replaceAll(" ", "").replace("\n", ""),
        confidence: totalConfidence / line.words.length,
      });
    });

    const newWords = korWords.map((word, index) =>
      word.confidence >= engWords[index].confidence ? word : engWords[index],
    );

    setWords(newWords);
    setStatus((prev) => ({ ...prev, result: true }));
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
      cv.bitwise_not(dst, dst);
      cv.cvtColor(dst, dst, cv.COLOR_BGR2GRAY);
      cv.convertScaleAbs(dst, dst, 1.3, 0);
      cv.imshow(dstRef.current, dst);
      src.delete();
      dst.delete();
      mask.delete();
      resolve("ok");
    });
    setStatus((prev) => ({ ...prev, target: true }));
    handleOCR();
  };

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar>
          <Box display="flex" alignItems="center">
            <Button
              onClick={handleClick}
              variant="outlined"
              sx={{ mr: 1 }}
              startIcon={<ScreenshotMonitor />}
              size="small"
            >
              게임화면 캡쳐
            </Button>
            <LoadingButton
              onClick={handleCv}
              variant="contained"
              startIcon={<Translate />}
              disabled={!status.screenShot}
              sx={{ mr: 2 }}
              loading={status.target && !status.result}
              size="small"
            >
              글자 추출
            </LoadingButton>
            <FormControl disabled={status.target}>
              <RadioGroup row value={raidType} onChange={handleChangeRaid}>
                <FormControlLabel
                  control={<Radio size="small" />}
                  value="4"
                  label="4인 레이드"
                  componentsProps={{ typography: { variant: "body2" } }}
                />
                <FormControlLabel
                  control={<Radio size="small" />}
                  label="8인 레이드"
                  value="8"
                  componentsProps={{ typography: { variant: "body2" } }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Button
            color="error"
            onClick={handleCv}
            startIcon={<ClearAll />}
            disabled={!status.screenShot}
            size="small"
          >
            전체 초기화
          </Button>
        </Toolbar>
      </AppBar>
      <Divider />
      <Box
        p={2}
        sx={{
          background: (theme) =>
            theme.palette.mode === "light" ? "#eee" : theme.palette.grey[900],
          minHeight: "100vh",
        }}
      >
        <Grid container spacing={2}>
          <Grid item sm={12}>
            <Typography variant="h6">1번 파티</Typography>
          </Grid>
          <Grid item sm={3}>
            <Collapse in={status.target}>
              <Paper>
                <Box p={2}>
                  <canvas ref={dstRef} style={{ width: "100%" }} />
                </Box>
              </Paper>
            </Collapse>
          </Grid>
          <Grid item sm={9}>
            <Collapse in={status.result}>
              <Paper>
                <Box p={2}>
                  {words.map((word, index) => (
                    <CaptureResult
                      key={word.text}
                      word={word}
                      index={index}
                      lastIndex={words.length === index + 1}
                    />
                  ))}
                </Box>
              </Paper>
            </Collapse>
          </Grid>
          {raidType === "8" ? (
            <>
              <Grid item sm={12}>
                <Typography variant="h6">2번 파티</Typography>
              </Grid>
              <Grid item sm={3}>
                <Collapse in={status.target}>
                  <Paper>
                    <Box p={2}>
                      <canvas style={{ width: "100%" }} />
                    </Box>
                  </Paper>
                </Collapse>
              </Grid>
              <Grid item sm={9}>
                <Collapse in={status.result}>
                  <Paper>
                    <Box p={2}>
                      {words.map((word, index) => (
                        <CaptureResult
                          key={word.text}
                          word={word}
                          index={index}
                          lastIndex={words.length === index + 1}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Collapse>
              </Grid>
            </>
          ) : null}

          <Grid item sm={12}>
            <Typography variant="h6">게임화면 스크린샷</Typography>
          </Grid>
          <Grid item sm={12}>
            <Paper>
              <Box p={2}>
                <canvas ref={srcRef} style={{ width: "100%" }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <canvas ref={tempRef} style={{ display: "none" }} />
      <HiddenVideo ref={videoRef} />
    </>
  );
};

export default Capture;
