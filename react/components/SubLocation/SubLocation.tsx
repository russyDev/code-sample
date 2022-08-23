import React from 'react';

type TProps = {
    subLocation: TCalendarSubLocation;
    timeZone: string;
    className?: string;
    slPosition?: number;
    onToggleOpenedClick: (id: string) => void;
    isOpened: boolean;
};

export const SubLocation = ({
    subLocation,
    timeZone,
    className,
    slPosition,
    onToggleOpenedClick,
    isOpened,
}: TProps) => {
    const {
        values: { view },
    } = useAppState();

    const rows = isOpened ? subLocation.rows : [subLocation.rows[0]];

    const renderBookingsInfo = (sl: TCalendarSubLocation) => {
        if (view === 'all' || sl.bookedTotal === 0) {
            return <>{sl.bookedTotal}</>;
        }
        return (
            <>
                {sl.booked} ({sl.bookedTotal})
            </>
        );
    };

    return (
        <StyledSubLocation
            id={`sublocation-${subLocation.id}`}
            className={cx(className, 'cy-sub-location', !subLocation.is_office && 'cy-home')}
        >
            <StickyRow
                sticky={
                    (subLocation.name?.length ?? 0) > 15 ? (
                        <StyledTitle>
                            <Tooltip title={subLocation.name}>{subLocation.name}</Tooltip>
                        </StyledTitle>
                    ) : (
                        <StyledTitle>{subLocation.name}</StyledTitle>
                    )
                }
                className="mb-2"
            >
                <Row>
                    {subLocation.is_office &&
                        subLocation.weekBookings.map((value, index) => {
                            return (
                                <Cell key={uid({ value, index })}>
                                    <Capacity>
                                        {value} of {subLocation.capacity[index].capacity}
                                    </Capacity>
                                </Cell>
                            );
                        })}
                </Row>
            </StickyRow>

            <StickyRow
                sticky={
                    <StyledCapacity>
                        {subLocation.rows.length > 1 && (
                            <div
                                aria-label="expand-button"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onToggleOpenedClick(subLocation.id);
                                    }
                                }}
                                className={cx({ control: true, closed: !isOpened })}
                                onClick={() => {
                                    onToggleOpenedClick(subLocation.id);
                                }}
                            >
                                <ChevronRightIcon />
                            </div>
                        )}

                        <StyledBlockInfo className={cx({ extra: subLocation.rows.length > 1 })}>
                            <div className="inner">
                                <span>Booked</span>
                                <span>{renderBookingsInfo(subLocation)}</span>
                            </div>
                            <div className="inner">
                                <span>Capacity</span>
                                <span
                                    className={cx(!subLocation.is_office && 'inner__home-capacity')}
                                >
                                    {subLocation.is_office ? subLocation.weekCapacity : 'Unlimited'}
                                </span>
                            </div>
                        </StyledBlockInfo>
                    </StyledCapacity>
                }
            >
                <>
                    {rows.map((row) => {
                        return (
                            <StyledRowWrapper role="tabpanel" aria-label="row" key={row.id}>
                                <Row>
                                    {row.days.map((val) => {
                                        return (
                                            <Cell
                                                key={val.id}
                                                className={`cy-cell-${DateTime.fromISO(val.date, {
                                                    zone: timeZone,
                                                }).toFormat(DATE_FORMAT)}`}
                                            >
                                                <Day
                                                    key={`${val.id}`}
                                                    isHighlighted={val.isHighlighted}
                                                >
                                                    {!val.booking && val.isActionCard && (
                                                        <Action
                                                            date={val.date}
                                                            subLocation_id={subLocation.id}
                                                            is_user_action={val.isHighlighted}
                                                        />
                                                    )}
                                                    {val.booking && (
                                                        <BookedCard
                                                            slPosition={slPosition}
                                                            booking={val.booking}
                                                            is_office={subLocation.is_office}
                                                        />
                                                    )}
                                                </Day>
                                            </Cell>
                                        );
                                    })}
                                </Row>
                            </StyledRowWrapper>
                        );
                    })}
                </>
            </StickyRow>
        </StyledSubLocation>
    );
};
