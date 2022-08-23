import get from 'lodash/get';
import { useAuth } from 'src/utils/auth';
import { useAppState } from 'src/context';

type TAction = {
    name: string;
    action: () => void;
    icon: React.ReactNode;
};

export const useCardState = (booking: TCalendarBooking) => {
    const { canEdit, canDelete, isInSameTeam } = booking;
    const { canBookDay, canOptimisticUpdate } = useControlsHelpers();
    const {
        actions: { handleCallModal, handleCloseModal },
    } = useAppState();
    const {
        actions: { handleSetActionsDisabled },
    } = useCalendarPageState();

    const { mutateAsync } = useDeleteBooking();

    const { user: userData } = useAuth();
    const currentUser = get(userData, 'profile.user', {});
    const currentUserId = get(currentUser, 'id', '');

    const showActions = (canEdit || canDelete) && canOptimisticUpdate(booking.booking_date);

    const onEditClick = () => {
        if (!canEdit || !canBookDay(booking.booking_date)) {
            return;
        }
        handleCallModal({
            name: 'BookingModal',
            options: {
                booking,
                subLocation_id: booking.sublocation_id,
                user_id: booking.user_id,
                date: booking.booking_date,
            },
        });
    };

    const deleteOwnBooking = async () => {
        try {
            handleSetActionsDisabled(true);
            await mutateAsync({ id: booking.id, message: '' });
        } finally {
            handleSetActionsDisabled(false);
        }
    };

    const onDeleteClick = async () => {
        if (booking.user_id !== currentUserId) {
            handleCallModal({
                name: 'DeleteBooking',
                options: {
                    id: booking.id,
                    onClose: () => {
                        handleCloseModal();
                    },
                },
            });
        } else {
            await deleteOwnBooking();
        }
    };

    const getActions = () => {
        const actions: TAction[] = [];

        if (canEdit && canBookDay(booking.booking_date)) {
            actions.push({
                name: 'Edit',
                action: onEditClick,
                icon: <EditOutlinedIcon />,
            });
        }

        if (canDelete) {
            actions.push({
                name: 'Delete',
                action: onDeleteClick,
                icon: <DeleteOutlinedIcon />,
            });
        }

        return actions;
    };

    return {
        canEdit,
        onEditClick,
        onDeleteClick,
        actions: getActions(),
        isInSameTeam,
        showActions,
        currentUser,
    };
};
