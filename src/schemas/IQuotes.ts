import z from "zod";

const QuoteSchema = z.object({
    Id: z.number(),
    Amount: z.number().optional(),
    DealId: z.number(),
    Discount: z.number().optional(),
    TemplateId: z.number(),
    ContactId: z.number().optional(),
});

type IQuotes = z.infer<typeof QuoteSchema>;

export { QuoteSchema };
export type { IQuotes };
