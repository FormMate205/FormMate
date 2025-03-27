import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { queryClient } from './queryClient';

const QueryProvider = ({ children }: { children: ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

export default QueryProvider;
