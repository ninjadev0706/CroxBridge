import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Text } from 'crox-new-uikit'
import { getBalanceNumber } from 'utils/formatBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';


interface SendAmountInputProps {
    curTokenAddr: string
    currentTokenBalance: number
    setTokenBalance: (amount: number) => void
}

const SendAmountInput: React.FC<SendAmountInputProps> = ({ curTokenAddr, currentTokenBalance, setTokenBalance }) => {

    const availableTokenBal = getBalanceNumber(useTokenBalance(curTokenAddr))
    setTokenBalance(availableTokenBal);

    return (
        <Text color="#8B8CA7">Balance: {currentTokenBalance.toFixed(2)}</Text>
    )
}

export default SendAmountInput
