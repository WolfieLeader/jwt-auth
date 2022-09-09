export interface User {
  name: string;
  netWorth?: string;
  hobbies?: string[];
  email: string;
  password: string;
}

export interface UserSQL {
  id: number;
  name: string;
  netWorth?: string | null;
  hobbies?: string[];
  email: string;
  password: string;
  realPassword: string;
  createdAt: Date;
}
