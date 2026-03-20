import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { Delete } from "@mui/icons-material";

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
  return (
    <Card
      key={file.id}
      variant="outlined"
      sx={{ my: 2, p: 1, borderRadius: 2 }}
    >
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" fontSize="large">
          {file.name}
        </Typography>
        <Typography variant="body1">
          Uploaded on{" "}
          {file.created_at ? new Date(file.created_at).toLocaleString() : null}
        </Typography>
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
            onClick={() => onDelete(file.name)}
          >
            delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default DocumentItem;
