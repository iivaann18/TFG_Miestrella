import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import { generateInvoiceBuffer } from '../utils/invoice';
(async () => {
    try {
        const order = {
            orderNumber: 'ORD-TEST-1234',
            createdAt: new Date().toISOString(),
            customerName: 'Test Cliente',
            customerEmail: 'test@example.com',
            customerPhone: '600000000',
            subtotal: '49.5',
            shippingCost: '5.00',
            tax: '10.395',
            total: '64.89',
            shippingAddress: JSON.stringify({ firstName: 'Test', lastName: 'Cliente', address1: 'C/ Prueba 1', city: 'Madrid', zip: '28000', province: 'Madrid', country: 'ES' }),
            notes: 'Prueba de factura',
        };
        const items = [
            { productTitle: 'Figura A', quantity: 1, price: '49.50', subtotal: '49.50' },
            { productTitle: 'Envío', quantity: 1, price: '5.00', subtotal: '5.00' },
        ];
        const buffer = await generateInvoiceBuffer(order, items);
        const out = path.join(process.cwd(), 'test-invoice.pdf');
        fs.writeFileSync(out, buffer);
        console.log('Wrote test invoice to', out);
    }
    catch (err) {
        console.error('Test invoice generation failed:', err);
        process.exit(1);
    }
})();
//# sourceMappingURL=testInvoice.js.map