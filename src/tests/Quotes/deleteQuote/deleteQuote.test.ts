import QuotesController from "@controllers/Quotes";
import { expect, test } from "@playwright/test";
import generateMockedQuote from "../mockedDataQuote/mockedDataQuote";

test.describe("Delete a Quote", () => {
    test("Delete a Deal Quote Correctly", async () => {
        const quoteController = new QuotesController();
        const quoteData = generateMockedQuote();
        const quote = await quoteController.createQuoteWithDeal(quoteData);
        expect(quote.Id).toBeDefined();

        await quoteController.deleteQuoteAndRelatedData(quote);
        const deletedQuote = await quoteController.findQuoteById(quote.Id);
        expect(deletedQuote).toStrictEqual([]);
    });
});
