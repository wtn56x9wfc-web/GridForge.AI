/* Helper */
const $ = id => document.getElementById(id);

/* ===== Single Message Composer ===== */
const single = {
init() {
$('generateBtn')?.addEventListener('click', this.generate);
$('clearBtn')?.addEventListener('click', this.clear);
},
async generate(e){
e.preventDefault();
const payload = {
businessName: $('businessName').value.trim(),
senderName: $('senderName').value.trim(),
recipientName: $('recipientName').value.trim(),
industry: $('industry').value.trim(),
goals: $('goals').value.trim(),
messageType: $('messageType').value,
extra: $('extra').value.trim()
};
if (!payload.businessName || !payload.senderName || !payload.recipientName) return;

```
$('output').value = 'Generating…';
try {
  const res = await fetch('/api/generate', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  $('output').value = data.message || 'No content returned.';
} catch (err) {
  $('output').value = 'Error generating content. Please try again.';
}
```

},
clear(){
['businessName','senderName','recipientName','industry','goals','extra'].forEach(id => $(id).value='');
$('messageType').value = 'email';
$('output').value = '';
}
};

/* ===== Tiny CSV Utils (handles quotes) ===== */
function parseCSV(text){
const rows = [];
let row = [], cell = '', inQuotes = false;
for (let i=0;i<text.length;i++){
const c = text[i], n = text[i+1];
if (c === '"' ){
if (inQuotes && n === '"'){ cell += '"'; i++; }
else { inQuotes = !inQuotes; }
} else if (c === ',' && !inQuotes){
row.push(cell); cell = '';
} else if ((c === '\n' || c === '\r') && !inQuotes){
if (cell.length || row.length){ row.push(cell); rows.push(row); row=[]; cell=''; }
if (c === '\r' && n === '\n') i++; // handle CRLF
} else {
cell += c;
}
}
if (cell.length || row.length) { row.push(cell); rows.push(row); }
return rows;
}
function toCSV(rows){
const esc = v => {
if (v == null) return '';
const s = String(v);
return /[",\n\r]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s;
};
return rows.map(r => r.map(esc).join(',')).join('\n');
}

/* ===== Bulk Generation ===== */
const bulk = {
rows: [],
headers: [],
results: [],
maxBatch: 25, // safety

init(){
$('csvFile')?.addEventListener('change', this.loadCSV.bind(this));
$('generateBulkBtn')?.addEventListener('click', this.generateAll.bind(this));
$('downloadTemplateBtn')?.addEventListener('click', this.downloadTemplate);
$('downloadResultsBtn')?.addEventListener('click', this.downloadResults.bind(this));
$('clearBulkBtn')?.addEventListener('click', this.clear.bind(this));
},

requiredHeaders: ['name','company','title','email','notes','industry','goals','messageType'],

async loadCSV(e){
const file = e.target.files?.[0];
if (!file) return;
const text = await file.text();
const raw = parseCSV(text).filter(r => r.length && r.some(c => c && c.trim().length));
if (!raw.length) return;

```
this.headers = raw[0].map(h => String(h || '').trim());
const headerLower = this.headers.map(h => h.toLowerCase());
const missing = this.requiredHeaders.filter(h => !headerLower.includes(h));
if (missing.length){
  $('bulkStatus').textContent = `Missing headers: ${missing.join(', ')}`;
  $('generateBulkBtn').disabled = true;
  return;
}

this.rows = raw.slice(1).map(cols => {
  const obj = {};
  this.headers.forEach((h, i) => obj[h] = (cols[i] ?? '').toString().trim());
  return obj;
}).filter(r => Object.values(r).some(v => v));
$('bulkStatus').textContent = `Loaded ${this.rows.length} rows.`;
$('generateBulkBtn').disabled = this.rows.length === 0;
$('clearBulkBtn').disabled = this.rows.length === 0;
this.renderPreview();
```

},

renderPreview(){
const head = $('csvPreview').querySelector('thead');
const body = $('csvPreview').querySelector('tbody');
head.innerHTML = '<tr>' + this.headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
body.innerHTML = this.rows.slice(0,20).map(r =>
`<tr>${this.headers.map(h => `<td>${(r[h]||'')}</td>`).join('')}</tr>`
).join('');
$('csvPreviewWrap').style.display = 'block';
},

async generateAll(){
if (!this.rows.length) return;
$('generateBulkBtn').disabled = true;
$('downloadResultsBtn').disabled = true;
$('bulkStatus').textContent = `Generating ${this.rows.length} messages…`;

```
try {
  // Send to server to avoid client-side rate juggling
  const res = await fetch('/api/generate-bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows: this.rows })
  });
  const data = await res.json();
  if (!data || !Array.isArray(data.results)) throw new Error('Bad response');
  this.results = data.results;
  this.renderResults();
  $('bulkStatus').textContent = `Done. Generated ${this.results.length} messages.`;
  $('downloadResultsBtn').disabled = false;
  $('clearBulkBtn').disabled = false;
} catch (err) {
  $('bulkStatus').textContent = 'Error during bulk generation. Try again.';
} finally {
  $('generateBulkBtn').disabled = false;
}
```

},

renderResults(){
const wrap = $('bulkTableWrap');
const body = $('bulkTable').querySelector('tbody');
$('bulkCount').textContent = `${this.results.length} results`;
body.innerHTML = this.results.map((r, i) => `       <tr>         <td>${i+1}</td>         <td>${r.name || ''}</td>         <td>${r.company || ''}</td>         <td>${r.email || ''}</td>         <td>${(r.message || '').replace(/\n/g,'<br>')}</td>       </tr>
    `).join('');
wrap.style.display = this.results.length ? 'block' : 'none';
},

downloadTemplate(){
const headers = ['name','company','title','email','notes','industry','goals','messageType'];
const sample = [
headers,
['Jordan Patel','Northwind Robotics','COO','[jordan.patel@example.com](mailto:jordan.patel@example.com)','Evaluating automation in packaging','Manufacturing','Intro call about deploying robotics in packaging','email']
];
const blob = new Blob([toCSV(sample)], { type:'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'gridforge_template.csv'; a.click();
URL.revokeObjectURL(url);
},

downloadResults(){
if (!this.results.length) return;
const headers = ['name','company','title','email','message'];
const rows = [headers, ...this.results.map(r => headers.map(h => r[h] ?? ''))];
const blob = new Blob([toCSV(rows)], { type:'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'gridforge_results.csv'; a.click();
URL.revokeObjectURL(url);
},

clear(){
this.rows = []; this.headers = []; this.results = [];
$('csvFile').value = '';
$('csvPreviewWrap').style.display = 'none';
$('bulkTableWrap').style.display = 'none';
$('bulkCount').textContent = 'No results yet.';
$('bulkStatus').textContent = '';
$('generateBulkBtn').disabled = true;
$('downloadResultsBtn').disabled = true;
$('clearBulkBtn').disabled = true;
}
};

/* Init */
single.init();
bulk.init();
