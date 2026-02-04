# SME Financial Health Assessment – Explainable AI

## Problem Statement
Small and Medium Enterprises (SMEs) struggle to understand their financial health due to complex financial statements. This project provides an explainable AI-based solution to analyze financial data and present insights in simple language.

## Solution Overview
The system analyzes financial statements and computes key financial metrics. An explainable, rule-based AI reasoning layer converts these metrics into human-readable insights and explains the health score.

## Tech Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- AI Logic: Rule-based explainable AI (no external APIs)

## Architecture
Frontend → Backend API → Financial Metrics Engine → AI Reasoning Layer → UI Insights

## Features
- Financial statement upload
- Revenue, expense, and profit analysis
- Health score calculation
- Explainable AI insights
- Clear health score explanation

## How to Run Locally
1. Start backend:
   uvicorn backend.app:app --reload
2. Start frontend:
   npm run dev
3. Upload a sample CSV and analyze

## AI Explanation
AI is used at the interpretation layer. Financial metrics are computed deterministically, and an AI reasoning layer converts them into meaningful insights, ensuring transparency and reliability.
