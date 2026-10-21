import { beforeEach, describe, expect, it } from 'vitest'
import { database } from '../src/infra/database.ts'
import { emailGateway } from '../src/infra/email-gateway.ts'
import { OrderService } from '../src/order-service.ts'
import type { Order } from '../src/types.ts'

const order: Order = {
  id: 'ORD-4001',
  customer: { id: 'c-4', name: 'Pablo Gil', email: 'pablo@example.com', type: 'standard' },
  lines: [
    { sku: 'TEC-01', description: 'Teclado mecánico', quantity: 2, unitPrice: 25 },
    { sku: 'CAB-07', description: 'Cable USB-C', quantity: 1, unitPrice: 10 },
  ],
  paymentMethod: 'bizum',
  country: 'ES',
}

describe('Bizum payment', () => {
  beforeEach(() => {
    database.clear()
    emailGateway.clear()
  })

  it('charges a 0.5% fee', () => {
    const invoice = new OrderService().processOrder(order)

    expect(invoice).toContain('Comisión de pago: 0.30 EUR')
  })
})
