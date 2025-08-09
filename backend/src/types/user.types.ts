
export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  age?: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  age?: number;
  bio?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  age?: number;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
