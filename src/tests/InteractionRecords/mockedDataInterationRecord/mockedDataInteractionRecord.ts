import { faker } from "@faker-js/faker";
import type { IInteractionRecords } from "@schemas";

const typeMap = {
	Simples: 1,
	Visita: 2,
	Telefone: 3,
	Email: 4,
	Reunião: 5,
	Conferência: 6,
	WhatsApp: 7,
} as const;

type InteractionType = keyof typeof typeMap;

function generateMockedInteractionRecords(type?: InteractionType): IInteractionRecords {
	let chosenType: InteractionType;
	if (type) {
		chosenType = type;
	} else {
		const types = Object.keys(typeMap) as InteractionType[];
		const randomIndex = Math.floor(Math.random() * types.length);
		chosenType = types[randomIndex];
	}
	const typeId = typeMap[chosenType];

	const body: IInteractionRecords = {
		Date: faker.date.recent().toISOString(),
		Content: faker.lorem.sentence(),
		TypeId: typeId,
	};

	return body;
}

export default generateMockedInteractionRecords;
