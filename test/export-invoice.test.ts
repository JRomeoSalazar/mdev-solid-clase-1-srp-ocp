import { beforeEach, describe, expect, it } from 'vitest'
import { database } from '../src/infra/database.ts'
import { emailGateway } from '../src/infra/email-gateway.ts'
import { OrderService } from '../src/order-service.ts'
import type { Order } from '../src/types.ts'

const order: Order = {
  id: 'ORD-2001',
  customer: { id: 'c-2', name: 'Luis Pérez', email: 'luis@example.com', type: 'standard' },
  lines: [{ sku: 'CAB-07', description: 'Cable USB-C', quantity: 1, unitPrice: 10 }],
  paymentMethod: 'card',
  country: 'ES',
}

describe('OrderService.exportInvoice', () => {
  beforeEach(() => {
    database.clear()
    emailGateway.clear()
  })

  it.each(['text', 'html', 'csv'])('exporting as %s has no side effects', (format) => {
    new OrderService().exportInvoice(order, format)

    expect(database.findAllOrders()).toHaveLength(0)
    expect(emailGateway.sentMessages()).toHaveLength(0)
  })

  it('rejects unknown formats', () => {
    expect(() => new OrderService().exportInvoice(order, 'xml')).toThrow('Formato no soportado: xml')
  })
})
