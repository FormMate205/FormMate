import { Button } from '@/components/ui/button';
import ContractDocument from '@/entities/contract/ui/ContractDocument';
import { useContractPdfExport } from '@/shared/model/useContractPdfExport';

const ContractDetailTab = () => {
    // dummy
    const data = {
        formId: '1',
        status: '상대승인전',
        creatorId: '1',
        creatorName: '생길동',
        receiverId: '2',
        receiverName: '수길동',
        creditorId: '1',
        debtorId: '3',
        creditorName: '홍길동',
        creditorAddress: '서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호',
        creditorPhone: '010-1234-5678',
        creditorBank: '국민은행',
        creditorAccount: '123-456-789',
        debtorName: '김철수',
        debtorAddress: '서울 강남구 테헤란로 212 멀티캠퍼스 역삼 802호',
        debtorPhone: '010-9876-5432',
        debtorBank: '신한은행',
        debtorAccount: '987-654-321',
        contractDate: '2025-03-21T00:00:00',
        maturityDate: '2025-03-21T00:00:00',
        loanAmount: '10000000',
        repaymentMethod: '원금균등상환',
        repaymentDay: '25',
        interestRate: '5',
        earlyRepaymentFeeRate: '1.5',
        overdueInterestRate: '15',
        overdueLimit: '3',
        specialTerms: [
            {
                specialTermIndex: '1',
                specialTermDetail:
                    '채무자가 계약을 위반할 경우, 채권자는 본 계약을 근거로 법적 조치를 취할 수 있습니다. 이는 대여금 반환 소송 등을 의미합니다.',
            },
            {
                specialTermIndex: '2',
                specialTermDetail:
                    '빌려간 돈을 생활비 등 특정 용도로 사용해야 하며, 도박 등 부적절한 용도로 사용할 수 없습니다.',
            },
            {
                specialTermIndex: '3',
                specialTermDetail:
                    '계약과 관련한 분쟁이 발생할 경우 대한민국 법률을 따르며, 관할 법원은 채권자 또는 채무자의 주소지를 고려하여 결정할 수 있습니다.',
            },
            {
                specialTermIndex: '4',
                specialTermDetail:
                    '채무자가 계약을 지키지 않을 경우, 발생하는 법적 비용(소송 비용 등)은 채무자가 부담해야 합니다.',
            },
        ],
    };

    const { isPdfExporting, exportContract } = useContractPdfExport();
    const handleExportPdf = () => {
        exportContract(data);
    };

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-end'>
                <Button variant='choiceEmpty' onClick={handleExportPdf}>
                    PDF로 내보내기
                </Button>
            </div>
            {/* 차용증 계약서 */}
            <ContractDocument
                contract={data}
                isPdfMode={isPdfExporting}
                key={isPdfExporting ? 'pdf' : 'default'}
            />
        </div>
    );
};

export default ContractDetailTab;
