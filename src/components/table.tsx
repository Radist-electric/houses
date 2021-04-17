import { useState, useEffect } from 'react'
import { withStyles, Theme, createStyles, makeStyles } from '@material-ui/core/styles'
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

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
})

export default function CustomizedTables(props: any) {
  console.log('props table', props)
  const classes = useStyles()
  const [data, setData] = useState(null)
  console.log('data', data)
  

  useEffect(() => {
    console.log('useEffect table props')
    if (props.houses !== null) {
      const houses = JSON.parse(JSON.stringify(props.houses.data)).map((item: any, index: number) => {
        return {
          id: item.id,
          address: item.address,
          reestrFlatCount: item.reestrFlatCount,
          createdAt: item.createdAt
        }
      })
      console.log('houses', houses)
      
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
        <StyledTableCell align="right">{row.address}</StyledTableCell>
        <StyledTableCell align="right">{row.reestrFlatCount}</StyledTableCell>
        <StyledTableCell align="right">{row.createdAt}</StyledTableCell>
      </StyledTableRow>
    ))
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>id</StyledTableCell>
            <StyledTableCell align="right">Адрес</StyledTableCell>
            <StyledTableCell align="right">Кол-во квартир</StyledTableCell>
            <StyledTableCell align="right">Дата добавления</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
