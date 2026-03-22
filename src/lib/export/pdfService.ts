import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId: string, filename: string = 'Housing-Oracle-Analysis.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fefdfb', // Matching our warm-white surface
    } as any);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Add Institutional Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(15, 23, 42); // Navy
    pdf.text('HOUSING ORACLE v3.0', 15, 20);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Confidential Institutional Intelligence · Powered by Groq AI & TF.js', 15, 25);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 15, 30);
    
    pdf.setDrawColor(229, 231, 235);
    pdf.line(15, 35, pdfWidth - 15, 35);

    // Add Image
    pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
    
    pdf.save(filename);
  } catch (err) {
    console.error('PDF Export Error:', err);
  }
};
