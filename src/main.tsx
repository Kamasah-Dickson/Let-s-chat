import React, { lazy, Suspense } from "react";
import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UpdateProfilePage from "./pages/UpdateProfilePage.js";
import { store } from "./Store/store.ts";
import { Provider } from "react-redux";
import Loading from "./components/Loading.tsx";
import { createRoot } from "react-dom/client";
import ChatSettingsPage from "./pages/ChatSettingsPage.tsx";
import AdvancedSettingsPage from "./pages/AdvancedSettingsPage.tsx";
import LanguagePage from "./pages/LanguagePage.tsx";
import AskQuestionsPage from "./pages/AskQuestionsPage.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";

const App = lazy(() => import("./App.tsx"));
const NotificationPage = lazy(() => import("./pages/NotificationPage.tsx"));
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
						path="/notifications"
						element={
							<ProtectedRoutes>
								<Suspense fallback={<Loading />}>
									<NotificationPage />
								</Suspense>
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/profileupdate"
						element={
							<ProtectedRoutes>
								<UpdateProfilePage />
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/chat-settings"
						element={
							<ProtectedRoutes>
								<ChatSettingsPage />
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/advanced-settings"
						element={
							<ProtectedRoutes>
								<AdvancedSettingsPage />
							</ProtectedRoutes>
						}
					/>

					<Route
						path="/language"
						element={
							<ProtectedRoutes>
								<LanguagePage />
							</ProtectedRoutes>
						}
					/>
					<Route
						path="/ask-a-question"
						element={
							<ProtectedRoutes>
								<AskQuestionsPage />
							</ProtectedRoutes>
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
