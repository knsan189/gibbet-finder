import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { RootState } from "../redux/reducers";

const useTheme = () => {
  const { theme: mode } = useSelector((state: RootState) => state.config);
  const theme = createTheme({
    typography: {
      fontFamily: "Noto Sans KR, Roboto, sans-serif",
      h6: {
        fontSize: "1.1rem",
        lineHeight: 1.5,
      },
    },
    spacing: 10,
    palette: {
      mode,
      primary: {
        main: "#3d414d",
      },
    },
  });
  return { theme };
};
export default useTheme;
