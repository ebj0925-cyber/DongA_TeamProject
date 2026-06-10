import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, 'output', 'ppt');
const tmpRoot = path.join(outDir, '_planning_portfolio_tmp');

const EMU = 914400;
const W = 13.333333;
const H = 7.5;

const C = {
  bg: '#F7FAFF',
  navy: '#071B4D',
  blue: '#245BDB',
  blue2: '#3D6FE8',
  soft: '#EEF4FF',
  soft2: '#F4F8FF',
  border: '#C9D7F2',
  text: '#17213A',
  muted: '#5B6680',
  white: '#FFFFFF',
};

const img = (name) => path.join(root, 'output', 'ppt', 'img', name);

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function rm(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function esc(v = '') {
  return String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function emu(v) {
  return Math.round(v * EMU);
}

function hex(v) {
  return String(v).replace('#', '').toUpperCase();
}

function runs(lines, opts = {}) {
  const arr = Array.isArray(lines) ? lines : [lines ?? ''];
  const size = Math.round((opts.size ?? 16) * 100);
  const color = hex(opts.color ?? C.text);
  const font = opts.font ?? 'Malgun Gothic';
  const bold = opts.bold ? '<a:b/>' : '';
  const bullet = opts.bullet ? '<a:buChar char="•"/>' : '<a:buNone/>';
  return arr.map((line) => `
        <a:p>
          <a:pPr marL="${opts.bullet ? 205740 : 0}" indent="${opts.bullet ? -137160 : 0}" algn="${opts.align ?? 'l'}">${bullet}</a:pPr>
          <a:r>
            <a:rPr lang="ko-KR" sz="${size}" dirty="0">${bold}<a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="${font}"/><a:ea typeface="${font}"/></a:rPr>
            <a:t>${esc(line)}</a:t>
          </a:r>
        </a:p>`).join('');
}

function shapeXml(id, s) {
  const geom = s.geom ?? (s.round ? 'roundRect' : 'rect');
  const fill = s.fill
    ? `<a:solidFill><a:srgbClr val="${hex(s.fill)}"><a:alpha val="${Math.round((s.alpha ?? 1) * 100000)}"/></a:srgbClr></a:solidFill>`
    : '<a:noFill/>';
  const line = s.line
    ? `<a:ln w="${Math.round((s.lineWidth ?? 1) * 12700)}"><a:solidFill><a:srgbClr val="${hex(s.line)}"/></a:solidFill></a:ln>`
    : '<a:ln><a:noFill/></a:ln>';
  return `
      <p:sp>
        <p:nvSpPr><p:cNvPr id="${id}" name="Shape ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="${emu(s.x)}" y="${emu(s.y)}"/><a:ext cx="${emu(s.w)}" cy="${emu(s.h)}"/></a:xfrm>
          <a:prstGeom prst="${geom}"><a:avLst/></a:prstGeom>
          ${fill}
          ${line}
        </p:spPr>
        <p:txBody>
          <a:bodyPr wrap="square" lIns="${emu(s.padX ?? 0.1)}" tIns="${emu(s.padY ?? 0.05)}" rIns="${emu(s.padX ?? 0.1)}" bIns="${emu(s.padY ?? 0.05)}" anchor="${s.valign ?? 'mid'}"/>
          <a:lstStyle/>
          ${runs(s.text, s)}
        </p:txBody>
      </p:sp>`;
}

function imageXml(id, im) {
  return `
      <p:pic>
        <p:nvPicPr><p:cNvPr id="${id}" name="Picture ${id}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr>
        <p:blipFill><a:blip r:embed="${im.relId}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
        <p:spPr>
          <a:xfrm><a:off x="${emu(im.x)}" y="${emu(im.y)}"/><a:ext cx="${emu(im.w)}" cy="${emu(im.h)}"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          ${im.line ? `<a:ln w="${Math.round((im.lineWidth ?? 1) * 12700)}"><a:solidFill><a:srgbClr val="${hex(im.line)}"/></a:solidFill></a:ln>` : '<a:ln><a:noFill/></a:ln>'}
        </p:spPr>
      </p:pic>`;
}

function arrowXml(id, a) {
  return `
      <p:cxnSp>
        <p:nvCxnSpPr><p:cNvPr id="${id}" name="Arrow ${id}"/><p:cNvCxnSpPr/><p:nvPr/></p:nvCxnSpPr>
        <p:spPr>
          <a:xfrm><a:off x="${emu(a.x)}" y="${emu(a.y)}"/><a:ext cx="${emu(a.w)}" cy="${emu(a.h)}"/></a:xfrm>
          <a:prstGeom prst="line"><a:avLst/></a:prstGeom>
          <a:ln w="${Math.round((a.lineWidth ?? 2.2) * 12700)}">
            <a:solidFill><a:srgbClr val="${hex(a.color ?? C.blue)}"/></a:solidFill>
            <a:tailEnd type="triangle"/>
          </a:ln>
        </p:spPr>
      </p:cxnSp>`;
}

function header(slideNo, title) {
  return [
    { x: 1.0, y: 0.14, w: 0.6, h: 0.58, text: String(slideNo).padStart(2, '0'), size: 20, bold: true, color: C.white, fill: C.navy, line: null, align: 'c', padX: 0, padY: 0 },
    { x: 1.86, y: 0.21, w: 6.4, h: 0.42, text: title, size: 24, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
    { x: 9.08, y: 0.28, w: 3.25, h: 0.26, text: '기획·스토리보드·연출·기능 설계 포트폴리오', size: 9.5, color: C.muted, fill: null, line: null, align: 'r', padX: 0, padY: 0 },
  ];
}

function card(x, y, w, title, body, icon) {
  return [
    { x, y, w, h: 1.58, text: '', fill: C.white, line: C.border, round: true },
    { x: x + 0.16, y: y + 0.2, w: 0.55, h: 0.55, text: icon, size: 17, bold: true, color: C.blue, fill: C.soft, line: null, geom: 'ellipse', align: 'c', padX: 0, padY: 0 },
    { x: x + 0.82, y: y + 0.21, w: w - 1.0, h: 0.3, text: title, size: 13.5, bold: true, color: C.blue, fill: null, line: null, padX: 0, padY: 0 },
    { x: x + 0.82, y: y + 0.62, w: w - 1.0, h: 0.58, text: body, size: 10.5, color: C.text, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
  ];
}

function keywordStrip(items) {
  const shapes = [
    { x: 1.28, y: 5.25, w: 10.8, h: 1.02, text: '', fill: C.white, line: C.border, round: true },
    { x: 1.46, y: 5.42, w: 1.1, h: 0.23, text: '핵심 키워드', size: 10.2, bold: true, color: C.blue, fill: null, line: null, padX: 0, padY: 0 },
  ];
  const start = 2.25;
  const gap = 1.92;
  items.forEach((item, i) => {
    shapes.push({ x: start + gap * i, y: 5.57, w: 0.4, h: 0.4, text: item.icon, size: 13, bold: true, color: C.blue, fill: C.soft, line: null, geom: 'ellipse', align: 'c', padX: 0, padY: 0 });
    shapes.push({ x: start + gap * i + 0.5, y: 5.48, w: 1.15, h: 0.24, text: item.title, size: 9.8, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 });
    shapes.push({ x: start + gap * i + 0.5, y: 5.79, w: 1.25, h: 0.28, text: item.body, size: 7.6, color: C.text, fill: null, line: null, padX: 0, padY: 0 });
    if (i < items.length - 1) shapes.push({ x: start + gap * i + 1.75, y: 5.48, w: 0.01, h: 0.47, text: '', fill: C.border, line: null });
  });
  return shapes;
}

function goalBox(label, text) {
  return [
    { x: 1.28, y: 6.48, w: 10.8, h: 0.67, text: '', fill: C.white, line: C.border, round: true },
    { x: 1.55, y: 6.6, w: 0.42, h: 0.42, text: '◎', size: 16, bold: true, color: C.blue, fill: null, line: null, align: 'c', padX: 0, padY: 0 },
    { x: 2.33, y: 6.59, w: 0.82, h: 0.24, text: label, size: 10.5, bold: true, color: C.blue, fill: null, line: null, padX: 0, padY: 0 },
    { x: 3.32, y: 6.57, w: 7.9, h: 0.32, text, size: 10.8, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
  ];
}

function slideXml(slide) {
  let id = 2;
  const items = [];
  items.push(shapeXml(id++, { x: 0, y: 0, w: W, h: H, text: '', fill: slide.bg ?? C.bg, line: null }));
  items.push(shapeXml(id++, { x: 8.65, y: 0, w: 4.68, h: 7.5, text: '', fill: '#EEF5FF', line: null, alpha: 0.72 }));
  items.push(shapeXml(id++, { x: 0.82, y: 1.02, w: 1.02, h: 0.025, text: '', fill: C.blue, line: null }));
  for (const s of slide.shapes ?? []) items.push(shapeXml(id++, s));
  for (const im of slide.images ?? []) if (im.relId) items.push(imageXml(id++, im));
  for (const a of slide.arrows ?? []) items.push(arrowXml(id++, a));
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:bg><p:bgPr><a:solidFill><a:srgbClr val="${hex(slide.bg ?? C.bg)}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      ${items.join('\n')}
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

function writeBase(dir, slides) {
  for (const d of [
    '_rels', 'docProps', 'ppt/_rels', 'ppt/slides/_rels', 'ppt/slides',
    'ppt/slideMasters/_rels', 'ppt/slideMasters', 'ppt/slideLayouts/_rels',
    'ppt/slideLayouts', 'ppt/media', 'ppt/theme',
  ]) ensureDir(path.join(dir, d));

  let mediaIndex = 1;
  slides.forEach((slide) => {
    (slide.images ?? []).forEach((im, imageIndex) => {
      if (!fs.existsSync(im.path)) {
        im.relId = null;
        return;
      }
      const ext = path.extname(im.path).toLowerCase() || '.png';
      const mediaName = `image${mediaIndex}${ext}`;
      fs.copyFileSync(im.path, path.join(dir, 'ppt', 'media', mediaName));
      im.relId = `rId${imageIndex + 2}`;
      im.target = `../media/${mediaName}`;
      mediaIndex += 1;
    });
  });

  const slideOverrides = slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join('');
  fs.writeFileSync(path.join(dir, '[Content_Types].xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>
  <Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>
  <Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  ${slideOverrides}
</Types>`);

  fs.writeFileSync(path.join(dir, '_rels', '.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`);
  fs.writeFileSync(path.join(dir, 'docProps', 'core.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Planning Portfolio Deck</dc:title><dc:creator>Codex</dc:creator><cp:lastModifiedBy>Codex</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-05-26T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-05-26T00:00:00Z</dcterms:modified></cp:coreProperties>`);
  fs.writeFileSync(path.join(dir, 'docProps', 'app.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Codex PPTX Generator</Application><PresentationFormat>Widescreen</PresentationFormat><Slides>${slides.length}</Slides></Properties>`);

  const slideIds = slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}"/>`).join('');
  fs.writeFileSync(path.join(dir, 'ppt', 'presentation.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>${slideIds}</p:sldIdLst><p:sldSz cx="${emu(W)}" cy="${emu(H)}" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  fs.writeFileSync(path.join(dir, 'ppt', '_rels', 'presentation.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>${slides.map((_, i) => `<Relationship Id="rId${i + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join('')}</Relationships>`);
  fs.writeFileSync(path.join(dir, 'ppt', 'slideMasters', 'slideMaster1.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  fs.writeFileSync(path.join(dir, 'ppt', 'slideMasters', '_rels', 'slideMaster1.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  fs.writeFileSync(path.join(dir, 'ppt', 'slideLayouts', 'slideLayout1.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  fs.writeFileSync(path.join(dir, 'ppt', 'slideLayouts', '_rels', 'slideLayout1.xml.rels'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  fs.writeFileSync(path.join(dir, 'ppt', 'theme', 'theme1.xml'), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="PlanningPortfolio"><a:themeElements><a:clrScheme name="Portfolio"><a:dk1><a:srgbClr val="071B4D"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="17213A"/></a:dk2><a:lt2><a:srgbClr val="F7FAFF"/></a:lt2><a:accent1><a:srgbClr val="245BDB"/></a:accent1><a:accent2><a:srgbClr val="EEF4FF"/></a:accent2><a:accent3><a:srgbClr val="C9D7F2"/></a:accent3><a:accent4><a:srgbClr val="3D6FE8"/></a:accent4><a:accent5><a:srgbClr val="5B6680"/></a:accent5><a:accent6><a:srgbClr val="071B4D"/></a:accent6><a:hlink><a:srgbClr val="245BDB"/></a:hlink><a:folHlink><a:srgbClr val="245BDB"/></a:folHlink></a:clrScheme><a:fontScheme name="Malgun"><a:majorFont><a:latin typeface="Malgun Gothic"/><a:ea typeface="Malgun Gothic"/></a:majorFont><a:minorFont><a:latin typeface="Malgun Gothic"/><a:ea typeface="Malgun Gothic"/></a:minorFont></a:fontScheme><a:fmtScheme name="Default"><a:fillStyleLst/><a:lnStyleLst/><a:effectStyleLst/><a:bgFillStyleLst/></a:fmtScheme></a:themeElements></a:theme>`);

  slides.forEach((slide, i) => {
    fs.writeFileSync(path.join(dir, 'ppt', 'slides', `slide${i + 1}.xml`), slideXml(slide));
    const imageRels = (slide.images ?? []).filter((im) => im.relId && im.target).map((im) => `<Relationship Id="${im.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${im.target}"/>`).join('');
    fs.writeFileSync(path.join(dir, 'ppt', 'slides', '_rels', `slide${i + 1}.xml.rels`), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>${imageRels}</Relationships>`);
  });
}

function makeDeck(slides, fileName) {
  ensureDir(outDir);
  rm(tmpRoot);
  ensureDir(tmpRoot);
  const dir = path.join(tmpRoot, fileName.replace(/\.pptx$/i, ''));
  ensureDir(dir);
  writeBase(dir, slides);
  const pptx = path.join(outDir, fileName);
  const zip = pptx.replace(/\.pptx$/i, '.zip');
  if (fs.existsSync(pptx)) fs.rmSync(pptx, { force: true });
  if (fs.existsSync(zip)) fs.rmSync(zip, { force: true });
  execFileSync('powershell', ['-NoProfile', '-Command', `Compress-Archive -Path "${dir}\\*" -DestinationPath "${zip}" -Force; Move-Item -Path "${zip}" -Destination "${pptx}" -Force`], { stdio: 'inherit' });
  rm(tmpRoot);
  return pptx;
}

const commonKeywords = [
  { icon: 'P', title: '기획', body: '경험 목표 정의' },
  { icon: 'U', title: 'UX 흐름', body: 'Step 구조 설계' },
  { icon: 'S', title: '스토리보드', body: '장면 전환 기준' },
  { icon: 'F', title: '기능 설계', body: 'API·DB 연결' },
  { icon: 'I', title: '인터랙션', body: '3D·통계·메시지' },
];

const slides = [
  {
    shapes: [
      ...header(1, '프로젝트 소개'),
      { x: 1.24, y: 1.15, w: 5.55, h: 0.92, text: ['AI 기반 인터랙티브', '고립감 설문/분석 플랫폼'], size: 27, bold: true, color: C.navy, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
      { x: 1.24, y: 2.56, w: 5.2, h: 0.52, text: '설문 참여부터 AI 분석, 개인 맞춤 결과, 통계/채팅/3D 체험까지 사용자 경험을 연결하는 통합 플랫폼', size: 11.8, color: C.text, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
      ...card(1.22, 3.48, 1.78, '설문', '객관식/주관식으로 고립감 데이터 수집', '01'),
      ...card(3.62, 3.48, 1.78, 'AI 분석', '점수 산출과 주관식 응답 분석', '02'),
      ...card(6.02, 3.48, 1.78, '개인 결과', '맞춤형 리포트와 피드백 제공', '03'),
      ...card(8.42, 3.48, 2.45, '통계·채팅·3D', '분석, 소통, 몰입형 체험으로 확장', '04'),
      ...keywordStrip(commonKeywords),
      ...goalBox('목표', '고립감이라는 추상적 주제를 하나의 인터랙티브 서비스 경험으로 구조화'),
    ],
    images: [{ path: img('screen_01_step2_3d_intro.png'), x: 8.6, y: 0.92, w: 3.18, h: 2.23, line: C.border }],
    arrows: [
      { x: 3.0, y: 4.27, w: 0.42, h: 0 },
      { x: 5.4, y: 4.27, w: 0.42, h: 0 },
      { x: 7.8, y: 4.27, w: 0.42, h: 0 },
    ],
  },
  {
    shapes: [
      ...header(2, '내 담당 역할'),
      { x: 1.24, y: 1.18, w: 5.6, h: 0.88, text: ['전체 기획과 연출을', '기능 구조로 연결'], size: 27, bold: true, color: C.navy, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
      { x: 1.24, y: 2.52, w: 5.42, h: 0.5, text: '프로젝트의 감정 흐름과 화면 구조를 먼저 설계하고, 개발 단계에서 구현 가능한 기능 단위로 정리했습니다.', size: 11.7, color: C.text, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
      ...card(1.24, 3.42, 2.28, '경험 기획', '고립에서 연결로 이어지는 사용자 여정 정의', 'P'),
      ...card(3.9, 3.42, 2.28, '스토리보드', '장면 목적, 화면 전환, 인터랙션 기준 설계', 'S'),
      ...card(6.56, 3.42, 2.28, '연출 방향', '해저 공간, 사운드, 스크롤 몰입감 기획', 'D'),
      ...card(9.22, 3.42, 2.28, '기능 설계', '설문, 결과, 통계, 메시지 기능 흐름 정의', 'F'),
      ...keywordStrip([
        { icon: '1', title: '주제 정의', body: '고립과 연결' },
        { icon: '2', title: '화면 흐름', body: 'Step1-3 설계' },
        { icon: '3', title: '서사 구조', body: '감정 변화' },
        { icon: '4', title: '데이터 연결', body: '결과·통계' },
        { icon: '5', title: '협업 기준', body: '구현 문서화' },
      ]),
      ...goalBox('역할', '단순 화면 기획이 아니라 서비스 경험과 기능 구조를 함께 설계'),
    ],
    images: [{ path: img('screen_03_step3_main_menu.png'), x: 8.78, y: 0.9, w: 2.98, h: 2.18, line: C.border }],
  },
  {
    shapes: [
      ...header(3, '기획 의도'),
      { x: 1.24, y: 1.22, w: 5.8, h: 0.72, text: '설문을 하나의 경험으로 만들기', size: 26, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.12, w: 5.25, h: 0.58, text: '고립감은 점수만으로 전달되기 어렵기 때문에, 응답 이후에도 체험과 메시지로 감정적 연결이 이어지도록 설계했습니다.', size: 11.7, color: C.text, fill: null, line: null, valign: 'top', padX: 0, padY: 0 },
      { x: 1.24, y: 3.12, w: 2.75, h: 1.4, text: ['Before', '일회성 설문과 결과 확인에 그치는 구조'], size: 15, bold: true, color: C.navy, fill: C.white, line: C.border, round: true, valign: 'top' },
      { x: 4.42, y: 3.12, w: 2.75, h: 1.4, text: ['After', '설문, 3D 체험, 결과, 통계, 메시지가 연결된 구조'], size: 15, bold: true, color: C.blue, fill: C.soft, line: C.border, round: true, valign: 'top' },
      ...card(7.62, 3.12, 1.62, '몰입', '고립감을 공간으로 체험', 'M'),
      ...card(9.52, 3.12, 1.62, '인식', '개인 결과로 상태 확인', 'R'),
      ...keywordStrip(commonKeywords),
      ...goalBox('의도', '기능을 나열하지 않고 감정 흐름 안에서 필요한 순간에 배치'),
    ],
    images: [{ path: img('screen_02_step2_3d_scroll.png'), x: 8.3, y: 0.92, w: 3.48, h: 1.95, line: C.border }],
    arrows: [{ x: 3.98, y: 3.82, w: 0.42, h: 0 }],
  },
  {
    shapes: [
      ...header(4, '사용자 여정 설계'),
      { x: 1.24, y: 1.16, w: 5.9, h: 0.62, text: 'Step1 → Step2 → Step3 구조', size: 26, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.4, h: 0.43, text: '사용자가 데이터를 입력하는 순간부터 결과를 받아들이고, 다른 참여자와 연결되는 흐름을 설계했습니다.', size: 11.5, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.0, 2.25, 'Step1 설문', '감정과 상황 데이터를 수집하는 진입 단계', '01'),
      ...card(4.05, 3.0, 2.25, 'Step2 체험', '해저 공간을 지나며 고립감을 시각적으로 경험', '02'),
      ...card(6.86, 3.0, 2.25, 'Step3 결과', '개인 리포트, 통계, 메시지로 연결', '03'),
      ...card(9.67, 3.0, 2.25, '회복 경험', '나와 타인의 응답을 통해 공감과 인사이트 제공', '04'),
      ...keywordStrip([
        { icon: 'A', title: '입력', body: '설문 응답' },
        { icon: 'B', title: '몰입', body: '3D 공간' },
        { icon: 'C', title: '분석', body: 'AI 결과' },
        { icon: 'D', title: '비교', body: '전체 통계' },
        { icon: 'E', title: '소통', body: '메시지' },
      ]),
      ...goalBox('설계', '각 단계가 독립 기능이 아니라 하나의 사용자 여정으로 느껴지도록 구성'),
    ],
    images: [{ path: img('screen_05_step3_personal_result.png'), x: 8.72, y: 0.92, w: 3.02, h: 1.9, line: C.border }],
    arrows: [
      { x: 3.49, y: 3.79, w: 0.46, h: 0 },
      { x: 6.3, y: 3.79, w: 0.46, h: 0 },
      { x: 9.11, y: 3.79, w: 0.46, h: 0 },
    ],
  },
  {
    shapes: [
      ...header(5, '스토리보드 및 장면 연출'),
      { x: 1.24, y: 1.14, w: 5.9, h: 0.72, text: '감정 변화를 장면 단위로 설계', size: 26, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.38, h: 0.45, text: '질문, 전환, 사운드, 스크롤, 결과 표시 타이밍을 장면별로 정리해 구현 기준으로 삼았습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 2.92, 2.28, '도입', '사용자 정보와 설문 진입 맥락 설정', 'A'),
      ...card(3.88, 2.92, 2.28, '침잠', '어두운 해저 공간과 낮은 밀도의 움직임', 'B'),
      ...card(6.52, 2.92, 2.28, '전환', '체험 종료 후 결과 화면으로 이동', 'C'),
      ...card(9.16, 2.92, 2.28, '연결', '통계와 메시지로 타인의 존재를 확인', 'D'),
      ...keywordStrip([
        { icon: 'T', title: '톤', body: '차분한 긴장감' },
        { icon: 'L', title: '빛', body: '어둠 속 강조' },
        { icon: 'S', title: '사운드', body: '몰입 보조' },
        { icon: 'M', title: '모션', body: '스크롤 반응' },
        { icon: 'R', title: '결과', body: '회복 전환' },
      ]),
      ...goalBox('연출', '감정적 장면 연출이 실제 기능 이동과 어긋나지 않도록 흐름을 정리'),
    ],
    images: [{ path: img('screen_01_step2_3d_intro.png'), x: 8.6, y: 0.92, w: 3.18, h: 1.82, line: C.border }],
  },
  {
    shapes: [
      ...header(6, '콘텐츠 구조 설계'),
      { x: 1.24, y: 1.15, w: 5.9, h: 0.65, text: '설문 데이터가 결과와 통계로 이어지는 구조', size: 24.5, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.5, h: 0.43, text: '문항, 선택지, 주관식 응답, 감정 분류, 결과 제공 방식을 하나의 정보 구조로 정리했습니다.', size: 11.5, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.02, 2.18, '문항 메타데이터', '장면별 질문과 입력 유형 관리', 'Q'),
      ...card(3.86, 3.02, 2.18, '응답 데이터', '참여자별 선택지와 주관식 저장', 'A'),
      ...card(6.48, 3.02, 2.18, '개인 결과', '점수와 AI 분석 결과 연결', 'R'),
      ...card(9.1, 3.02, 2.18, '전체 통계', '세대, 성별, 문항별 분포 계산', 'G'),
      ...keywordStrip([
        { icon: 'DB', title: 'DB', body: '관계 설계' },
        { icon: 'API', title: 'API', body: '조회 단위' },
        { icon: 'AI', title: 'AI', body: '분석 필드' },
        { icon: 'UX', title: 'UX', body: '결과 표현' },
        { icon: 'ST', title: '통계', body: '시각화' },
      ]),
      ...goalBox('구조', '설문 응답이 단순 저장으로 끝나지 않고 서비스 화면의 근거가 되도록 설계'),
    ],
    images: [{ path: img('DB_Schema.PNG'), x: 8.45, y: 0.96, w: 3.55, h: 1.85, line: C.border }],
  },
  {
    shapes: [
      ...header(7, '기능 구조 설계'),
      { x: 1.24, y: 1.16, w: 5.95, h: 0.68, text: '기획 흐름을 API·DB·AI 파이프라인으로 전환', size: 24.3, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.55, h: 0.43, text: '프론트 화면에서 필요한 데이터를 기준으로 백엔드 API와 DB 조회 단위를 나누었습니다.', size: 11.5, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 2.98, 2.12, 'React 화면', 'Step별 사용자 인터페이스와 모달', 'FE'),
      ...card(3.74, 2.98, 2.12, 'Express API', '결과, 통계, 장면, 메시지 라우팅', 'API'),
      ...card(6.24, 2.98, 2.12, 'MySQL', '참여자, 응답, 장면, 메시지 저장', 'DB'),
      ...card(8.74, 2.98, 2.12, 'OpenAI/RAG', '결과 분석과 메시지 검수 보조', 'AI'),
      ...keywordStrip([
        { icon: '1', title: '저장', body: '설문 응답' },
        { icon: '2', title: '조회', body: '개인 결과' },
        { icon: '3', title: '집계', body: '전체 통계' },
        { icon: '4', title: '검수', body: '메시지' },
        { icon: '5', title: '표현', body: '3D·그래프' },
      ]),
      ...goalBox('기능', '사용자 화면에서 필요한 경험을 기준으로 기능 단위를 역설계'),
    ],
    images: [{ path: img('05_statistics_payload_graph_summary.png'), x: 8.6, y: 0.92, w: 3.25, h: 1.92, line: C.border }],
    arrows: [
      { x: 3.36, y: 3.77, w: 0.38, h: 0 },
      { x: 5.86, y: 3.77, w: 0.38, h: 0 },
      { x: 8.36, y: 3.77, w: 0.38, h: 0 },
    ],
  },
  {
    shapes: [
      ...header(8, '주요 기능 1: 설문과 개인 결과'),
      { x: 1.24, y: 1.16, w: 5.8, h: 0.68, text: '사용자 응답을 개인 리포트로 변환', size: 25, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.0, w: 5.35, h: 0.44, text: '쿠키 기반 참여자 식별을 통해 현재 사용자의 응답과 분석 결과만 불러오는 구조를 설계했습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.0, 2.45, '설문 참여', '객관식과 주관식 응답 저장', '01'),
      ...card(4.12, 3.0, 2.45, '참여자 식별', 'isolation_user_info 쿠키 기준 조회', '02'),
      ...card(7.0, 3.0, 2.45, '결과 리포트', '점수, 응답, AI 분석을 화면화', '03'),
      ...keywordStrip([
        { icon: 'ID', title: '식별', body: '쿠키 기반' },
        { icon: 'SQL', title: '조인', body: '응답 연결' },
        { icon: 'AI', title: '분석', body: '결과 문장' },
        { icon: 'UX', title: '표현', body: '개인화' },
        { icon: 'M', title: '모달', body: 'Step3 제공' },
      ]),
      ...goalBox('성과', '설문 결과가 사용자에게 다시 돌아오는 개인화 경험으로 완성'),
    ],
    images: [{ path: img('screen_05_step3_personal_result.png'), x: 8.72, y: 0.92, w: 3.0, h: 2.1, line: C.border }],
    arrows: [
      { x: 3.69, y: 3.79, w: 0.43, h: 0 },
      { x: 6.57, y: 3.79, w: 0.43, h: 0 },
    ],
  },
  {
    shapes: [
      ...header(9, '주요 기능 2: 통계와 메시지'),
      { x: 1.24, y: 1.15, w: 5.9, h: 0.68, text: '나의 결과에서 전체 참여자 맥락으로 확장', size: 24.2, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.48, h: 0.44, text: '개인 경험 이후 전체 통계와 따뜻한 메시지를 배치해 타인의 존재를 확인하는 흐름을 만들었습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.0, 2.45, '통계 시각화', '세대, 성별, 문항별 응답 분포 제공', 'ST'),
      ...card(4.12, 3.0, 2.45, '입자 연출', '참여자 수를 움직이는 입자로 표현', 'PT'),
      ...card(7.0, 3.0, 2.45, '따뜻한 메시지', '응원과 공감 메시지 작성 및 조회', 'CH'),
      ...keywordStrip([
        { icon: 'G', title: '집계', body: '응답 비율' },
        { icon: 'V', title: '시각화', body: '그래프' },
        { icon: 'P', title: '입자', body: '참여자 표현' },
        { icon: 'C', title: '채팅', body: '익명 응원' },
        { icon: 'S', title: '안전', body: '필터링' },
      ]),
      ...goalBox('확장', '개인 결과 다음에 통계와 메시지를 배치해 고립에서 연결로 전환'),
    ],
    images: [
      { path: img('screen_06_step3_stats_particles.png'), x: 8.45, y: 0.95, w: 1.58, h: 2.05, line: C.border },
      { path: img('screen_04_step3_warm_chat.png'), x: 10.18, y: 0.95, w: 1.58, h: 2.05, line: C.border },
    ],
  },
  {
    shapes: [
      ...header(10, '주요 기능 3: 3D 인터랙션'),
      { x: 1.24, y: 1.15, w: 5.8, h: 0.68, text: '고립감을 체험 가능한 공간으로 연출', size: 25, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.02, w: 5.5, h: 0.44, text: '스크롤, 시선 이동, 사운드, 전환 영상을 활용해 설문과 결과 사이에 몰입형 장면을 배치했습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.0, 2.25, '해저 공간', '어둡고 깊은 장면으로 감정 은유', '3D'),
      ...card(4.0, 3.0, 2.25, '입력 반응', '스크롤과 모바일 움직임 반영', 'IN'),
      ...card(6.76, 3.0, 2.25, '전환 연출', '체험 종료 후 Step3로 자연스럽게 이동', 'TR'),
      ...keywordStrip([
        { icon: '3D', title: '공간', body: '심해 연출' },
        { icon: 'S', title: '스크롤', body: '진행 입력' },
        { icon: 'G', title: '자이로', body: '모바일 반응' },
        { icon: 'B', title: 'BGM', body: '몰입 강화' },
        { icon: 'N', title: '전환', body: '서사 연결' },
      ]),
      ...goalBox('몰입', '설문 결과를 보기 전에 감정을 체험하게 만들어 서비스 기억점을 강화'),
    ],
    images: [
      { path: img('screen_01_step2_3d_intro.png'), x: 8.42, y: 0.95, w: 1.6, h: 2.05, line: C.border },
      { path: img('screen_02_step2_3d_scroll.png'), x: 10.18, y: 0.95, w: 1.6, h: 2.05, line: C.border },
    ],
  },
  {
    shapes: [
      ...header(11, '문제 해결 및 협업 방식'),
      { x: 1.24, y: 1.14, w: 5.9, h: 0.72, text: '추상적 기획을 구현 가능한 단위로 정리', size: 25, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.0, w: 5.35, h: 0.44, text: '감정적 표현과 실제 기능 구현 사이의 간격을 줄이기 위해 화면 목적, 데이터, 인터랙션 기준을 문서화했습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 3.0, w: 2.55, h: 1.48, text: ['문제', '고립감이라는 추상적 주제를 기능으로 설명하기 어려움'], size: 13.8, bold: true, color: C.navy, fill: C.white, line: C.border, round: true, valign: 'top' },
      { x: 4.15, y: 3.0, w: 2.55, h: 1.48, text: ['해결', 'Step별 목적과 화면 전환 기준을 스토리보드로 정리'], size: 13.8, bold: true, color: C.blue, fill: C.soft, line: C.border, round: true, valign: 'top' },
      { x: 7.06, y: 3.0, w: 2.55, h: 1.48, text: ['결과', '개발자가 API, 화면, 연출 범위를 나눠 구현 가능'], size: 13.8, bold: true, color: C.navy, fill: C.white, line: C.border, round: true, valign: 'top' },
      ...keywordStrip([
        { icon: 'B', title: '범위', body: '기능 우선순위' },
        { icon: 'W', title: '와이어', body: '화면 구조' },
        { icon: 'F', title: '흐름', body: '전환 기준' },
        { icon: 'D', title: '데이터', body: '필요 API' },
        { icon: 'Q', title: '검수', body: '시연 기준' },
      ]),
      ...goalBox('협업', '기획 문서를 실제 구현 기준으로 사용할 수 있게 구체화'),
    ],
    images: [{ path: img('20_input_feeling_grouping.png'), x: 8.5, y: 0.95, w: 3.3, h: 1.9, line: C.border }],
    arrows: [
      { x: 3.79, y: 3.74, w: 0.36, h: 0 },
      { x: 6.7, y: 3.74, w: 0.36, h: 0 },
    ],
  },
  {
    shapes: [
      ...header(12, '성과 및 배운 점'),
      { x: 1.24, y: 1.12, w: 5.85, h: 0.72, text: '기획이 실제 서비스 구조로 구현된 경험', size: 25, bold: true, color: C.navy, fill: null, line: null, padX: 0, padY: 0 },
      { x: 1.24, y: 2.0, w: 5.4, h: 0.46, text: '사용자 여정, 스토리보드, 연출 설계가 프론트 화면과 백엔드 데이터 흐름으로 이어지도록 전체 구조를 잡았습니다.', size: 11.4, color: C.text, fill: null, line: null, padX: 0, padY: 0 },
      ...card(1.24, 3.0, 2.28, '기획 역량', '주제와 사용자 경험을 기능 단위로 전환', 'P'),
      ...card(3.9, 3.0, 2.28, '연출 역량', '감정 흐름을 장면, 사운드, 모션으로 구체화', 'D'),
      ...card(6.56, 3.0, 2.28, '기능 이해', 'API, DB, AI, 3D 구조와 연결해 설계', 'F'),
      ...card(9.22, 3.0, 2.28, '협업 역량', '구현 가능한 기준과 문서로 전달', 'C'),
      ...keywordStrip(commonKeywords),
      ...goalBox('결과', '기획자 관점과 기능 설계 관점을 함께 보여주는 포트폴리오 구성'),
    ],
    images: [{ path: img('screen_07_step3_stats_question_grid.png'), x: 8.62, y: 0.92, w: 3.16, h: 1.95, line: C.border }],
  },
];

console.log(makeDeck(slides, 'planning_storyboard_portfolio.pptx'));
