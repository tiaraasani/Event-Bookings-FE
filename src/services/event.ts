import { axiosInstance } from "@/lib/axios";
import type { Event } from "@/types/Events";

export const getMyOrganizedEvents = async (): Promise<Event[]> => {
  const response = await axiosInstance.get("/events/my");

  return response.data.data;
};

export const deleteEvent = async (eventId: number) => {
  const response = await axiosInstance.delete(`/events/${eventId}`);

  return response.data.data;
};
