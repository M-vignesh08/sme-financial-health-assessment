'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-financial-statements.ts';
import '@/ai/flows/identify-cash-flow-patterns.ts';
import '@/ai/flows/evaluate-creditworthiness.ts';
import '@/ai/flows/assisted-bookkeeping.ts';
import '@/ai/flows/provide-personalized-recommendations.ts';
import '@/ai/flows/predict-future-financial-performance.ts';
import '@/ai/flows/get-bank-data.ts';