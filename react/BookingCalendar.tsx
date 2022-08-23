import React from 'react';

type TProps = {
    subLocations: TSubLocations;
    isFetchingData: boolean;
    handleSetBookingsLoading?: ((newState: boolean) => void) | void;
};

export const BookingCalendar = (props: TProps) => {
    const { subLocations, isFetchingData, handleSetBookingsLoading } = props;
    const {
        calendarData,
        isBookingLoading,
        isBookingFetching,
        isFetching,
        weekBookingsCount,
        totalCapacity,
        isDisabled,
        timeZone,
        toggleOpened,
        subLocationBehave,
    } = useCalendarState({ subLocations, handleSetBookingsLoading });

    return (
        <Fieldset isDisabled={isDisabled}>
            <Loader type="spinner" isLoading={isFetching || isFetchingData}>
                <LoadingOverlay isLoading={isBookingLoading || isBookingFetching || isFetching}>
                    <StyledCalendar className="scroll-target">
                        {calendarData.map((subLocation, index) => {
                            return (
                                <SubLocation
                                    slPosition={index}
                                    timeZone={timeZone}
                                    key={uid(subLocation)}
                                    subLocation={subLocation}
                                    className={cx(!!index && 'mt-3')}
                                    onToggleOpenedClick={toggleOpened}
                                    isOpened={subLocationBehave[index]?.isOpened}
                                />
                            );
                        })}

                        <DividerWrapper className="mt-3">
                            <Divider />
                        </DividerWrapper>

                        <StickyRow
                            sticky={<StyledTitle>Total</StyledTitle>}
                            className="mt-3 with-background-and-radius"
                        >
                            <Row>
                                {weekBookingsCount.map((value, index) => {
                                    return (
                                        <Cell key={uid({ value, index })}>
                                            <Capacity>
                                                {value} of {totalCapacity[index]?.capacity ?? 0}
                                            </Capacity>
                                        </Cell>
                                    );
                                })}
                            </Row>
                        </StickyRow>
                    </StyledCalendar>
                </LoadingOverlay>
            </Loader>
        </Fieldset>
    );
};
