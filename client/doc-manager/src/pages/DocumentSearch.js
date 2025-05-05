import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const DocumentSearch = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const navigate = useNavigate();
  const [downloadByHash, setDownloadByHash] = useState("");
  const [hashDownloadError, setHashDownloadError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.value);
    setError("");
  };

  const handleSearch = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError("");
    setSearchCount(searchCount + 1);

    try {
      const response = await axiosInstance.get(
        "/api/file_versions/retrieve_revisions_by_hash",
        {
          params: { file_hash: file },
        }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to search files");
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (file) => {
    const fileRevisions = results.filter((f) => f.url === file.url);
    const hasMultipleVersions = fileRevisions.length > 1;
    const isLatestVersion =
      file.revision_number ===
      Math.max(...fileRevisions.map((f) => f.revision_number));
    console.log(fileRevisions);
    const downloadUrl =
      hasMultipleVersions && !isLatestVersion
        ? `${file.url}?revision=${file.revision_number}`
        : file.url;
    console.log(downloadUrl, "URL");
    navigate(downloadUrl, { state: { fileName: file.file.file_name } });
  };

  const handleSetDownloadByHash = (e) => {
    setHashDownloadError(null);
    setDownloadByHash(e.target.value);
  };
  const hashDownload = async () => {
    let link = null;
    try {
      const response = await axiosInstance.get(
        `/api/file_versions/download_file_by_hash/`,
        {
          params: { file_hash: downloadByHash },
          responseType: "blob",
        }
      );
      const filename = "downloaded_file";
      link = document.createElement("a");
      link.href = URL.createObjectURL(response.data);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
    } catch {
      setHashDownloadError(
        "Cannot find file by that hash or you do not have perimission to view it."
      );
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
        <Stack
          alignSelf={"start"}
          direction={"row"}
          spacing={4}
          flex={1}
          width={"100%"}
        >
          <Stack alignSelf={"start"} flex={1}>
            <Typography variant="h5" gutterBottom>
              Search revisions by document hash
            </Typography>

            <Box display="flex" gap={2} sx={{ width: "100%", mt: 2, mb: 2 }}>
              <input
                type={"text"}
                onChange={handleFileChange}
                style={{ width: "300px" }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                disabled={!file || loading}
              >
                {loading ? <CircularProgress size={24} /> : "Search"}
              </Button>
            </Box>
          </Stack>

          <Stack flex={1}>
            <Typography variant="h5" gutterBottom>
              Download document directly from hash
            </Typography>
            <Box display="flex" gap={2} sx={{ width: "100%", mt: 2, mb: 2 }}>
              <input
                type={"text"}
                value={downloadByHash}
                onChange={handleSetDownloadByHash}
                style={{ width: "300px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={hashDownload}
              >
                Download
              </Button>
            </Box>
          </Stack>
        </Stack>
        {hashDownloadError && (
          <Alert severity="error">{hashDownloadError}</Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {results.length > 0 && (
          <Box mt={4} width="100%">
            <Typography variant="h5" gutterBottom>
              Search Results
            </Typography>
            <List
              sx={{
                maxHeight: 400,
                overflow: "auto",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              {results.map((file) => (
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
                    primary={
                      <Typography> Title: {file.file.file_name}</Typography>
                    }
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
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => downloadFile(file)}
                    sx={{ ml: 2 }}
                  >
                    Download
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {results.length === 0 && searchCount > 0 && !loading && !error && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No files found matching your search
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default DocumentSearch;
