import ContactController from "@controllers/Contacts";
import DealsController from "@controllers/Deals";
import type { IInteractionRecords } from "@schemas";
import InteractionRecordsService from "@services/InteractionRecords";
import type { IUser } from "@types";
import generateMockedContact from "../../tests/Contacts/mockedDataContact/mockedDataContact";
import generateMockedDeal from "../../tests/Deals/mockedDataDeal/mockedDataDeal";

class InteractionRecordsController {
	private user?: IUser;

	constructor(user?: IUser) {
		this.user = user;
	}

	async findAllInteractionRecords(top = 15) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const response = await interactionRecordsService.findAllInteractionRecords(top);
		return response;
	}

	async findInteractionRecordById(Id: number) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const response = await interactionRecordsService.findInteractionRecordById(Id);
		return response;
	}

	async createInteractionRecordForContact(data: IInteractionRecords) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const contactController = new ContactController();
		const contactData = generateMockedContact("person");
		const contact = await contactController.createContact(contactData);

		const response = await interactionRecordsService.createInteractionRecord({
			...data,
			ContactId: contact.Id,
		});
		return response;
	}

	async createInteractionRecordForDeal(data: IInteractionRecords) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const dealsController = new DealsController(this.user);
		const dealData = generateMockedDeal();
		const deal = await dealsController.createDealWithPipeline(dealData);

		const response = await interactionRecordsService.createInteractionRecord({
			...data,
			DealId: deal.Id,
		});
		return response;
	}

	async updateInteractionRecord(record: IInteractionRecords, data: Partial<IInteractionRecords>) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const response = await interactionRecordsService.updateInteractionRecord(record, data);
		return response;
	}

	async deleteInteractionRecord(record: IInteractionRecords) {
		const interactionRecordsService = new InteractionRecordsService(this.user);
		const response = await interactionRecordsService.deleteInteractionRecord(record);
		return response;
	}

	async deleteInteractionRecordAndRelatedData(record: IInteractionRecords) {
		if (record.ContactId) {
			const contactController = new ContactController();
			await contactController.deleteContact({ Id: record.ContactId });
		}
		if (record.DealId) {
			const dealController = new DealsController(this.user);
			await dealController.deleteDealAndPipeline({ Id: record.DealId });
		}

		const interactionRecordsService = new InteractionRecordsService(this.user);
		const response = await interactionRecordsService.deleteInteractionRecord(record);
		return response;
	}
}

export default InteractionRecordsController;
