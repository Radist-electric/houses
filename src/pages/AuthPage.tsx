import React, { useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
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

const isLocalStorage = storageAvailable('localStorage')

function storageAvailable(x: string) {
  try {
    localStorage.setItem(x, x)
    localStorage.removeItem(x)
    return true
  }
  catch (e) {
    return false
  }
}

const storageName: string = 'housesUser'
let initUser: any
if (isLocalStorage) {
  initUser = JSON.parse(localStorage.getItem(storageName) || '{}')
}
console.log('initUser', initUser)


export const AuthPage = () => {
  const classes = useStyles()
  // const [user, setUser] = useState(initUser)
  const [form, setForm] = useState(initForm)

  const formHandler = () => {
    console.log('submitted', form)
    let isFormValid = true
    const newForm = form.map((item) => {
      item.error = item.value.trim().length === 0
      isFormValid = !item.error && isFormValid
      return item
    })
    setForm(newForm)
    console.log('isFormValid', isFormValid)
    if(isFormValid) {
      loginHandler({username: form[0].value, password: form[1].value})
      setForm(initForm)
    }
  }

  const loginHandler = async (loginData: {username:string, password: string}) => {
    console.log('loginHandler', loginData)
    try {
      const url: string = 'http://test-alpha.reestrdoma.ru/api/login/'
      const requestOptions = {
        method: "POST", 
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(loginData)
    }
      console.log('requestOptions', requestOptions)
      
      const response = await fetch(url, requestOptions)
      const data = await response.json()

      if (!response.ok) {
        console.log(data.errors.error[0])
      }
      console.log('data', data)
      
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
      />
    )
  })

  return (
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

  )
}