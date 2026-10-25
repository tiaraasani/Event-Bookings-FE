import { useQuery } from "@tanstack/react-query";
import { getMyOrganizedEvents } from "../../services/event";

export const useGetMyOrganizedEvents = () => {
  return useQuery({
    queryKey: ["my-organized-events"],
    queryFn: getMyOrganizedEvents,
  });
};
