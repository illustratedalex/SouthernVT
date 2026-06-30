export interface PartnerDeal {
  id: string;
  slug: string;
  name: string;
  description?: string;
  featuredImage?: string;
  gallery?: string[];
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;

  businessId?: string;
  offerType?: string;
  discountText?: string;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
}
