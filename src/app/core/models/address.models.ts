export interface Address {
    id: number;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
}

export interface CreateAddressReq {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
}

export interface UpdateAddressReq {
    id: number;
    street: string;
    city: string;
    country: string;
    postalCode?: string;
}