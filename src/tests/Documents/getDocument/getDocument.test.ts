import DocumentsController from "@controllers/Documents";
import { deleteMultipleItens, generateMultipleItens } from "@lib";
import { expect, test } from "@playwright/test";
import type { IDocuments } from "@schemas";
import generateMockedDocument from "../mockedDataDocument/mockedDataDocument";

test.describe("Get Documents", () => {
    test("Get Deal Document Correctly", async () => {
        const documentsController = new DocumentsController();

        const document = await documentsController.createDocumentForDeal(generateMockedDocument());
        expect(document.Id).toBeDefined();  

        const fetchedDocument = await documentsController.findDocumentById(document.Id);
        expect(fetchedDocument).toStrictEqual([document]);

        await documentsController.deleteDocumetAndRelatedData(document);
    });

    test("Get Client Document Correctly", async () => {
        const documentsController = new DocumentsController();

        const document = await documentsController.createDocumentForContact(generateMockedDocument());
        expect(document.Id).toBeDefined();  

        const fetchedDocument = await documentsController.findDocumentById(document.Id);
        expect(fetchedDocument).toStrictEqual([document]);

        await documentsController.deleteDocumetAndRelatedData(document);
    });

    test("Get all Documents", async () => {
        const documentsController = new DocumentsController();

        const contactDocuments = await generateMultipleItens<IDocuments>(
            () => documentsController.createDocumentForContact(generateMockedDocument()),
            generateMockedDocument,
            3,
        );
        expect(contactDocuments).toBeDefined();
        
        const dealDocuments = await generateMultipleItens<IDocuments>(
            () => documentsController.createDocumentForDeal(generateMockedDocument()),
            generateMockedDocument,
            3,
        );
        expect(dealDocuments).toBeDefined();    
        
        const fetchedDocuments = await documentsController.findAllDocuments();
        expect(fetchedDocuments).toBeDefined();
        expect(fetchedDocuments).toMatchArrayId<IDocuments>(dealDocuments);
        expect(fetchedDocuments).toMatchArrayId<IDocuments>(contactDocuments);

        await deleteMultipleItens<IDocuments>(documentsController.deleteDocumetAndRelatedData.bind(documentsController), dealDocuments);

        await deleteMultipleItens<IDocuments>(documentsController.deleteDocumetAndRelatedData.bind(documentsController), contactDocuments);
    }); 
});