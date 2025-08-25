import { faker } from "@faker-js/faker";
import type { IQuotes } from "@schemas";

function generateMockedQuote(): IQuotes {
    return {
        Amount: faker.number.int({ min: 100, max: 100000 }),
        Discount: faker.number.int({ min: 0, max: 99 }),
    };
}

export default generateMockedQuote;
