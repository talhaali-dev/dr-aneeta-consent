const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('ICF-Caregivers.docx');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

// Let's print out the parts of the XML that contain Name of Participant
const idx = xml.indexOf('Name of Participant:');
console.log(xml.substring(idx, idx + 300));
