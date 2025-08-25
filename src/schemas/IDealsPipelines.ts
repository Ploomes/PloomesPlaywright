import z from "zod";
import { StageSchema } from "./IStage";

const DealsPipelinesSchema = z.object({
	Id: z.number(),
	Archived: z.boolean(),
	Name: z.string(),
	Color: z.string(),
	ForbiddenStageReturn: z.boolean().optional(),
	GenderId: z.number(),
	IconId: z.number(),
	LoseButtonId: z.number(),
	LoseVerbId: z.number(),
	MayCreateDocuments: z.boolean(),
	MayCreateOrders: z.boolean(),
	MaycreateQuoteWithDeals: z.boolean(),
	MayLoseDeals: z.boolean(),
	MayWinDeals: z.boolean(),
	MustPassAllStages: z.boolean(),
	WinButtonId: z.number(),
	WinDealOnLastStage: z.boolean(),
	WinVerbId: z.number(),
	Stages: z.array(StageSchema).optional(),
	SingularUnitName: z.string().optional(),
	PluralUnitName: z.string().optional(),
	EnableFunnelViewMode: z.boolean().optional(),
	EnableTableViewMode: z.boolean().optional(),
});

type IDealssPipelines = z.infer<typeof DealsPipelinesSchema>;

export { DealsPipelinesSchema };

export type { IDealssPipelines };
