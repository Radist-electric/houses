import { useState, useContext } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { AuthContext } from '../context/AuthContext'
import { useHistory } from 'react-router-dom'
import CustomizedSnackbars from '../components/alert'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      maxWidth: 576,
      background: 'none'
    },
    form: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      maxWidth: 576,
      background: 'none'
    },
    input: {
      marginBottom: theme.spacing(2)
    }
  }),
)

const initForm = [
  {
    label: 'Электронная почта',
    error: false,
    value: ''
  },
  {
    label: 'Пароль',
    error: false,
    value: ''
  }
]

export const AuthPage = () => {
  const classes = useStyles()
  const auth = useContext(AuthContext)
  const history = useHistory()
  
  const [form, setForm] = useState(initForm)
  const [message, setMessage] = useState({
    show: false,
    severity: 'success',
    text: ''
  })

  const formHandler = () => {
    let isFormValid = true
    const newForm = form.map((item) => {
      item.error = item.value.trim().length === 0
      isFormValid = !item.error && isFormValid
      return item
    })
    setForm(newForm)
    if (isFormValid) {
      loginHandler({ username: form[0].value, password: form[1].value })
      setForm(initForm)
    }
  }

  const loginHandler = async (loginData: { username: string, password: string }) => {
    try {
      const url: string = 'http://test-alpha.reestrdoma.ru/api/login/'
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      }

      const response = await fetch(url, requestOptions)
      const data = await response.json()
      console.log('data', data)

      if (!response.ok) {
        setMessage({
          show: true,
          severity: 'error',
          text: data.errors.error[0]
        })
        return
      }

      setMessage({
        show: true,
        severity: 'success',
        text: `Приветствую, ${data.data.user.firstName}. Вы вошли. `
      })

      if (auth.isLocalStorage) {
        const newUser = {
          expiresIn: data.data.expiresIn,
          token: data.data.token.access,
          firstName: data.data.user.firstName
        }
        localStorage.setItem(auth.storageName, JSON.stringify(newUser))
        auth.changeUserData()
        history.push({
          pathname: '/'
        })
      }

    } catch (e) {
      throw e
    }
  }

  const onChangeHandler = (event: any, index: any) => {
    const input = { ...form[index] }
    input.value = event.target.value
    input.error = false
    const newForm = [...form.slice(0, index), input, ...form.slice(index + 1)]
    setForm(newForm)
  }

  const handleKey = (event: any) => {
    if (event.key === 'Enter') formHandler()
  }

  const inputs = form.map((item, i) => {
    return (
      <TextField
        key={i}
        className={classes.input}
        error={item.error}
        required
        label={item.label}
        fullWidth={true}
        variant='outlined'
        value={item.value}
        helperText={item.error && 'Поле не должно быть пустым'}
        onChange={event => onChangeHandler(event, i)}
        onKeyUp={handleKey}
      />
    )
  })

  return (
    <>
      <Paper className={classes.paper} elevation={0}>
        <Typography variant="h5" component="h1">Авторизация</Typography>
        <form className={classes.form} noValidate autoComplete="off">
          {inputs}
        </form>
        <Button
          variant='contained'
          color='primary'
          fullWidth={true}
          size="large"
          onClick={formHandler}
        >
          Войти
      </Button>
      </Paper>
      <CustomizedSnackbars message={message} />
    </>
  )
}