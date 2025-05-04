import { Box } from "@mui/material";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
    </Box>
  );
};

export default AppLayout;
