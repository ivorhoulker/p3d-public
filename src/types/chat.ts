import { Record, User } from "pocketbase";

export interface Chat extends Record {
    text: string;
    user: User
  }