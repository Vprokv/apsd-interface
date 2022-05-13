import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

test('renders login page', () => {
  render(<MemoryRouter><App /></MemoryRouter>)
  const buttonElement = screen.getByText(/Вход/i)
  expect(buttonElement).toBeInTheDocument
})
