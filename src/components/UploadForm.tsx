type UploadFormProps = {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  disabled?: boolean;
};

const UploadForm = ({ onFileChange, onUpload, disabled }: UploadFormProps) => {
  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload} disabled={disabled}>
        upload
      </button>
    </div>
  );
};

export default UploadForm;
