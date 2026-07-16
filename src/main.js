import * as pdfjsLib from
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";

/* =========================
   PDFs (EDICIONES)
========================= */
const pdfs = [
  { title: "Edición 2026", file: "src/revistas/revista-2026.pdf" }
];

let currentPDF = 0;
let currentPage = 1;
let pdfDoc = null;

const canvas = document.getElementById("pdf-canvas");
const ctx = canvas.getContext("2d");

/* =========================
   LOAD PDF
========================= */
async function loadPDF(index) {
  pdfDoc = await pdfjsLib.getDocument(pdfs[index].file).promise;
  currentPage = 1;
  renderPage();
}

/* =========================
   RENDER ONE PAGE
========================= */
async function renderPage() {
  const page = await pdfDoc.getPage(currentPage);
  const viewport = page.getViewport({ scale: 1 });

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: ctx,
    viewport
  }).promise;
}

/* =========================
   PAGE NAVIGATION (BOTONES CHICOS)
========================= */
function nextPage() {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
}

/* =========================
   EDITION NAVIGATION (FLECHAS GRANDES)
========================= */
function nextPDF() {
  currentPDF = (currentPDF + 1) % pdfs.length;
  loadPDF(currentPDF);
}

function prevPDF() {
  currentPDF = (currentPDF - 1 + pdfs.length) % pdfs.length;
  loadPDF(currentPDF);
}

/* =========================
   INIT
========================= */
loadPDF(currentPDF);

/* =========================
   EXPOSE TO HTML
========================= */
window.nextPDF = nextPDF;
window.prevPDF = prevPDF;
window.nextPage = nextPage;
window.prevPage = prevPage;
