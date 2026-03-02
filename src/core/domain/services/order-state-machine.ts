import type { StateMachine } from "../interfaces";
import { OrderStatus } from "../enums/order-status.enum";
import { InvalidStateTransitionException } from "../exceptions/invalid-state-transition.exception";

export class OrderStateMachine implements StateMachine<OrderStatus> {
  private static readonly transitions = new Map<OrderStatus, Set<OrderStatus>>([
    [OrderStatus.PENDING, new Set([OrderStatus.PAID, OrderStatus.CANCELLED])],
    [OrderStatus.PAID, new Set([OrderStatus.PARTIAL, OrderStatus.COMPLETED])],
    [OrderStatus.PARTIAL, new Set([OrderStatus.COMPLETED])],
    [OrderStatus.COMPLETED, new Set()],
    [OrderStatus.CANCELLED, new Set()],
  ]);

  canTransition(from: OrderStatus, targetStatus: OrderStatus): boolean {
    const allowed = OrderStateMachine.transitions.get(from);
    return allowed?.has(targetStatus) ?? false;
  }

  transition(from: OrderStatus, targetStatus: OrderStatus): OrderStatus {
    if (!this.canTransition(from, targetStatus)) {
      throw new InvalidStateTransitionException("Order", from, targetStatus);
    }
    return targetStatus;
  }

  getAllowedTransitions(from: OrderStatus): OrderStatus[] {
    const allowed = OrderStateMachine.transitions.get(from);
    return allowed ? Array.from(allowed) : [];
  }
}
