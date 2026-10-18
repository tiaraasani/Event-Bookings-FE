import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdatePicture } from "@/hooks/api/useUpdatePicture";

type Props = {
  currentPicture: string | null;
  name: string;
};

function UpdatePictureForm({ currentPicture, name }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const { mutate, isPending } = useUpdatePicture();

  const preview = file ? URL.createObjectURL(file) : currentPicture;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    mutate(file, {
      onSuccess: () => setFile(null),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#BCE7DF] text-2xl font-bold text-[#147D74]">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="picture">Choose image</Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <Button type="submit" disabled={!file || isPending}>
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}

export default UpdatePictureForm;
