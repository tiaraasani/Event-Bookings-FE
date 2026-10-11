import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateProfile } from "@/hooks/api/useUpdateProfile";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "@/schemas/update-profile";

type Props = {
  currentName: string;
};

function UpdateNameForm({ currentName }: Props) {
  const { register, handleSubmit, formState } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: currentName },
  });
  const { mutate, isPending } = useUpdateProfile();

  const onSubmit = (values: UpdateProfileSchema) => {
    mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Change Name</h2>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {formState.errors.name && (
          <p className="text-sm text-red-500">
            {formState.errors.name.message}
          </p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}

export default UpdateNameForm;
