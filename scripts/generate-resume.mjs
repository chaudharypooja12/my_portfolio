import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(
  await readFile(path.join(root, "src", "data", "portfolio.json"), "utf8"),
);

const pdf = await PDFDocument.create();
pdf.setTitle(`${data.profile.name} Resume`);
pdf.setAuthor(data.profile.name);
pdf.setSubject("Professional resume");
pdf.setKeywords(["Computer Science Teacher", "Full-Stack Developer", "Next.js"]);
pdf.setCreator("Pooja Portfolio resume generator");

const regular = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
const pageWidth = 612;
const pageHeight = 792;
const margin = 48;
const contentWidth = pageWidth - margin * 2;
const ink = rgb(0.11, 0.14, 0.2);
const muted = rgb(0.31, 0.35, 0.42);
const accent = rgb(0.31, 0.2, 0.62);
const rule = rgb(0.82, 0.83, 0.87);
const pages = [];
let page;
let y;

function addPage() {
  page = pdf.addPage([pageWidth, pageHeight]);
  pages.push(page);
  y = pageHeight - margin;
}

function width(text, font, size) {
  return font.widthOfTextAtSize(text, size);
}

function wrap(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (width(candidate, font, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function ensureSpace(height) {
  if (y - height < margin + 18) addPage();
}

function drawLines(lines, options = {}) {
  const {
    font = regular,
    size = 9.5,
    color = ink,
    x = margin,
    maxWidth = contentWidth,
    lineHeight = size + 3,
    gapAfter = 0,
  } = options;

  const wrapped = lines.flatMap((line) => wrap(line, font, size, maxWidth));
  ensureSpace(wrapped.length * lineHeight + gapAfter);
  for (const line of wrapped) {
    page.drawText(line, { x, y, font, size, color });
    y -= lineHeight;
  }
  y -= gapAfter;
}

function section(title) {
  ensureSpace(34);
  y -= 7;
  page.drawText(title.toUpperCase(), {
    x: margin,
    y,
    font: bold,
    size: 10.5,
    color: accent,
  });
  y -= 6;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 0.8,
    color: rule,
  });
  y -= 15;
}

function role(entry) {
  ensureSpace(58);
  page.drawText(entry.role, { x: margin, y, font: bold, size: 10.2, color: ink });
  const dateWidth = width(entry.date, regular, 8.8);
  page.drawText(entry.date, {
    x: pageWidth - margin - dateWidth,
    y,
    font: regular,
    size: 8.8,
    color: muted,
  });
  y -= 13;
  page.drawText(entry.company, { x: margin, y, font: regular, size: 9.3, color: muted });
  y -= 14;
  for (const item of entry.responsibilities) {
    const lines = wrap(item, regular, 9, contentWidth - 15);
    ensureSpace(lines.length * 11.5);
    page.drawText("-", { x: margin + 2, y, font: bold, size: 9, color: accent });
    for (const [index, line] of lines.entries()) {
      page.drawText(line, {
        x: margin + 14,
        y: y - index * 11.5,
        font: regular,
        size: 9,
        color: ink,
      });
    }
    y -= lines.length * 11.5 + 2;
  }
  y -= 4;
}

function project(entry) {
  ensureSpace(48);
  page.drawText(entry.title, { x: margin, y, font: bold, size: 10, color: ink });
  y -= 13;
  drawLines([entry.description], { size: 9, lineHeight: 11.5, gapAfter: 2 });
  drawLines([`Technologies: ${entry.tags.join(", ")}`], {
    size: 8.5,
    color: muted,
    lineHeight: 10.5,
    gapAfter: 7,
  });
}

addPage();
page.drawText(data.profile.name, {
  x: margin,
  y,
  font: bold,
  size: 23,
  color: ink,
});
y -= 25;
page.drawText(data.profile.title, {
  x: margin,
  y,
  font: bold,
  size: 11,
  color: accent,
});
y -= 18;
drawLines(
  [`${data.profile.email}  |  ${data.profile.linkedin}  |  ${data.profile.github}`],
  { size: 8.5, color: muted, lineHeight: 10.5, gapAfter: 2 },
);

section("Professional Summary");
drawLines([data.profile.summary], { size: 9.4, lineHeight: 12.2, gapAfter: 1 });

section("Professional Experience");
for (const entry of data.experience) role(entry);

section("Technical Skills");
for (const skill of data.skills) {
  drawLines([`${skill.category}: ${skill.items.join(", ")}`], {
    size: 9,
    lineHeight: 11.5,
    gapAfter: 2,
  });
}

addPage();
section("Selected Projects");
for (const projectEntry of data.projects.filter((entry) =>
  ["portfolio", "attendance", "banking", "tic-tac-toe", "snake", "spaceship"].includes(entry.id),
)) {
  project(projectEntry);
}

section("Education");
for (const entry of data.education) {
  ensureSpace(34);
  page.drawText(entry.degree, { x: margin, y, font: bold, size: 9.6, color: ink });
  const dateWidth = width(entry.date, regular, 8.5);
  page.drawText(entry.date, {
    x: pageWidth - margin - dateWidth,
    y,
    font: regular,
    size: 8.5,
    color: muted,
  });
  y -= 12;
  drawLines([`${entry.institution} | ${entry.grade}`], {
    size: 8.8,
    color: muted,
    lineHeight: 10.5,
    gapAfter: 5,
  });
}

section("Certificates & Achievement");
drawLines([`Certificates: ${data.certificates.join("; ")}`], {
  size: 9,
  lineHeight: 11.5,
  gapAfter: 4,
});
drawLines([data.achievement], { size: 9, lineHeight: 11.5 });

for (const [index, resumePage] of pages.entries()) {
  const footer = `${data.profile.name} | Page ${index + 1} of ${pages.length}`;
  resumePage.drawText(footer, {
    x: pageWidth / 2 - width(footer, regular, 8) / 2,
    y: 24,
    font: regular,
    size: 8,
    color: muted,
  });
}

if (pages.length !== 2) {
  throw new Error(`Resume must contain exactly 2 pages; generated ${pages.length}.`);
}

const output = path.join(root, "public", "Pooja_Resume.pdf");
await writeFile(output, await pdf.save({ useObjectStreams: false }));
console.log(`Generated ${output} (${pages.length} pages).`);
