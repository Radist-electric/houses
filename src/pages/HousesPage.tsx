import { useState, useContext, useEffect, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import TablePaginationActions from '../components/table'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CustomizedSnackbars from '../components/alert'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    table: {
      marginTop: theme.spacing(5),
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
      console.log('data companies', data)
      setCompanies(data.errors ? null : data)

    } catch (e) { }
  }

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
      setHouses(data.errors ? null : data)
    } catch (e) { }
  }, [auth.token])

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
    console.log('select', select)
    if (select.data) {
      const company_id = select.data[0]
      const page = 1
      const perPage = 10
      if (+select.data[1] === 0 || select.data[1] === undefined) {
        setShowTable(false)
      } else {
        setShowTable(true)
        getHouses(company_id, page, perPage)
      }
    }
  }, [select, getHouses])

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
        {showTable && <TablePaginationActions houses={houses} />}
        {!showTable && <Typography variant="body1" component="p">Данные по домам отсутствуют.</Typography>}
      </div>

      <CustomizedSnackbars message={message} />
    </>
  )
}