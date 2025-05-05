import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post("/auth-token/", {
        username: email,
        password: password,
      });
      login(response.data.token);
      navigate("/doc-upload");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      localStorage.removeItem("token");
    }
  };

  return (
    <Container
      maxWidth="100%"
      alignItems="center"
      style={{ backgroundColor: "#aed6f1" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        maxWidth="400px"
        alignSelf={"center"}
        justifySelf={"center"}
      >
        <Typography variant="h4" gutterBottom textAlign="center">
          Document Manager{" "}
        </Typography>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="standard"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="standard"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
