import { useState, useEffect } from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell)

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow)

export default function CustomizedTables(props: any) {
  const [data, setData] = useState(null)

  useEffect(() => {
    if (props.houses !== null) {
      const houses = JSON.parse(JSON.stringify(props.houses.data)).map((item: any, index: number) => {
        return {
          id: item.id,
          address: item.address,
          reestrFlatCount: item.reestrFlatCount,
          createdAt: item.createdAt
        }
      })
      setData(houses)
    }
  }, [props])

  let tableRows
  if (data !== null) {
    const array = JSON.parse(JSON.stringify(data))
    tableRows = array.map((row: any) => (
      <StyledTableRow key={row.id}>
        <StyledTableCell component="th" scope="row">
          {row.id}
        </StyledTableCell>
        <StyledTableCell>{row.address}</StyledTableCell>
        <StyledTableCell>{row.reestrFlatCount}</StyledTableCell>
        <StyledTableCell>{new Date(Date.parse(row.createdAt)).toLocaleDateString()}</StyledTableCell>
      </StyledTableRow>
    ))
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>id</StyledTableCell>
            <StyledTableCell>Адрес</StyledTableCell>
            <StyledTableCell>Кол-во квартир</StyledTableCell>
            <StyledTableCell>Дата добавления</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
