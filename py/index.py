from typing import List, Tuple
import urllib.request
import requests
import io
import fitz  # install with 'pip install pymupdf'


def _parse_highlight(annot: fitz.Annot, wordlist: List[Tuple[float, float, float, float, str, int, int, int]]) -> str:
    points = annot.vertices
    quad_count = int(len(points) / 4)
    sentences = []
    for i in range(quad_count):
        # where the highlighted part is
        r = fitz.Quad(points[i * 4: i * 4 + 4]).rect

        words = [w for w in wordlist if fitz.Rect(w[:4]).intersects(r)]
        sentences.append(" ".join(w[4] for w in words))
    sentence = " ".join(sentences)
    return sentence


def handle_page(page):
    wordlist = page.get_text("words")  # list of words on page
    wordlist.sort(key=lambda w: (w[3], w[0]))  # ascending y, then x

    highlights = []
    annot = page.first_annot
    while annot:
        if annot.type[0] == 8:
            highlights.append(_parse_highlight(annot, wordlist))
        annot = annot.next
    return highlights


def main(filepath: str) -> List:
    response = requests.get(filepath)
    pdf = io.BytesIO(response.content)

    highlights = []
    with fitz.open(stream=pdf) as doc:
        for page in doc:
            highlights += handle_page(page)

    return highlights


if __name__ == "__main__":
    print(main("https://uc6e1a08caba76229286e838f4ae.dl.dropboxusercontent.com/cd/0/get/Btn_uIZcG2u2ppjUTDrwi9W143LAqcqqHh2claEdLxwhjG_PPRlDtr7p8YZBwC2Y38LV167mj2L3MtRhR8JdIyFGQvkvZHeMmlK4FmrpjYNwXyA1iaxbRm6QVk2VNAw4rAH7GZ1M7mjjIScNJydgqmjUnLTXzlY8xW2vDN8A95jl-3Vm_SY4DG2jqMPqn19e-Oo/file"))
