from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
import os
import math

def draw_star(c, x, y, size):
    """Draws a 5-pointed star centered at (x, y)"""
    path = c.beginPath()
    for i in range(10):
        angle = math.radians(i * 36 - 90)
        radius = size if i % 2 == 0 else size * 0.4
        px = x + radius * math.cos(angle)
        py = y - radius * math.sin(angle)
        if i == 0:
            path.moveTo(px, py)
        else:
            path.lineTo(px, py)
    path.close()
    c.drawPath(path, fill=1, stroke=1)

def create_flyer():
    filename = "recursos/flyer-resenas.pdf"
    os.makedirs("recursos", exist_ok=True)
    
    c = canvas.Canvas(filename, pagesize=A4)
    width, height = A4
    
    # Colors
    primary_color = colors.HexColor("#c6ff00") # Lime
    dark_navy = colors.HexColor("#0a1128")
    star_color = colors.HexColor("#FFD700") # Gold
    
    # Background border
    c.setStrokeColor(dark_navy)
    c.setLineWidth(5)
    c.rect(0.25*inch, 0.25*inch, width - 0.5*inch, height - 0.5*inch)
    
    # 1. Logo (Top)
    logo_path = "assets/img/logo.png"
    if os.path.exists(logo_path):
        logo = ImageReader(logo_path)
        c.drawImage(logo, (width - 2.2*inch)/2, height - 2.5*inch, width=2.2*inch, height=2.2*inch, mask='auto')
    
    # 2. Title - Part 1
    c.setFont("Helvetica-Bold", 34)
    c.setFillColor(dark_navy)
    c.drawCentredString(width/2, height - 3.2*inch, "¡APÓYANOS CON TUS")
    
    # 3. Stars
    c.setFillColor(star_color)
    c.setStrokeColor(colors.HexColor("#B8860B")) # Darker gold for stroke
    c.setLineWidth(1)
    star_y = height - 3.7*inch
    for i in range(5):
        draw_star(c, (width/2 - 1.25*inch) + (i * 0.625 * inch), star_y, 18)
        
    # 4. Title - Part 2
    c.setFont("Helvetica-Bold", 34)
    c.setFillColor(dark_navy)
    c.drawCentredString(width/2, height - 4.3*inch, "ESTRELLAS!")
    
    # 5. Message
    c.setFont("Helvetica", 18)
    c.setFillColor(colors.black)
    c.drawCentredString(width/2, height - 4.9*inch, "Tu apoyo nos ayuda a seguir creciendo.")
    c.drawCentredString(width/2, height - 5.2*inch, "Escanea el código para dejarnos tu comentario.")
    
    # 6. QR Code (Central-Bottom area)
    qr_path = "assets/img/gym-review-qr.png"
    if os.path.exists(qr_path):
        qr = ImageReader(qr_path)
        qr_size = 3.6*inch
        # Place QR below the message text
        # Message 2 is at height - 5.2*inch. Let's put QR top at height - 5.6*inch
        qr_y = height - 5.6*inch - qr_size
        c.drawImage(qr, (width - qr_size)/2, qr_y, width=qr_size, height=qr_size)
    
    # 7. Footer (Bottom)
    c.setFont("Helvetica-Bold", 26)
    c.setFillColor(dark_navy)
    c.drawCentredString(width/2, 1.4*inch, "ATHLETIC GYM")
    
    c.setFont("Helvetica-Oblique", 14)
    c.setFillColor(colors.grey)
    c.drawCentredString(width/2, 1.0*inch, "¡Gracias por ser parte de la familia!")
    
    c.showPage()
    c.save()
    print(f"PDF generado: {filename}")

if __name__ == "__main__":
    create_flyer()
