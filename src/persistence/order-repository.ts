import { database } from '../infra/database.ts'
import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'

// Fixed timestamp pinned by the existing behavior (and tests).
const CREATED_AT = new Date('2024-01-15T10:00:00Z').toISOString()

export interface OrderRepository {
  save(order: Order, totals: OrderTotals): void
}

export class DatabaseOrderRepository implements OrderRepository {
  save(order: Order, totals: OrderTotals): void {
    database.insertOrder({
      id: order.id,
      customerId: order.customer.id,
      total: totals.total,
      createdAt: CREATED_AT,
    })
  }
}
