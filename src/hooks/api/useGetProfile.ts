import { axiosInstance } from "@/lib/axios";
import type { Profile } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";

export function useGetProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Profile>("/profile");
      return data;
    },
  });
}
