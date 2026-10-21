export interface ShippingPolicy {
  calculateShipping(amount: number): number
}

export class FreeAboveThresholdShipping implements ShippingPolicy {
  constructor(
    private readonly threshold: number,
    private readonly cost: number,
  ) {}

  calculateShipping(amount: number): number {
    return amount >= this.threshold ? 0 : this.cost
  }
}

export class FlatRateShipping implements ShippingPolicy {
  constructor(private readonly cost: number) {}

  calculateShipping(): number {
    return this.cost
  }
}

const SPAIN = new FreeAboveThresholdShipping(50, 4.95)
const PORTUGAL_FRANCE = new FreeAboveThresholdShipping(80, 9.95)

// Countries not listed here fall back to the default rate.
export const defaultShippingPolicy: ShippingPolicy = new FlatRateShipping(24.95)

// To support a new country, register it here (or add a new policy).
export const shippingPolicies: Record<string, ShippingPolicy> = {
  ES: SPAIN,
  PT: PORTUGAL_FRANCE,
  FR: PORTUGAL_FRANCE,
}
