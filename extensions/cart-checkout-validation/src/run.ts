import type {
  RunInput,
  FunctionRunResult,
  FunctionError,
} from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const errors: FunctionError[] = input.cart.lines
    .filter(({ quantity }) => quantity > 1)
    .map(() => ({
      localizedMessage: "Not possible to order more than one of each",
      target: "cart",
    }));

  return {
    errors
  }
};