import type { CustomerType } from '../types.ts'

export interface DiscountPolicy {
  calculateDiscount(subtotal: number): number
}

export class PercentageDiscount implements DiscountPolicy {
  constructor(private readonly rate: number) {}

  calculateDiscount(subtotal: number): number {
    return subtotal * this.rate
  }
}

const VIP_BASE_RATE = 0.2
const VIP_HIGH_RATE = 0.25
const VIP_HIGH_RATE_THRESHOLD = 1000

export class VipDiscount implements DiscountPolicy {
  calculateDiscount(subtotal: number): number {
    const rate = subtotal > VIP_HIGH_RATE_THRESHOLD ? VIP_HIGH_RATE : VIP_BASE_RATE
    return subtotal * rate
  }
}

// To support a new customer type, add a policy and register it here.
export const discountPolicies: Record<CustomerType, DiscountPolicy> = {
  standard: new PercentageDiscount(0),
  premium: new PercentageDiscount(0.1),
  vip: new VipDiscount(),
  employee: new PercentageDiscount(0.35),
  partner: new PercentageDiscount(0.15),
}
