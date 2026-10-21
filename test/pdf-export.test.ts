import { beforeEach, describe, expect, it } from 'vitest'
import { database } from '../src/infra/database.ts'
import { emailGateway } from '../src/infra/email-gateway.ts'
import { OrderService } from '../src/order-service.ts'
import type { Order } from '../src/types.ts'

const order: Order = {
  id: 'ORD-5001',
  customer: { id: 'c-5', name: 'Marta (Ruiz)', email: 'marta@example.com', type: 'standard' },
  lines: [{ sku: 'TEC-01', description: 'Teclado mecánico', quantity: 2, unitPrice: 25 }],
  paymentMethod: 'card',
  country: 'ES',
}

describe('PDF export', () => {
  beforeEach(() => {
    database.clear()
    emailGateway.clear()
  })

  it('produces a well-formed PDF with the invoice content', () => {
    const pdf = new OrderService().exportInvoice(order, 'pdf')

    expect(pdf.startsWith('%PDF-1.4')).toBe(true)
    expect(pdf.trimEnd().endsWith('%%EOF')).toBe(true)
    expect(pdf).toContain('FACTURA ORD-5001')
    expect(pdf).toContain('Marta \\(Ruiz\\)')
    expect(pdf).toContain('TOTAL: 61.41 EUR')
  })

  it('points startxref at the xref table', () => {
    const pdf = new OrderService().exportInvoice(order, 'pdf')

    const startxref = Number(/startxref\n(\d+)/.exec(pdf)?.[1])
    expect(pdf.slice(startxref, startxref + 4)).toBe('xref')
  })

  it('has no side effects', () => {
    new OrderService().exportInvoice(order, 'pdf')

    expect(database.findAllOrders()).toHaveLength(0)
    expect(emailGateway.sentMessages()).toHaveLength(0)
  })
})
