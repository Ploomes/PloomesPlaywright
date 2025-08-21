import z from "zod";

const QuoteSchema = z.object({
    
});

type IQuotes = z.infer<typeof QuoteSchema>;

export { QuoteSchema };
export type { IQuotes };
