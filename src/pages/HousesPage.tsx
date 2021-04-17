import { useState, useContext, useEffect, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/loader'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TablePaginationActions from '../components/table'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CustomizedSnackbars from '../components/alert'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    table: {
      marginTop: theme.spacing(5)
    },
    buttons: {
      display: 'flex',
      justifyContent: 'center',
      margin: `${theme.spacing(2)}px 0`
    },
    current: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
  }),
)

export const HousesPage = () => {
  const classes = useStyles()
  const auth = useContext(AuthContext)
  const [companies, setCompanies] = useState(null)
  const [houses, setHouses] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const [message, setMessage] = useState({
    show: false,
    severity: 'success',
    text: ''
  })
  const [select, setSelect] = useState<{ data: any; name: string }>({
    data: '',
    name: 'Company Data'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    prevPage: 1,
    nextPage: 1,
    lastPage: 1,
    perPage: 10
  })

  const handleChange = (event: React.ChangeEvent<{ id?: string; value: unknown }>) => {
    const name = event.target.id as keyof typeof select;
    const value = JSON.parse(JSON.stringify(event.target.value)).split(',')
    setSelect({
      ...select,
      [name]: value
    })
  }

  // ComponentDidMount
  useEffect(() => {
    if (auth.isAuthenticated) {
      getCompanies()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Получить список компаний
  const getCompanies = async () => {
    const url: string = 'http://test-alpha.reestrdoma.ru/api/reestrdoma/companies/'
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`
      }
    }
    try {
      const data = await request(url, requestOptions)
      // console.log('data companies', data)
      setCompanies(data.errors ? null : data)

    } catch (e) { }
  }

  // Получить список домов
  const getHouses = useCallback(async (company_id: any, page: number, perPage: number) => {
    const url: string = `http://test-alpha.reestrdoma.ru/api/reestrdoma/company/houses/${company_id}/?page=${page}&perPage=${perPage}`
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.token}`
      }
    }
    try {
      const data = await request(url, requestOptions)
      console.log('data houses', data)
      setHouses(data.errors ? null : data)

      setPagination({
        ...pagination,
        currentPage: data.links.currentPage,
        nextPage: data.links.nextPage,
        prevPage: data.links.prevPage,
        lastPage: data.links.lastPage
      })


    } catch (e) { }
  }, [auth.token])

  // Запрос на сервер
  const request = async (url: string, requestOptions: any) => {
    setLoading(true)
    try {
      const response = await fetch(url, requestOptions)
      const data = await response.json()

      if (!response.ok) {
        setMessage({
          show: true,
          severity: 'error',
          text: data.errors.messages[0].message
        })
      }
      setLoading(false)
      return data

    } catch (e) {
      setLoading(false)
      throw e
    }
  }

  // Проверяем изменения Select
  useEffect(() => {
    // console.log('select', select)
    if (select.data) {
      const housesCount = +select.data[1]

      if (housesCount === 0 || housesCount === undefined) {
        setShowTable(false)
      } else {
        setShowTable(true)
        getHouses(select.data[0], 1, pagination.perPage)
      }
    }
  }, [select, getHouses]) // eslint-disable-line react-hooks/exhaustive-deps

  // Сменить страницу пагинации
  const paginationHandler = (type: string) => {
    let page
    switch (type) {
      case 'first':
        page = 1
        break
      case 'prev':
        page = pagination.prevPage
        break
      case 'next':
        page = pagination.nextPage
        break
      case 'last':
        page = pagination.lastPage
        break
      default:
        page = 1
    }
    if (page !== pagination.currentPage && page !== null) {
      getHouses(select.data[0], page, pagination.perPage)
    }
  }

  // Формируем список компаний в опциях выбора
  let options
  if (companies !== null) {
    const array = JSON.parse(JSON.stringify(companies))
    options = array.data.map((item: any, index: any) => {
      return <option value={[item.id, item.housesCount]} key={index}>{item.name}</option>
    })
  }

  return (
    <>
      <Typography variant="h5" component="h1">Список домов</Typography>
      {!auth.isAuthenticated &&
        <Typography variant="body1" component="p">Данные доступны только для авторизованных пользователей. Пожалуйста, войдите в систему.</Typography>
      }

      {loading && <Loader />}

      {(companies !== null) && <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-native-simple">Выберите компанию</InputLabel>
        <Select
          native
          autoWidth={true}
          value={select.data}
          onChange={handleChange}
          inputProps={{
            id: 'data'
          }}
        >
          <option aria-label="Выберите компанию" value="" />
          {options}
        </Select>
      </FormControl>}

      <div className={classes.table}>
        {showTable && 
        <>
        <TablePaginationActions houses={houses} />
        <div className={classes.buttons}>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
          <Button onClick={() => { paginationHandler('first') }}>1</Button>
          <Button onClick={() => { paginationHandler('prev') }}>&lt;</Button>
          <Button onClick={() => { paginationHandler('next') }}>&gt;</Button>
          <Button onClick={() => { paginationHandler('last') }}>{pagination.lastPage}</Button>
        </ButtonGroup>
      </div>

      <Typography className={classes.current} variant="body1" component="p">{pagination.currentPage} из {pagination.lastPage}</Typography>

        </>
        }
        {!showTable && auth.isAuthenticated && <Typography variant="body1" component="p">Данные по домам отсутствуют.</Typography>}
      </div>



      <CustomizedSnackbars message={message} />
    </>
  )
}
