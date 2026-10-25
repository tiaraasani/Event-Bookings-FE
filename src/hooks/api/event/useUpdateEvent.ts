import { axiosInstance } from "@/lib/axios";
import type { UpdateEventSchema } from "@/schemas/updateEvent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type UpdateEventPayload = UpdateEventSchema & {
  imageFile?: File | null;
};

function useUpdateEvent(id: number) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateEventPayload) => {
      const { imageFile, ...eventData } = payload;

      const formData = new FormData();

      formData.append("data", JSON.stringify(eventData));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axiosInstance.patch(`/events/${id}`, formData);
    },

    onSuccess: () => {
      toast.success("Event updated successfully");
      queryClient.invalidateQueries({ queryKey: ["my-organized-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", String(id)] });
      navigate("/profile");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update event");
    },
  });
}

export default useUpdateEvent;
