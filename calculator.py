#!/usr/bin/env python3
"""Simple command-line calculator."""


def add(a: float, b: float) -> float:
    return a + b


def subtract(a: float, b: float) -> float:
    return a - b


def multiply(a: float, b: float) -> float:
    return a * b


def divide(a: float, b: float) -> float:
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero.")
    return a / b


OPERATIONS = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}


def calculate(a: float, operator: str, b: float) -> float:
    if operator not in OPERATIONS:
        raise ValueError(f"Unsupported operator: {operator}")
    return OPERATIONS[operator](a, b)


def main() -> None:
    print("Calculator")
    print("Enter expressions in the format: number operator number (e.g., 12.5 * 4)")
    print("Supported operators: + - * /")
    print("Type 'q' to quit.")

    while True:
        raw = input("> ").strip()
        if raw.lower() in {"q", "quit", "exit"}:
            print("Goodbye!")
            break

        parts = raw.split()
        if len(parts) != 3:
            print("Invalid input. Example: 3 + 4")
            continue

        left, operator, right = parts
        try:
            a = float(left)
            b = float(right)
            result = calculate(a, operator, b)
            print(f"= {result}")
        except ValueError as err:
            print(f"Error: {err}")
        except ZeroDivisionError as err:
            print(f"Error: {err}")


if __name__ == "__main__":
    main()
