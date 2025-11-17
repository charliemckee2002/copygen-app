// generate.js
// Fully rewritten for stability, clarity, and real production use.

import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { PDFDocument, StandardFonts } from "pdf-lib";

// ensure working dirs exist
const OUTPUT_DIR = path.join(process.cwd(), "output");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

/**
 * Generates a single PDF with given text content.
 */
async function generatePDF(content, filename) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // letter size
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  const fontSize = 14;
  const margin = 50;

  page.drawText(content, {
    x: margin,
    y: page.getHeight() - margin,
    size: fontSize,
    font,
    lineHeight: 16,
    maxWidth: page.getWidth() - margin * 2
  });

  const pdfBytes = await pdf.save();
  const filePath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}

/**
 * Generates many PDFs based on array of { title, body }
 */
async function generateAllPDFs(items) {
  const created = [];

  for (const item of items) {
    const filename = `${item.title.replace(/[^a-z0-9]/gi, "_")}.pdf`;
    const content = `${item.title}\n\n${item.body}`;
    const fp = await generatePDF(content, filename);
    created.push(fp);
  }

  return created;
}

/**
 * Packages all given files into a ZIP archive.
 */
async function packageZip(files, zipName = "bundle.zip") {
  const zip = new JSZip();

  for (const filePath of files) {
    const fileData = fs.readFileSync(filePath);
    const name = path.basename(filePath);
    zip.file(name, fileData);
  }

  const zipContent = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const zipPath = path.join(OUTPUT_DIR, zipName);

  fs.writeFileSync(zipPath, zipContent);

  return zipPath;
}

/**
 * Main callable function
 * Example input:
 * [
 *   { title: "Planner 1", body: "This is planner text" },
 *   { title: "Checklist", body: "Checklist content" }
 * ]
 */
export async function generatePackage(items, zipName = "package.zip") {
  try {
    console.log("Generating PDFs...");
    const pdfPaths = await generateAllPDFs(items);

    console.log("Creating ZIP...");
    const zipPath = await packageZip(pdfPaths, zipName);

    return {
      success: true,
      pdfs: pdfPaths,
      zip: zipPath
    };
  } catch (err) {
    console.error("Generation error:", err);
    return { success: false, error: err.message };
  }
}

// CLI usage support
if (process.argv[2] === "--demo") {
  (async () => {
    const sampleItems = Array.from({ length: 15 }, (_, i) => ({
      title: `PDF_${i + 1}`,
      body: `This is automatically generated body text for PDF ${i + 1}.`
    }));

    const result = await generatePackage(sampleItems, "demo_bundle.zip");
    console.log(result);
  })();
}
