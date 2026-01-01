
import cv2
import os

def create_template(source_path, template_path, method='center', size=(200, 200), offset=(0,0)):
    print(f"Processing {source_path}...")
    img = cv2.imread(source_path)
    if img is None:
        print(f"Error: Could not load {source_path}")
        return

    h, w = img.shape[:2]
    
    if method == 'center':
        center_y, center_x = h // 2 + offset[1], w // 2 + offset[0]
        y1 = center_y - size[1] // 2
        y2 = center_y + size[1] // 2
        x1 = center_x - size[0] // 2
        x2 = center_x + size[0] // 2
    elif method == 'top_right':
        # For the "Generate Report" button which is likely in top right
        y1 = 50 + offset[1]
        y2 = 50 + size[1] + offset[1]
        x1 = w - size[0] - 100 + offset[0]
        x2 = w - 100 + offset[0]
    
    # Ensure bounds
    y1, y2 = max(0, y1), min(h, y2)
    x1, x2 = max(0, x1), min(w, x2)
    
    template = img[y1:y2, x1:x2]
    cv2.imwrite(template_path, template)
    print(f"Saved template to {template_path} ({x2-x1}x{y2-y1})")

# Security: Backpack is usually in the center or slightly offset
# Based on prompt "backpack left on the ground" in a parking lot, usually central
create_template('example-security-source.png', 'example-security-template.png', method='center', size=(150, 150))

# UI: "Generate Report" button in top right
# I'll try to target the top right area
create_template('example-ui-source.png', 'example-ui-template.png', method='top_right', size=(200, 80))
