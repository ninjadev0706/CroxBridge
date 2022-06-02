import React, { useEffect, useRef } from 'react'
import { useCountUp } from 'react-countup'
import { Text } from 'crox-new-uikit'

interface CardValueProps {
  value: number
  decimals?: number
  fontSize?: string
  prefix?: string
  kind?: string
  color?: string
  isInvestor?: boolean;
}

const CardValue: React.FC<CardValueProps> = ({ value, decimals, fontSize = '20px', prefix, kind, color = "textSubtle" }) => {
  const { countUp, update } = useCountUp({
    start: 0,
    end: value,
    duration: 1,
    separator: ',',
    decimals:
      // eslint-disable-next-line no-nested-ternary
      decimals !== undefined ? decimals : value < 0 ? 4 : value > 1e5 ? 0 : 3,
  })

  const updateValue = useRef(update)

  useEffect(() => {
    updateValue.current(value)
  }, [value, updateValue])

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {kind ? (
        <>
          <Text fontSize="20px" color={color}>Liquidity: </Text>
          <Text color="primary" fontSize={fontSize} style={{marginLeft: '4px'}}>
            {prefix}{countUp}
          </Text>
        </>
        ):(
          <Text color={color} fontSize={fontSize} bold>
            {prefix}{countUp}
          </Text>
        )
      }      
    </div>
  )
}

export default CardValue
