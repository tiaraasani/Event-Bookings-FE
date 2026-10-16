import { useQuery } from "@tanstack/react-query";
import { getMyPointBalance } from "@/services/transaction";

export const useGetMyPointBalance = () => {
  return useQuery({
    queryKey: ["my-point-balance"],
    queryFn: getMyPointBalance,
  });
};
