import json
from datetime import datetime
from internship_generator import generate_certificate

def main():
    time = datetime.now()
    print(f"Script started at {time}")

    with open('source.json', 'r') as f:
        data = json.load(f)
    for item in data:
        name = item.get('name')
        if name:
            generate_certificate(name)
    time_taken = datetime.now() - time
    print(f"Total time taken: {time_taken.total_seconds()} seconds")

if __name__ == "__main__":
    main()