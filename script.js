async function generateSingleQR() {
  const container = document.getElementById('qrResult');
  container.innerHTML = '';
  const link = document.getElementById('singleLink').value;
  if (!link) return alert('Entre un lien !');
  const qr = new QRCode(container, { text: link, width: 200, height: 200 });
}

async function generateBatchQR() {
  const file = document.getElementById('excelFile').files[0];
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
    const imgData = canvas.querySelector('img').src.split(',')[1];
    zip.file(`${name}.png`, imgData, { base64: true });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.getElementById('downloadZip');
  link.href = URL.createObjectURL(blob);
  link.download = 'QRRRrrrr_QRs.zip';
  link.style.display = 'block';
  link.innerText = 'Télécharger le ZIP';
}