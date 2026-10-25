import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export interface OrganizerReview {
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
    ticket: {
      event: {
        id: number;
        name: string;
      };
    };
  };
}

function useGetOrganizationReviews(organizationId: string | undefined) {
  return useQuery({
    queryKey: ["organization-reviews", organizationId],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/reviews/organization/${organizationId}`,
      );

      return response.data.data as OrganizerReview[];
    },
    enabled: Boolean(organizationId),
  });
}

export default useGetOrganizationReviews;
