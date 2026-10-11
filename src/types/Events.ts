export interface Event {
  id: number;
  categoryId: number;
  organizationId: number;
  name: string;
  description: string | null;
  city: string;
  type: "VENUE" | "ONLINE";
  slug: string;
  image: string | null;
  startDate: string;
  endDate: string;
  deletedAt?: string | null;
  category: {
    id: number;
    name: string;
    description?: string | null;
  };
  organization: {
    id: number;
    name: string;
    logo: string | null;
  };
  tickets: {
    id: number;
    name: string;
    price: number;
    quantity: number;
    availableQuantity: number;
  }[];
}
