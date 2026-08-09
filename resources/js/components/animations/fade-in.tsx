import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none' | 'zoom';

interface FadeInProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    direction?: Direction;
    delay?: number;
    duration?: number;
    distance?: number;
    once?: boolean;
    amount?: number | 'some' | 'all';
    className?: string;
}

export function FadeIn({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.5,
    distance = 30,
    once = true,
    amount = 0.15,
    className = '',
    ...props
}: FadeInProps) {
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: distance, x: 0, opacity: 0, scale: 1 };
            case 'down':
                return { y: -distance, x: 0, opacity: 0, scale: 1 };
            case 'left':
                return { x: distance, y: 0, opacity: 0, scale: 1 };
            case 'right':
                return { x: -distance, y: 0, opacity: 0, scale: 1 };
            case 'zoom':
                return { x: 0, y: 0, opacity: 0, scale: 0.95 };
            case 'none':
            default:
                return { x: 0, y: 0, opacity: 0, scale: 1 };
        }
    };

    return (
        <motion.div
            initial={getInitialPosition()}
            whileInView={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 1,
            }}
            viewport={{ once, amount }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1.0], // smooth cubic-bezier curve
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}
