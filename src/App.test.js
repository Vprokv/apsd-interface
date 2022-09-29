import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { RecoilRoot } from 'recoil'
import { MemoryRouter as Router } from 'react-router-dom'
import App from './App'

test('when open root', async () => {
  render(
    <RecoilRoot>
      <Router history={history}>
        <App />
      </Router>
    </RecoilRoot>
  )

  await screen.findByRole('button')

  expect(screen.getByRole('button')).toHaveTextContent('Вход')
})
