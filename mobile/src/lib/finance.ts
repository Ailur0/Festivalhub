import type { Expense, ExpenseCategory, GroupDetail, Member } from '@/data/types';

export const expenseCategories: ExpenseCategory[] = [
  'Decoration',
  'Prasad',
  'Pooja Items',
  'Logistics',
  'Cultural Events',
  'Miscellaneous',
];

export type ContributionStatus = 'paid' | 'partial' | 'unpaid';

export type Contribution = Member & {
  share: number;
  paid: number;
  status: ContributionStatus;
};

export type GroupFinances = {
  totalBudget: number;
  share: number;
  collected: number;
  spent: number;
  balance: number;
  collectedPercent: number;
  spentPercent: number;
  paidCount: number;
  contributions: Contribution[];
  byCategory: { category: ExpenseCategory; total: number; expenses: Expense[] }[];
  /** Payments from people who have left the group; included in `collected` */
  formerMemberPayments: number;
};

/**
 * Totals are derived from the members and expenses the database returned, so the
 * numbers on every screen add up. Only call this when `myPermissions.viewBudget`
 * is true; without it the server sends no amounts.
 */
export function getGroupFinances(group: GroupDetail): GroupFinances {
  const totalBudget = group.totalBudget ?? 0;
  const memberCount = group.members.length;
  const share = memberCount > 0 ? totalBudget / memberCount : 0;

  const contributions = group.members.map((member): Contribution => {
    const paid = member.paidAmount ?? 0;
    // Round the share down so a fraction of a currency unit doesn't keep someone "partial"
    const status: ContributionStatus =
      share > 0 && paid >= Math.floor(share) ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
    return { ...member, share, paid, status };
  });

  const memberPayments = contributions.reduce((sum, member) => sum + member.paid, 0);
  const collected = memberPayments + group.formerMemberPayments;
  const spent = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const byCategory = expenseCategories.map((category) => {
    const expenses = group.expenses.filter((expense) => expense.category === category);
    return { category, expenses, total: expenses.reduce((sum, expense) => sum + expense.amount, 0) };
  });

  return {
    totalBudget,
    share,
    collected,
    spent,
    balance: collected - spent,
    collectedPercent: totalBudget > 0 ? (collected / totalBudget) * 100 : 0,
    spentPercent: totalBudget > 0 ? (spent / totalBudget) * 100 : 0,
    paidCount: contributions.filter((contribution) => contribution.status === 'paid').length,
    contributions,
    byCategory,
    formerMemberPayments: group.formerMemberPayments,
  };
}
