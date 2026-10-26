import { axiosInstance } from "@/lib/axios";
import type { EventAttendeesResponse } from "@/types/event-attendee";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type AttendeesQuery = {
  page?: number;
  take?: number;
};

export function useGetEventAttendees(eventId: number, query?: AttendeesQuery) {
  return useQuery({
    queryKey: ["event-attendees", eventId, query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EventAttendeesResponse>(
        `/organizer/events/${eventId}/attendees`,
        { params: query },
      );
      return data;
    },
    enabled: eventId > 0,
    placeholderData: keepPreviousData,
  });
}
