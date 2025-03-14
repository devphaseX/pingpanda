export enum Plan {
  FREE = "FREE",
  PRO = "PRO",
}

export enum DeliverStatus {
  PENDING = "PENDING",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export type PlanQuota = {
  maxEventsPerMonth: number;
  maxEventCategories: number;
};

export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventCategories: 3,
};

export const PRO_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventCategories: 10,
};

export const PlanQuota: Record<Plan, PlanQuota> = {
  [Plan.FREE]: FREE_QUOTA,
  [Plan.PRO]: PRO_QUOTA,
};

export enum TimeRange {
  TODAY = "today",
  WEEK = "week",
  MONTH = "month",
}
