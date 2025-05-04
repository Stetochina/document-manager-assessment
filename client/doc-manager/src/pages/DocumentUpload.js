import { useState, useEffect } from "react";

import {
  TextField,
  Button,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useAuth();
  const currentUserId = user?.user_id;

  const myFiles = files.filter((file) => file.user === currentUserId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosInstance.get("/api/file_versions/");
        setFiles(response.data);
      } catch (error) {
        console.error("Failed to fetch files", error);
      }
    };
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (!file || !url) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("url", url);

    try {
      const response = await axiosInstance.post(
        "/api/file_versions/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setFiles((prevFiles) => [...prevFiles, response.data]);
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.detail || "Invalid request format");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={5}
      >
        <Typography variant="h4" gutterBottom>
          Document upload & revisions display
        </Typography>
        <Stack alignSelf={"start"} direction={"row"}>
          <Stack alignSelf={"start"} paddingTop={"20px"}>
            <Typography fontWeight={"bold"}>Generate new revision:</Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              paddingTop={"20px"}
            >
              <Typography alignSelf={"center"}>
                Please provide the url where to store the document:
              </Typography>
              <TextField
                fullWidth
                label="URL"
                variant="outlined"
                margin="normal"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorMessage("");
                }}
              />
            </Stack>
            <Stack>
              <Box display="flex" gap={2} sx={{ width: "100%", mt: 1, mb: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    flexGrow: 1,
                    textAlign: "left",
                    justifyContent: "flex-start",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file ? file.name : "Choose Document to store at desired URL"}
                  <input type="file" onChange={handleFileChange} hidden />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={!file || !url}
                >
                  Upload
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>

        <Box>
          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 2,
                bgcolor: "#ef9a9a",
                color: "white",
                borderColor: "#ef5350",
                "& .MuiAlert-icon": { color: "white" },
              }}
            >
              {errorMessage}
            </Alert>
          )}
        </Box>
        <Box mt={4} width="100%">
          <Typography variant="h6" gutterBottom alignSelf={"center"}>
            My Documents
          </Typography>
          <List
            sx={{
              maxHeight: 500,
              overflow: "scroll",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
              bgcolor: "background.paper",
              mb: 3,
            }}
          >
            {myFiles.map((file) => (
              <ListItem
                key={file.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                style={{
                  border: "1px solid black",
                  margin: "10px",
                  maxWidth: "98%",
                  borderRadius: "4px",
                }}
              >
                <ListItemText
                  primary={file.file.file_name}
                  secondary={
                    <Typography>
                      URL: {file.url}
                      <br />
                      Revision: {file.revision_number}
                      <br />
                      Hash: {file.file.file_hash}
                    </Typography>
                  }
                />
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      const fileVersions = files.filter(
                        (f) => f.url === file.url
                      );
                      const hasMultipleVersions = fileVersions.length > 1;
                      const isLatestVersion =
                        file.revision_number ===
                        Math.max(...fileVersions.map((f) => f.revision_number));
                      console.log(fileVersions);
                      const downloadUrl =
                        hasMultipleVersions && !isLatestVersion
                          ? `${file.url}?revision=${file.revision_number}`
                          : file.url;
                      navigate(`${downloadUrl}`, {
                        state: { fileName: file.file.file_name },
                      });
                    }}
                  >
                    Download
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Container>
  );
};

export default DocumentUpload;
