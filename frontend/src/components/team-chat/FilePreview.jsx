import { Box, Typography, Link, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axiosInstance from "../../services/axiosInstance";

const FilePreview = ({ file }) => {
  const normalizeFilePath = (filePath) =>
    String(filePath).replace(/\\/g, "/").replace(/^\//, "");

  const getAttachmentUrl = (filePath) => {
    if (!filePath) return "";
    const normalized = normalizeFilePath(filePath);
    const baseUrl = axiosInstance.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:5000";
    return normalized.startsWith("http") ? normalized : `${baseUrl}/${normalized}`;
  };

  const isImageFile = (fileName) => {
    const ext = String(fileName).split(".").pop().toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  };

  const isPdfFile = (fileName) => {
    return fileName.toLowerCase().endsWith(".pdf");
  };

  const fileName = String(file).split("/").pop();

  const url = getAttachmentUrl(file);

  const handleView = () => {
    const ext = fileName.split(".").pop().toLowerCase();
    const directOpenExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "webp", "txt", "html", "htm"];
    const officeExtensions = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];

    if (directOpenExtensions.includes(ext)) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (officeExtensions.includes(ext)) {
      const officeViewer = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      window.open(officeViewer, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isImageFile(fileName)) {
    return (
      <Box
        sx={{
          mt: 1,
          maxWidth: 200,
        }}
      >
        <Box
          component="img"
          src={url}
          alt={fileName}
          sx={{
            width: "100%",
            maxHeight: 150,
            objectFit: "cover",
            borderRadius: "12px",
            display: "block",
            cursor: "pointer",
          }}
          onClick={handleView}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
          <IconButton size="small" onClick={handleView} sx={{ color: "#fff", p: 0.5 }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDownload} sx={{ color: "#fff", p: 0.5 }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        mt: 1,
        p: 1.5,
        bgcolor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography
          sx={{
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 150,
          }}
        >
          {fileName}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <IconButton size="small" onClick={handleView} sx={{ color: "#fff", p: 0.5 }}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={handleDownload} sx={{ color: "#fff", p: 0.5 }}>
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FilePreview;
