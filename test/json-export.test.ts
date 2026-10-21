import { beforeEach, describe, expect, it } from 'vitest'
import { database } from '../src/infra/database.ts'
import { emailGateway } from '../src/infra/email-gateway.ts'
import { OrderService } from '../src/order-service.ts'
import type { Order } from '../src/types.ts'

const order: Order = {
  id: 'ORD-6001',
  customer: { id: 'c-6', name: 'Lucía Mora', email: 'lucia@example.com', type: 'standard' },
  lines: [{ sku: 'TEC-01', description: 'Teclado mecánico', quantity: 2, unitPrice: 25 }],
  paymentMethod: 'card',
  country: 'ES',
}

describe('JSON export', () => {
  beforeEach(() => {
    database.clear()
    emailGateway.clear()
  })

  it('produces parseable JSON with lines and totals', () => {
    const invoice = JSON.parse(new OrderService().exportInvoice(order, 'json'))

    expect(invoice.id).toBe('ORD-6001')
    expect(invoice.customer).toEqual({ name: 'Lucía Mora', email: 'lucia@example.com' })
    expect(invoice.lines).toEqual([
      { sku: 'TEC-01', description: 'Teclado mecánico', quantity: 2, unitPrice: 25, total: 50 },
    ])
    expect(invoice.totals).toMatchObject({ subtotal: 50, discount: 0, fee: 0.75, shipping: 0, total: 61.41 })
  })

  it('has no side effects', () => {
    new OrderService().exportInvoice(order, 'json')

    expect(database.findAllOrders()).toHaveLength(0)
    expect(emailGateway.sentMessages()).toHaveLength(0)
  })
})
