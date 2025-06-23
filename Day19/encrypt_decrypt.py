from cryptography.fernet import Fernet
import json

class Notes:

    def __init__(self, notes_file="data.json"):
        self.notes_file = notes_file
        self.notes = []
        self.fernet = None
        self.set_fernet()
        self.load_notes()

    def set_fernet(self):
        # fernet is a key used for encryption and decryption
        # 32 byte and is base64 encoded
        crypto_key = Fernet.generate_key()
        self.fernet = Fernet(crypto_key)
        print("Encryption successful!")

    def encrypt_text(self, text):
        """Encrypt the given text using the fernet key."""
        if not self.fernet:
            raise ValueError("Fernet key is not set.")
        return self.fernet.encrypt(text.encode()).decode()
    
    def decrypt_text(self, encrypted_text):
        """Decrypt the given encrypted text using the fernet key."""
        if not self.fernet:
            raise ValueError("Fernet key is not set.")
        return self.fernet.decrypt(encrypted_text.encode()).decode()
    
    def save_notes(self):
        try:
            with open(self.notes_file, 'w') as file:
                json.dump(self.notes, file, indent=4)
                print("Notes saved successfully!")
        except Exception as e:
            print(f"Error saving notes: {e}")
    
    def load_notes(self):
        try:
            with open(self.notes_file, 'r') as file:
                self.notes = json.load(file)
                print("Notes loaded successfully!")
        except FileNotFoundError:
            self.notes = []
            print("No notes file found. Starting with an empty notes list.")
        except json.JSONDecodeError:
            self.notes = []
            print("Error decoding JSON from notes file. Starting with an empty notes list.")
        except Exception as e:
            self.notes = []
            print(f"Error loading notes: {e}")
    
    def add_note(self):
        # User input -> 1. Title, 2. Content
        # Encrypt the content
        # update the notes list
        # store the notes list

        print("Add a new note...")
        title = input("Enter note title: ").strip()
        if not title:
            print("Title cannot be empty.")
            return
        content = input("Enter note content: ").strip()
        if not content:
            print("Content cannot be empty.")
            return
        
        try:
            encrypted_content = self.encrypt_text(content)
            note = {
                "id": len(self.notes) + 1,
                "title": title,
                "content": encrypted_content
            }
            self.notes.append(note)
            self.save_notes()
            print("Note added successfully!")
        except Exception as e:
            print(f"Error adding note: {e}")
            

    def list_notes(self):
        if not self.notes:
            print("No notes available.")
            return

        for note in self.notes:
            print(f"ID: {note['id']}, Title: {note['title']}")

    def get_note_by_id(self, note_id):
        """Retrieve a note by its ID."""
        for note in self.notes:
            if note['id'] == note_id:
                return note
        return None

    def view_note(self):
        self.list_notes()
        try:
            note_id = int(input("Enter the ID of the note you want to view: ").strip())
            note = self.get_note_by_id(note_id)

            if note is None:
                print("Note not found.")
                return
            
            decrypted_text = self.decrypt_text(note['content'])
            print(f"Note ID: {note['id']}")
            print(f"Title: {note['title']}")
            print(f"Content: {decrypted_text}")
        except Exception as e:
            print(f"Error viewing note with id {note_id}: {e}")

    def delete_note(self):
        self.list_notes()
        try:
            note_id = int(input("Enter the ID of the note you want to delete: ").strip())
            note = self.get_note_by_id(note_id)

            if note is None:
                print("Note not found.")
                return
            
            for i, note in enumerate(self.notes):
                if note['id'] == note_id:
                    deleted_note = self.notes.pop(i)
                    self.save_notes()
                    print(f"Deleted note: {deleted_note['title']}")
                    return
            
            print("Note deleted successfully!")
        except Exception as e:
            print(f"Error deleting note with id {note_id}: {e}")

    def menu(self):
        print("Notes CLI App")
        while True:
            print("Options:")
            print("1. Add Note")
            print("2. List Notes")
            print("3. View Note")
            print("4. Delete Note")
            print("5. Exit")

            choice = input("Choose an option: ").strip()
            if choice == '1':
                self.add_note()
            elif choice == '2':
                self.list_notes()
            elif choice == '3':
                self.view_note()
            elif choice == '4':
                self.delete_note()
            elif choice == '5':
                print("Exiting the app.")
                break
            else:
                print("Invalid choice. Please try again.")
        
def main():
    notes = Notes()
    notes.menu()

if __name__ == "__main__":
    main()