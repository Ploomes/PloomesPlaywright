import QuotesController from "@controllers/Quotes";
import { expect, test } from "@playwright/test";
import generateMockedQuote from "../mockedDataQuote/mockedDataQuote";

test.describe("Create a Quote", () => {
    test("Create a Quote Correctly", async () => {
        const quotesController = new QuotesController();
        const quoteData = generateMockedQuote();

        const quote = await quotesController.createQuoteWithDeal(quoteData);

        expect(quote.Id).toBeDefined();
        expect(quote.Amount).toBe(quoteData.Amount);

        await quotesController.deleteQuoteAndRelatedData(quote);
    });
});