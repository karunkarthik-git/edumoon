import cloudinary

cloudinary.config(
cloud_name = "your_folder_name",
api_key = "your_api_key",
api_secret = "your_api_secret",
)

import cloudinary.uploader

def upload_file_to_cloudinary(file_path: str):
    try:
        response = cloudinary.uploader.upload(file_path)
        return response['secure_url']
    except Exception as e:
        print(f"Error uploading file to Cloudinary: {e}")
        return None