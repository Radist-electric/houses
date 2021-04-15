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
    }
  }),
)

export const AuthPage = () => {
  const classes = useStyles()

  const formHandler = () => {
    console.log('submitted')

  }

  return (
    <Paper className={classes.paper} elevation={0}>
      <Typography variant="h5" component="h1">Авторизация</Typography>
      <form className={classes.form} noValidate autoComplete="off">
        <div>
          <TextField
            error={false}
            id="outlined-error"
            label="Электронная почта"
            helperText="Поле не должно быть пустым"
            variant="outlined"
            fullWidth={true}
          />
          <TextField
            error={false}
            id="outlined-error-helper-text"
            label="Пароль"
            helperText="Поле не должно быть пустым"
            variant="outlined"
            fullWidth={true}
          />
        </div>
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