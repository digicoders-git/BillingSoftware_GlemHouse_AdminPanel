import html2canvas from 'html2canvas';

export const downloadInvoiceAsJpg = async (htmlContent, fileName = 'invoice.jpg') => {
    return new Promise((resolve, reject) => {
        // Create an iframe to safely render the HTML with styles isolated
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.width = '1200px'; // Extra wide to prevent responsive squishing
        iframe.style.height = '1500px'; // Extra tall
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(htmlContent);
        doc.close();

        const captureAndDownload = async () => {
            try {
                // The container is what we want to capture so we get the margin
                const container = doc.querySelector('.invoice-container');
                if (!container) {
                    throw new Error("Invoice container not found in HTML");
                }

                // Reset body margins/padding in iframe to avoid offset issues in html2canvas
                doc.body.style.margin = '0';
                doc.body.style.padding = '0';
                
                const canvas = await html2canvas(container, {
                    scale: 2, // Higher quality
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: 1200,
                    windowHeight: 1500
                });

                const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                
                // Trigger download
                const link = document.createElement('a');
                link.download = fileName;
                link.href = dataUrl;
                link.click();
                
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                resolve(true);
            } catch (err) {
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
                reject(err);
            }
        };

        // Use setTimeout to ensure all assets (like the logo) are fully loaded in the iframe
        // Since we have an img src="/logo.png", it might take a few ms to load.
        setTimeout(() => {
            captureAndDownload();
        }, 1000);
    });
};
