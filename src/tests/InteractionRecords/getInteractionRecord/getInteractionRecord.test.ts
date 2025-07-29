import InteractionRecordsController from "@controllers/InteractionRecords";
import { deleteMultipleItens, generateMultipleItens } from "@lib";
import { expect, test } from "@playwright/test";
import generateMockedInteractionRecords from "../mockedDataInterationRecord/mockedDataInteractionRecord";
import type { IInteractionRecords } from "@schemas";

test.describe("Get Interaction Record", () => {
	test("Get an Interaction Record", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const data = await generateMockedInteractionRecords();
		const interactionRecord = await interactionRecordsController.createInteractionRecordForContact(data);
		expect(interactionRecord.Id).toBeDefined();

		const fetchedInteractionRecord = await interactionRecordsController.findInteractionRecordById(interactionRecord.Id);
		expect(fetchedInteractionRecord).toStrictEqual([interactionRecord]);

		await interactionRecordsController.deleteInteractionRecordAndRelatedData(interactionRecord);
	});

	test("Get all Interaction Records", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const records = await generateMultipleItens(
			interactionRecordsController.createInteractionRecordForContact.bind(interactionRecordsController),
			() => generateMockedInteractionRecords(),
			3,
		);

		expect(records).toBeDefined();
		const fetchedRecords = await interactionRecordsController.findAllInteractionRecords();
		expect(fetchedRecords).toBeDefined();
		expect(fetchedRecords).toMatchArrayId<IInteractionRecords>(records);

		await deleteMultipleItens(
			interactionRecordsController.deleteInteractionRecordAndRelatedData.bind(interactionRecordsController),
			records,
		);
	});
});
