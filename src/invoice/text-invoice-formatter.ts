import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'

const SEPARATOR = '-'.repeat(40)
const PERCENT = 100

export class TextInvoiceFormatter implements InvoiceFormatter {
  format(order: Order, totals: OrderTotals): string {
    const lines = order.lines.map((line) => {
      const lineTotal = (line.unitPrice * line.quantity).toFixed(2)
      return `${line.quantity} x ${line.description} ... ${lineTotal} EUR`
    })
    const taxPercent = Math.round(totals.taxRate * PERCENT)

    return [
      `FACTURA ${order.id}`,
      `Cliente: ${order.customer.name} <${order.customer.email}>`,
      SEPARATOR,
      ...lines,
      SEPARATOR,
      `Subtotal: ${totals.subtotal.toFixed(2)} EUR`,
      `Descuento: -${totals.discount.toFixed(2)} EUR`,
      `Comisión de pago: ${totals.fee.toFixed(2)} EUR`,
      `Envío: ${totals.shipping.toFixed(2)} EUR`,
      `IVA (${taxPercent}%): ${totals.tax.toFixed(2)} EUR`,
      `TOTAL: ${totals.total.toFixed(2)} EUR`,
      '',
    ].join('\n')
  }
}
