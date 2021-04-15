import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  root: {
    '& ol': {
      listStyle: 'none',
      counterReset: 'li'
    },
    '& li:before': {
      counterIncrement: 'li',
      content: 'counters(li, ".") ". "'
    }
  }
}))

export const AboutPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant="h5" component="h1">Тестовое задание ReactJS</Typography>
      <ol>
        <li>Развернуть React на TypeScript через Create React App, можно пользоваться статьей <a href="https://reactjs.org/docs/create-a-new-react-app.html">Create a New React App</a>
        </li>
        <li>Создать два компонента: Авторизация и Список домов.
          <ol>
            <li>Авторизация - форма состоящая из двух полей: username (он же e-mail) и пароль и кнопки войти.</li>
            <li>Список домов.</li>
          </ol>
        </li>
      </ol>
      <Typography variant="body1" component="p">Так же необходимо реализовать пагинацию для данной таблицы.</Typography>
      <Typography variant="body1" component="p">Готовый результат выложить на Github, Gitlab или Bitbucket и прислать ссылку.</Typography>
    </div>
  )
}