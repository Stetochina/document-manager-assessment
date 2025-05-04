import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import axiosInstance from "../api/axiosInstance";

const DocumentDownload = () => {
  const location = useLocation();
  const { "*": restOfPath } = useParams();
  const fileUrl = location.pathname + location.search;
  const { fileName } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const downloadStartedRef = useRef(false); // Using ref instead of state
  const navigate = useNavigate();
  useEffect(() => {
    if (downloadStartedRef.current) return;
    downloadStartedRef.current = true;

    const fetchFile = async () => {
      let link = null;
      try {
        const response = await axiosInstance.get(
          "/api/file_versions/get_document_by_url",
          {
            params: { file_url: fileUrl },
            responseType: "blob",
          }
        );
        const contentDisposition = response.headers["content-disposition"];
        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : fileName || "downloaded_file";

        console.log(response.data, "RESPONSE");
        link = document.createElement("a");
        link.href = URL.createObjectURL(response.data);
        link.download = filename;
        document.body.appendChild(link);
        console.log(link, "LINK");
        link.click();

        setDownloadCompleted(true);
      } catch (err) {
        setError("Error downloading file");
        console.error(err);
      } finally {
        if (link) {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileUrl, fileName]);

  const handleBackToFileUpload = () => {
    navigate("/file-upload");
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && downloadCompleted && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Once you are done with file download you can go back to MyFiles
            overview
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleBackToFileUpload}
          >
            Go back
          </Button>
        </Box>
      )}
      {!loading && !error && !downloadCompleted && (
        <Box>
          <Typography variant="h6" gutterBottom>
            File is being downloaded...
          </Typography>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default DocumentDownload;
