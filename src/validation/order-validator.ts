import type { Order } from '../types.ts'

export class OrderValidator {
  // The check order is part of the observable behavior: tests pin which error wins.
  validate(order: Order): void {
    this.validateHasLines(order)
    this.validateEmail(order)
    this.validateLineValues(order)
  }

  private validateHasLines(order: Order): void {
    if (order.lines.length === 0) {
      throw new Error('El pedido no tiene líneas')
    }
  }

  private validateEmail(order: Order): void {
    if (!order.customer.email.includes('@')) {
      throw new Error(`Email inválido: ${order.customer.email}`)
    }
  }

  private validateLineValues(order: Order): void {
    for (const line of order.lines) {
      if (line.quantity <= 0) {
        throw new Error(`Cantidad inválida en ${line.sku}`)
      }
      if (line.unitPrice < 0) {
        throw new Error(`Precio inválido en ${line.sku}`)
      }
    }
  }
}
