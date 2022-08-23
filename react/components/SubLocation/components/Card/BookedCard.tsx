import React from 'react';
import cx from 'classnames';
import { uid } from 'react-uid';

type TProps = {
    booking: TCalendarBooking;
    is_office: boolean;
    slPosition?: number;
};

export const BookedCard = ({ booking, is_office, slPosition }: TProps) => {
    const { onEditClick, actions, isInSameTeam, showActions, currentUser } = useCardState(booking);
    const className = `cy-booking-${slPosition}-${booking.booking_date}`;
    const renderCard = () => {
        return (
            <StyledCard
                aria-label="booked-card"
                onDoubleClick={() => onEditClick()}
                role="button"
                className={cx({
                    disabled: !isInSameTeam && !currentUser.isAdmin,
                    'booked-card': true,
                    [className]: true,
                })}
            >
                <div className={cx({ marker: true, is_office })} />
                <div className="content">
                    <p className="username">{`${booking.user?.firstName} ${booking.user?.lastName}`}</p>
                    <div className="placement">
                        {is_office ? <span>In the Office</span> : <span>At Home</span>}

                        {showActions && (
                            <Dropdown
                                ariaLabel="card-actions"
                                icon={
                                    <div className="button" role="button">
                                        <svg
                                            className="icon"
                                            focusable="false"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </div>
                                }
                                isOpen={false}
                            >
                                {actions.map((action) => {
                                    return (
                                        <Dropdown.Item
                                            key={uid(action)}
                                            ariaLabel={action.name}
                                            value={null}
                                            onClick={() => action.action()}
                                            isDisabled={false}
                                        >
                                            {action.icon} {action.name}
                                        </Dropdown.Item>
                                    );
                                })}
                            </Dropdown>
                        )}
                    </div>
                </div>
            </StyledCard>
        );
    };

    return (
        <>
            {isInSameTeam || currentUser.isAdmin ? (
                renderCard()
            ) : (
                <StyledTooltip
                    id={booking.id}
                    title="You can not change booking of this user"
                    placement="right-start"
                >
                    {renderCard()}
                </StyledTooltip>
            )}
        </>
    );
};
