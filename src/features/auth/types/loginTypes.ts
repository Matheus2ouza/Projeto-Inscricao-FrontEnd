// Tipos principais
export type User = {
  id: string;
  role: string;
};

export type LoginServiceInput = {
  username: string;
  password: string;
};

export type RequestData = {
  username: string;
  password: string;
};

export type LoginServiceOutput = {
  role: string;
};

export type SessionData = {
  user: User;
  expires: string;
};

export type AuthResponse = {
  authToken: string;
  refreshToken: string;
  user: User;
};

export type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};
