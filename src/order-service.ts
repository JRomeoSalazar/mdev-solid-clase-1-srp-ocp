import { invoiceFormatters } from './invoice/invoice-formatters.ts'
import { TextInvoiceFormatter } from './invoice/text-invoice-formatter.ts'
import { EmailOrderNotifier, type OrderNotifier } from './notification/order-notifier.ts'
import { DatabaseOrderRepository, type OrderRepository } from './persistence/order-repository.ts'
import { calculateTotals } from './pricing/calculate-totals.ts'
import type { Order } from './types.ts'
import { OrderValidator } from './validation/order-validator.ts'

/**
 * Orchestrates the order flow. Each step lives in its own module:
 * validation, pricing, invoice formatting, persistence and notification.
 */
export class OrderService {
  constructor(
    private readonly validator = new OrderValidator(),
    private readonly repository: OrderRepository = new DatabaseOrderRepository(),
    private readonly notifier: OrderNotifier = new EmailOrderNotifier(),
  ) {}

  processOrder(order: Order): string {
    this.validator.validate(order)
    const totals = calculateTotals(order)
    const invoice = new TextInvoiceFormatter().format(order, totals)

    this.repository.save(order, totals)
    this.notifier.sendConfirmation(order, invoice)

    return invoice
  }

  /** Pure export: calculates and formats, without persisting or notifying. */
  exportInvoice(order: Order, format: string): string {
    this.validator.validate(order)
    const formatter = invoiceFormatters[format]
    if (!formatter) {
      throw new Error(`Formato no soportado: ${format}`)
    }
    return formatter.format(order, calculateTotals(order))
  }
}
