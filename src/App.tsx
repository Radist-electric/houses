import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useRoutes } from './routes'
import { makeStyles } from '@material-ui/core/styles'
import { AuthContext } from './context/AuthContext'
import ButtonAppBar from './components/header'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2)
  }
}))

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

export const App = () => {
  const routes = useRoutes()
  const classes = useStyles()
  const [user, setUser] = useState(initUser)
  const isAuthenticated = !!user.token

  const changeUserData = () => {
    const newUser = JSON.parse(localStorage.getItem(storageName) || '{}')
    setUser(newUser)
    
  }

  return (
    <AuthContext.Provider value={{ token: user.token, firstName: user.firstName, isAuthenticated, isLocalStorage, storageName, changeUserData}}>
      <Router>
        <CssBaseline />
        <ButtonAppBar />
        <Container className={classes.content}>
          <Grid item xs={12}>
            {routes}
          </Grid>
        </Container>
      </Router>
    </AuthContext.Provider>

  )
}

