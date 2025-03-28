import { Contract } from '@/entities/contract/model/types';

// 계약 상대 정보
export interface FormPartner {
    userId: string;
    userName: string;
    phoneNumber: string;
}

// 계약 초안 request
export type FormDraftRequest = Pick<
    Contract,
    | 'receiverId'
    | 'creditorId'
    | 'debtorId'
    | 'maturityDate'
    | 'loanAmount'
    | 'repaymentMethod'
    | 'repaymentDay'
    | 'interestRate'
    | 'earlyRepaymentFeeRate'
    | 'overdueInterestRate'
    | 'overdueLimit'
> & { specialTermIndexes: string[] };
