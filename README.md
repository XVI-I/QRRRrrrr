# 🌀 QRRRrrrr!!!

> Générateur de QR Codes simple, illimité et auto-hébergé — sans serveur, 100 % gratuit.

---

## 🚀 Aperçu

**QRRRrrrr!!!** est un petit site web qui permet de :
- Générer un QR code unique à partir d’un lien ou d’un fichier 📄  
- Générer en masse plusieurs QR codes à partir d’un fichier Excel 📊  
- Télécharger le tout dans un fichier `.zip` automatiquement 📦

Le tout fonctionne **directement dans le navigateur**, sans aucune limite ni appel externe 🔥

---

## 🎨 Design

Style **noir et blanc** inspiré des vieux journaux, avec encadrements fins et typo typewriter (`Space Mono`).  
Un rendu minimaliste et rétro pour un outil moderne 👨‍💻

---

## 🧩 Fonctionnalités

| Fonction | Description |
|-----------|-------------|
| 🔗 Génération unique | Colle un lien → QR instantané |
| 📂 Upload Excel | Colonne A = nom du QR / Colonne B = lien |
| ⚙️ Génération en masse | Création de tous les QR en local |
| 📦 Téléchargement ZIP | Télécharge tous les QR codes d’un coup |
| 💻 100 % local | Aucune donnée n’est envoyée nulle part |

---

## 🛠️ Stack technique

| Élément | Outil |
|----------|--------|
| Frontend | **HTML + CSS (custom)** |
| Style | **Design noir & blanc, encadré façon “journal”** |
| Génération QR | [qrcode.js](https://cdnjs.com/libraries/qrcodejs) |
| Lecture Excel | [SheetJS (xlsx.js)](https://sheetjs.com/) |
| Création ZIP | [JSZip](https://stuk.github.io/jszip/) |
| Hébergement | [Vercel](https://vercel.com/) |

---

## ⚡ Installation locale

1. Clone ce repo :
   ```bash
   git clone https://github.com/XVI-I/QRRRrrrr.git
   cd QRRRrrrr
