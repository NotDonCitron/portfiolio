from PIL import Image

# Open the image
img = Image.open('../example-fishing-scene.png')
width, height = img.size

# Crop the center where the "SPACE" box likely is
# Assuming 1024x1024, the prompt said "In the center"
center_x = width // 2
center_y = height // 2
crop_width = 400
crop_height = 200

left = center_x - (crop_width // 2)
top = center_y - (crop_height // 2)
right = center_x + (crop_width // 2)
bottom = center_y + (crop_height // 2)

# Crop
template = img.crop((left, top, right, bottom))
template.save('../example-fishing-template.png')

print("Template created!")
