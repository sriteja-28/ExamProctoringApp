import '@testing-library/jest-dom';

// Suppress specific React Router warnings
jest.spyOn(console, 'warn').mockImplementation((msg) => {
  if (msg.includes('React Router Future Flag Warning')) return;
  console.warn(msg);
});

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  // Import React locally in the factory to avoid out-of-scope issues.
  const LocalReact = require('react');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
    // Create a mock Link that forwards refs.
    Link: LocalReact.forwardRef((props, ref) => {
      const { children, to, ...rest } = props;
      return LocalReact.createElement('a', { href: to, ref, ...rest }, children);
    }),
  };
});

export { mockedNavigate };
