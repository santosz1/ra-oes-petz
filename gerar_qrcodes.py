#!/usr/bin/env python3
"""
Gerador de QR Codes em lote — Controle de Rações
==================================================

Lê a lista de produtos (de um arquivo .xlsx/.csv exportado do site, ou de
uma lista embutida abaixo) e gera um arquivo PNG de QR Code para cada
produto, usando o código de barras (ou marca + nome, se o código não
existir/estiver ilegível).

Como usar
---------
1. Instale as dependências (uma vez só):

       pip install qrcode[pil] openpyxl

2. Rode o script:

       python gerar_qrcodes.py

   Por padrão ele usa a lista de exemplo embutida no arquivo (ESTOQUE_EXEMPLO).
   Para usar uma planilha exportada do site em vez disso:

       python gerar_qrcodes.py --planilha caminho/para/estoque.xlsx

3. Os QR Codes são salvos na pasta "qrcodes_saida/", um arquivo .png por
   produto, nomeado com a marca e o nome do produto.

Requisitos das colunas da planilha (se usar --planilha)
---------------------------------------------------------
A planilha precisa ter colunas com esses nomes (o script procura por
palavras-chave no cabeçalho, então não precisa ser exato):
  - "Marca"
  - "Nome do Produto" (ou "Produto")
  - "Código de Barras" (ou "Código" / "Codigo")
"""

import argparse
import os
import re
import sys

try:
    import qrcode
except ImportError:
    print("Faltando a biblioteca 'qrcode'. Instale com:\n    pip install qrcode[pil]")
    sys.exit(1)


# Lista de exemplo (mesmo estoque inicial do site). Substitua ou ignore
# usando --planilha para ler de um arquivo real.
ESTOQUE_EXEMPLO = [
    {"marca": "Granvita", "produto": "Granvita Quatree Select Gatos Sênior", "codigo": "7898256303463"},
    {"marca": "Special Cat", "produto": "Special Cat Premium Castrados (Salmão & Arroz) 10,1 kg", "codigo": "7898242032223"},
    {"marca": "Quaily Day", "produto": "Quaily Day Gatos Adultos", "codigo": "7898936660725"},
    {"marca": "Purina", "produto": "Purina Cat Chow Gatos Filhotes", "codigo": "7891000248027"},
]


def slugificar(texto: str) -> str:
    """Transforma um texto em um nome de arquivo seguro."""
    texto = texto.strip().lower()
    texto = re.sub(r"[^a-z0-9]+", "_", texto)
    texto = re.sub(r"_+", "_", texto).strip("_")
    return texto or "produto"


def achar_coluna(cabecalho, *termos):
    for i, nome in enumerate(cabecalho):
        nome_low = str(nome or "").strip().lower()
        if any(t in nome_low for t in termos):
            return i
    return -1


def ler_planilha(caminho: str):
    try:
        import openpyxl
    except ImportError:
        print("Faltando a biblioteca 'openpyxl' para ler .xlsx. Instale com:\n    pip install openpyxl")
        sys.exit(1)

    wb = openpyxl.load_workbook(caminho, data_only=True)
    ws = wb.active
    linhas = list(ws.iter_rows(values_only=True))
    if len(linhas) < 2:
        print("Planilha vazia ou sem dados.")
        sys.exit(1)

    cabecalho = linhas[0]
    col_marca = achar_coluna(cabecalho, "marca")
    col_produto = achar_coluna(cabecalho, "produto", "nome")
    col_codigo = achar_coluna(cabecalho, "código", "codigo", "barras")

    if col_marca == -1 or col_produto == -1:
        print("Não encontrei as colunas de Marca e Produto na planilha. Confira os cabeçalhos.")
        sys.exit(1)

    produtos = []
    for linha in linhas[1:]:
        if not linha or all(v is None for v in linha):
            continue
        marca = str(linha[col_marca] or "").strip()
        produto = str(linha[col_produto] or "").strip()
        codigo = str(linha[col_codigo] or "").strip() if col_codigo > -1 else ""
        if not marca or not produto:
            continue
        produtos.append({"marca": marca, "produto": produto, "codigo": codigo})

    return produtos


def gerar_qrcodes(produtos, pasta_saida: str):
    os.makedirs(pasta_saida, exist_ok=True)
    gerados = 0

    for p in produtos:
        codigo = (p.get("codigo") or "").strip()
        codigo_valido = codigo and "ilegível" not in codigo.lower()
        valor = codigo if codigo_valido else f"{p['marca']} - {p['produto']}"

        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(valor)
        qr.make(fit=True)
        img = qr.make_image(fill_color="#101828", back_color="white")

        nome_arquivo = f"{slugificar(p['marca'])}_{slugificar(p['produto'])}.png"
        caminho = os.path.join(pasta_saida, nome_arquivo)
        img.save(caminho)
        gerados += 1
        print(f"  ✓ {caminho}  (conteúdo: {valor})")

    return gerados


def main():
    parser = argparse.ArgumentParser(description="Gera QR Codes em lote para os produtos do estoque.")
    parser.add_argument(
        "--planilha",
        help="Caminho para um arquivo .xlsx exportado do site (ex: controle-racoes-2026-09-03.xlsx). "
             "Se não for informado, usa a lista de exemplo embutida no script.",
    )
    parser.add_argument(
        "--saida",
        default="qrcodes_saida",
        help="Pasta onde os PNGs serão salvos (padrão: qrcodes_saida/)",
    )
    args = parser.parse_args()

    if args.planilha:
        if not os.path.isfile(args.planilha):
            print(f"Arquivo não encontrado: {args.planilha}")
            sys.exit(1)
        produtos = ler_planilha(args.planilha)
    else:
        print("Nenhuma planilha informada — usando a lista de exemplo embutida no script.")
        print("(Use --planilha caminho/arquivo.xlsx para gerar a partir do seu estoque real)\n")
        produtos = ESTOQUE_EXEMPLO

    if not produtos:
        print("Nenhum produto encontrado.")
        sys.exit(1)

    print(f"Gerando QR Codes para {len(produtos)} produto(s)...\n")
    total = gerar_qrcodes(produtos, args.saida)
    print(f"\nConcluído: {total} QR Code(s) salvos em '{args.saida}/'.")


if __name__ == "__main__":
    main()
