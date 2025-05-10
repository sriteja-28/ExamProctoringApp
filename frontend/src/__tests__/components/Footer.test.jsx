import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  test('renders copyright text with current year', () => {
    const currentYear = new Date().getFullYear();
    render(<Footer />);
    // Check that the copyright text contains the current year and expected phrases.
    expect(
      screen.getByText(new RegExp(`©\\s*${currentYear}\\s*All rights reserved`, 'i'))
    ).toBeInTheDocument();
  });

  test('renders developer link with correct attributes', () => {
    render(<Footer />);
    const developerLink = screen.getByRole('link', { name: /Muthangi Sri Teja/i });
    expect(developerLink).toBeInTheDocument();
    expect(developerLink).toHaveAttribute('href', '#');
    // Also check that the link opens in a new tab.
    expect(developerLink).toHaveAttribute('target', '_blank');
    expect(developerLink).toHaveAttribute('rel', 'noopener');
  });
});
