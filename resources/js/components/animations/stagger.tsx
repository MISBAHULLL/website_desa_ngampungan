import { motion } from 'framer-motion';
import type { HTMLMotionProps, Variants } from 'framer-motion';
import type { ReactNode } from 'react';

interface StaggerContainerProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    staggerDelay?: number;
    delayChildren?: number;
    once?: boolean;
    amount?: number | 'some' | 'all';
    className?: string;
}

export function StaggerContainer({
    children,
    staggerDelay = 0.1,
    delayChildren = 0,
    once = true,
    amount = 0.15,
    className = '',
    ...props
}: StaggerContainerProps) {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren,
            },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'none';
    distance?: number;
    className?: string;
}

export function StaggerItem({
    children,
    direction = 'up',
    distance = 25,
    className = '',
    ...props
}: StaggerItemProps) {
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

    const itemVariants: Variants = {
        hidden: getInitialPosition(),
        show: {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.45,
                ease: [0.25, 0.1, 0.25, 1.0],
            },
        },
    };

    return (
        <motion.div variants={itemVariants} className={className} {...props}>
            {children}
        </motion.div>
    );
}
