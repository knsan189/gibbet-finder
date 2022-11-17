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
import React, { useRef, useState, useContext } from "react";
import { Line } from "tesseract.js";
import { LoadingButton } from "@mui/lab";
import { useDispatch } from "react-redux";
import { screenCapture } from "../lib/capture";
import { OpenCv } from "../App";
import { getOCRString, setMatchPoint } from "../utils/ocr";
import { enqueueSnackbar } from "../redux/reducers/snackbar";
import CaptureResult from "../components/Capture/CaptureResult";
import { clearCanvas, setImagetoCanvas } from "../utils/canvas";
import {
  templateNormal1PartyUrl,
  templateNormal2PartyUrl,
  templateWide1PartyUrl,
  templateWide2PartyUrl,
} from "../utils/const";

const HiddenVideo = styled("video")(() => ({
  position: "absolute",
  top: -100000,
  left: -100000,
}));

// eslint-disable-next-line no-useless-escape
const regex = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

interface PartyWords {
  party1: CaptureWord[];
  party2: CaptureWord[];
}

const Capture = () => {
  const dispatch = useDispatch();
  const cv = useContext(OpenCv);
  const [raidType, setRaidType] = useState<string>("8");
  const [status, setStatus] = useState({
    target: false,
    result: false,
  });

  const [screenshot, setScreenshot] = useState<Screenshot>();
  const [loading, toggleLoading] = useState(false);
  const [partyWords, setPartyWords] = useState<PartyWords>({ party1: [], party2: [] });
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceRef = useRef<HTMLCanvasElement>(null);
  const party1TemplateRef = useRef<HTMLCanvasElement>(null);
  const party2TemplateRef = useRef<HTMLCanvasElement>(null);
  const party1ResultRef = useRef<HTMLCanvasElement>(null);
  const party2ResultRef = useRef<HTMLCanvasElement>(null);

  const handleChangeRaid = (event: any, value: string) => {
    setRaidType(value);
  };

  const onScreenCapture = async () => {
    if (videoRef.current) {
      try {
        const imageData = await screenCapture(videoRef.current);
        const newScreenshot = await setImagetoCanvas(sourceRef.current, imageData);
        let party1Image = templateNormal1PartyUrl;
        let party2Image = templateNormal2PartyUrl;
        if (newScreenshot.gcd === 40) {
          party1Image = templateWide1PartyUrl;
          party2Image = templateWide2PartyUrl;
        }
        await setImagetoCanvas(party1TemplateRef.current, party1Image, true);
        await setImagetoCanvas(party2TemplateRef.current, party2Image, true);
        setScreenshot(newScreenshot);
      } catch (error: any) {
        dispatch(enqueueSnackbar({ message: error.message, options: { variant: "error" } }));
      }
    }
  };

  const handleOCR = async (targetCanvas: HTMLCanvasElement | null, type: keyof PartyWords) => {
    const ctx = targetCanvas?.getContext("2d");
    if (!targetCanvas || !ctx) return;
    const base64 = targetCanvas.toDataURL("image/png");
    const korLines: Line[] = await getOCRString(base64, "kor");
    console.log(korLines);
    const korWords: CaptureWord[] = [];

    korLines.forEach((line) => {
      let totalConfidence = 0;
      line.words.forEach((word) => {
        totalConfidence += word.confidence;
      });

      let text = line.text.replaceAll(" ", "").replace("\n", "").replace(regex, "");
      if (text.length === 1) {
        text = "";
      }

      korWords.push({
        text,
        confidence: totalConfidence / line.words.length,
        id: line.confidence,
      });
    });

    const engLines: Line[] = await getOCRString(base64);
    const engWords: CaptureWord[] = [];

    engLines.forEach((line) => {
      let totalConfidence = 0;
      line.words.forEach((word) => {
        totalConfidence += word.confidence;
      });
      let text = line.text.replaceAll(" ", "").replace("\n", "").replace(regex, "");
      if (text.length === 1) {
        text = "";
      }
      engWords.push({
        text,
        confidence: totalConfidence / line.words.length,
        id: line.confidence,
      });
    });

    const newWords = korWords.map((word, index) =>
      word.confidence >= engWords[index].confidence ? word : engWords[index],
    );

    setPartyWords((prev) => ({ ...prev, [type]: newWords }));
    setStatus((prev) => ({ ...prev, result: true }));
  };

  const handleCv = async () => {
    try {
      if (!cv || !screenshot) return;
      toggleLoading(true);
      await new Promise<void>((resolve) => {
        (async () => {
          const src = cv.imread(sourceRef.current);
          await setMatchPoint(
            cv,
            src,
            sourceRef.current,
            party1TemplateRef.current,
            party1ResultRef.current,
            screenshot,
          );
          if (raidType === "8") {
            await setMatchPoint(
              cv,
              src,
              sourceRef.current,
              party2TemplateRef.current,
              party2ResultRef.current,
              screenshot,
            );
          }
          src.delete();
          setStatus((prev) => ({ ...prev, target: true }));
          await handleOCR(party1ResultRef.current, "party1");
          if (raidType === "8") {
            await handleOCR(party2ResultRef.current, "party2");
          }
          resolve();
        })();
      });
      toggleLoading(false);
    } catch (error) {
      console.log(error);
      toggleLoading(false);
    }
  };

  const handleClear = () => {
    setStatus({ target: false, result: false });
    setScreenshot(undefined);
    setPartyWords({ party1: [], party2: [] });
    clearCanvas(sourceRef.current, party1ResultRef.current, party2ResultRef.current);
  };
  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Divider />
        <Toolbar>
          <Box display="flex" alignItems="center">
            <Button
              onClick={onScreenCapture}
              variant="outlined"
              sx={{ mr: 1 }}
              startIcon={<ScreenshotMonitor />}
              size="small"
              disabled={status.target}
            >
              게임화면 캡쳐
            </Button>
            <LoadingButton
              onClick={handleCv}
              variant="contained"
              startIcon={<Translate />}
              sx={{ mr: 2 }}
              loading={loading}
              size="small"
              disabled={!Boolean(screenshot) || status.target}
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
          <Button color="error" onClick={handleClear} startIcon={<ClearAll />} size="small">
            초기화
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
                  <canvas ref={party1ResultRef} style={{ width: "100%" }} />
                </Box>
              </Paper>
            </Collapse>
          </Grid>
          <Grid item sm={9}>
            <Collapse in={Boolean(partyWords.party1.length)}>
              <Paper>
                <Box p={2}>
                  {partyWords.party1.map((word, index) => (
                    <CaptureResult
                      key={word.id}
                      word={word}
                      index={index}
                      lastIndex={partyWords.party1.length === index + 1}
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
                      <canvas ref={party2ResultRef} style={{ width: "100%" }} />
                    </Box>
                  </Paper>
                </Collapse>
              </Grid>
              <Grid item sm={9}>
                <Collapse in={Boolean(partyWords.party2.length)}>
                  <Paper>
                    <Box p={2}>
                      {partyWords.party2.map((word, index) => (
                        <CaptureResult
                          key={word.id}
                          word={word}
                          index={index}
                          lastIndex={partyWords.party2.length === index + 1}
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
          <Grid item sm={9}>
            <Collapse in={Boolean(screenshot)}>
              <Paper>
                <Box p={2}>
                  <canvas ref={sourceRef} style={{ width: "100%" }} />
                </Box>
              </Paper>
            </Collapse>
          </Grid>
          <Grid item sm={3}>
            <Collapse in={Boolean(screenshot)}>
              <Paper>
                <Box p={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2">이미지 크기</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {screenshot?.width} X {screenshot?.height}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2">이미지 비율</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {screenshot?.aspectRatio.width} : {screenshot?.aspectRatio.height}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle2">생성 시간</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {screenshot?.createdTime.toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Collapse>
          </Grid>
          <Grid item>
            <canvas ref={party1TemplateRef} style={{ display: "none" }} />
            <canvas ref={party2TemplateRef} style={{ display: "none" }} />
          </Grid>
        </Grid>
      </Box>

      <HiddenVideo ref={videoRef} />
    </>
  );
};

export default Capture;
