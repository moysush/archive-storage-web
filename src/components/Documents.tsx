import { useState } from "react";
import { supabase } from "../utils/supabase";
import type { UserProps } from "./Login";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type FileObject = {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
};

const Documents = ({ user }: UserProps) => {
  const queryClient = useQueryClient();
  const [newFile, newFileSet] = useState<File | null>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      newFileSet(e.target.files[0]);
    }
  };

  const {
    data: files,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["files", user?.id],
    queryFn: async () => {
      const { data } = await supabase.storage.from("documents").list(user?.id);
      return data as FileObject[];
    },
    enabled: !!user?.id,
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
      const path = `${user?.id}/${Date.now()}_${file?.name}`;
      const { data, error } = await supabase.storage
        .from("documents")
        .upload(path, file);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", user?.id] });
      newFileSet(null);
      alert("uploaded!");
    },
  });

  const handleDownload = async (name: string) => {
    const { data } = await supabase.storage
      .from("documents")
      .download(`${user?.id}/${name}`);
    if (!data) return;

    const url = URL.createObjectURL(data);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: name,
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
          <p>{f.created_at}</p>
          <button onClick={() => handleDownload(f.name)}>download</button>
          <button onClick={() => deleteMutation.mutate(f.name)}>delete</button>
        </div>
      ))}
      <input type="file" onChange={handleUpload} />
      <button onClick={() => uploadMutation.mutate(newFile as File)}>upload</button>
    </div>
  );
};

export default Documents;
