import React, {Component, ReactElement, ReactNode} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import { drawTheme } from '../src/pages/_app'
import { ThemeProvider, createTheme } from '@mui/material'
import { makeThemeA } from '../makeThemeA'

// const queryClient = new QueryClient();

// // const AllTheProviders = ({Component, pageProps}: AppProps) => {
// const AllTheProviders = ({children}: {children: ReactNode}) => {
//   return (
//     <ThemeProvider theme={drawTheme}>
//         {children}
//     </ThemeProvider>
//   )
// }

export const MockTheme = ({ children }: any) => {
  const theme = makeThemeA();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export * from '@testing-library/react'

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: MockTheme, ...options})

// export {customRender as render}