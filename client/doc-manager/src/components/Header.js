import {
  List,
  ListItem,
  ListItemText,
  Drawer,
  Button,
  Box,
  Container,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  return (
    <Container
      sx={{
        width: "100%",
        flexShrink: 0,
        borderBottom: "1px solid black",
      }}
    >
      <Stack flexDirection="row" spacing={"around"}>
        <ListItem
          button="true"
          component={Link}
          to="/doc-upload"
          style={{ color: "black" }}
        >
          <ListItemText primary="My documents and revisions" />
        </ListItem>
        <ListItem
          button="true"
          component={Link}
          to="/doc-search"
          style={{ color: "black" }}
        >
          <ListItemText primary="Search and Download by hash" />
        </ListItem>
        <Box p={2}>
          <Button fullWidth variant="contained" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default Header;
