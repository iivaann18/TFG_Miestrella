// invoiceProvider has been removed by request — keep a stub to avoid runtime import errors.
export const generateInvoiceWithProvider = async (_order, _items) => {
    throw new Error('External invoice provider disabled. Use local PDF generator instead.');
};
export default generateInvoiceWithProvider;
//# sourceMappingURL=invoiceProvider.js.map