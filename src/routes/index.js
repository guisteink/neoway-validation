import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from '../views/Pages/Home'

export default function Routes()
{
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" name="Index" component={Home}></Route>
            </Switch>
        </BrowserRouter>)
}