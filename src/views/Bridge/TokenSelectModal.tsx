import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Text, Flex, Input, Button } from 'crox-new-uikit'
import ReactTooltip from 'react-tooltip';
import { VscCloseAll } from 'react-icons/vsc'
import { BsPatchQuestion, BsSortAlphaDownAlt } from 'react-icons/bs'
import CurrencyList from './CurrencyList'
import './tokenmodal.css'

const StyledModal = styled.div`
  background-color: ${({ theme }) => theme.colors.modalBridgeBackground};
  padding: 35px 25px 25px;
  border-radius: 10px;
  margin: 0 30px;
  text-align: center;
  width: 420px;
  transition: all ease 200ms;
  @media screen and (max-width: 580px) {
    width: 360px;
    .searchInput {
      width: 300px !important;
    }
  }
`

const TokenSelectModal = ({ onDismiss, swapConfig, selectToken }) => {
    return (
        <StyledModal>
            <Flex justifyContent='space-between' alignItems='center' mb='15px'>
                <Flex alignItems='center'>
                    <Text fontSize='18px' mr='5px' bold>Select a Token</Text>
                    <BsPatchQuestion style={{ color: 'EAE2FC', cursor: 'pointer', fontSize: '18px' }} data-tip data-for='tip1' />
                    <ReactTooltip id='tip1' aria-haspopup='true' place='right' backgroundColor='#1377bf' className='tooltip' >
                        <Text fontSize="14px" color="white">Find a token by searching for its name or symbol or by pasting its address below.</Text>
                    </ReactTooltip>
                </Flex>
                <VscCloseAll style={{ color: 'EAE2FC', fontSize: '24px', cursor: 'pointer' }} onClick={onDismiss} />
            </Flex>
            <Input placeholder='Search name or paste address' />
            <Flex justifyContent='space-between' alignItems='center' mt='30px' mb='20px'>
                <Text bold>Token Name</Text>
                <BsSortAlphaDownAlt style={{ color: 'EAE2FC', fontSize: '20px', cursor: 'pointer' }} />
            </Flex>
            <CurrencyList tokenList={swapConfig} selectToken={selectToken}/>
        </StyledModal>
    )
}

export default TokenSelectModal
