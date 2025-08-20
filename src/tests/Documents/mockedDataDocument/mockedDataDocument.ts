import { faker } from "@faker-js/faker";
import type { IDocuments } from "@schemas";

function generateMockedDocument(): IDocuments {
	let contactId: number | undefined;
	let dealId: number | undefined;
	let templateId: number;
	return {
		ContactId: contactId || undefined,
		DealId: dealId || undefined,
		Name: faker.lorem.words(),
		Discount: faker.number.float({ fractionDigits: 2, min: 0, max: 100 }),
		TemplateId: templateId,
		Total: faker.number.float({ fractionDigits: 2, min: 100, max: 1000000 }),
	};
}

export default generateMockedDocument;
