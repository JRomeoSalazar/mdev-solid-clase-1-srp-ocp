import type { PaymentMethod } from '../types.ts'

export interface PaymentFeePolicy {
  calculateFee(amount: number): number
}

export class RateAndFixedFee implements PaymentFeePolicy {
  constructor(
    private readonly rate: number,
    private readonly fixed = 0,
  ) {}

  calculateFee(amount: number): number {
    return amount * this.rate + this.fixed
  }
}

// To support a new payment method, add a policy and register it here.
export const paymentFeePolicies: Record<PaymentMethod, PaymentFeePolicy> = {
  card: new RateAndFixedFee(0.015),
  paypal: new RateAndFixedFee(0.029, 0.3),
  transfer: new RateAndFixedFee(0),
  bizum: new RateAndFixedFee(0.005),
}
