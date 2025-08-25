import QuotesController from "@controllers/Quotes";
import DealsController from "@controllers/Deals";
import { deleteMultipleItens, generateMultipleItens } from "@lib";
import { expect, test } from "@playwright/test";
import type { IQuotes } from "@schemas";
import generateMockedQuote from "../mockedDataQuote/mockedDataQuote";
import generateMockedDeal from "../../Deals/mockedDataDeal/mockedDataDeal";

test.describe("Get Quotes", () => {
    test("Get Quote Correctly", async () => {
        const quotesController = new QuotesController();
        const data = generateMockedQuote();
        const quote = await quotesController.createQuoteWithDeal(data);
        expect(quote.Id).toBeDefined();

        const fetchedQuote = await quotesController.findQuoteById(quote.Id);
        const fetchedDocumentId = fetchedQuote?.[0]?.Id;
        expect(fetchedDocumentId).toBe(quote.Id);

        await quotesController.deleteQuoteAndRelatedData(quote);
    });

    test("Get all Quotes", async () => {
        const quotesController = new QuotesController();
        const dealsController = new DealsController();
        const dealData = generateMockedDeal();
        const deal = await dealsController.createDealWithPipeline(dealData);

        const quotes = await generateMultipleItens<IQuotes>(
            (data) => quotesController.createQuoteAtDeal(data, deal.Id),
            generateMockedQuote,
            3,
        );
        expect(quotes).toBeDefined();

        const fetchedQuotes = await quotesController.findAllQuotes();
        expect(fetchedQuotes).toBeDefined();
        expect(fetchedQuotes).toMatchArrayId<IQuotes>(quotes);

        await deleteMultipleItens<IQuotes>(quotesController.deleteQuoteAndRelatedData.bind(quotesController), quotes);
    });
});
