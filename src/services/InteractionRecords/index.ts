import { QueryOdata } from "@lib";
import type { APIRequestContext } from "@playwright/test";
import type { IInteractionRecords } from "@schemas";
import type { IUser } from "@types";
import Authentication from "../../auth/authentication";

class InteractionRecordsService {
	endpoint = "InteractionRecords";
	request: APIRequestContext;
	auth = new Authentication();

	constructor(user?: IUser) {
		if (user) {
			this.auth.updateUser(user);
		}
	}

	async findAllInteractionRecords(top: number): Promise<IInteractionRecords[]> {
		const context = await this.auth.createContext();
		const odata = new QueryOdata({
			orderBy: { Id: "desc" },
			top,
		});
		const query = odata.toString();
		const response = await context.get(`${this.endpoint}?${query}`);
		const json = await response.json();
		return json.value;
	}

	async createInteractionRecord(record: IInteractionRecords): Promise<IInteractionRecords> {
		const context = await this.auth.createContext();
		const response = await context.post(`${this.endpoint}`, { data: record });
		const json = await response.json();
		return json.value[0];
	}

	async updateInteractionRecord(record: IInteractionRecords, data: Partial<IInteractionRecords>) {
		const context = await this.auth.createContext();
		const response = await context.patch(`${this.endpoint}(${record.Id})`, { data });
		const json = await response.json();
		return json.value[0];
	}

	async findInteractionRecordById(Id: number): Promise<IInteractionRecords[]> {
		const context = await this.auth.createContext();
		const query = `$filter=Id eq ${Id}`;
		const response = await context.get(`${this.endpoint}?${query}`);
		const json = await response.json();
		return json.value;
	}

	async deleteInteractionRecord(record: IInteractionRecords) {
		const context = await this.auth.createContext();
		const response = await context.delete(`${this.endpoint}(${record.Id})`);
		return response;
	}
}

export default InteractionRecordsService;
