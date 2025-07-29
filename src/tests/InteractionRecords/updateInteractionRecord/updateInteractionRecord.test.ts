import InteractionRecordsController from "@controllers/InteractionRecords";
import { expect, test } from "@playwright/test";
import generateMockedInteractionRecords from "../mockedDataInterationRecord/mockedDataInteractionRecord";

test.describe("Update Interaction Record", () => {
	test("Update an Interaction Record", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const data = await generateMockedInteractionRecords("Simples");
		const interactionRecord = await interactionRecordsController.createInteractionRecordForContact(data);
		expect(interactionRecord.Id).toBeDefined();

		const updateData = await generateMockedInteractionRecords("Simples");
		const updatedInteractionRecord = await interactionRecordsController.updateInteractionRecord(
			interactionRecord,
			updateData,
		);
		expect(updatedInteractionRecord.Content).toBe(updateData.Content);

		await interactionRecordsController.deleteInteractionRecordAndRelatedData(updatedInteractionRecord);
	});
});
