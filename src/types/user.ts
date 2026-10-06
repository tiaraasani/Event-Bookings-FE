export type Role = "CUSTOMER" | "ORGANIZER";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  picture: string | null;
  referralCode: string;
  createdAt: string;
};
