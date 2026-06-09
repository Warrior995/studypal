import { login, register, logOut, verifySession } from "./authFunctions";

jest.mock("@/app/lib/supabase", () => ({
	supabase: {
		from: jest.fn(),
	},
}));

jest.mock("bcryptjs", () => ({
	compare: jest.fn(),
	hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn(),
}));

jest.mock("next/headers", () => ({
	cookies: jest.fn(),
}));

import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type CookieStore = {
	set: jest.Mock;
	delete: jest.Mock;
	get: jest.Mock;
};

function makeFromMock(returnValue: any) {
	const eq = jest.fn().mockResolvedValue(returnValue);
	const select = jest.fn().mockReturnValue({ eq });
	(supabase as any).from.mockReturnValue({ select, insert: jest.fn().mockReturnValue({ select: jest.fn().mockResolvedValue(returnValue) }) });
	return { select, eq };
}

describe("auth route", () => {
	let cookieStore: CookieStore;

	beforeEach(() => {
		jest.clearAllMocks();

		cookieStore = {
			set: jest.fn(),
			delete: jest.fn(),
			get: jest.fn(),
		};

		(cookies as jest.Mock).mockReturnValue(cookieStore);
	});

	describe("login", () => {
		test("succeeds with correct credentials and sets cookie", async () => {
			makeFromMock({ data: [{ id: 1, pwd_hash: "hashed" }], error: null });
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			(jwt.sign as jest.Mock).mockReturnValue("signed-token");

			const res = await login("alice", "password");

			expect(res).toEqual({ status: "Success" });
			expect(cookieStore.set).toHaveBeenCalledWith("token", "signed-token", expect.any(Object));
		});

		test("fails with unknown username", async () => {
			makeFromMock({ data: [], error: null });

			const res = await login("noone", "pw");

			expect(res.status).toBe("Failed");
			expect(res.reason).toMatch(/Invalid username or password/i);
			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		test("fails with wrong password", async () => {
			makeFromMock({ data: [{ id: 2, pwd_hash: "hash" }], error: null });
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);

			const res = await login("bob", "badpw");

			expect(res.status).toBe("Failed");
			expect(res.reason).toMatch(/Invalid username or password/i);
			expect(cookieStore.set).not.toHaveBeenCalled();
		});

		test("returns error when supabase returns null data", async () => {
			makeFromMock({ data: null, error: { message: "err" } });

			const res = await login("x", "y");

			expect(res.status).toBe("Failed");
			expect(res.reason).toMatch(/Error while trying to login/i);
		});
	});

	describe("register", () => {
		test("registers a user, hashes password, signs token and sets cookie", async () => {
			const insertSelect = jest.fn().mockResolvedValue({ data: [{ id: 5, username: "eve" }], error: null });
			(supabase as any).from.mockReturnValue({ insert: jest.fn().mockReturnValue({ select: insertSelect }) });

			(bcrypt.hash as jest.Mock).mockResolvedValue("hashval");
			(jwt.sign as jest.Mock).mockReturnValue("signed-reg-token");

			const res = await register("eve", "pw");

			expect(res).toEqual({ status: "Success" });
			expect(cookieStore.set).toHaveBeenCalledWith("token", "signed-reg-token", expect.any(Object));
		});

		test("returns failed when supabase returns null data", async () => {
			const insertSelect = jest.fn().mockResolvedValue({ data: null, error: { message: "err" } });
			(supabase as any).from.mockReturnValue({ insert: jest.fn().mockReturnValue({ select: insertSelect }) });

			const res = await register("f", "g");

			expect(res.status).toBe("Failed");
			expect(res.reason).toMatch(/Failed to register user/i);
		});
	});

	describe("logOut", () => {
		test("deletes the token cookie and returns true", async () => {
			const res = await logOut();

			expect(cookieStore.delete).toHaveBeenCalledWith("token");
			expect(res).toBe(true);
		});
	});

	describe("verifySession", () => {
		test("returns session object when token exists and is valid", async () => {
			cookieStore.get.mockReturnValue({ value: "tkn" });
			(jwt.verify as jest.Mock).mockReturnValue({ userid: 9, username: "sam" });

			const res = await verifySession();

			expect(res).toEqual({ id: 9, username: "sam" });
		});

		test("returns false when no token present", async () => {
			
			cookieStore.get.mockReturnValue(undefined);

			const res = await verifySession();

			expect(res).toBe(false);
		});
	});
});

