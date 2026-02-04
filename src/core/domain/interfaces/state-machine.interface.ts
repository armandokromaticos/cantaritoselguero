export interface StateMachine<TState> {
  canTransition(from: TState, to: TState): boolean;
  transition(from: TState, to: TState): TState;
  getAllowedTransitions(from: TState): TState[];
}
