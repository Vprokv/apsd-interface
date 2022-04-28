import { render, screen } from '@testing-library/react'
import App from './App'

test('renders login page', () => {
  render(<App />)
  const buttonElement = screen.getByText(/Вход/i)
  expect(buttonElement).toBeInTheDocument
})
