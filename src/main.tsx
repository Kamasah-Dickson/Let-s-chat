import React, { lazy, Suspense } from "react";
import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./Store/store.ts";
import { Provider } from "react-redux";
import Loading from "./components/Loading.tsx";
import { createRoot } from "react-dom/client";

const App = lazy(() => import("./App.tsx"));
const Login = lazy(() => import("./components/Login.tsx"));
const Signup = lazy(() => import("./components/Signup.tsx"));
const PageNotFound = lazy(() => import("./components/PageNotFound.tsx"));

const container = document.getElementById("root") as HTMLElement;
createRoot(container).render(
	<React.StrictMode>
		<Provider store={store}>
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<Suspense fallback={<Loading />}>
								<App />
							</Suspense>
						}
					/>
					<Route
						path="/login"
						element={
							<Suspense fallback={<Loading />}>
								<Login />
							</Suspense>
						}
					/>
					<Route
						path="/signup"
						element={
							<Suspense fallback={<Loading />}>
								<Signup />
							</Suspense>
						}
					/>

					<Route
						path="*"
						element={
							<Suspense fallback={<Loading />}>
								<PageNotFound />
							</Suspense>
						}
					/>
				</Routes>
			</Router>
		</Provider>
	</React.StrictMode>
);
