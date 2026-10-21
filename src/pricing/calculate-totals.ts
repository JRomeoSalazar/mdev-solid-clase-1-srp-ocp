import type { Order } from '../types.ts'
import { discountPolicies } from './discount-policy.ts'
import type { OrderTotals } from './order-totals.ts'
import { paymentFeePolicies } from './payment-fee-policy.ts'
import { defaultShippingPolicy, shippingPolicies } from './shipping-policy.ts'

export const TAX_RATE = 0.21

const CENTS = 100

/** Pure money calculation: no formatting, persistence or notifications. */
export function calculateTotals(order: Order): OrderTotals {
  const discountPolicy = discountPolicies[order.customer.type]
  if (!discountPolicy) {
    throw new Error(`Tipo de cliente no soportado: ${order.customer.type}`)
  }
  const feePolicy = paymentFeePolicies[order.paymentMethod]
  if (!feePolicy) {
    throw new Error(`Método de pago no soportado: ${order.paymentMethod}`)
  }
  const shippingPolicy = shippingPolicies[order.country] ?? defaultShippingPolicy

  const subtotal = order.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
  const discount = discountPolicy.calculateDiscount(subtotal)
  const afterDiscount = subtotal - discount
  const fee = feePolicy.calculateFee(afterDiscount)
  const shipping = shippingPolicy.calculateShipping(afterDiscount)
  const taxableBase = afterDiscount + fee + shipping
  const tax = taxableBase * TAX_RATE
  const total = Math.round((taxableBase + tax) * CENTS) / CENTS

  return { subtotal, discount, afterDiscount, fee, shipping, taxableBase, taxRate: TAX_RATE, tax, total }
}
