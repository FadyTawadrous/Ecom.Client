export interface Address {
    id: number;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

export interface CreateAddressReq {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}

export interface UpdateAddressReq {
    id: number;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}