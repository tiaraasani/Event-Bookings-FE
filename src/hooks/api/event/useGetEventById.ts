import { axiosInstance } from "@/lib/axios";
import type { Event } from "@/types/Events";
import { useQuery } from "@tanstack/react-query";

function useGetEventsById(id: string | undefined) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data.data as Event;
    },
    enabled: Boolean(id),
  });
}

export default useGetEventsById;
