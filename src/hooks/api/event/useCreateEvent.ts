import { axiosInstance } from "@/lib/axios";
import type { CreateEventSchema } from "@/schemas/createEvent";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

type CreateEventPayload = CreateEventSchema & {
  imageFile?: File | null;
};

function useCreateEvent() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const { imageFile, ...eventData } = payload;

      const formData = new FormData();

      formData.append("data", JSON.stringify(eventData));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axiosInstance.post("/events", formData);
    },

    onSuccess: () => {
      alert("Create event success");
      navigate("/events");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      alert(error.response?.data.message || "Create event failed!");
    },
  });
}

export default useCreateEvent;
