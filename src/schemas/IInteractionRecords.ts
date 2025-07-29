import z from "zod";

const InteractionRecordSchema = z.object({
	Id: z.number(),
	Date: z.string().datetime(),
	ContactId: z.number().optional(),
	Content: z.string(),
	DealId: z.number().optional(),
	Tags: z.array(z.string()).optional(),
	TypeId: z.number(),
});

type IInteractionRecords = z.infer<typeof InteractionRecordSchema>;

export { InteractionRecordSchema };

export type { IInteractionRecords };
