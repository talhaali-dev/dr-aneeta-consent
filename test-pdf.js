const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function run() {
  const pdfBytes = fs.readFileSync('public/ICF-Caregivers.pdf');
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  console.log('Fields:', fields.map(f => f.getName()));
}
run();
