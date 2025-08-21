import DocumentTemplatesController from "@controllers/DocumentTemplates";
import type { IDocuments } from "@schemas";
import DocumentsService from "@services/Documents";
import type { IUser } from "@types";
import ContactController from "@controllers/Contacts";
import DealsController from "@controllers/Deals";
import generateMockedDocumentTemplates from "../../tests/DocumentTemplates/mockedDataDocumentTemplate/mockedDataDocumentTemplate";
import generateMockedContact from "../../tests/Contacts/mockedDataContact/mockedDataContact";
import generateMockedDeal from "../../tests/DealsPipelines/mockedDataDealsPipeline/mockedDataDealsPipeline";

const documentMetaDataMap = new Map<number, { ContactId?: number; DealId?: number; TemplateId: number }>();

class DocumentsController {
	private user?: IUser;

	constructor(user?: IUser) {
		this.user = user;
	}

	async findAllDocuments(top = 15) {
		const documentsService = new DocumentsService(this.user);
		const response = await documentsService.findAllDocuments(top);
		return response;
	}

	async findDocumentById(Id: number) {
		const documentsService = new DocumentsService(this.user);
		const response = await documentsService.findDocumentById(Id);
		return response;
	}

	async createDocumentForDeal(data: IDocuments) {
		const documentsService = new DocumentsService(this.user);
		const documentTemplatesController = new DocumentTemplatesController(this.user);
		const dealsController = new DealsController(this.user);

		const templateData = generateMockedDocumentTemplates("Deal Document");
		const template = await documentTemplatesController.createDocumentTemplate(templateData);

		const dealData = generateMockedDeal();
		const deal = await dealsController.createDealWithPipeline(dealData);

		const dealId = deal.Id;

		const response = await documentsService.createDocument({
			...data,
			TemplateId: template.Id,
			DealId: dealId, 
		});

		return response;
	}

	async createDocumentForContact(data: IDocuments) {
		const documentsService = new DocumentsService(this.user);
		const documentTemplatesController = new DocumentTemplatesController(this.user);		
		const contactsController = new ContactController(this.user);

		const templateData = generateMockedDocumentTemplates("Client Document");
		const template = await documentTemplatesController.createDocumentTemplate(templateData);

		const contactData = generateMockedContact("company");
		const contact = await contactsController.createContact(contactData);
		const contactId = contact.Id;

		const response = await documentsService.createDocument({
			...data,
			TemplateId: template.Id,
			ContactId: contactId,
		});

		return response;
	}

	async updateDocument(document: IDocuments, data: Partial<IDocuments>) {
		const documentsService = new DocumentsService(this.user);
		const response = await documentsService.updateDocument(document, data);
		return response;
	}

	async deleteDocument(document: IDocuments) {
		const documentsService = new DocumentsService(this.user);
		const response = await documentsService.deleteDocument(document);
		return response;
	}

	async deleteDocumentAndRelatedData(document: IDocuments) {
		const documentsService = new DocumentsService(this.user);
		const documentTemplatesController = new DocumentTemplatesController(this.user);

		const documentId = document.Id;
		let metaData = documentMetaDataMap.get(documentId);

		if (!metaData) {
			const getDocument = await documentsService.findDocumentById(documentId);
			const fetchedDocument = getDocument[0];
			if (fetchedDocument) {
				metaData = {
					ContactId: fetchedDocument.ContactId,
					DealId: fetchedDocument.DealId,
					TemplateId: fetchedDocument.TemplateId,
				};
			}
		}

		const response = await documentsService.deleteDocument(document);

		await documentTemplatesController.deleteDocumentTemplate({ Id: metaData?.TemplateId });

		if (metaData?.ContactId) {
			await new ContactController(this.user).deleteContact({ Id: metaData.ContactId });
		}
		if (metaData?.DealId) {
			await new DealsController(this.user).deleteDealAndPipeline({ Id: metaData.DealId });
		}
		
		return response;
	}
}

export default DocumentsController;
