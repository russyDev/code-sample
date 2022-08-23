import styled from 'styled-components';

export const StyledDay = styled.div`
    height: 57px;
    background: var(--primary-a-10);
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
    font-size: 12px;
    border-radius: 3px;
    color: var(--primary-a-700);
    &.highlighted {
        background: var(--primary-a-50);
    }
`;
