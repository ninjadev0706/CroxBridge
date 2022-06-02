import styled from 'styled-components'

const Container = styled.div`
  margin: auto;
  width: 100%;
  background-color: #1A1B23;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: auto;
  }
`

export default Container
