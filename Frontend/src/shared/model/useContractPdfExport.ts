import { useState } from 'react';
import { ContractDocs } from '@/entities/contract/model/types';
import { exportToPdf } from '../lib/exportToPdf';

export const useContractPdfExport = () => {
    const [isPdfExporting, setIsPdfExporting] = useState(false);

    const exportContract = async (contract: ContractDocs) => {
        setIsPdfExporting(true);

        await new Promise((r) => setTimeout(r, 100));

        const filename = `${contract.creditorName}_${contract.debtorName}_차용증.pdf`;
        await exportToPdf('contract-document', filename);

        setIsPdfExporting(false);
    };

    return { isPdfExporting, exportContract };
};
