import cloudinary
from env import CLOUD_ENV, CLOUD_API_KEY, CLOUD_API_SECRET

cloudinary.config(
    cloud_name=CLOUD_ENV,
    api_key=CLOUD_API_KEY,
    api_secret=CLOUD_API_SECRET,
)

import cloudinary.uploader

def upload_file_to_cloudinary(file_path: str):
    try:
        response = cloudinary.uploader.upload(file_path)
        return response['secure_url']
    except Exception as e:
        print(f"Error uploading file to Cloudinary: {e}")
        return None
