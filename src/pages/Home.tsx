import { Box } from "@mui/material";
import Result from "../components/Result/Result";
import Search from "../components/Search/Search";

const Home = () => {
  return (
    <Box display="flex">
      <Search />
      <Result />
    </Box>
  );
};

export default Home;
