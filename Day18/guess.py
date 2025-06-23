import random

SETTINGS = {
    "easy" : {
        "range": (1, 10),
        "attempts": 10,
    },
    "medium": {
        "range": (1, 50),
        "attempts": 7,
    },
    "hard": {
        "range": (1, 100),
        "attempts": 5,
    },
}

def select_difficulty():
    print("Select difficulty levels:")
    for difficulty in SETTINGS:
        print(f"- {difficulty.capitalize()}")
    while True:
        selection = input("Enter difficulty level: ").lower()
        if selection in SETTINGS:
            print(f"You selected {selection.capitalize()} difficulty.")
            return selection
        else:
            print("Invalid selection. Please try again.")

def start():
    print("Welcome to the Guessing Game!")
    selected_difficulty = select_difficulty()
    settings = SETTINGS[selected_difficulty]
    low, high = settings["range"]
    attempts = settings["attempts"]
    generated_number = random.randint(low, high)
    print(f"Guess a number between {low} and {high}. You have {attempts} attempts.")

    while attempts > 0:
        try:
            user_input = int(input("Enter your guess: "))
            attempts -= 1

            if user_input < generated_number: 
                print("Too low!")
            elif user_input > generated_number:
                print("Too high!")
            else:
                print("Congratulations! You've guessed the number!")
                return
        except ValueError:
            print("Invalid input. Please enter a valid number.")

    print(f"Sorry, you've run out of attempts. The number was {generated_number}.")
    print("Game Over!")

start()