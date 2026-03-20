import { Fab, Typography,  } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type UploadFormProps = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UploadForm = ({ onFileChange }: UploadFormProps) => {
  return (
    <label>
      <input type="file" onChange={onFileChange} style={{ display: "none" }} />
      <Fab
        aria-label="add"
        variant="extended"
        size="medium"
        color="primary"
        component="span"
      >
        <AddIcon sx={{ mr: 1 }} />
        <Typography>upload</Typography>
      </Fab>
    </label>
  );
};

export default UploadForm;
