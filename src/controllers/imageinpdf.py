from fpdf import FPDF
from PIL import Image
import os

def sort_key(img):
    # Extrai o valor REF do nome da imagem
    ref = int(img.split('_')[1].split('.png')[0])
    return ref


class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        pass

def convert_images_to_pdf(image_folder, output_pdf):
    images = [img for img in os.listdir(image_folder) if img.endswith(".png")]

    if not images:
        print("Nenhuma imagem PNG encontrada na pasta.")
        return

    print(f"Encontradas {len(images)} imagens na pasta.")

    images.sort(key=sort_key)  # Ordena as imagens para manter a ordem no PDF

    # Define margens
    left_margin = 13  # em mm
    right_margin = 7  # em mm
    top_margin = 5  # em mm
    bottom_margin = 5  # em mm

    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=bottom_margin)
    pdf.set_left_margin(left_margin)
    pdf.set_right_margin(right_margin)
    pdf.set_top_margin(top_margin)

    pdf.add_page()  # Adiciona a primeira página

    # Configuração das imagens por página
    images_per_page = 4
    image_width = (pdf.w - left_margin - right_margin) / 2  # Largura disponível na página
    image_height = (pdf.h - top_margin - bottom_margin) / 2  # Altura disponível na página

    # Adiciona cor de fundo à nova página
    pdf.set_fill_color(255, 255, 255)  # #dfcaa4
    pdf.rect(0, 0, pdf.w, pdf.h, 'F')

    for i, img in enumerate(images):
        if i % images_per_page == 0 and i != 0:
            pdf.add_page()  # Adiciona uma nova página
            #print(f"Nova página adicionada. Imagens até agora: {i}")

            # Adiciona cor de fundo à nova página
            pdf.set_fill_color(255, 255, 255)  # #dfcaa4
            pdf.rect(0, 0, pdf.w, pdf.h, 'F')

        img_path = os.path.join(image_folder, img)
        img_obj = Image.open(img_path)
        img_width, img_height = img_obj.size

        # Calcula as proporções para ajustar a imagem proporcionalmente na célula da grade
        width_ratio = image_width / img_width
        height_ratio = image_height / img_height
        min_ratio = min(width_ratio, height_ratio)

        new_width = int(img_width * min_ratio)
        new_height = int(img_height * min_ratio)

        # Calcula as coordenadas para posicionar a imagem em um dos quadrantes
        quadrant = i % images_per_page
        x_offset = left_margin + (quadrant % 2) * image_width
        y_offset = top_margin + (quadrant // 2) * image_height

        # Adiciona a cor da borda
        pdf.set_draw_color(255, 255, 255)  # #dfcaa4
        pdf.set_line_width(5)  # Largura da borda

        # Adiciona a borda ao redor da imagem
        pdf.rect(x_offset, y_offset, new_width, new_height)

        pdf.set_fill_color(255, 255, 255)  # #dfcaa4

        # Adiciona a imagem à página
        pdf.image(img_path, x=x_offset, y=y_offset, w=new_width, h=new_height)

        # Adiciona espaço (3 mm) entre as imagens da linha de cima para a linha de baixo
        if quadrant // 2 == 0 and i + 1 < len(images) and (i + 1) % images_per_page == 0:
            pdf.ln(3)  # Adiciona uma quebra de linha de 3 mm

    pdf.output(f'{caminho}{output_pdf}')
    print(f"PDF criado com sucesso: {output_pdf}")

# Substitua 'caminho/para/suas/imagens' pelo caminho da pasta que contém suas imagens PNG
# Substitua 'output.pdf' pelo nome desejado para o arquivo PDF de saída

import sys

# O primeiro argumento é o nome do script
script_name = sys.argv[0]

# Os argumentos subsequentes são os parâmetros passados para o script
caminho = sys.argv[1]
nomeArquivo = sys.argv[2]
#corFundo = 

# Agora você pode usar esses valores para chamar sua função
convert_images_to_pdf(caminho, nomeArquivo)

