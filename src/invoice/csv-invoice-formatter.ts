import type { Order } from '../types.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'

export class CsvInvoiceFormatter implements InvoiceFormatter {
  format(order: Order): string {
    return order.lines
      .map((line) => `${line.quantity} x ${line.description};${(line.unitPrice * line.quantity).toFixed(2)} EUR`)
      .join('\n')
  }
}
