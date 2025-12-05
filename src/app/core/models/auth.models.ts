// Matches GetUserVM from Backend
export interface User {
    id: string;
    email: string;
    displayName: string;
    profileImageUrl?: string;
    phoneNumber?: string;
    createdOn: Date;
    roles?: string[]; // If you added roles to the VM
}

// Matches AuthResponseVM from Backend
export interface AuthResponse {
    user: User;
    token: string;
    tokenExpiration: string;
}

// Input for Login
export interface LoginReq {
    email: string;
    password: string;
}

// Input for Register
// Note: We use FormData for file uploads, so we might not need a strict interface 
// for the API call itself, but good to have for the Form.
export interface RegisterReq {
    email: string;
    password: string;
    displayName: string;
    phoneNumber?: string;
    profileImage?: File; // Handled as File for upload
}

// Input for Update Profile
export interface UpdateProfileReq {
    displayName?: string;
    phoneNumber?: string;
    profileImage?: File; // Handled as File for upload
}

export interface ChangePasswordReq {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}