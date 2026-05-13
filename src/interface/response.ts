import { ROLE_NAME } from "@/common";

export type BaseEntityResponse = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponse = BaseEntityResponse & {
  email: string;
  phone: string;
  fullName: string;
  role: ROLE_NAME;
  status: "ACTIVE";
  pathAvatar: null;
  dob: "18/11/1997";
  gender: "MALE";
};
