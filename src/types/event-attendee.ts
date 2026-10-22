export type EventAttendee = {
  orderId: number;
  name: string;
  email: string;
  ticketName: string;
  quantity: number;
  totalPaid: number;
  paidAt: string | null;
};

export type EventAttendeesResponse = {
  event: {
    id: number;
    name: string;
    startDate: string;
  };
  summary: {
    totalAttendees: number;
    totalTickets: number;
    totalRevenue: number;
  };
  attendees: EventAttendee[];
};
