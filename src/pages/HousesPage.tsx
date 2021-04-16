import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Loader } from '../components/Loader'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
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
  }),
)

export const HousesPage = () => {
  const classes = useStyles()
  const auth = useContext(AuthContext)
  const [companies, setCompanies] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({
    show: false,
    severity: 'success',
    text: ''
  })
  const [select, setSelect] = useState<{ id: string | number; name: string }>({
    id: '',
    name: '',
  })

  console.log('select', select)

  const handleChange = (event: React.ChangeEvent<{ id?: string; value: unknown }>) => {
    const name = event.target.id as keyof typeof select;
    setSelect({
      ...select,
      [name]: event.target.value,
    })
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
      getCompanies()
    }

  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    console.log('useEffect companies')

    if (companies !== null) {
      console.log('companies', companies)

    }
  }, [companies])

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
      console.log('data', data)
      setCompanies(data.errors ? null : data)

    } catch (e) { }
  }

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

  let options
  if (companies !== null) {
    const array = JSON.parse(JSON.stringify(companies))
    options = array.data.map((item: any, index: any) => {
      return <option value={item.id} key={index}>{item.name}</option>
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
        <InputLabel htmlFor="age-native-simple">Список домов</InputLabel>
        <Select
          native
          autoWidth={true}
          value={select.id}
          onChange={handleChange}
          inputProps={{
            id: 'id'
          }}
        >
          <option aria-label="Выберите дом" value="" />
          {options}
        </Select>
      </FormControl>}

      <CustomizedSnackbars message={message} />
    </>
  )
}