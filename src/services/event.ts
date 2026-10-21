import { axiosInstance } from "@/lib/axios";

export const getMyOrganizedEvents = async () => {
  const response = await axiosInstance.get("/events/my");

  return response.data.data;
};

export const deleteEvent = async (eventId: number) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);

  return response.data.data;
};
