import { Matcher } from 'react-day-picker';

export interface ContractAmountResponse {
    paidAmount: number;
    expectedTotalRepayment: number;
    receivedAmount: number;
    expectedTotalReceived: number;
}

export interface ContractItem {
    userIsCreditor: boolean;
    contracteeName: string;
    repaymentAmount: number;
    scheduledPaymentDate: [number, number, number];
}

export interface ScheduleMap {
    [day: string]: {
        contracts: ContractItem[];
    };
}

export interface ScheduleCalendarProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    currentMonth: Date;
    setCurrentMonth: (date: Date) => void;
    modifiers: { [key: string]: Matcher };
}

export interface ScheduleListProps {
    contracts: ContractItem[];
}
