import { Switch, Route, Redirect } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { HousesPage } from './pages/HousesPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const useRoutes = () => {

  return (
    <Switch>
      <Route exact path="/">
        <HousesPage />
      </Route>
      <Route exact path="/auth">
        <AuthPage />
      </Route>
      <Route exact path="/about">
        <AboutPage />
      </Route>
      <Route exact path="/404">
        <NotFoundPage />
      </Route>
      <Redirect to="/404" />
    </Switch>
  )

}