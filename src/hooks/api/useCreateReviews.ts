import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

interface CreateReviewData {
  eventId: number;
  type: "EVENT" | "ORGANIZER";
  rating: number;
  title: string;
  comment: string;
}

function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewData) => {
      const response = await axiosInstance.post("/reviews", data);
      return response.data;
    },
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["event-reviews", String(variables.eventId)],
      });

      queryClient.invalidateQueries({
        queryKey: ["organization-reviews"],
      });
    },
  });
}

export default useCreateReview;
