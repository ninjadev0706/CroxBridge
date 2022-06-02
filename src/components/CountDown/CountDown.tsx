import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Heading } from 'crox-new-uikit'

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 20px;
`

const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: #d9dada;
  @media screen and (max-width: 1000px) {
    padding: 0.4rem;
    width: 80px;
    height: 80px;
  }  
`
const Inner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #fefefe;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const CountDown = ({ timestamp }: { timestamp: number }) => {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [poolActive, setPoolActive] = useState<boolean>(false)

  const leadingZero = (num) => {
    return num < 10 && num > 0 ? `0 ${num}` : num
  }
  
  useEffect(() => {
    const timer = setInterval(() => {      
      if ((timestamp - Date.now()) < 0) {
        setPoolActive(false)
      } else {
        setPoolActive(true)
        const timee = timestamp - Date.now()
        const time = Math.abs(timee)
        const dayss = Math.floor(time / (1000 * 60 * 60 * 24))
        const hourss = Math.floor((time / (1000 * 60 * 60)) % 24)
        const minutess = Math.floor((time / 1000 / 60) % 60)
        const secondss = Math.floor((time / 1000) % 60)
        setDays(dayss)
        setHours(hourss)
        setMinutes(minutess)
        setSeconds(secondss)
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [timestamp]);

  return poolActive ? (
    <Col>
      <Heading as="h1" size="lg" mb="24px" color="secondary">
        Farming Starts in
      </Heading>
      <Wrapper>
        {/* <Circle>
          <Inner>
            <Heading size="lg">{leadingZero(days)}</Heading>
            <Text>{days === 1 ? 'day' : 'days'}</Text>
          </Inner>
        </Circle> */}
        <Circle>
          <Inner>
            <Heading size="lg">{leadingZero(hours)}</Heading>
            <Text>{hours === 1 ? 'hour' : 'hours'}</Text>
          </Inner>
        </Circle>
        <Circle>
          <Inner>
            <Heading size="lg">{leadingZero(minutes)}</Heading>
            <Text>{minutes === 1 ? 'minute' : 'minutes'}</Text>
          </Inner>
        </Circle>
        <Circle>
          <Inner>
            <Heading size="lg">{leadingZero(seconds)}</Heading>
            <Text>{seconds === 1 ? 'second' : 'seconds'}</Text>
          </Inner>
        </Circle>
      </Wrapper>
    </Col>
  ) : null
}

export default CountDown
