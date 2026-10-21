import { beforeEach, describe, expect, it } from 'vitest'
import { database } from '../src/infra/database.ts'
import { emailGateway } from '../src/infra/email-gateway.ts'
import { OrderService } from '../src/order-service.ts'
import type { Order } from '../src/types.ts'

const order: Order = {
  id: 'ORD-3001',
  customer: { id: 'c-3', name: 'Marta Ruiz', email: 'marta@example.com', type: 'partner' },
  lines: [
    { sku: 'TEC-01', description: 'Teclado mecánico', quantity: 2, unitPrice: 25 },
    { sku: 'CAB-07', description: 'Cable USB-C', quantity: 1, unitPrice: 10 },
  ],
  paymentMethod: 'card',
  country: 'ES',
}

describe('partner customer', () => {
  beforeEach(() => {
    database.clear()
    emailGateway.clear()
  })

  it('applies a 15% discount', () => {
    const invoice = new OrderService().processOrder(order)

    expect(invoice).toContain('Descuento: -9.00 EUR')
  })
})
