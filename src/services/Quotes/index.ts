import { QueryOdata } from "@lib";
import type { APIRequestContext } from "@playwright/test";
import type { IQuotes } from "@schemas";
import type { IUser } from "@types";
import Authentication from "../../auth/authentication";

class QuotesService {
    endpoint = "Quotes";
    request: APIRequestContext;
    auth = new Authentication();

    constructor(user?: IUser) {
        if (user) {
            this.auth.updateUser(user);
        }
    }

    async findAllQuotes(top: number): Promise<IQuotes[]> {
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

    async createQuote(quote: IQuotes): Promise<IQuotes> {
        const context = await this.auth.createContext();
        const response = await context.post(`${this.endpoint}`, { data: quote });
        const json = await response.json();
        return json.value[0];
    }

    async updateQuote(quote: IQuotes, data: Partial<IQuotes>) {
        const context = await this.auth.createContext();
        const response = await context.patch(`${this.endpoint}(${quote.Id})`, { data: data });
        const json = await response.json();
        return json.value[0];
    }

    async deleteQuote(quote: IQuotes) {
        const context = await this.auth.createContext();
        const response = await context.delete(`${this.endpoint}(${quote.Id})`);
        return response;
    }

    async findQuoteById(Id: number): Promise<IQuotes[]> {
        const context = await this.auth.createContext();
        const query = `$filter=Id eq ${Id}`;
        const response = await context.get(`${this.endpoint}?${query}`);
        const json = await response.json();
        return json.value;
    }
}

export default QuotesService;
