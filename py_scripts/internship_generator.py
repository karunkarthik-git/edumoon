

from PIL import Image, ImageDraw, ImageFont


def generate_certificate(name):
    # Load the certificate image
    image = Image.open('INTERNSHIP_TEMPLATE.jpg')

    # Get image dimensions
    width, height = image.size

    # Define rectangle size
    rect_width = 1200
    rect_height = 100

    # Calculate center position above the gold line (approximate y)
    center_x = 1278
    center_y = 677  # Adjust this value to place the box above the gold line

    # Calculate top-left and bottom-right points
    start_point = (center_x - rect_width // 2, center_y - rect_height // 2)
    end_point = (center_x + rect_width // 2, center_y + rect_height // 2)

    # Draw the red rectangle
    draw = ImageDraw.Draw(image)
    # Add center-aligned text in the red box, auto-scaling font size
    text = name
    font_path = "Poppins-Bold.ttf"  # Path to font file
    max_font_size = 60
    min_font_size = 10
    box_width = rect_width - 20  # Padding inside box
    box_height = rect_height - 10

    # Find the largest font size that fits the box
    font_size = max_font_size
    while font_size >= min_font_size:
        font = ImageFont.truetype(font_path, font_size)
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        if text_width <= box_width and text_height <= box_height:
            break
        font_size -= 1
    else:
        font = ImageFont.truetype(font_path, min_font_size)
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]

    # Calculate position to center the text in the box
    box_left, box_top = start_point
    text_x = box_left + (rect_width - text_width) // 2
    text_y = box_top + (rect_height - text_height) // 2

    # Draw the text
    draw.text((text_x, text_y), text, font=font, fill="black")

    # Generate file name by joining name with underscores
    file_name = f"./results/{name.strip().replace(' ', '_')}.jpg"
    image.save(file_name)
    print(f'Saved as {file_name}')
