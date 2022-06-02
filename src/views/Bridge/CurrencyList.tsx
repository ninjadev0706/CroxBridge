import React from "react";
import { Flex, Text } from "crox-new-uikit";

const CurrencyList = ({ tokenList, selectToken }) => {
    return (
        <Flex flexDirection='column' className="currencyList">
            {tokenList.map((token) => {
                return (
                    <Flex mb='20px' key={token.index}>
                        <Flex style={{ cursor: 'pointer' }} onClick={() => selectToken(token.index)}>
                            <img alt={token.name} src={token.logoURI ? token.logoURI : `images/coins/${token.name}.png`} width='24px' height='24px'
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = '/images/no_icon.png'
                                }} />
                            <Text ml='10px'>{token.name}</Text>
                        </Flex>
                    </Flex>
                )
            })}
        </Flex>
    )
}

export default CurrencyList