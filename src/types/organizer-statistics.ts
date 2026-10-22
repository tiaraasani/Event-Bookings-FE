export type StatRow = {
  label: string;
  tickets: number;
  revenue: number;
};

export type OrganizerStatistics = {
  year: number;
  month: number;
  summary: {
    totalEvents: number;
    totalOrders: number;
    totalTickets: number;
    totalRevenue: number;
  };
  byYear: StatRow[];
  byMonth: StatRow[];
  byDay: StatRow[];
};
