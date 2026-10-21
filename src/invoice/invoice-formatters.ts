import { CsvInvoiceFormatter } from './csv-invoice-formatter.ts'
import { HtmlInvoiceFormatter } from './html-invoice-formatter.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'
import { JsonInvoiceFormatter } from './json-invoice-formatter.ts'
import { PdfInvoiceFormatter } from './pdf-invoice-formatter.ts'
import { TextInvoiceFormatter } from './text-invoice-formatter.ts'

// To support a new export format, add a formatter and register it here.
export const invoiceFormatters: Record<string, InvoiceFormatter> = {
  text: new TextInvoiceFormatter(),
  html: new HtmlInvoiceFormatter(),
  csv: new CsvInvoiceFormatter(),
  pdf: new PdfInvoiceFormatter(),
  json: new JsonInvoiceFormatter(),
}
