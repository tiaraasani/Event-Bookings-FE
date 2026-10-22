import { axiosInstance } from "@/lib/axios";
import type { OrganizerStatistics } from "@/types/organizer-statistics";
import { useQuery } from "@tanstack/react-query";

export function useGetOrganizerStatistics(year: number, month: number) {
  return useQuery({
    queryKey: ["organizer-statistics", year, month],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OrganizerStatistics>(
        "/organizer/statistics",
        { params: { year, month } },
      );
      return data;
    },
  });
}
