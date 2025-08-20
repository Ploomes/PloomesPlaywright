import ContactController from "@controllers/Contacts";
import DealsPipelinesController from "@controllers/DealsPipelines";
import type { IDeals } from "@schemas";
import DealsService from "@services/Deals";
import type { IUser } from "@types";
import generateMockedContact from "../../tests/Contacts/mockedDataContact/mockedDataContact";
import generateMockedDealsPipeline from "../../tests/DealsPipelines/mockedDataDealsPipeline/mockedDataDealsPipeline";

const dealMetadataMap = new Map<number, { PipelineId: number; ContactId: number }>();

class DealsController {
	private user?: IUser;

	constructor(user?: IUser) {
		this.user = user;
	}

	async findAllDeals(top = 15) {
		const dealsService = new DealsService(this.user);
		const response = await dealsService.findAllDeals(top);
		return response;
	}

	async findDealById(Id: number) {
		const dealsService = new DealsService(this.user);
		const response = await dealsService.findDealById(Id);
		return response;
	}

	async createDealWithPipeline(data: IDeals) {
		const dealsService = new DealsService(this.user);
		const dealsPipelinesController = new DealsPipelinesController(this.user);
		const contactController = new ContactController(this.user);

		const contactData = generateMockedContact("company");
		const contact = await contactController.createContact(contactData);
		const contactId = contact.Id;

		const pipelineData = generateMockedDealsPipeline();
		const pipeline = await dealsPipelinesController.createDealsPipeline(pipelineData);

		const stages = await dealsPipelinesController.findStagesFromPipeline(pipeline.Id);
		const stageId = stages[0].Id;

		const dataWithStage = {
			...data,
			StageId: stageId,
			ContactId: contactId,
		};

		const response = await dealsService.createDeal(dataWithStage);

		dealMetadataMap.set(response.Id, {
			PipelineId: pipeline.Id,
			ContactId: contactId,
		});

		return response;
	}

	async createDealAtStage(stageId: number, data: IDeals) {
		const dealsService = new DealsService(this.user);
		const contactsController = new ContactController(this.user);

		const contactData = generateMockedContact("company");
		const contact = await contactsController.createContact(contactData);
		const contactId = contact.Id;

		const dataWithStage = {
			...data,
			StageId: stageId,
			ContactId: contactId,
		};

		const response = await dealsService.createDeal(dataWithStage);

		dealMetadataMap.set(response.Id, {
			PipelineId: 0,
			ContactId: contactId,
		});

		return response;
	}

	async createDealAtPipeline(pipelineId: number, data: IDeals) {
		const dealsService = new DealsService(this.user);
		const dealsPipelinesController = new DealsPipelinesController(this.user);
		const contactsController = new ContactController(this.user);

		const contactData = generateMockedContact("company");
		const contact = await contactsController.createContact(contactData);
		const contactId = contact.Id;

		const stages = await dealsPipelinesController.findStagesFromPipeline(pipelineId);

		const randomStageId = stages[Math.floor(Math.random() * stages.length)].Id;

		const dataWithStage = {
			...data,
			StageId: randomStageId,
			ContactId: contactId,
		};

		const response = await dealsService.createDeal(dataWithStage);

		dealMetadataMap.set(response.Id, {
			PipelineId: pipelineId,
			ContactId: contactId,
		});

		return response;
	}

	async updateDeal(deal: IDeals, data: Partial<IDeals>) {
		const dealsService = new DealsService(this.user);
		const response = await dealsService.updateDeal(deal, data);
		return response;
	}

	async deleteDealAndPipeline(deal: IDeals) {
		const dealsService = new DealsService(this.user);

		const dealId = deal.Id;
		let metadata = dealMetadataMap.get(dealId);

		if (!metadata) {
			const getDeal = await dealsService.findDealById(dealId);
			const fetchedDeal = getDeal[0];
			if (fetchedDeal) {
				metadata = {
					PipelineId: fetchedDeal.PipelineId ?? 0,
					ContactId: fetchedDeal.ContactId ?? 0,
				};
			}
		}

		const response = await dealsService.deleteDeal(deal);

		if (metadata?.PipelineId) {
			const dealsPipelinesController = new DealsPipelinesController(this.user);
			await dealsPipelinesController.deleteDealsPipeline({ Id: metadata.PipelineId });
		}

		if (metadata?.ContactId) {
			const contactController = new ContactController(this.user);
			await contactController.deleteContact({ Id: metadata.ContactId });
		}

		dealMetadataMap.delete(dealId);

		return response;
	}

	async deleteDeal(deal: IDeals) {
		const dealsService = new DealsService(this.user);

		const getDeal = await dealsService.findDealById(deal.Id);
		const fetchedDeal = getDeal[0];
		const { ContactId } = fetchedDeal;

		const response = await dealsService.deleteDeal(deal);

		if (ContactId) {
			const contactController = new ContactController(this.user);
			await contactController.deleteContact({ Id: deal.ContactId });
		}

		return response;
	}
}

export default DealsController;
