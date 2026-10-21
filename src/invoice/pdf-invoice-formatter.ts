import type { OrderTotals } from '../pricing/order-totals.ts'
import type { Order } from '../types.ts'
import type { InvoiceFormatter } from './invoice-formatter.ts'
import { TextInvoiceFormatter } from './text-invoice-formatter.ts'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 50
const FONT_SIZE = 10
const LEADING = 12
const LATIN1_MAX_CODE = 255

/**
 * Builds a minimal single-page PDF (monospaced text, no dependencies).
 * The result is a binary string: every character is one byte, so write it
 * with the 'latin1' encoding. Characters outside Latin-1 become '?'.
 * Invoices longer than one page are not paginated.
 */
export class PdfInvoiceFormatter implements InvoiceFormatter {
  private readonly text = new TextInvoiceFormatter()

  format(order: Order, totals: OrderTotals): string {
    const lines = this.text.format(order, totals).trimEnd().split('\n')
    return this.buildPdf(this.buildContentStream(lines))
  }

  private buildContentStream(lines: string[]): string {
    const textLines = lines.map((line) => `(${this.escape(line)}) Tj`).join('\nT*\n')
    return `BT\n/F1 ${FONT_SIZE} Tf\n${LEADING} TL\n${MARGIN} ${PAGE_HEIGHT - MARGIN} Td\n${textLines}\nET`
  }

  private escape(line: string): string {
    return [...line]
      .map((char) => (char.charCodeAt(0) > LATIN1_MAX_CODE ? '?' : char))
      .join('')
      .replace(/[\\()]/g, '\\$&')
  }

  private buildPdf(content: string): string {
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >>`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    ]

    let pdf = '%PDF-1.4\n'
    const offsets: number[] = []
    objects.forEach((body, index) => {
      offsets.push(pdf.length)
      pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
    })

    const xrefOffset = pdf.length
    const entries = offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`)
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${entries.join('')}`
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
    return pdf
  }
}
