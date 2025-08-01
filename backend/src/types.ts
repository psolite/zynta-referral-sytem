// User type definition
export interface User {
  id: number;
  name: string;
  email: string;
  referralCode: string;
  points: number;
}

// Request body for registration
export interface RegisterRequest {
  name: string;
  email: string;
  referralCode: string;
}

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UsersResponse extends ApiResponse<User[]> {}

export interface UserResponse extends ApiResponse<User> {}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  users: User[];
}> {}

// Error types
export interface AppError extends Error {
  status?: number;
}