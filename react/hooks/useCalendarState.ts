import { useAppState } from 'src/context';
import get from 'lodash/get';

type TProps = {
    subLocations: TSubLocations;
    handleSetBookingsLoading?: ((newState: boolean) => void) | void;
};

export const useCalendarState = (props: TProps) => {
    const { subLocations, handleSetBookingsLoading } = props;
    const { user: userData } = useAuth();
    const currentUser = get(userData, 'profile.user');
    const timeZone = get(currentUser, 'timezone', DEFAULT_TIME_ZONE);

    const {
        values: { location, range, view },
    } = useAppState();

    const {
        values: { isActionsDisabled },
    } = useCalendarPageState();

    const { data: usersData, isLoading: isUsersLoading } = useGetUsersByDates({
        start_date: range.from.toFormat(DATE_FORMAT),
        end_date: range.to.toFormat(DATE_FORMAT),
        location_id: location,
    });

    const { users } = useFilterUsersByTeam({
        type: view,
        skipCurrentUserManager: false,
        users: usersData || [],
    });

    const payload: TGetAllBookingPayLoad = {
        sublocation_id: subLocations.map((sl) => sl.id),
        start_date: range.from.toFormat(DATE_FORMAT),
        end_date: range.to.toFormat(DATE_FORMAT),
    };

    const { totalCapacityPerDay } = useCapacityData();
    const {
        data: bookingsData = [],
        isLoading: isBookingLoading,
        isFetching: isBookingFetching,
        refetch: refetchBookingsData,
    } = useGetBookingsByLocationIds(payload);

    const bookings: TCalendarBooking[] = useExtendedBookings(bookingsData, users);

    const prevIsActionsDisabled = usePrevious<boolean>(isActionsDisabled);
    useEffect(() => {
        if (!isActionsDisabled && prevIsActionsDisabled) {
            (() => refetchBookingsData())();
        }
    }, [isActionsDisabled, prevIsActionsDisabled, refetchBookingsData]);

    const { isBookingVisible } = useBookingFiltered(users);
    const bookingsFiltered = useMemo(
        () => bookings.filter((booking) => isBookingVisible(booking)),
        [bookings, isBookingVisible]
    );

    const calendarData = useCalendarData({
        subLocations,
        bookings,
        bookingsFiltered,
    });

    const memoizedBehaveCalendarData = useMemo(
        () => calendarData.map((sl) => ({ id: sl.id, isOpened: sl.isOpened })),
        [calendarData]
    );

    const [subLocationBehave, setSubLocationBehave] = useState<{ id: string; isOpened: boolean }[]>(
        []
    );

    const prevCalendarData = usePrevious(calendarData);
    useEffect(() => {
        if (
            ((prevCalendarData && calendarData.length !== prevCalendarData?.length) ||
                !subLocationBehave.length) &&
            !isEqual(memoizedBehaveCalendarData, subLocationBehave)
        ) {
            setSubLocationBehave(memoizedBehaveCalendarData);
        }
    }, [
        calendarData,
        calendarData.length,
        prevCalendarData,
        subLocationBehave,
        memoizedBehaveCalendarData,
    ]);

    const toggleOpened = (id: string) => {
        setSubLocationBehave(
            subLocationBehave.map((sl) => {
                return { ...sl, isOpened: sl.id === id ? !sl.isOpened : sl.isOpened };
            })
        );
    };

    const dates = getDatesArrayFromInterval(range.from.toISO(), range.to.toISO(), timeZone);
    const subLocationOutOfOffice = subLocations.filter((sl) => !sl.is_office);
    const listOfOfficeBookings = bookings.filter(
        (booking) => !subLocationOutOfOffice.find((sl) => sl.id === booking.sublocation_id)
    );
    const weekBookingsCount = dates.map((date) => {
        const lookingDate = DateTime.fromISO(date, { zone: timeZone }).toFormat(DATE_FORMAT);
        return listOfOfficeBookings.filter((booking) => booking.booking_date === lookingDate)
            .length;
    });

    useEffect(() => {
        if (handleSetBookingsLoading) {
            handleSetBookingsLoading(isBookingFetching || !location);
        }
    }, [handleSetBookingsLoading, isBookingFetching, location]);

    return {
        isFetching: !location,
        isBookingLoading: isUsersLoading || isBookingLoading,
        isBookingFetching,
        calendarData,
        weekBookingsCount,
        totalCapacity: totalCapacityPerDay,
        isDisabled: isActionsDisabled,
        view,
        isAdmin: currentUser?.isAdmin,
        timeZone,
        toggleOpened,
        subLocationBehave,
    };
};
