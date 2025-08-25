import DocumentTemplatesController from "@controllers/DocumentTemplates";
import type { IQuotes } from "@schemas";
import QuotesService from "@services/Quotes";
import type { IUser } from "@types";
import generateMockedDocumentTemplates from "../../tests/DocumentTemplates/mockedDataDocumentTemplate/mockedDataDocumentTemplate";
import DealsController from "@controllers/Deals";
import ContactController from "@controllers/Contacts";
import generateMockedDeal from "../../tests/DealsPipelines/mockedDataDealsPipeline/mockedDataDealsPipeline";

const quoteMetaDataMap = new Map<number, { ContactId?: number; DealId?: number; TemplateId: number }>();

class QuotesController {
    private user?: IUser;

    constructor(user?: IUser) {
        this.user = user;
    }

    async findAllQuotes(top = 15) {
        const quotesService = new QuotesService(this.user);
        const response = await quotesService.findAllQuotes(top);
        return response;
    }

    async findQuoteById(Id: number) {
        const quotesService = new QuotesService(this.user);
        const response = await quotesService.findQuoteById(Id);
        return response;
    }

    async createQuoteWithDeal(data: IQuotes) {
        const quotesService = new QuotesService(this.user);
        const documentTemplatesController = new DocumentTemplatesController(this.user);
        const dealsController = new DealsController(this.user);

        const templateData = generateMockedDocumentTemplates("Quote");
        const template = await documentTemplatesController.createDocumentTemplate(templateData);

        const dealData = generateMockedDeal();
        const deal = await dealsController.createDealWithPipeline(dealData);

        const dealId = deal.Id;

        const response = await quotesService.createQuote({
            ...data,
            TemplateId: template.Id,
            DealId: dealId, 
        });

        return response;
    }

    async createQuoteAtDeal(data: IQuotes, dealId: number) {
        const quotesService = new QuotesService(this.user);
        const documentTemplatesController = new DocumentTemplatesController(this.user);

        const templateData = generateMockedDocumentTemplates("Quote");
        const template = await documentTemplatesController.createDocumentTemplate(templateData);

        const response = await quotesService.createQuote({
            ...data,
            TemplateId: template.Id,
            DealId: dealId, 
        });

        return response;
    }

    async updateQuote(quote: IQuotes, data: Partial<IQuotes>) {
        const quotesService = new QuotesService(this.user);
        const response = await quotesService.updateQuote(quote, data);
        return response;
    }

    async deleteQuote(quote: IQuotes) {
        const quotesService = new QuotesService(this.user);
        const response = await quotesService.deleteQuote(quote);
        return response;
    }

    async deleteQuoteAndRelatedData(quote: IQuotes) {
        const quotesService = new QuotesService(this.user);
        const documentTemplatesController = new DocumentTemplatesController(this.user);

        const quoteId = quote.Id;
        let metaData = quoteMetaDataMap.get(quoteId);

        if(!metaData) {
            metaData = {
                TemplateId: quote.TemplateId,
                ContactId: quote.ContactId,
                DealId: quote.DealId,
            };
            quoteMetaDataMap.set(quoteId, metaData);
        }

        const response = await quotesService.deleteQuote(quote);

        await documentTemplatesController.deleteDocumentTemplate({ Id: metaData?.TemplateId });

        if (metaData?.DealId) {
            const dealsController = new DealsController(this.user);
            await dealsController.deleteDealAndPipeline({ Id: metaData.DealId });
        }
        if (metaData?.ContactId) {
            const contactsController = new ContactController(this.user);
            await contactsController.deleteContact({ Id: metaData.ContactId });
        }
        return response;
    }

};

export default QuotesController;
