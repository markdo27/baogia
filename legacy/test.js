const fs = require('fs');

const appJsStr = fs.readFileSync('app.js', 'utf8');
const match = appJsStr.match(/var DATA=(\[[\s\S]*?\n\]);/);
if (!match) throw new Error('DATA not found in app.js');
let DATA;
eval('DATA = ' + match[1]);

const csvStr = fs.readFileSync('C:/Users/AZPC/.gemini/antigravity/brain/0aa0fff4-8b9d-4958-b70d-b21f763b7bde/.system_generated/steps/470/content.md', 'utf8');
const lines = csvStr.split('\n');

let currentSection = null;
let csvTotal = 0;

function parseNumber(str) {
  if(!str) return 0;
  return parseFloat(str.replace(/,/g, '').replace(/"/g, ''));
}

for (let i = 4; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line.includes('TỔNG CỘNG') || line.includes('LÀM TRÒN') || line.includes('PHẦN HẠNG MỤC') || line.includes('---') || line.includes('PHẦN ĐIỆN') || line.includes('PHẦN XÂY DỰNG') || line.includes('PHẦN LẮP ĐẶT CỬA') || line.includes('PHẦN NỘI THẤT') || line.startsWith('STT,')) {
      if(line.includes('PHẦN ĐIỆN')) currentSection = 'I';
      else if(line.includes('PHẦN XÂY DỰNG')) currentSection = 'II';
      else if(line.includes('PHẦN LẮP ĐẶT CỬA')) currentSection = 'III';
      else if(line.includes('PHẦN NỘI THẤT')) currentSection = 'IV';
      continue;
  }
  
  if(!currentSection) continue;
  
  // A robust yet simple CSV line parser
  let matches = [];
  let inQuotes = false;
  let currentWord = '';
  for(let c=0; c<line.length; c++) {
      if(line[c] === '"') {
          inQuotes = !inQuotes;
      } else if(line[c] === ',' && !inQuotes) {
          matches.push(currentWord);
          currentWord = '';
      } else {
          currentWord += line[c];
      }
  }
  matches.push(currentWord);
  
  const nStr = matches[0];
  if (!nStr || isNaN(parseInt(nStr))) continue;
  const n = parseInt(nStr);
  const name = matches[1] || '';
  const dvt = matches[2] || '';
  const sl = parseNumber(matches[3]);
  const dg = parseNumber(matches[4]);
  const evText = matches[5] || '';
  let tt = parseNumber(matches[6]);
  if(tt === 0 || isNaN(tt)) tt = dg * sl; // fallback
  const ref = matches[7] || '';
  const note = matches[8] || '';
  
  let ev = 'mid';
  const evL = evText.toLowerCase();
  if (evL.includes('rất cao') || evL.includes('cao')) ev = 'high';
  if (evL.includes('hợp lý')) ev = 'ok';
  
  let brand = '';
  const combined = name + ' ' + note;
  if (combined.toLowerCase().includes('schneider')) brand = 'Schneider';
  else if (combined.toLowerCase().includes('cadivi')) brand = 'Cadivi';
  else if (combined.toLowerCase().includes('panduit')) brand = 'Panduit';
  else if (combined.toLowerCase().includes('nanoco')) brand = 'Nanoco';
  else if (combined.toLowerCase().includes('bình minh')) brand = 'Bình Minh';
  else if (combined.toLowerCase().includes('vĩnh tường')) brand = 'Vĩnh Tường';
  else if (combined.toLowerCase().includes('dulux')) brand = 'Dulux';
  else if (combined.toLowerCase().includes('egger')) brand = 'Egger';
  else if (combined.toLowerCase().includes('sika')) brand = 'Sika';
  else if (combined.toLowerCase().includes('porelan')) brand = 'Porelan';
  else if (combined.toLowerCase().includes('xingfa')) brand = 'Xingfa';
  else if (combined.toLowerCase().includes('vickini')) brand = 'VICKINI';

  const sec = DATA.find(s => s.s === currentSection);
  if (sec) {
      const existing = sec.items.find(it => it.n === n);
      if (!existing) {
          sec.items.push({ n, name, dvt, sl, dg, tt, ref, note, ev, brand });
      } else {
          // ensure the existing item has the correct tt if it was wrong
          if (existing.tt !== tt) existing.tt = tt;
      }
  }
  csvTotal += tt;
}

DATA.forEach(sec => {
    sec.items.sort((a, b) => a.n - b.n);
});

let newTotal = 0;
let computedTotal = 0;

DATA.forEach(sec => sec.items.forEach(it => {
    // Force tt to be correct
    it.tt = it.dg * it.sl;
    newTotal += it.tt;
}));
console.log('New Total in DATA:', newTotal.toLocaleString());
console.log('Total parsed from CSV directly:', csvTotal.toLocaleString());

const newDataStr = 'var DATA=' + JSON.stringify(DATA, null, 2).replace(/\"([a-zA-Z0-9_]+)\":/g, '$1:') + ';';
const newAppJsStr = appJsStr.replace(/var DATA=\[[\s\S]*?\n\];/, newDataStr);
fs.writeFileSync('app.js', newAppJsStr, 'utf8');
console.log('app.js updated successfully!');
