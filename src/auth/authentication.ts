import { getJsonFile, updateJsonFile } from "@lib";
import { request } from "@playwright/test";
import type { ILogin, IUser } from "@types";
import { config } from "dotenv";
import users from "../constants/users";

config();
const userKeyPath = "userKeys.json";
const partnersKeyPath = "partnersKeys.json";
let userKeyList = getJsonFile(userKeyPath);
let partnersKeyList = getJsonFile(partnersKeyPath);

class Authentication {
	private baseUrl = process.env.BASE_URL;
	private listKeyPath = userKeyPath;
	private isPartners = false;
	private user: IUser = {
		email: users.default.email,
		password: users.default.password,
	};

	constructor(isPartners?: boolean) {
		if (isPartners) {
			this.listKeyPath = partnersKeyPath;
			this.baseUrl = process.env.PARTNERS_URL;
			this.isPartners = true;
		}
	}

	updateUser(user: IUser) {
		if (user) this.user = user;
	}

	async login({ email, password }: ILogin) {
		let listKeys = this.isPartners ? partnersKeyList : userKeyList;
		if (listKeys[email]) {
			const testUrl = `${this.baseUrl}/Self`;
			const response = await fetch(testUrl, {
				headers: { "user-Key": listKeys[email] },
			});
			if (response.status === 200) {
				return listKeys[email];
			}
			delete listKeys[email];
			await updateJsonFile(this.listKeyPath, listKeys);
		}

		const url = `${this.baseUrl}/Self/Login?\$select=UserKey`;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ Email: email, Password: password }),
		});

		if (response.status !== 200) {
			console.info(await response.text());
			throw new Error(`Unexpected status code: ${response.status}`);
		}
		const data = await response.json();
		const userKey = data.value[0].UserKey;

		listKeys = {
			...listKeys,
			[email]: userKey,
		};

		if (this.isPartners) {
			partnersKeyList = listKeys;
		} else {
			userKeyList = listKeys;
		}

		await updateJsonFile(this.listKeyPath, listKeys);

		return userKey;
	}

	async createContext(options?: Parameters<typeof request.newContext>[0]) {
		const userKey = await this.login({
			email: this.user.email,
			password: this.user.password,
		});

		const baseOptions: Parameters<typeof request.newContext>[0] = {
			baseURL: process.env.BASE_URL,
			extraHTTPHeaders: {
				"user-Key": userKey,
			},
		};

		Object.assign(baseOptions, options);
		return await request.newContext(baseOptions);
	}
}

export default Authentication;
