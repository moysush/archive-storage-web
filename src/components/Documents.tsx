import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { UserProps } from "./Login";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Documents = ({ user }: UserProps) => {
  const queryClient = useQueryClient();
  const [newFile, setNewFile] = useState<File | null>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewFile(e.target.files[0]);
    }
  };

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["files", user?.id],
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
      return await supabase.storage
        .from("documents")
        .remove([`${user?.id}/${fileName}`]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.id] });
      alert("deleted successfully");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const path = `${user?.id}/${file?.name}`;
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (error) throw error;
      setNewFile(null);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.id] });
      alert("uploaded!");
    },
    onError: () => {},
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

  if (isLoading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files</p>;

  return (
    <div>
      <h2>documents</h2>
      <p>total files: {files?.length}</p>
      {!files && <p>no documents yet</p>}
      {files?.map((f) => (
        <div key={f.id}>
          <p>{f.name}</p>
          <p>Posted on {f.created_at? new Date(f.created_at).toLocaleString(): null}</p>
          <button onClick={() => handleDownload(f.name, f.folderName)}>
            download
          </button>
          {f.folderName === user?.id && (
            <button onClick={() => deleteMutation.mutate(f.name)}>
              delete
            </button>
          )}
        </div>
      ))}
      <input type="file" onChange={handleUpload} />
      <button onClick={() => uploadMutation.mutate(newFile as File)}>
        upload
      </button>
    </div>
  );
};

export default Documents;
