import { QueryOdata } from "@lib";
import type { APIRequestContext } from "@playwright/test";
import type { IUser } from "@types";
import type { IDocuments } from "@schemas";
import Authentication from "../../auth/authentication";

class DocumentService {
	endpoint = "Documents";
	request: APIRequestContext;
	auth = new Authentication();

	constructor(user?: IUser) {
		if (user) {
			this.auth.updateUser(user);
		}
	}

	async findAllDocuments(top: number): Promise<IDocuments[]> {
		const context = await this.auth.createContext();
		const odata = new QueryOdata({
			orderBy: { Id: "desc" },
			top: top,
		});
		const query = odata.toString();
		const response = await context.get(`${this.endpoint}?${query}`);
		const json = await response.json();
		return json.value;
	}

	async createDocument(document: IDocuments): Promise<IDocuments> {
		const context = await this.auth.createContext();
		const response = await context.post(`${this.endpoint}`, { data: document });
		const json = await response.json();
		return json.value[0];
	}

	async updateDocument(document: IDocuments, data: Partial<IDocuments>) {
		const context = await this.auth.createContext();
		const response = await context.patch(`${this.endpoint}(${document.Id})`, { data: data });
		const json = await response.json();
		return json.value[0];
	}

	async deleteDocument(document: IDocuments) {
		const context = await this.auth.createContext();
		const response = await context.delete(`${this.endpoint}(${document.Id})`);
		return response;
	}

	async findDocumentById(Id: number): Promise<IDocuments[]> {
		const context = await this.auth.createContext();
		const query = `$filter=Id eq ${Id}`;
		const response = await context.get(`${this.endpoint}?${query}`);
		const json = await response.json();
		return json.value;
	}
}

export default DocumentService;
