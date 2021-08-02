import { Fragment } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { SearchProvider } from "./contexts/Search";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./views/home";
import Movie from "./views/movie";

function Layout() {
  return (
    <div className="layout">
      <BrowserRouter>
        <Header />
        <Fragment>
          <SearchProvider>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/movie/:imdbId" component={Movie} />
            </Switch>
          </SearchProvider>
        </Fragment>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default Layout;
