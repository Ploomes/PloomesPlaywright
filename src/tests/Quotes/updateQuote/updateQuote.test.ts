import QuotesController from "@controllers/Quotes";
import { expect, test } from "@playwright/test";
import generateMockedQuote from "../mockedDataQuote/mockedDataQuote";

test.describe("Update Quote", () => {
    test("Update a Quote Correctly", async () => {
        const quotesController = new QuotesController();
        const data = generateMockedQuote();
        const quote = await quotesController.createQuoteWithDeal(data);
        expect(quote.Id).toBeDefined();

        const updateData = generateMockedQuote();
        const updatedQuote = await quotesController.updateQuote(quote, updateData);
        expect(updatedQuote.Amount).toBe(updateData.Amount);

        await quotesController.deleteQuoteAndRelatedData(updatedQuote);
    });
});
