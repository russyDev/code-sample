import React, { ReactNode } from 'react';
import cx from 'classnames';
import { StyledDay } from './styles';

type TProps = {
    children: ReactNode;
    isHighlighted?: boolean;
};

export const Day = ({ children, isHighlighted = false }: TProps) => {
    return <StyledDay className={cx({ highlighted: isHighlighted })}>{children}</StyledDay>;
};
