import styled from 'styled-components';
import { getFromTheme } from 'src/utils/styles';

export const StyledTooltip = styled(Tooltip)`
    width: 100%;
`;
export const StyledCard = styled.div`
    border-radius: 3px;
    height: 57px;
    background: #fff;
    width: 100%;
    display: flex;
    align-items: stretch;
    justify-content: center;
    font-size: 13px;
    &.disabled {
        opacity: 0.6;
    }
    .marker {
        height: 100%;
        flex: none;
        width: 5px;
        background: var(--primary-a-600);
        border-radius: 3px 0 0 3px;
        &.is_office {
            background: var(--success-100);
        }
    }
    .content {
        flex-grow: 1;
        padding: 0 2px 0 5px;
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        font-size: 12px;
        color: #212121;
        font-weight: 600;
        p {
            margin-bottom: 10px;
            margin-top: 5px;
        }
    }
    .placement {
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: flex-start;
    }
    .button {
        width: 20px;
        cursor: pointer;
        transition: all 0.3s;
        .icon {
            fill: rgba(0, 0, 0, 0.45);
        }
        &:hover {
            background: #fff;
            border-radius: 2px;
            box-shadow: ${getFromTheme('shadow.100')};
            color: rgba(0, 0, 0, 0.45);
        }
    }

    .username {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 105px;
    }

    &&& button {
        padding: 0;
        min-width: 0;
        height: 20px;
    }
`;
