from PIL import Image, ImageDraw, ImageFont
import os

def generate_certificate(name, template_path, results_folder, font_path=None, font_size=48, text_color=(0, 0, 0)):
    image = Image.open(template_path).convert('RGB')
    draw = ImageDraw.Draw(image)
    font_candidates = [font_path] if font_path and os.path.exists(font_path) else [
        "arialbd.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "DejaVuSans-Bold.ttf",
        "arial.ttf"
    ]
    box_width = 1000
    box_height = 90
    box_x = 500
    box_y = 500
    max_font_size = 48
    min_font_size = 18
    best_font = None
    for size in range(max_font_size, min_font_size - 1, -1):
        font = None
        for candidate in font_candidates:
            try:
                font = ImageFont.truetype(candidate, size)
                break
            except Exception:
                continue
        if not font:
            font = ImageFont.load_default()
        try:
            bbox = font.getbbox(name)
            name_width = bbox[2] - bbox[0]
            name_height = bbox[3] - bbox[1]
        except AttributeError:
            name_width, name_height = font.getsize(name)
        if name_width <= box_width - 20:
            best_font = font
            break
    else:
        best_font = font
    name_x = box_x + (box_width - name_width) // 2
    name_y = box_y + (box_height - name_height) // 2
    draw.text((name_x, name_y), name, fill=text_color, font=best_font)
    os.makedirs(results_folder, exist_ok=True)
    output_path = os.path.join(results_folder, f"{name}.png")
    image.save(output_path)
    print(f"Certificate saved as {output_path}")

if __name__ == "__main__":
    name = "Karun"
    template_path = "certificate_template.jpeg"
    results_folder = "results"
    font_path = None
    font_size = 48
    text_color = (0, 0, 0)
    generate_certificate(name, template_path, results_folder, font_path, font_size, text_color=text_color)
