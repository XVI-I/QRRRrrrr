// --- GÉNÉRATION UNIQUE AVEC TÉLÉCHARGEMENT MULTI-FORMATS ---
async function generateSingleQR() {
  const container = document.getElementById('qrResult');
  container.innerHTML = '';

  const link = document.getElementById('singleLink').value.trim();
  if (!link) return alert('Entre un lien à transformer en QR code.');

  const qrContainer = document.createElement('div');
  qrContainer.id = "qrImage";
  container.appendChild(qrContainer);

  // Génération du QR
  new QRCode(qrContainer, { text: link, width: 200, height: 200 });

  setTimeout(() => {
    const img = qrContainer.querySelector('img');
    if (!img) return;

    // --- Sélecteur de format ---
    const formatSelect = document.createElement('select');
    formatSelect.id = 'formatSelect';
    formatSelect.innerHTML = `
      <option value="png">PNG</option>
      <option value="jpeg">JPEG</option>
      <option value="pdf">PDF</option>
      <option value="svg">SVG</option>
    `;
    formatSelect.style.marginTop = '10px';
    formatSelect.style.padding = '4px';
    container.appendChild(formatSelect);

    // --- Bouton de téléchargement ---
    const downloadBtn = document.createElement('button');
    downloadBtn.innerText = '📥 Télécharger le QR';
    downloadBtn.style.marginLeft = '10px';
    downloadBtn.onclick = async () => {
      const format = formatSelect.value;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const qrImg = new Image();
      qrImg.src = img.src;
      await qrImg.decode();

      if (format === 'svg') {
        // SVG natif
        const svgData = `
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <image href="${img.src}" width="200" height="200" />
          </svg>`;
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        triggerDownload(blob, 'QRRRrrrr_QR.svg');
      } else if (format === 'pdf') {
        // PDF via jsPDF (petit import dynamique)
        const { jsPDF } = window.jspdf || await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        const pdf = new jsPDF();
        pdf.addImage(img.src, 'PNG', 10, 10, 50, 50);
        pdf.save('QRRRrrrr_QR.pdf');
      } else {
        // PNG ou JPEG via canvas
        canvas.width = 200;
        canvas.height = 200;
        ctx.drawImage(qrImg, 0, 0);
        const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        canvas.toBlob(blob => triggerDownload(blob, `QRRRrrrr_QR.${format}`), mime);
      }
    };

    container.appendChild(downloadBtn);
  }, 500);
}

function triggerDownload(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// --- GÉNÉRATION DE GROUPE (Excel inchangée) ---
async function generateBatchQR() {
  const file = document.getElementById('excelFile').files[0];
  const format = document.getElementById('batchFormat').value;
  if (!file) return alert('Importe un fichier Excel');

  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const zip = new JSZip();

  for (let i = 1; i < rows.length; i++) {
    const [name, url] = rows[i];
    if (!name || !url) continue;

    const canvas = document.createElement('canvas');
    new QRCode(canvas, { text: url, width: 200, height: 200 });
    await new Promise(res => setTimeout(res, 300));

    const img = canvas.querySelector('img');

    if (format === 'svg') {
      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
          <image href="${img.src}" width="200" height="200" />
        </svg>`;
      zip.file(`${name}.svg`, svgData);
    } else if (format === 'pdf') {
      const { jsPDF } = window.jspdf || await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      const pdf = new jsPDF();
      pdf.addImage(img.src, 'PNG', 10, 10, 50, 50);
      const pdfBlob = pdf.output('blob');
      zip.file(`${name}.pdf`, pdfBlob);
    } else {
      // PNG ou JPEG
      const canvas2 = document.createElement('canvas');
      const ctx = canvas2.getContext('2d');
      const qrImg = new Image();
      qrImg.src = img.src;
      await qrImg.decode();
      canvas2.width = 200;
      canvas2.height = 200;
      ctx.drawImage(qrImg, 0, 0);
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const imgData = canvas2.toDataURL(mime).split(',')[1];
      zip.file(`${name}.${format}`, imgData, { base64: true });
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.getElementById('downloadZip');
  link.href = URL.createObjectURL(blob);
  link.download = `QRRRrrrr_QRs_${format}.zip`;
  link.style.display = 'block';
  link.innerText = `📦 Télécharger le ZIP (${format.toUpperCase()})`;
}

