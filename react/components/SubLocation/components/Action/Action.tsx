import React from 'react';

type TProps = {
    subLocation_id?: string;
    user_id?: string;
    date?: string;
    is_user_action: boolean;
};

export const Action = ({ subLocation_id, user_id, date, is_user_action }: TProps) => {
    const queryClient = useQueryClient();
    const { user: userData } = useAuth();
    const profile = get(userData, 'profile');
    const user = get(profile, 'user');
    const timeZone = get(user, 'timezone', DEFAULT_TIME_ZONE);
    const userRoles = get(user, 'roles', [] as TUserRole[]);
    const { mutateAsync, isLoading } = useAddBooking();
    const {
        values: { location, range },
        actions: { handleCallModal, handleCallNotification },
    } = useAppState();
    const {
        actions: { handleSetActionsDisabled },
    } = useCalendarPageState();

    const submitBooking = async () => {
        try {
            handleSetActionsDisabled(true);
            await mutateAsync({
                sublocation_id: subLocation_id as string,
                user_id: user?.id as string,
                booking_date: DateTime.fromISO(date as string, { zone: timeZone }).toFormat(
                    DATE_FORMAT
                ),
            });
        } catch (error) {
            handleCallNotification({ message: getServerError(error), type: 'danger' });
        } finally {
            handleSetActionsDisabled(false);
            await queryClient.invalidateQueries([
                'users-list-date',
                {
                    location_id: location,
                    start_date: range.from.toFormat(DATE_FORMAT),
                    end_date: range.to.toFormat(DATE_FORMAT),
                },
            ]);
        }
    };

    const onClickHandler = async () => {
        if (!is_user_action || (is_user_action && userRoles.includes('ROLE_SUPER'))) {
            handleCallModal({
                name: 'BookingModal',
                options: {
                    subLocation_id,
                    user_id,
                    date,
                },
            });
        } else {
            try {
                await submitBooking();
            } catch (error) {
                return;
            }
        }
    };

    return (
        <StyledAction
            className="cy-action-card"
            role="button"
            tabIndex={0}
            onClick={() => onClickHandler()}
            onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                    await onClickHandler();
                }
            }}
        >
            <Loader type="spinner" isLoading={isLoading}>
                + Add Booking
            </Loader>
        </StyledAction>
    );
};
