import { axiosInstance } from "@/lib/axios";
import type { CreateEventSchema } from "@/schemas/createEvent";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function useCreateEvent() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateEventSchema) => {
      await axiosInstance.post("/events", {
        ...payload,
        startDate: new Date(payload.startDate).toISOString(),
        endDate: new Date(payload.endDate).toISOString(),
      });
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
