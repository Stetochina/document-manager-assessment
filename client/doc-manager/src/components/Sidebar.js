import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <List>
        <ListItem button="true" component={Link} to="/doc-upload" style={{color: 'black'}}>
          <ListItemText primary="My documents and revisions" />
        </ListItem>
        <ListItem button="true" component={Link} to="/doc-search" style={{color: 'black'}}>
          <ListItemText primary="Search and Download by hash" />
        </ListItem>
      </List>
      <Box p={2}>
        <Button fullWidth variant="contained" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
