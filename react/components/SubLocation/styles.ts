import styled, { css } from 'styled-components';
import { getFontStyle, getFromTheme } from 'src/utils/styles';

export const paddingAndBorderRadius = css`
    padding: 8px;
    border-radius: 3px;
`;
export const backgroundAndBoxShadow = css`
    background-color: var(--black-300);
    box-shadow: ${getFromTheme('shadow.100')};
`;

export const StyledTitle = styled.div`
    font-weight: 600;
    font-size: 16px;
    word-break: break-word;
    &,
    .tooltip * {
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .tooltip {
        max-width: 100%;
    }
`;

export const StyledSubLocation = styled.div`
    --sticky-row__sticky-content--background: var(--black-200);
    width: fit-content;
    min-width: 100%;
    ${paddingAndBorderRadius}
    &:nth-of-type(odd) {
        --sticky-row__sticky-content--background: var(--black-300);
        ${backgroundAndBoxShadow}
    }
    .wrapper {
        display: flex;
        min-width: 1000px;
    }
`;

export const StyledCapacity = styled.div`
    flex: none;
    width: 150px;
    background: #fff;
    margin-right: 4px;
    border-radius: 4px;
    position: sticky;
    left: 0;
    z-index: 1;
    box-shadow: ${getFromTheme('shadow.100')};
    padding: 0 5px 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: end;
    span {
        font-weight: bold;
        font-size: 13px;
        margin-top: auto;
    }
    .control {
        position: absolute;
        top: 0;
        right: 0;
        width: 40px;
        height: 40px;
        text-align: center;
        cursor: pointer;
        .icon__svg {
            transform: rotate(-90deg);
        }
        &.closed {
            .icon__svg {
                transform: rotate(90deg);
            }
        }
        .icon--size-md .icon__svg {
            font-size: 30px;
        }
    }
`;

export const StyledRowWrapper = styled.div`
    margin-bottom: 5px;
    &:last-child {
        margin-bottom: 0;
    }
`;

export const StyledBlockInfo = styled.div`
    width: 100%;
    & .inner {
        display: flex;
        justify-content: space-between;
        &__home-capacity {
            ${getFontStyle('bodyExtraSmall')}
            font-weight: bold;
        }
        span:last-child {
            line-height: 17px;
            font-size: 10px;
        }
    }
    &.extra {
        padding-top: 24px;
    }
`;
