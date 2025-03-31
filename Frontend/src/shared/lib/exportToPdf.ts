import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPdf = async (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(
        pdfWidth / imgProps.width,
        pdfHeight / imgProps.height,
    );

    const finalWidth = imgProps.width * ratio;
    const finalHeight = imgProps.height * ratio;

    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, 'PNG', marginX, marginY, finalWidth, finalHeight);
    pdf.save(filename);
};
