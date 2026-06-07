export const numberToWords = (num) => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n) => {
        if ((n = n.toString()).length > 9) return 'Overflow';
        let nStr = ('000000000' + n).substr(-9);
        let nArray = nStr.match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!nArray) return '';
        let str = '';
        str += (nArray[1] != 0) ? (a[Number(nArray[1])] || b[nArray[1][0]] + ' ' + a[nArray[1][1]]) + 'Crore ' : '';
        str += (nArray[2] != 0) ? (a[Number(nArray[2])] || b[nArray[2][0]] + ' ' + a[nArray[2][1]]) + 'Lakh ' : '';
        str += (nArray[3] != 0) ? (a[Number(nArray[3])] || b[nArray[3][0]] + ' ' + a[nArray[3][1]]) + 'Thousand ' : '';
        str += (nArray[4] != 0) ? (a[Number(nArray[4])] || b[nArray[4][0]] + ' ' + a[nArray[4][1]]) + 'Hundred ' : '';
        str += (nArray[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArray[5])] || b[nArray[5][0]] + ' ' + a[nArray[5][1]]) + 'only ' : 'only';
        return str;
    };
    return inWords(Math.floor(num));
};

export const pdfTemplate = (bill, logoBase64 = '') => {
    // Determine the absolute URL for the logo so html2canvas can load it inside an iframe
    const absoluteLogo = logoBase64 || (typeof window !== 'undefined' ? window.location.origin + '/logo.png' : '/logo.png');
    
    const { 
        billNo, clientName, clientPhone, clientAddress, clientGSTIN, items, 
        totalAmount, subTotal, totalTax, taxPercentage, createdAt, isGstEnabled, billingType, senderType, receiverType
    } = bill;
    
    const isTransfer = billingType === 'Transfer' || (senderType === 'Admin' && receiverType === 'Branch');

    const billDate = new Date(createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const amountInWords = numberToWords(totalAmount || 0);
    
    // Unified Logo & Watermark Logic
    const headerLogoHtml = absoluteLogo ? `<img src="${absoluteLogo}" style="max-height: 70px; width: auto; object-fit: contain; margin-bottom: 5px;" />` : '';

    const watermarkHtml = absoluteLogo ? `
        <div style="position: absolute; top: 35%; left: 10%; width: 80%; opacity: 0.12; transform: rotate(-30deg); z-index: -1; pointer-events: none; text-align: center;">
            <img src="${absoluteLogo}" style="width: 60%; height: auto;" />
        </div>
    ` : '';

    const invoiceTitle = isTransfer ? 'STOCK TRANSFER' : (isGstEnabled ? 'TAX INVOICE' : 'ESTIMATE / QUOTATION');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #000; font-size: 13px; background: #fff; }
            .wrapper { border: 2px solid #000; width: 800px; box-sizing: border-box; margin: 0 auto; padding: 0px; position: relative; min-height: 1000px; background: #fff; }
            .top-pan { border-bottom: 2px solid #000; display: flex; justify-content: space-between; padding: 5px 15px; font-weight: bold; font-size: 12px; }
            
            .header { text-align: center; border-bottom: 2px solid #000; padding: 15px; background: #fff; }
            .invoice-title { font-size: 16px; font-weight: 900; text-decoration: underline; margin-bottom: 8px; text-transform: uppercase; }
            .comp-name { font-size: 26px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px; margin-top: 5px; }
            .comp-addr { font-size: 14px; font-weight: 600; line-height: 1.5; }
            
            .info-section { display: flex; border-bottom: 2px solid #000; min-height: 130px; }
            .left-box { width: 60%; border-right: 2px solid #000; padding: 12px 15px; box-sizing: border-box; }
            .right-box { width: 40%; padding: 12px 15px; box-sizing: border-box; }
            .box-title { font-weight: 900; text-decoration: underline; margin-bottom: 15px; display: block; text-align: center; font-size: 14px; text-transform: uppercase; }
            
            .data-row { margin-bottom: 10px; font-weight: bold; }
            .line-fill { display: inline-block; font-weight: bold; margin-left: 5px; }
            
            .table-main { width: 100%; border-collapse: collapse; }
            .table-main th, .table-main td { border: 1.5px solid #000; padding: 8px 10px; text-align: left; }
            .table-main th { text-align: center; font-weight: 900; background: #f0f0f0; border-top: none; }
            .table-main td { vertical-align: top; }
            
            .footer-box { display: flex; justify-content: flex-end; border: 1.5px solid #000; border-top: none; }
            .footer-label { width: 25.4%; background: #f0f0f0; padding: 8px; font-weight: 950; text-align: center; border-right: 2px solid #000; border-left: 2px solid #000; border-top: 2px solid #000;}
            .footer-val { width: 17%; padding: 8px; font-weight: 950; text-align: right; border-top: 2px solid #000;}
            
            .inbound-words { border-top: 1.5px solid #000; padding: 10px 15px; font-weight: bold; text-transform: uppercase; }
            .sign-section { display: flex; justify-content: space-between; align-items: flex-end; padding: 10px 15px 15px 15px; margin-top: auto; }
            .auth-side { text-align: right; font-weight: bold; }
            
            .empty-row { height: 25px; }
            .empty-row td { border: 1.5px solid #000; }
            
            @media print {
                @page { margin: 0; }
                body { padding: 0; }
                .wrapper { border: none; }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container" style="padding: 40px; background: #fff; width: fit-content; margin: 0 auto;">
        <div class="wrapper">
            ${watermarkHtml}
            
            <div class="header">
                <div class="invoice-title">${invoiceTitle}</div>
                ${headerLogoHtml}
                <div class="comp-name">GLEM HOUSE CONSUMER CARE PVT LTD</div>
                <div class="comp-addr">
                    Address: 1/093,New A, Jiyamau, Hazratganj, Lucknow (Uttar Pradesh)-226001<br>
                    Gst no: 09AAACG1234H1Z5<br>
                    Email Id: contact@glemhouse.com
                </div>
            </div>

            <div class="info-section">
                <div class="left-box">
                    <span class="box-title">Detail of Receiver / Consignee</span>
                    <div class="data-row">Name : <span class="line-fill">${(clientName || 'CUSTOMER').toUpperCase()}</span></div>
                    <div class="data-row">Address : <span class="line-fill">${clientAddress || 'AS PER RECORDS'}</span></div>
                    <div class="data-row">Contact : <span class="line-fill">${clientPhone || 'N/A'}</span></div>
                    <div class="data-row">ID : <span class="line-fill">${clientGSTIN || 'N/A'}</span></div>
                </div>
                <div class="right-box">
                    <div class="data-row" style="margin-top:20px;">Invoice No. : <strong>${billNo || 'N/A'}</strong></div>
                    <div class="data-row">Date : <strong>${billDate || 'N/A'}</strong></div>
                </div>
            </div>

            <table class="table-main">
                <thead>
                    <tr>
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: 5%;">S.No.</th>
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: ${isTransfer ? '35%' : '30%'};">Description</th>
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: ${isTransfer ? '15%' : '10%'};">HSN Code</th>
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: ${isTransfer ? '15%' : '10%'};">Batch No.</th>
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: ${isTransfer ? '15%' : '10%'};">Exp. Date</th>
                        <th style="border-bottom: 2px solid #000; border-right: ${isTransfer ? 'none' : '2px solid #000'}; padding: 10px 5px; width: ${isTransfer ? '15%' : '7%'};">Qty.</th>
                        ${!isTransfer ? `
                        <th style="border-bottom: 2px solid #000; border-right: 2px solid #000; padding: 10px 5px; width: 14%;">Rate</th>
                        <th style="border-bottom: 2px solid #000; padding: 10px 5px; width: 14%;">Amount</th>
                        ` : ''}
                    </tr>
                </thead>
                <tbody>
                    ${(items || []).map((item, idx) => {
                        const rawExpiry = item.expiry || item.expiryDate || item.product?.expiry || item.product?.expiryDate || '';
                        let expiryDisplay = 'N/A';
                        if (rawExpiry) {
                            // Convert YYYY-MM (from month input) to MM/YYYY
                            const monthMatch = rawExpiry.match(/^(\d{4})-(\d{2})$/);
                            if (monthMatch) {
                                expiryDisplay = `${monthMatch[2]}/${monthMatch[1]}`;
                            } else {
                                expiryDisplay = rawExpiry;
                            }
                        }
                        return `
                        <tr>
                            <td style="text-align: center;">${idx + 1}</td>
                            <td>
                                ${item.name || item.description || 'Product'}
                                ${item.freeItem ? `<br><span style="font-size: 11px; font-weight: bold; color: #333;">(Free: ${item.freeItem})</span>` : ''}
                            </td>
                            <td style="text-align: center;">${item.hsn || item.product?.hsn || 'N/A'}</td>
                            <td style="text-align: center;">${item.batch || item.product?.batch || 'N/A'}</td>
                            <td style="text-align: center;">${expiryDisplay}</td>
                            <td style="text-align: center;">${item.qty || 0}</td>
                            ${!isTransfer ? `
                            <td style="text-align: right;">₹${Number(item.price || item.rate || 0).toLocaleString('en-IN')}</td>
                            <td style="text-align: right; font-weight: bold;">₹${Number(item.total || ((item.qty || 0) * (item.price || item.rate || 0))).toLocaleString('en-IN')}</td>
                            ` : ''}
                        </tr>
                    `}).join('')}
                    <!-- Dynamic filler to maintain spacing -->
                    ${Array(Math.max(0, 8 - (items?.length || 0))).fill(`<tr class="empty-row"><td></td><td></td><td></td><td></td><td></td><td></td>${!isTransfer ? '<td></td><td></td>' : ''}</tr>`).join('')}
                    <tr class="empty-row" style="height: 150px; border-bottom: none;">
                        <td style="border-bottom: none;"></td>
                        <td style="border-bottom: none;"></td>
                        <td style="border-bottom: none;"></td>
                        <td style="border-bottom: none;"></td>
                        <td style="border-bottom: none;"></td>
                        <td style="border-bottom: none;"></td>
                        ${!isTransfer ? '<td style="border-bottom: none;"></td><td style="border-bottom: none;"></td>' : ''}
                    </tr>
                </tbody>
            </table>

            ${!isTransfer ? `
            <div class="footer-box"><div class="footer-label" style="width: 86%;">SUBTOTAL</div><div class="footer-val" style="width: 14%;">${Number(subTotal || 0).toLocaleString('en-IN')}</div></div>
            ${isGstEnabled ? `
                <div class="footer-box"><div class="footer-label" style="width: 86%;">TAX ${taxPercentage !== undefined ? '(' + taxPercentage + '%)' : ''}</div><div class="footer-val" style="width: 14%;">${Number(totalTax || 0).toLocaleString('en-IN')}</div></div>
            ` : ''}
            <div class="footer-box" style="background:#f0f0f0;">
                <div class="footer-label" style="width: 86%; border-bottom: 2px solid #000;">GRAND TOTAL</div>
                <div class="footer-val" style="width: 14%; border-bottom: 2px solid #000;">₹ ${Number(totalAmount || 0).toLocaleString('en-IN')}</div>
            </div>

            <div class="inbound-words">Total Amount (in words) : RUPEES ${amountInWords}</div>
            ` : ''}

            <div class="sign-section">
                <div style="font-size: 10px;">E. & O. E.<br>Subject to Jurisdiction.</div>
                <div class="auth-side">
                    <div>For <strong>GLEM HOUSE CONSUMER CARE PVT LTD</strong></div>
                    <div style="margin-top: 50px; border-top: 1px solid #000; padding-top: 5px;">Authorized Signatory</div>
                </div>
            </div>
        </div>
        </div>
    </body>
    </html>
    `;
};
