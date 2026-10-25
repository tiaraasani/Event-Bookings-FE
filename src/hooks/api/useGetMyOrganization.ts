import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

interface Organization {
  id: number;
  name: string;
}

export default function useGetMyOrganization() {
  return useQuery({
    queryKey: ["my-organization"],
    queryFn: async () => {
      const response = await axiosInstance.get<Organization>(
        "/organizer/organization",
      );
      return response.data;
    },
  });
}
