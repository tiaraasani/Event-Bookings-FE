import { axiosInstance } from "@/lib/axios";
import type { Event } from "@/types/Events";
import { useQuery } from "@tanstack/react-query";

function useGetEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await axiosInstance.get("/events");
      return (response.data.data ?? response.data) as Event[];
    },
  });
}

export default useGetEvents;
