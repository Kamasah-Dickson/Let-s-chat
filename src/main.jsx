import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.scss";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotificationPage from "./pages/NotificationPage.jsx";
import ChatSettingsPage from "./pages/ChatSettingsPage.jsx";
import AdvancedSettingsPage from "./pages/AdvancedSettingsPage.jsx";
import LanguagePage from "./pages/LanguagePage.jsx";
import AskQuestionsPage from "./pages/AskQuestionsPage.jsx";
import AppContext from "./context/appContext.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AppContext>
			<Router>
				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/profileupdate" element={<UpdateProfilePage />} />
					<Route path="/notifications" element={<NotificationPage />} />
					<Route path="/chat-settings" element={<ChatSettingsPage />} />
					<Route path="/advanced-settings" element={<AdvancedSettingsPage />} />
					<Route path="/language" element={<LanguagePage />} />
					<Route path="/ask-a-question" element={<AskQuestionsPage />} />
				</Routes>
			</Router>
		</AppContext>
	</React.StrictMode>
);
