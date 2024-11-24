import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    accountType: string;
  }

  interface Session {
    user: User & {
      id: string;
      accountType: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType: string;
  }
}