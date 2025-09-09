export interface User {
  id: string;
  email: string;
  role: string;
}
export interface Item {
  id: string;
  title: string;
  description: string;
}

export enum Roles {
  ADMIN = "admin",
  user = "user",
}
