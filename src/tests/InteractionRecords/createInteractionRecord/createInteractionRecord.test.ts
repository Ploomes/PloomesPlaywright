import InteractionRecordsController from "@controllers/InteractionRecords";
import { expect, test } from "@playwright/test";
import generateMockedInteractionRecords from "../mockedDataInterationRecord/mockedDataInteractionRecord";

test.describe("Create Interaction Record", () => {
	test("Create an Interaction Record for Contact", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const data = await generateMockedInteractionRecords();
		const interactionRecord = await interactionRecordsController.createInteractionRecordForContact(data);
		expect(interactionRecord.Id).toBeDefined();

		await interactionRecordsController.deleteInteractionRecordAndRelatedData(interactionRecord);
	});

	test("Create an Interaction Record for Deal", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const data = await generateMockedInteractionRecords();
		const interactionRecord = await interactionRecordsController.createInteractionRecordForDeal(data);
		expect(interactionRecord.Id).toBeDefined();

		await interactionRecordsController.deleteInteractionRecordAndRelatedData(interactionRecord);
	});
});
