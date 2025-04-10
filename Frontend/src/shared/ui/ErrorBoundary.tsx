import { AxiosError } from 'axios';
import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorResponse } from '@/widgets/modal/types';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            const error = this.state.error as AxiosError<ErrorResponse>;
            const message = error.response?.data.message;

            if (message === '계좌 정보를 찾을 수 없습니다.') {
                return <div>계좌 정보가 없습니다.</div>;
            }

            return <div>에러가 발생했습니다.</div>;
        }

        return this.props.children;
    }
}
