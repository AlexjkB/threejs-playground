from PIL import Image
import sys
import os
from pathlib import Path

def add_to_filename(filename: str, suffix: str) -> str:
    stem, ext = os.path.splitext(filename)
    return f"{stem}{suffix}{ext}"

def split_and_save(img: Image.Image, start_x: int, start_y: int, size: int, out_path: Path) -> None:
    box = (int(start_x), int(start_y), int(start_x + size), int(start_y + size))
    cropped = img.crop(box)
    try:
        cropped.save(out_path)
        print(f"✓ Saved {out_path}")
    except Exception as e:
        print(f"* ERROR: Could not save {out_path}: {e}")

def process_image(file_path: Path) -> None:
    try:
        img = Image.open(file_path)
    except Exception as e:
        print(f"* ERROR: Could not open {file_path}: {e}")
        return

    tile = img.size[0] // 4 
    out_dir = file_path.parent  

    split_and_save(img, tile * 1, tile * 0, tile, out_dir / add_to_filename(file_path.name, "_top"))
    split_and_save(img, tile * 1, tile * 1, tile, out_dir / add_to_filename(file_path.name, "_front"))
    split_and_save(img, tile * 0, tile * 1, tile, out_dir / add_to_filename(file_path.name, "_left"))
    split_and_save(img, tile * 1, tile * 2, tile, out_dir / add_to_filename(file_path.name, "_bottom"))
    split_and_save(img, tile * 2, tile * 1, tile, out_dir / add_to_filename(file_path.name, "_right"))
    split_and_save(img, tile * 3, tile * 1, tile, out_dir / add_to_filename(file_path.name, "_back"))

def is_image_file(name: str) -> bool:
    return name.lower().endswith((".png", ".jpg", ".jpeg"))

def main():
    args = [Path(a) for a in sys.argv[1:] if is_image_file(a)]
    if not args:
        print("ERROR: No image provided")
        print("Usage: python3 cubemap_splitter.py path/to/image.png")
        return

    for path in args:
        process_image(path)

if __name__ == "__main__":
    main()
