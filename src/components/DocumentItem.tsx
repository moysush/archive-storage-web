
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
    <div key={file.id}>
      <p>{file.name}</p>
      <p>
        {file.created_at ? new Date(file.created_at).toLocaleString() : null}
      </p>
      <button onClick={() => onDownload(file.name, file.folderName)}>
        download
      </button>
      {file.folderName === userId && (
        <button onClick={() => onDelete(file.name)}>delete</button>
      )}
    </div>
  );
};

export default DocumentItem;
