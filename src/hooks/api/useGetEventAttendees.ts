import { axiosInstance } from "@/lib/axios";
import type { EventAttendeesResponse } from "@/types/event-attendee";
import { useQuery } from "@tanstack/react-query";

export function useGetEventAttendees(eventId: number) {
  return useQuery({
    queryKey: ["event-attendees", eventId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EventAttendeesResponse>(
        `/organizer/events/${eventId}/attendees`,
      );
      return data;
    },
    enabled: eventId > 0,
  });
}
