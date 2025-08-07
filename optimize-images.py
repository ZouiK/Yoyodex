#!/usr/bin/env python3
"""
Script d'optimisation des images pour améliorer le LCP
"""
import os
import subprocess
from PIL import Image
import sys

def optimize_image(input_path, output_path=None, quality=85, max_size=(800, 600)):
    """Optimise une image en réduisant sa taille et sa qualité"""
    try:
        with Image.open(input_path) as img:
            # Convertir en RGB si nécessaire
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Redimensionner si trop grande
            if img.size[0] > max_size[0] or img.size[1] > max_size[1]:
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
            
            # Sauvegarder avec compression
            if output_path is None:
                output_path = input_path
            
            img.save(output_path, quality=quality, optimize=True)
            print(f"✅ Optimisé: {input_path}")
            
    except Exception as e:
        print(f"❌ Erreur avec {input_path}: {e}")

def main():
    """Optimise toutes les images du dossier img/"""
    img_dir = "img"
    
    if not os.path.exists(img_dir):
        print(f"❌ Dossier {img_dir} non trouvé")
        return
    
    print("🚀 Optimisation des images en cours...")
    
    # Images à optimiser en priorité (les plus lourdes)
    priority_images = [
        "suna.webp",
        "oto.webp", 
        "gromit_uzumaki.jpg",
        "hutch.png",
        "kekkei_genkai.webp"
    ]
    
    # Optimiser d'abord les images prioritaires
    for img_name in priority_images:
        img_path = os.path.join(img_dir, img_name)
        if os.path.exists(img_path):
            optimize_image(img_path)
    
    # Optimiser toutes les autres images
    for filename in os.listdir(img_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            img_path = os.path.join(img_dir, filename)
            if filename not in priority_images:  # Éviter le double traitement
                optimize_image(img_path)
    
    print("🎉 Optimisation terminée !")

if __name__ == "__main__":
    main()
