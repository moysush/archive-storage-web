import { supabase } from "../utils/supabase";
import type { UserProps } from "./Login";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DocumentItem from "./DocumentItem";
import UploadForm from "./UploadForm";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const Documents = ({ user }: UserProps) => {
  const queryClient = useQueryClient();
  const [onLoadingAnimation, setOnLoadingAnimation] = useState(false);
  const userId = user?.id || "";
  const sanitizeFileName = (name: string) => {
    // eslint-disable-next-line no-useless-escape
    return name.replace(/[/\[\]{}()*?'"<>|\\/:]/g, "_");
  };

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["files", userId],
    queryFn: async () => {
      const { data: folders } = await supabase.storage
        .from("documents")
        .list("");
      const filePromises = folders?.map(async (folder) => {
        const { data: folderFiles, error: fileError } = await supabase.storage
          .from("documents")
          .list(folder.name, {
            limit: 100,
          });
        if (fileError || !folderFiles) return [];
        return folderFiles.map((f) => ({
          ...f,
          folderName: folder.name,
        }));
      });

      const files = (await Promise.all(filePromises || [])).flat();
      return files;
    },
    enabled: true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileName: string) => {
      setOnLoadingAnimation(true);
      return await supabase.storage
        .from("documents")
        .remove([`${user?.id}/${fileName}`]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", userId] });
      setOnLoadingAnimation(false);
      alert("deleted successfully");
    },
    onError: () => {
      setOnLoadingAnimation(false);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const path = `${user?.id}/${file?.name}`;
      setOnLoadingAnimation(true);
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", userId] });
      alert("uploaded!");
      setOnLoadingAnimation(false);
    },
    onError: () => {
      setOnLoadingAnimation(false);
    },
  });

  const handleDownload = async (fileName: string, folderName: string) => {
    const { data } = await supabase.storage
      .from("documents")
      .download(`${folderName}/${fileName}`);
    console.log(`${folderName}/${fileName}`);

    if (!data) return;

    const url = URL.createObjectURL(data);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: fileName,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const file = e.target.files[0];
    if (file) {
    const safeName = sanitizeFileName(file.name);
    const safeFile = new File([file], safeName, {type: file.type})  
    uploadMutation.mutate(safeFile);
    }
  };

  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files</p>;

  return (
    <Paper elevation={0}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">Total Files: {files?.length}</Typography>
        {!files && <Typography>No documents yet...</Typography>}
        {onLoadingAnimation && <CircularProgress />}
        <UploadForm onFileChange={handleUpload} />
      </Box>
      {files?.map((f) => (
        <DocumentItem
          key={f.id}
          file={f}
          userId={userId}
          onDownload={handleDownload}
          onDelete={deleteMutation.mutate}
        />
      ))}
    </Paper>
  );
};

export default Documents;
