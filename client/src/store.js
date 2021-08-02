import { createStore, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import rootReducer from "./store/reducers";
import rootEpic from "./store/epics";

const logger = createLogger();

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware();

  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware, logger))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
