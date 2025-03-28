import { create } from 'zustand';
import { FormPartner } from '@/entities/formDraft/model/types';

// 스토어의 상태 타입 정의
interface FormPartnerState {
    partner: FormPartner | null;
    setPartner: (partner: FormPartner) => void;
    cancelPartner: () => void;
}

const useFormPartnerStore = create<FormPartnerState>((set) => ({
    partner: null,

    setPartner: (partner: FormPartner) => set({ partner }),
    cancelPartner: () => set({ partner: null }),
}));

export default useFormPartnerStore;
