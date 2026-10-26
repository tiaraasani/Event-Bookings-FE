import { axiosInstance } from "@/lib/axios";
import type {
  OrganizerTransaction,
  PaymentStatus,
} from "@/types/organizer-transaction";
import type {
  PaginationQueryParams,
  PaginationResponse,
} from "@/types/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type OrganizerTransactionQuery = PaginationQueryParams & {
  status?: PaymentStatus | "";
  eventId?: number;
};

export function useGetOrganizerTransactions(query?: OrganizerTransactionQuery) {
  return useQuery({
    queryKey: ["organizer-transactions", query],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PaginationResponse<OrganizerTransaction>
      >("/organizer/transactions", { params: query });
      return data;
    },
    placeholderData: keepPreviousData,
  });
}
