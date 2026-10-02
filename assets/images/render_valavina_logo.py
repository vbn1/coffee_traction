from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 900
img = Image.new('RGBA', (W, H), '#F4EDE4')
d = ImageDraw.Draw(img)

# Colors
brown = '#4B2A1E'
deep_brown = '#6D4028'
leaf_color = '#6E8E5C'
leaf_dark_color = '#2E4E32'
bean = '#7C452C'
bean_light = '#E8C782'
mountain = '#C98B5F'
mountain_shadow = '#7E432A'

# Wordmark
script_candidates = [
    'C:/Windows/Fonts/Segoe Script.ttf',
    'C:/Windows/Fonts/BRUSHSCI.ttf',
    'C:/Windows/Fonts/Georgia.ttf',
    'C:/Windows/Fonts/times.ttf',
]
script_font = None
for path in script_candidates:
    try:
        script_font = ImageFont.truetype(path, 170)
        break
    except Exception:
        pass
if script_font is None:
    script_font = ImageFont.truetype('arial.ttf', 170)

text = 'VaLaViNa'
text_bbox = d.textbbox((0, 0), text, font=script_font)
text_w = text_bbox[2] - text_bbox[0]
text_x = (W - text_w) / 2
text_y = 100

d.text((text_x, text_y), text, font=script_font, fill=brown)

# Taglines
small_candidates = [
    'C:/Windows/Fonts/Georgia.ttf',
    'C:/Windows/Fonts/times.ttf',
    'C:/Windows/Fonts/calibri.ttf',
]
small_font = None
for path in small_candidates:
    try:
        small_font = ImageFont.truetype(path, 32)
        break
    except Exception:
        pass
if small_font is None:
    small_font = ImageFont.truetype('arial.ttf', 32)

label1 = 'SINGLE ORIGIN ARABICA'
label2 = 'HAND-PICKED FROM OUR ESTATE'

d.text((W/2 - d.textbbox((0, 0), label1, font=small_font)[2] / 2, 500), label1, fill=deep_brown, font=small_font)
d.text((W/2 - d.textbbox((0, 0), label2, font=small_font)[2] / 2, 560), label2, fill=deep_brown, font=small_font)

# Leaves
def leaf(x, y, s, ang):
    p = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    pd = ImageDraw.Draw(p)
    pd.polygon([(0, -20), (25, -55), (55, -10), (80, 0), (25, 15)], fill=leaf_color)
    pd.ellipse((15, -15, 70, 30), fill=leaf_color)
    pd.ellipse((0, -35, 40, 10), fill=leaf_dark_color)
    # attach stem
    pd.line((40, 5, 40, 70), fill=leaf_dark_color, width=5)
    q = p.rotate(ang, expand=True, fillcolor=(0,0,0,0))
    img.alpha_composite(q, (x, y))

for x, y, s, ang in [
    (320, 420, 1, 10), (360, 450, 1, -10), (880, 420, 1, -10), (840, 450, 1, 10),
    (300, 560, 1, 10), (340, 610, 1, -20), (860, 560, 1, -10), (820, 610, 1, 20),
    (440, 610, 1, 15), (700, 610, 1, -15),
]:
    leaf(x, y, s, ang)

# Mountain
mountain_points = [(350, 650), (470, 535), (540, 600), (600, 555), (662, 600), (730, 535), (850, 650), (350, 650)]
d.polygon(mountain_points, fill=mountain)
d.line((350, 650, 470, 535, 540, 600, 600, 555, 662, 600, 730, 535, 850, 650), fill='#553820', width=7)
# shadow underside
shadow = [(315, 662), (392, 620), (470, 605), (540, 610), (625, 595), (700, 578), (780, 570), (845, 570), (914, 626), (914, 710), (315, 710)]
d.polygon(shadow, fill='#7B452D')

# Coffee beans
for cx, cy in [(470, 710), (640, 710), (545, 750)]:
    # bean body
    d.ellipse((cx, cy, cx+140, cy+75), fill=bean)
    d.ellipse((cx+10, cy+12, cx+130, cy+60), fill=bean_light)
    d.line((cx+40, cy+28, cx+40, cy+58), fill='#F9E8C7', width=7)
    d.line((cx+70, cy+20, cx+103, cy+54), fill='#F9E8C7', width=7)
    d.line((cx+100, cy+16, cx+115, cy+48), fill='#F9E8C7', width=7)
    d.line((cx+70, cy+8, cx+70, cy+70), fill='#F9E8C7', width=7)

# fruit berries
for cx, cy in [(332, 640), (392, 663), (480, 652), (610, 650), (716, 660), (810, 644), (866, 630), (940, 640)]:
    d.ellipse((cx-18, cy-18, cx+18, cy+18), fill='#6C2C1A')

# tiny decorative line
for y in [390, 420, 450]:
    d.arc((330, y, 870, y+40), 180, 0, fill='#5A3226', width=5)

img.save('C:/Users/DELL/Desktop/Phibean_Coffee/assets/images/valavina-logo.png')
print('saved')
