/**
 * Markdown to PDF conversion utility for UniversalLLM.
 * Copyright (c) Abdul Ismail
 */
async function markdownToPdf(markdown) {
  const { PDFDocument, StandardFonts } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const lines = String(markdown || "").split("\n");
  let page = doc.addPage();
  let y = 750;
  const lineHeight = 14;
  const margin = 50;
  const maxWidth = 500;

  for (const line of lines) {
    const chunks = [];
    let current = "";
    for (const word of line.split(" ")) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, 10) > maxWidth) {
        if (current) chunks.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) chunks.push(current);
    if (!chunks.length) chunks.push("");

    for (const chunk of chunks) {
      if (y < margin) {
        page = doc.addPage();
        y = 750;
      }
      page.drawText(chunk, { x: margin, y, size: 10, font });
      y -= lineHeight;
    }
  }

  return await doc.save();
}

module.exports = { markdownToPdf };
