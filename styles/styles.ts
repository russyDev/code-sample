import styled from 'styled-components';

export const StyledButton = styled.div`
    display: inline-flex;
    height: 45px;

    .light-button {
        background-color: #ffffff;
        cursor: pointer;
        border: 1px solid #c4c7d0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        height: 45px;
        svg {
            fill: rgba(0, 0, 0, 0.67);
        }
        &:not(&__preferences) {
            width: 200px;
        }
    }

    .dropdown-btn {
        border-radius: 0 3px 3px 0;
        background-color: #ffffff;
        border: 1px solid #c4c7d0;
        border-left: none;
        height: 45px;
        svg {
            fill: rgba(0, 0, 0, 0.67);
        }
        .elmo-btn__label {
            display: none;
        }
        button.elmo-btn--xl {
            height: 45px;
        }
    }
`;
