import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";
import { FileIcon, defaultStyles } from "react-file-icon";

const getExtension = (filename: string) => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
};

type DocumentItemProps = {
  file: {
    folderName: string;
    name: string;
    id: string | null;
    updated_at: string | null;
    created_at: string | null;
    last_accessed_at: string | null;
    // metadata: FileMetadata | null;
    bucket_id?: string;
    owner?: string;
    // buckets?: Bucket;
  };
  userId: string;
  onDownload: (fileName: string, folderName: string) => void;
  onDelete: (fileName: string) => void;
};

const DocumentItem = ({
  file,
  userId,
  onDownload,
  onDelete,
}: DocumentItemProps) => {
  const ext = getExtension(file.name);

  return (
    <Card
      key={file.id}
      variant="outlined"
      sx={{ my: 2, p: 1, borderRadius: 2 }}
    >
      <CardContent sx={{display: "flex", gap: 2, alignItems: "center"}}>
        <div style={{ width: 24, height: 24 }}>
          <FileIcon
            extension={ext}
            {...defaultStyles[ext]}
          />
        </div>
        <div>
          <Typography variant="subtitle1" fontWeight="bold" fontSize="large">
            {file.name}
          </Typography>
          <Typography variant="body1">
            Uploaded on{" "}
            {file.created_at
              ? new Date(file.created_at).toLocaleString()
              : null}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          size="small"
          startIcon={<Download />}
          onClick={() => onDownload(file.name, file.folderName)}
        >
          download
        </Button>
        {file.folderName === userId && (
          <Button
            variant="contained"
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this file?")
              ) {
                onDelete(file.name);
              }
            }}
          >
            delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default DocumentItem;
