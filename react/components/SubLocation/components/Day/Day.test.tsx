import React from 'react';
import { render, screen } from '@testing-library/react';
import { Day } from './Day';

describe('Day component', () => {
    it('component should render correct', () => {
        const { container } = render(<Day isHighlighted>test children content</Day>);
        screen.getByText(/test children content/i);

        expect((container.firstChild as HTMLDivElement).classList.contains('highlighted')).toBe(
            true
        );
    });
    it('should not be highlighted', () => {
        const { container } = render(<Day>test children content</Day>);
        screen.getByText(/test children content/i);

        expect((container.firstChild as HTMLDivElement).classList.contains('highlighted')).toBe(
            false
        );
    });
});
