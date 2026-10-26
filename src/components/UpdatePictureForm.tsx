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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="size-20 rounded-xl border border-brand-navy/10 object-cover shadow-sm"
          />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-xl border border-brand-navy/10 bg-brand-neutral text-2xl font-bold text-brand-navy">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1 space-y-2">
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
