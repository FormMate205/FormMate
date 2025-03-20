import { SVGProps } from 'react';
import { IconName } from './IconName';

interface IconProps extends SVGProps<SVGSVGElement> {
    name: IconName;
    color?: string;
    size?: number;
}

const Icons = ({
    name,
    className = 'fill-line-500',
    size = 24,
    ...props
}: IconProps) => {
    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox='0 0 24 24'
            preserveAspectRatio='xMidYMid meet'
            {...props}
        >
            <use href={`/assets/icons/sprites.svg#${name}`} />
        </svg>
    );
};

export default Icons;
