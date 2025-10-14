import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      group?: string;
    } & DefaultSession["user"];
  }

  interface User {
    username: string;
    group?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    group?: string;
  }
}
