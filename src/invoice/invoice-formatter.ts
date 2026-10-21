import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'

export interface InvoiceFormatter {
  format(order: Order, totals: OrderTotals): string
}
