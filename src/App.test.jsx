import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App.jsx';

const mockResumeData = {
  main: {
    name: 'Test Person',
    firstName: 'Test',
    lastName: 'Person',
    occupation: 'Engineer',
    tagline: 'Building things',
    bio: 'A bio.',
    contactmessage: 'Say hi.',
    email: 'test@example.com',
    address: { city: 'Testville', state: 'TS' },
    resumedownload: 'jay.pdf',
    social: [],
  },
  resume: {
    skillmessage: 'Skills summary.',
    education: [],
    work: [],
    skillCategories: [],
  },
  projects: [],
};

describe('App', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockResumeData) })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the resume data once loaded', async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText('Test Person')).toBeInTheDocument());
  });
});
