import { axiosInstance } from "@/lib/axios";
import type { OrganizerTransaction } from "@/types/organizer-transaction";
import { useQuery } from "@tanstack/react-query";

export function useGetOrganizerTransactions() {
  return useQuery({
    queryKey: ["organizer-transactions"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OrganizerTransaction[]>(
        "/organizer/transactions",
      );
      return data;
    },
  });
}
