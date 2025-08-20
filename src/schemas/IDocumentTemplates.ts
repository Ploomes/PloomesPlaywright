import zod from "zod";

const DocumentTemplateSchema = zod.object({
	AllowedTeams: zod.array(zod.number()).optional(),
	AllowedUsers: zod.array(zod.number()).optional(),
	EntityId: zod.number().int(),
	SecondaryEntityId: zod.number().int().optional(),
	FileNameVariables: zod.array(zod.string()).optional(),
	Name: zod.string(),
	Pages: zod.array(zod.object({}).optional()).optional(),
	Id: zod.number(),
	Default: zod.boolean().optional(),
});

typeIDocumentTemplates = zod.infer<typeof DocumentTemplateSchema>;

export { DocumentTemplateSchema };

export type { IDocumentTemplates };
