import cloudinary

cloudinary.config(
cloud_name = "platform-cloud",
api_key = "288712169677339",
api_secret = "IP5nQz5QgE9J5ui7tyz_g7fVdHc",
)

import cloudinary.uploader

def upload_file_to_cloudinary(file_path: str):
    try:
        response = cloudinary.uploader.upload(file_path)
        return response['secure_url']
    except Exception as e:
        print(f"Error uploading file to Cloudinary: {e}")
        return None
