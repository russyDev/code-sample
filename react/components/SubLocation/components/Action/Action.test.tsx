import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactQueryProvider } from 'src/utils/react-query';
import { useAuth } from 'src/utils/auth';
import { useAddBooking } from 'src/hooks/queries/booking/useAddBooking';
import { DateTime } from 'luxon';
import { DATE_FORMAT, DEFAULT_TIME_ZONE } from 'src/constants';
import { useAppState } from 'src/context';
import { Action } from './index';

jest.mock('src/utils/auth');
jest.mock('src/hooks/queries/booking/useAddBooking');
jest.mock('src/context');

const addBookingFunc = jest.fn();
const callModalFunc = jest.fn();
const date = DateTime.local().toISO();
const handleCallNotification = jest.fn();

describe('Action', () => {
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue({
            user: {
                profile: {
                    user: {
                        id: 'user_id',
                    },
                },
            },
        });
        (useAddBooking as jest.Mock).mockReturnValue({
            mutateAsync: addBookingFunc,
            isLoading: false,
        });
        (useAppState as jest.Mock).mockReturnValue({
            actions: { handleCallModal: callModalFunc, handleCallNotification },
            values: {
                location: 'location_id',
                range: {
                    from: DateTime.local(),
                    to: DateTime.local(),
                },
            },
        });
    });
    it('Should render correct', () => {
        render(
            <Action is_user_action user_id="user_id" subLocation_id="subLocation_id" date={date} />,
            {
                wrapper: ReactQueryProvider,
            }
        );

        screen.getByText(/add booking/i);
        const button = screen.getByRole('button', { name: '+ Add Booking' });
        fireEvent.click(button);

        expect(addBookingFunc).toHaveBeenCalledWith({
            sublocation_id: 'subLocation_id',
            user_id: 'user_id',
            booking_date: DateTime.fromISO(date as string, { zone: DEFAULT_TIME_ZONE }).toFormat(
                DATE_FORMAT
            ),
        });
    });

    it('On enter event', () => {
        render(<Action is_user_action />, { wrapper: ReactQueryProvider });
        const button = screen.getByRole('button', { name: '+ Add Booking' });
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(addBookingFunc).toHaveBeenCalled();
    });

    it('call modal', () => {
        render(
            <Action
                is_user_action={false}
                user_id="user_id"
                subLocation_id="subLocation_id"
                date={date}
            />,
            {
                wrapper: ReactQueryProvider,
            }
        );

        const button = screen.getByRole('button', { name: '+ Add Booking' });
        fireEvent.click(button);
        expect(callModalFunc).toHaveBeenCalledWith({
            name: 'BookingModal',
            options: {
                subLocation_id: 'subLocation_id',
                user_id: 'user_id',
                date,
            },
        });
    });

    it('Should display error notification', () => {
        addBookingFunc.mockImplementation(() => {
            throw new Error();
        });
        (useAddBooking as jest.Mock).mockReturnValue({
            mutateAsync: addBookingFunc,
            isLoading: false,
        });
        render(<Action is_user_action />, { wrapper: ReactQueryProvider });

        const button = screen.getByRole('button', { name: '+ Add Booking' });
        fireEvent.keyDown(button, { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(handleCallNotification).toHaveBeenCalled();
    });
});
