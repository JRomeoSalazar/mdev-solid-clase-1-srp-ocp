import { emailGateway } from '../infra/email-gateway.ts'
import type { Order } from '../types.ts'

export interface OrderNotifier {
  sendConfirmation(order: Order, invoice: string): void
}

export class EmailOrderNotifier implements OrderNotifier {
  sendConfirmation(order: Order, invoice: string): void {
    emailGateway.send(
      order.customer.email,
      `Tu pedido ${order.id} está confirmado`,
      `Hola ${order.customer.name},\n\nGracias por tu compra.\n\n${invoice}`,
    )
  }
}
