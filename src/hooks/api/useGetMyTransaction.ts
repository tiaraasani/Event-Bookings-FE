import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "@/services/transaction";

export const useGetMyTransactions = () => {
  return useQuery({
    queryKey: ["my-transactions"],
    queryFn: getMyTransactions,
  });
};
