import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogClose } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from '@app/shared/confirm-dialog/confirm-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CustomerService } from '@app/services/customer.service';
import { InvoiceService } from '@app/services/invoice.service';
import { InvoiceViewModel } from '@app/model/invoice';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-invoice-view',
  imports: [MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogClose,
    ],
  templateUrl: './invoice-view.html',
  styleUrl: './invoice-view.scss',
})
export class InvoiceView {

  //loading = false;  
  customers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private invoiceService: InvoiceService,
     private dialogRef: MatDialogRef<InvoiceView>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  invoice!: InvoiceViewModel;

  ngOnInit() {
    if (this.data) {
      this.invoiceService.getInvoiceById(this.data).subscribe((res) => (this.invoice = res));
    }
  }

//   exportPdf() {
//   const element = document.getElementById('invoicePdf');

//   const options = {
//     margin: 10,
//     filename: `Invoice_${this.invoice.header.invoiceNo}.pdf`,
//     image: {
//       type: 'jpeg' as const,
//       quality: 0.98
//     },
//     html2canvas: {
//       scale: 2
//     },
//     jsPDF: {
//       unit: 'mm' as const,
//       format: 'a4' as const,
//       orientation: 'portrait' as const
//     }
//   };

//   html2pdf().from(element!).set(options).save();
// }

exportPdf() {
  const doc = new jsPDF('p', 'mm', 'a4');

  const header = this.invoice.header;

  // ===== TITLE =====
  doc.setFontSize(16);
  doc.text(`Invoice ${header.invoiceNo}`, 14, 15);

  // ===== CUSTOMER INFO =====
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(header.invoiceDate).toLocaleDateString()}`, 14, 25);
  doc.text(`Customer: ${header.customerName}`, 14, 31);
  doc.text(`Phone: ${header.mobile ?? '-'}`, 14, 37);

  // ===== TABLE DATA =====
  const tableBody = this.invoice.items.map((i, index) => [
    index + 1,
    i.productName,
    i.qty,
    i.rate.toFixed(2),
    i.gstAmount.toFixed(2),
    i.total.toFixed(2)
  ]);

  autoTable(doc, {
  startY: 45,

  head: [[
    'S.No',
    'Product',
    'Qty',
    'Rate',
    'GST',
    'Total'
  ]],

  body: tableBody,

  theme: 'grid',

  styles: {
    fontSize: 9,
    textColor: [0, 0, 0],          // Dark text (important)
    cellPadding: 3,
    lineColor: [0, 0, 0],
    lineWidth: 0.1
  },

  headStyles: {
    fillColor: [128, 128, 128],          // Black background
    textColor: [255, 255, 255],    // White text
    fontStyle: 'bold',
    halign: 'center'
  },

  bodyStyles: {
    fillColor: [255, 255, 255]     // White rows (no dim effect)
  },

  alternateRowStyles: {
    fillColor: [245, 245, 245]     // Subtle zebra stripe
  },

  columnStyles: {
    0: { halign: 'center', cellWidth: 10 },  // #
    1: { halign: 'left', cellWidth: 60 },    // Product
    2: { halign: 'center' },                 // Qty
    3: { halign: 'right' },                  // Rate
    4: { halign: 'right' },                  // GST
    5: { halign: 'right' }                   // Total
  }
});


  // ===== TOTALS =====
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.text(`Sub Total: ${header.subTotal.toFixed(2)}`, 140, finalY);
  doc.text(`GST Total: ${header.gstTotal.toFixed(2)}`, 140, finalY + 6);
  doc.setFontSize(12);
  doc.text(`Grand Total: ${header.grandTotal.toFixed(2)}`, 140, finalY + 14);

  // ===== SAVE =====
  doc.save(`Invoice_${header.invoiceNo}.pdf`);
}


}
