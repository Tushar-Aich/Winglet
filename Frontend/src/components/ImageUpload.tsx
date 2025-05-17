import { cn } from "@/lib/utils";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Image, User } from "lucide-react";
import { Button } from "./ui/button";

interface ImageUploads {
  value?: File;
  onChange: (file?: File) => void;
  error?: String;
  name: String
}

const ImageUpload = ({ value, onChange, error, name }: ImageUploads) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        const file = acceptedFiles[0];
        onChange(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 5 * 1024 * 1024,
    maxFiles: 1,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center px-6 border-2 border-dashed rounded-lg transition-all cursor-pointer",
          isDragActive
            ? "border-[#E5DEFF] dark:border-[#6E59A5] bg-[#E5DEFF]/20"
            : "border-gray-300 hover:border-[#E5DEFF] hover:dark:border-[#6E59A5]"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4 py-4 px-4">
          <Avatar
            className={cn(
              "h-24 w-24 border-2",
              preview ? "border-[#E5DEFF]" : "border-gray-300"
            )}
          >
            {preview ? (
              <AvatarImage src={preview} className="object-cover"/>
            ) : (
              <AvatarFallback className="bg-muted">
                {name === "Avatar" ? (<User className="h-12 w-12 text-muted-foreground" />): undefined}
                {name === "Cover Image" ? (<Image className="h-12 w-12 text-muted-foreground" />) : undefined}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-gray-700">
              {preview ? `change ${name}` : `Upload ${name}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & Drop or Click to Browse
            </p>
            <p className="text-xs text-muted-foreground">
              Max 5MB, JPG, PNG or JPEG
            </p>
          </div>
        </div>
      </div>
      {preview && (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm text-destructive hover:text-destructive"
          onClick={removeImage}
        >
          Remove Image
        </Button>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

export default ImageUpload;
