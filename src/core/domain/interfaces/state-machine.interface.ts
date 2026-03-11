export interface StateMachine<TState> {
  canTransition(from: TState, targetStatus: TState): boolean;
  transition(from: TState, targetStatus: TState): TState;
  getAllowedTransitions(from: TState): TState[];
}
