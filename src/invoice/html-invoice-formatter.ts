import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'
import { TextInvoiceFormatter } from './text-invoice-formatter.ts'

export class HtmlInvoiceFormatter implements InvoiceFormatter {
  private readonly text = new TextInvoiceFormatter()

  format(order: Order, totals: OrderTotals): string {
    return `<pre>${this.text.format(order, totals)}</pre>`
  }
}
