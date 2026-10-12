export type Coupon = {
  id: number;
  code: string;
  discountValue: number;
  isUsed: boolean;
  expiresAt: string;
};

export type Organization = {
  id: number;
  name: string;
  logo: string | null;
  description: string | null;
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ORGANIZER";
  picture: string | null;
  referralCode: string;
  createdAt: string;
  organization: Organization | null;
  pointBalance: number;
  coupons: Coupon[];
};
