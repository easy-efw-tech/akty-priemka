import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function htmlElementToPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let heightLeft = imgHeight;
  let position = 0;
  let pageNum = 0;

  while (heightLeft > 0) {
    if (pageNum > 0) doc.addPage();
    doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    position -= pageHeight;
    pageNum++;
  }

  doc.save(filename);
}

export async function renderAndExportPdf(
  renderFn: (container: HTMLElement) => Promise<void>,
  filename: string
): Promise<void> {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '0';
  container.style.left = '0';
  container.style.zIndex = '-9999';
  container.style.opacity = '0';
  container.style.pointerEvents = 'none';
  document.body.appendChild(container);

  try {
    await renderFn(container);
    await new Promise(resolve => setTimeout(resolve, 400));
    const el = container.firstElementChild as HTMLElement;
    if (!el) throw new Error('No element rendered');
    await htmlElementToPdf(el, filename);
  } finally {
    document.body.removeChild(container);
  }
}
