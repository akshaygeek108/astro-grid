import { Component, ElementRef, Input } from '@angular/core';
import jsPDF from 'jspdf';
import 'svg2pdf.js';

@Component({
  selector: 'button-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.css']
})
export class GeneratePdfComponent {

  @Input() container1!: ElementRef;
  @Input() container2!: ElementRef;
  @Input() kundli2Enabled = false;
  @Input() kundliTitle1 = 'Kundli 1';
  @Input() kundliTitle2 = 'Kundli 2';



  generatePDF() {

    // ✅ A4 size explicitly
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    const svg1 = this.container1?.nativeElement.querySelector('svg');
    const svg2 = this.container2?.nativeElement.querySelector('svg');

    if (!svg1) return;

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();


    // // ✅ Watermark style
    // pdf.setFontSize(60);
    // pdf.setTextColor(200, 200, 200); // light gray

    // // Rotate and center
    // pdf.text('Astro Grid',
    //   pageWidth / 2,
    //   pageHeight / 2,
    //   {
    //     align: 'center',
    //     angle: 45 // diagonal
    //   }
    // );
    const margin = 20;

    // ✅ Reduce bottom margin by using more height
    const usableHeight = pageHeight - margin; // minimal bottom margin

    // half width charts
    const chartWidth = (pageWidth - margin * 3) / 2;

    // maintain square ratio
    const chartHeight = chartWidth;

    const topOffset = 40;

    /* =========================
       🎯 TITLE STYLE
    ========================= */

    pdf.setFontSize(14);
    pdf.setTextColor(200, 0, 0); // 🔴 RED color

    // Centered title for Kundli 1
    pdf.text(
      this.kundliTitle1,
      margin + chartWidth / 2,
      25,
      { align: 'center' }
    );

    // Centered title for Kundli 2
    if (this.kundli2Enabled && svg2) {
      pdf.text(
        this.kundliTitle2,
        chartWidth + margin * 2 + chartWidth / 2,
        25,
        { align: 'center' }
      );
    }

    /* =========================
       🧭 DRAW CHARTS
    ========================= */

    (pdf as any).svg(svg1, {
      x: margin,
      y: topOffset,
      width: chartWidth,
      height: chartHeight
    }).then(() => {

      if (this.kundli2Enabled && svg2) {

        (pdf as any).svg(svg2, {
          x: chartWidth + margin * 2,
          y: topOffset,
          width: chartWidth,
          height: chartHeight
        }).then(() => {
          pdf.save('kundli.pdf');
        });

      } else {
        pdf.save('kundli.pdf');
      }

    });
  }
}
