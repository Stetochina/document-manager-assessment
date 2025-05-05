import { Box } from "@mui/material";
import Header from "./Header";

const AppLayout = ({ children }) => {
  return (
    <Box display="flex" flexDirection={"column"}>
      <Header />
      <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
