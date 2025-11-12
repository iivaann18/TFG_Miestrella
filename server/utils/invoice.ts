import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

type Order = any;

// Generate a branded, colored invoice PDF and return as Buffer
export const generateInvoiceBuffer = async (order: Order, items: any[]) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  // Colors and layout
  const brand = {
    primary: '#875b3b',
    accent: '#a88453',
    text: '#2d2638',
    light: '#f4dcd5',
  };

  // Prepare logo path (project root ../public/assets/logo.png)
  const logoPath = path.resolve(process.cwd(), '..', 'public', 'assets', 'logo.png');
  const hasLogo = fs.existsSync(logoPath);

  // Pipe to buffer
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', (err) => reject(err));
  });

  // Header: colored band with logo and company
  doc.rect(0, 0, doc.page.width, 120).fill(brand.primary);
  if (hasLogo) {
    try {
      doc.image(logoPath, 50, 22, { width: 90, height: 76 });
    } catch (e) {
      // ignore image errors
    }
  }

  doc.fillColor('white').fontSize(20).text(process.env.COMPANY_NAME || 'Mi Estrella', hasLogo ? 160 : 50, 36);
  doc.fontSize(10).text(process.env.COMPANY_ADDRESS || 'C/ Falsa 123, 28000 Madrid', hasLogo ? 160 : 50, 62);
  doc.text(`NIF: ${process.env.COMPANY_NIF || 'B12345678'}`, hasLogo ? 160 : 50, 76);
  doc.text(`IBAN: ${process.env.COMPANY_IBAN || 'ES12 3456 7890 1234 5678 9012'}`, hasLogo ? 160 : 50, 90);

  doc.fillColor(brand.text);
  doc.moveDown(6);

  // Invoice title box
  doc.fontSize(18).fillColor(brand.primary).text('FACTURA', { align: 'right' });
  doc.moveDown(0.5);

  // Order meta
  doc.fontSize(10).fillColor(brand.text);
  doc.text(`Número de pedido: ${order.orderNumber || ''}`, { align: 'right' });
  doc.text(`Fecha: ${new Date(order.createdAt || Date.now()).toLocaleDateString('es-ES')}`, { align: 'right' });

  doc.moveDown();

  // Billing & Shipping boxes
  const startY = doc.y;
  doc.fontSize(12).fillColor(brand.text).text('Facturar a:', 50, startY);
  const billTo = typeof order.billingAddress === 'string' ? safeParse(order.billingAddress) : order.billingAddress || {};
  doc.fontSize(10).text(formatAddress(billTo), 50, startY + 18);

  const shipToY = startY;
  doc.fontSize(12).text('Enviar a:', 320, shipToY);
  const shipTo = typeof order.shippingAddress === 'string' ? safeParse(order.shippingAddress) : order.shippingAddress || {};
  doc.fontSize(10).text(formatAddress(shipTo), 320, shipToY + 18);

  doc.moveDown(4);

  // Items table
  const tableTop = doc.y + 10;
  drawTableHeader(doc, tableTop, brand);
  let y = tableTop + 24;

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (y > doc.page.height - 140) {
      doc.addPage();
      y = 60;
      drawTableHeader(doc, y, brand);
      y += 24;
    }

    // Zebra
    if (i % 2 === 0) {
      doc.rect(40, y - 6, doc.page.width - 80, 20).fill(brand.light).fillColor(brand.text);
    }

    doc.fillColor(brand.text).fontSize(10).text(it.productTitle || it.name || '', 50, y, { width: 260 });
    doc.text(String(it.quantity || it.qty || 1), 320, y, { width: 40, align: 'right' });
    doc.text(`€${(parseFloat(it.price || it.unit_cost || 0)).toFixed(2)}`, 380, y, { width: 80, align: 'right' });
    doc.text(`€${(parseFloat(it.subtotal || (it.quantity * it.price) || 0)).toFixed(2)}`, 470, y, { width: 80, align: 'right' });

    y += 22;
  }

  // Totals
  const totalsY = y + 10;
  doc.rect(doc.page.width - 220, totalsY - 6, 180, 70).fill('#fff').stroke();
  doc.fillColor(brand.text).fontSize(10).text(`Subtotal: €${parseFloat(order.subtotal || 0).toFixed(2)}`, doc.page.width - 210, totalsY + 4, { align: 'left' });
  doc.text(`Envío: €${parseFloat(order.shippingCost || 0).toFixed(2)}`, doc.page.width - 210, totalsY + 20);
  doc.text(`IVA: €${parseFloat(order.tax || 0).toFixed(2)}`, doc.page.width - 210, totalsY + 36);
  if (order.discount && parseFloat(order.discount) > 0) {
    doc.text(`Descuento: -€${parseFloat(order.discount).toFixed(2)}`, doc.page.width - 210, totalsY + 52);
  }

  doc.fontSize(14).fillColor(brand.primary).text(`Total: €${parseFloat(order.total || 0).toFixed(2)}`, doc.page.width - 210, totalsY + 68);

  // Footer
  doc.moveTo(40, doc.page.height - 80).lineTo(doc.page.width - 40, doc.page.height - 80).strokeColor('#eee').stroke();
  doc.fontSize(9).fillColor('#666').text('Gracias por su compra. Si tiene preguntas sobre esta factura, contacte con nosotros en info@miestrella.com', 50, doc.page.height - 70, { align: 'center', width: doc.page.width - 100 });

  doc.end();
  return finished;
};

function safeParse(str: any) {
  try {
    return typeof str === 'string' ? JSON.parse(str) : str || {};
  } catch (e) {
    return {};
  }
}

function formatAddress(addr: any) {
  if (!addr) return '';
  const lines = [];
  if (addr.firstName || addr.lastName) lines.push(`${addr.firstName || ''} ${addr.lastName || ''}`.trim());
  if (addr.address1) lines.push(`${addr.address1}${addr.address2 ? ', ' + addr.address2 : ''}`);
  const cityLine = `${addr.city || ''}${addr.zip ? ' ' + addr.zip : ''}`.trim();
  if (cityLine) lines.push(cityLine);
  const countryLine = `${addr.province || ''}${addr.country ? ', ' + addr.country : ''}`.trim();
  if (countryLine) lines.push(countryLine);
  if (addr.phone) lines.push(`Tel: ${addr.phone}`);
  return lines.join('\n');
}

function drawTableHeader(doc: any, y: number, brand: any) {
  doc.rect(40, y - 6, doc.page.width - 80, 22).fill(brand.accent).fillColor('white');
  doc.fontSize(10).text('Producto', 50, y);
  doc.text('Cant.', 320, y, { width: 40, align: 'right' });
  doc.text('Precio', 380, y, { width: 80, align: 'right' });
  doc.text('Subtotal', 470, y, { width: 80, align: 'right' });
  doc.fillColor(brand.text);
}

export default generateInvoiceBuffer;
