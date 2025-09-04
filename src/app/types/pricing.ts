// ipapi.co response structure
export interface IpapiResponse {
  ip: string;
  city: string;
  region: string;
  country_code: string;
  country_name: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  languages: string;
  asn: string;
  org: string;
  error?: boolean;
  reason?: string;
}

export interface LocationData {
  country_code: string;
  country_name: string;
  city: string;
  region: string;
  currency?: string;
  timezone?: string;
}

export interface PricingData {
  currency: string;
  price: string;
  region: string;
  message: string;
  buttonText: string;
}
