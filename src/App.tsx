import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { makeStyles } from '@material-ui/core/styles'
import ButtonAppBar from './components/header'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2)
  }
}))

function App() {
  const routes = useRoutes()
  const classes = useStyles()

  return (
    <Router>
      <CssBaseline />
      <ButtonAppBar />
      <Container className={classes.content}>
        <Grid item xs={12}>
          {routes}
        </Grid>
      </Container>
    </Router>
  )
}

export default App
