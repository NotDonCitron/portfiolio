from PIL import Image, ImageDraw

# Set 2: PCB (Template Match)
try:
    img_pcb = Image.open('../example-pcb-1.png')
    width, height = img_pcb.size
    cx, cy = width // 2, height // 2
    # Crop central chip
    crop_area = (cx - 150, cy - 150, cx + 150, cy + 150)
    pcb_template = img_pcb.crop(crop_area)
    pcb_template.save('../example-pcb-2.png')
    print("PCB Template created.")
except Exception as e:
    print(f"Error PCB: {e}")

# Set 3: Document (Diff)
try:
    img_doc = Image.open('../example-doc-1.png')
    img_doc_mod = img_doc.copy()
    draw = ImageDraw.Draw(img_doc_mod)
    
    # Redact some lines to create difference
    # Randomly guessed coordinates based on generated image structure (usually centered text)
    draw.rectangle([(150, 400), (600, 440)], fill="black") # Redact a line
    
    # Add a coffee stain (circle)
    draw.ellipse([(700, 700), (850, 850)], fill=(139, 69, 19, 128)) # Brownish
    
    img_doc_mod.save('../example-doc-2.png')
    print("Doc Diff created.")
except Exception as e:
    print(f"Error Doc: {e}")
