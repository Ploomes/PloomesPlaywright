import DocumentsController from "@controllers/Documents";
import { expect, test } from "@playwright/test";
import generateMockedDocument from "../mockedDataDocument/mockedDataDocument";

test.describe("Delete a Document", () => {
	test("Delete a Deal Document Correctly", async () => {
		const documentController = new DocumentsController();
		const documentData = generateMockedDocument();

		const document = await documentController.createDocumentForDeal(documentData);

		expect(document.Id).toBeDefined();
		expect(document.Name).toBe(documentData.Name);

		await documentController.deleteDocumetAndRelatedData(document);
        const deletedDocument = await documentController.findDocumentById(document.Id);
        expect(deletedDocument).toStrictEqual([]);
	});

	test("Delete a Client Document Correctly", async () => {
		const documentController = new DocumentsController();
		const documentData = generateMockedDocument();

		const document = await documentController.createDocumentForContact(documentData);

		expect(document.Id).toBeDefined();
		expect(document.Name).toBe(documentData.Name);

		await documentController.deleteDocumetAndRelatedData(document);
        const deletedDocument = await documentController.findDocumentById(document.Id);
        expect(deletedDocument).toStrictEqual([]);
	});
});
