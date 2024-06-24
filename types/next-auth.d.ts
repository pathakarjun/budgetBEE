import NextAuth from "next-auth";

declare module "next-auth" {
	interface User {
		username: string;
	}
	interface Session {
		user: User & {
			username: String;
		};
		token: {
			username: String;
		};
	}
}
