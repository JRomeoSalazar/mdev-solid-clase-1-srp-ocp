import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'

const INDENT = 2

export class JsonInvoiceFormatter implements InvoiceFormatter {
  format(order: Order, totals: OrderTotals): string {
    const invoice = {
      id: order.id,
      customer: { name: order.customer.name, email: order.customer.email },
      lines: order.lines.map((line) => ({
        sku: line.sku,
        description: line.description,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        total: line.unitPrice * line.quantity,
      })),
      totals,
    }
    return JSON.stringify(invoice, null, INDENT)
  }
}
