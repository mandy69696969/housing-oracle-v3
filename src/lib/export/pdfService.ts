import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string = 'Housing-Oracle-Analysis.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Capture full scrollable content, not just visible viewport
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fefdfb',
      scrollY: -window.scrollY,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
    } as any);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Institutional Header on first page
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42);
    pdf.text('HOUSING ORACLE v3.0', 15, 20);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Confidential Institutional Intelligence · Powered by Groq AI & TF.js', 15, 25);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 30);
    
    pdf.setDrawColor(229, 231, 235);
    pdf.line(15, 35, pdfWidth - 15, 35);

    // Paginate if content exceeds one page
    const headerOffset = 40;
    const availableHeight = pdfPageHeight - headerOffset;
    
    if (imgHeight <= availableHeight) {
      pdf.addImage(imgData, 'PNG', 0, headerOffset, pdfWidth, imgHeight);
    } else {
      // Multi-page: split image across pages
      let yOffset = 0;
      let pageNum = 0;
      
      while (yOffset < imgHeight) {
        if (pageNum > 0) pdf.addPage();
        const startY = pageNum === 0 ? headerOffset : 10;
        const pageContentHeight = pageNum === 0 ? availableHeight : pdfPageHeight - 20;
        
        pdf.addImage(imgData, 'PNG', 0, startY - yOffset, pdfWidth, imgHeight);
        yOffset += pageContentHeight;
        pageNum++;
      }
    }
    
    pdf.save(filename);
  } catch (err) {
    console.error('PDF Export Error:', err);
  }
};
