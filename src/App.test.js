import { render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { MemoryRouter as Router } from 'react-router-dom'
import App from './App'

test('renders login page', () => {
  render(
    <RecoilRoot>
      <Router history={history}>
        <App />
      </Router>
    </RecoilRoot>
  )
  const buttonElement = screen.getByText(/Вход/i)
  expect(buttonElement).toBeInTheDocument
})
