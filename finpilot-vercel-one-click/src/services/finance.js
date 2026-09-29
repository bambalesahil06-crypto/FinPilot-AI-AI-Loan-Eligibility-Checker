export function calculateLoanEligibility(input) {
  const { income, loanAmount, age, creditScore, employment, existingEmi } = input;
  const dti = income > 0 ? (existingEmi / income) * 100 : 100;

  const scorePts =
    creditScore >= 750 ? 35 :
    creditScore >= 700 ? 27 :
    creditScore >= 650 ? 18 : 8;

  const agePts =
    age >= 21 && age <= 60 ? 15 :
    age <= 70 ? 8 : 2;

  const empPts =
    employment === "salaried" ? 20 :
    employment === "self" ? 17 : 14;

  const dtiPts =
    dti <= 30 ? 20 :
    dti <= 45 ? 13 :
    dti <= 55 ? 7 : 0;

  const amountPts =
    loanAmount <= income * 24 ? 10 :
    loanAmount <= income * 36 ? 5 : 0;

  const eligibilityIndex = scorePts + agePts + empPts + dtiPts + amountPts;
  const eligible = eligibilityIndex >= 65 && dti < 55;

  return {
    eligible,
    eligibilityIndex,
    debtToIncome: Number(dti.toFixed(2)),
    factors: { scorePts, agePts, empPts, dtiPts, amountPts },
    disclaimer: "Estimate only; lender criteria may differ."
  };
}

export function analyzeCredit(input) {
  const { creditScore, utilization, onTimePaymentRate, accounts } = input;

  const band =
    creditScore >= 800 ? "Excellent" :
    creditScore >= 750 ? "Very good" :
    creditScore >= 700 ? "Good" :
    creditScore >= 650 ? "Fair" : "Needs improvement";

  const risk =
    creditScore >= 750 && utilization <= 30 && onTimePaymentRate >= 95
      ? "Lower"
      : creditScore >= 650
        ? "Moderate"
        : "Higher";

  const recommendations = [];
  if (utilization > 30) recommendations.push("Try to keep revolving utilization below 30%.");
  if (onTimePaymentRate < 95) recommendations.push("Prioritize every payment by its due date.");
  if (accounts < 2) recommendations.push("Build credit gradually and avoid unnecessary applications.");
  if (!recommendations.length) recommendations.push("Maintain low utilization and consistent on-time payments.");

  return {
    creditScore,
    band,
    riskBand: risk,
    recommendations,
    disclaimer: "Educational estimate; not a bureau report."
  };
}

export function calculateEmi({ principal, annualRate, years }) {
  const months = years * 12;
  const monthlyRate = annualRate / 1200;
  const emi = monthlyRate === 0
    ? principal / months
    : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);

  const totalRepayment = emi * months;
  return {
    monthlyEmi: Number(emi.toFixed(2)),
    totalRepayment: Number(totalRepayment.toFixed(2)),
    totalInterest: Number((totalRepayment - principal).toFixed(2)),
    months
  };
}
