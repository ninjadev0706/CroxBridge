import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import chainsdetails from '../../config/chains.json';

interface TxData {
  columns?: any
  transactions?: any
}

const TxTable: React.FC<TxData> = ({ columns, transactions }) => {
  const FulFilled = styled.div`
    background-color: #34d399;
    padding: 3px 10px;
    border-radius: 5px;
    width: 100px;
    text-align: center;
  `

  const Cancelled = styled.div`
    background-color: #ef4444;
    padding: 3px 10px;
    border-radius: 5px;
    width: 100px;
    text-align: center;
  `

  const Prepared = styled.div`
    background-color: #f59e0b;
    padding: 3px 10px;
    border-radius: 5px;
    width: 100px;
    text-align: center;
  `

  const [chainDatas, setChainDatas] = useState(null);
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    const chainde = JSON.stringify(chainsdetails);
    const chainDetail = JSON.parse(chainde);
    setChainDatas(chainDetail)
  }, [])

  transactions.sort((a, b) => a.preparedAt > b.preparedAt ? -1 : 1)

  useEffect(() => {
    if(transactions) {
      setRows([...transactions])
    }
  }, [transactions])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '96%', maxWidth: '1200px', overflow: 'hidden', margin: '30px auto', backgroundColor: "#2c2d3a" }}>
      <TableContainer sx={{ maxHeight: 700 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className='table-header'>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  className="table-header"
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const txdetails = row.action.crosschainTx.invariant;
                const fromChain = row.fromChainId;
                const sendChain = chainDatas.find((detail) => detail.chain_id === fromChain);

                const toChain = row.toChainId;
                const receiveChain = chainDatas.find((detail) => detail.chain_id === toChain);

                return (
                  <TableRow hover role="checkbox">
                    <TableCell className="table-cell">
                      <TableRow>
                        {sendChain.title}
                      </TableRow>
                      <TableRow>
                        {txdetails.user.slice(0, 5)}...{txdetails.user.slice(-5)}
                      </TableRow>
                    </TableCell>
                    <TableCell className="table-cell">
                      <TableRow>
                        {receiveChain.title}
                      </TableRow>
                      <TableRow>
                        {txdetails.receivingAddress.slice(0, 5)}...{txdetails.receivingAddress.slice(-5)}
                      </TableRow>
                    </TableCell>
                    <TableCell className="table-cell">
                      <TableRow>
                        {txdetails.sendingAssetId.slice(0, 5)}...{txdetails.sendingAssetId.slice(-5)}
                      </TableRow>
                      <TableRow>
                        {row.fromAmount}
                      </TableRow>
                    </TableCell>
                    <TableCell className="table-cell">
                      <TableRow>
                        {txdetails.receivingAssetId.slice(0, 5)}...{txdetails.receivingAssetId.slice(-5)}
                      </TableRow>
                      <TableRow>
                        {row.toAmount}
                      </TableRow>
                    </TableCell>
                    <TableCell className="table-cell">
                      {row.status === "SenderTransactionPrepared" && <Prepared>PREPARED</Prepared>}

                      {row.status === "FULFILLED" && <FulFilled>FULFILLED</FulFilled>}
                      {row.status === "CANCELLED" && <Cancelled>CANCELLED</Cancelled>}
                      {row.status !== "CANCELLED" && row.status !== "FULFILLED" && row.status !== "SenderTransactionPrepared" && <Prepared>PREPARED</Prepared>}

                    </TableCell>
                    <TableCell className="table-cell">
                      <TableRow>
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(row.preparedAt * 1000)}
                      </TableRow>
                      <TableRow>
                        {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(row.preparedAt * 1000)}
                      </TableRow>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        className="table-header"
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default TxTable;