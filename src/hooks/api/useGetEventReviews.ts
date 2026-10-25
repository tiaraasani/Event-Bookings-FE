import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface EventReview {
  id: number;
  rating: number;
  title: string;
  comment: string;
  type: "EVENT" | "ORGANIZER";
  createdAt: string;
  order: {
    user: {
      id: number;
      name: string;
    };
  };
}

function useGetEventReviews(eventId: string | undefined) {
  return useQuery({
    queryKey: ["event-reviews", eventId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/reviews/event/${eventId}`);

      return response.data.data as EventReview[];
    },
    enabled: Boolean(eventId),
  });
}

export default useGetEventReviews;
