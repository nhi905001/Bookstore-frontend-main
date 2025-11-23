import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('renders the copyright notice', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} Tiệm Sách. Đã đăng ký bản quyền.`;
    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});

