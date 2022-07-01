import createSagaMiddleware from "@redux-saga/core";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "../reducers";
import rootSaga from "../sagas";

const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(sagaMiddleware);

const middleware =
  process.env.NODE_ENV === "production" ? compose(enhancer) : composeWithDevTools(enhancer);

const store = createStore(rootReducer, middleware);

sagaMiddleware.run(rootSaga);

export default store;
