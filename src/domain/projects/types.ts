import type { Quote } from "../devis/types";
import type { ProfitabilitySummary } from "../profitability/types";
import type { Zone } from "../zones/types";

export type Project = {
  id: string;
  label: string;
  clientName?: string;
  zones: Zone[];
  quote?: Quote;
  profitability?: ProfitabilitySummary;
  createdAt: string;
  updatedAt: string;
};
