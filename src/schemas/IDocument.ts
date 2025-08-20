import { z } from "zod";

const DocumentSchema = z.object({
	Title: z.string(),
	Id: z.number(),
	ContactId: z.number(),
	Name: z.string(),
	DealId: z.number(),
	Discount: z.number(),
	TemplateId: z.number(),
	Total: z.number(),
	Product: z.array(z.object({})),
});

type IDocuments = z.infer<typeof DocumentSchema>;

export { DocumentSchema };

export type { IDocuments };
