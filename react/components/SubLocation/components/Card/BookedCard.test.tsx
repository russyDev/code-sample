import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReactQueryProvider } from 'src/utils/react-query';
import { DeleteOutlinedIcon, EditOutlinedIcon } from 'elmo-elements';
import { mockUser } from 'src/mocks';
import { BookedCard } from './BookedCard';
import { useCardState } from './hooks/useCardState';
import { useBookingFiltered } from '../../../../hooks/useBookingFiltered';
import type { TCalendarBooking } from '../../../../types';

jest.mock('./hooks/useCardState');
jest.mock('../../../../hooks/useBookingFiltered');

const booking: TCalendarBooking = {
    id: 'id',
    booking_date: '',
    created_at: '',
    modified_at: '',
    user_id: '',
    sublocation_id: '',
    user: mockUser,
    canEdit: true,
    canDelete: true,
    isInSameTeam: true,
};

const mockResponse = {
    canEdit: true,
    isInSameTeam: true,
    showActions: true,
    actions: [
        {
            name: 'Edit',
            action: jest.fn(),
            icon: <EditOutlinedIcon />,
        },
        {
            name: 'Delete',
            action: jest.fn(),
            icon: <DeleteOutlinedIcon />,
        },
    ],
    onEditClick: jest.fn(),
};

describe('Card', () => {
    beforeEach(() => {
        (useCardState as jest.Mock).mockReturnValue(mockResponse);
        (useBookingFiltered as jest.Mock).mockReturnValue({
            isVisible: true,
        });
    });

    afterEach(jest.clearAllMocks);

    it('Should render correct', () => {
        render(<BookedCard booking={booking} is_office={false} />, { wrapper: ReactQueryProvider });
        screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`);
        screen.getByText('At Home');

        fireEvent.click(screen.getByRole('button', { name: 'card-actions' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Edit' }));
        expect(mockResponse.actions[0].action).toBeCalled();

        fireEvent.click(screen.getByRole('button', { name: 'card-actions' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));
        expect(mockResponse.actions[1].action).toBeCalled();
    });

    it('Double click', () => {
        render(<BookedCard booking={booking} is_office={false} />, { wrapper: ReactQueryProvider });
        const card = screen.getByRole('button', { name: 'booked-card' });
        fireEvent.dblClick(card);
        expect(mockResponse.onEditClick).toBeCalled();
    });
});
