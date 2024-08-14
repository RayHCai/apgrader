import { PropsWithChildren } from 'react';

import classes from './styles.module.css';

type ButtonProps = PropsWithChildren & {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    isDark?: boolean;
};

export default function Button(props: ButtonProps) {
    return (
        <button
            className={ `${classes.button} ${props.className} ${
                props.isDark && classes.dark
            }` }
            onClick={ props.onClick }
            disabled={ props.disabled }
        >
            { props.children }
        </button>
    );
}
