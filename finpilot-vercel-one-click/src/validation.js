import { z } from "zod";

export const loanSchema = z.object({
  income: z.number().positive().finite(),
  loanAmount: z.number().positive().finite(),
  age: z.number().int().min(18).max(80),
  creditScore: z.number().int().min(300).max(900),
  employment: z.enum(["salaried", "self", "business", "other"]),
  existingEmi: z.number().min(0).finite()
});

export const creditSchema = z.object({
  creditScore: z.number().int().min(300).max(900),
  utilization: z.number().min(0).max(100),
  onTimePaymentRate: z.number().min(0).max(100),
  accounts: z.number().int().min(0).max(100)
});

export const emiSchema = z.object({
  principal: z.number().positive().finite(),
  annualRate: z.number().min(0).max(100).finite(),
  years: z.number().positive().max(40).finite()
});

export const tipsSchema = z.object({
  goal: z.string().trim().min(5).max(2000),
  context: z.record(z.string(), z.unknown()).optional().default({})
});

export const recordSchema = z.object({
  module: z.enum(["loan", "credit", "emi", "tips"]),
  data: z.record(z.string(), z.unknown()).default({}),
  result: z.record(z.string(), z.unknown()).default({}),
  goal: z.string().max(2000).optional()
});
