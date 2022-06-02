import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, Button } from 'crox-new-uikit'
import networkList from './NetworkList'

const StyledModal = styled.div`
  background-color: #23242F;
  padding: 20px 0;
  border-radius: 10px;
  margin: 0 30px;
  text-align: center;
  width: 580px;
  transition: all ease 200ms;
  @media screen and (max-width: 580px) {
    width: 360px;
    .searchInput {
      width: 300px !important;
    }
  }
`

const NetworkSelector = styled.button`
    text-align: center;
    transition: all ease 200ms;
    width: 250px;
    margin: 10px;
    margin-bottom: 0;
    position: relative;
    cursor: pointer;
    border: none;
    &:hover{
      transform: scale(1.05)
    }
`

const NetworkSelectModal = ({ isfrom, onDismiss, selectNetwork }) => {
  // const [query, setQuery] = useState("")
  // const searchChain = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuery(event.target.value)
  // }
  const [totalNetworkList, setTotalNetworkList] = useState(networkList)
  useEffect(() => {
    const networkLists = networkList;
    // if (query) {
      // const lowerCaseQuery = query.toLocaleLowerCase()
      // networkLists = networkLists.filter((network: any) => {
      //   return network.title.toLowerCase().includes(lowerCaseQuery)
      // })
    // }
    setTotalNetworkList(networkLists)
  }, [])

  return (
    <StyledModal>
      <Button style={{ position: "fixed", right: '50px', top: '20px', backgroundColor: 'transparent', boxShadow: 'none', width: '20px' }} onClick={onDismiss}>&#10006;</Button>
      {isfrom.from ? <Text color='textSubtle' fontSize="24px" p="20px" bold>Select Source Chain</Text> : <Text color='textSubtle' fontSize="24px" p="20px" bold>Select Destination Chain</Text>}
      {totalNetworkList.map((entry) => (
        <NetworkSelector onClick={() => selectNetwork(entry.chainID, isfrom)} className="btnfos-1 btnfos-4" key={entry.chainID}>
          <svg>
            <rect x="0" y="0" fill="none" width="100%" height="100%" />
          </svg>
          <Flex alignItems="center">
            <img src={`images/network/${entry.img}_net.png`} alt={`${entry.title} icon`} style={{ width: '40px', margin: '0 20px' }} />
            <span><Text color='textSubtle'>{entry.title}</Text></span>
          </Flex>
        </NetworkSelector>
      ))}
    </StyledModal>
  )
}

export default NetworkSelectModal
