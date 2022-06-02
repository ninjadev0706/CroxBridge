import React from 'react'
import { Button, Flex } from 'crox-new-uikit'
import Page from '../../components/layout/Page'
import TxTable from './TxTable';
import "./explorer.css"

interface TxTableProps {
    columns?: any
    transactions?: any
    setSelectTab?: any
}

const Explorer: React.FC<TxTableProps> = ({ columns, transactions, setSelectTab }) => {

    return (
        <Page>
            <Flex style={{ justifyContent: "center" }}>
                <Button color="white" mb="10px" style={{
                    textAlign: 'center', fontSize: '30px', padding: "10px 22px",
                    background: "#22232d", borderRadius: '0'
                }} onClick={() => setSelectTab(false)}>
                    BRIDGE
                </Button>
                <Button color="white" mb="10px" style={{
                    textAlign: 'center', fontSize: '30px', padding: "10px 22px",
                    background: "#3b3c4e", borderRadius: '0'
                }} onClick={() => setSelectTab(true)}>
                    View Txns
                </Button>
            </Flex>
            <TxTable columns={columns} transactions={transactions} />
        </Page>
    )
}

export default Explorer;
