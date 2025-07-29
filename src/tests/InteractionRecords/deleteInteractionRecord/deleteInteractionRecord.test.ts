import InteractionRecordsController from "@controllers/InteractionRecords";
import { expect, test } from "@playwright/test";
import generateMockedInteractionRecords from "../mockedDataInterationRecord/mockedDataInteractionRecord";

test.describe("Delete Interaction Record", () => {
	test("Delete an Interaction Record Correctly", async () => {
		const interactionRecordsController = new InteractionRecordsController();
		const data = await generateMockedInteractionRecords();
		const interactionRecord = await interactionRecordsController.createInteractionRecordForDeal(data);
		expect(interactionRecord.Id).toBeDefined();

		await interactionRecordsController.deleteInteractionRecordAndRelatedData(interactionRecord);
		const deletedInteractionRecord = await interactionRecordsController.findInteractionRecordById(interactionRecord.Id);
		expect(deletedInteractionRecord).toStrictEqual([]);
	});
});
