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
import Register from "./components/Register.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AppContext>
			<Router>
				<Routes>
					<Route path="/" element={<Signup />}></Route>
					<Route path="/register" element={<Register />}></Route>
					<Route path="/Let's-chat" element={<App />}></Route>
					<Route path="/notifications" element={<NotificationPage />}></Route>
					<Route path="/chat-settings" element={<ChatSettingsPage />}></Route>
					<Route
						path="/advanced-settings"
						element={<AdvancedSettingsPage />}
					></Route>
					<Route path="/language" element={<LanguagePage />}></Route>
					<Route path="/ask-a-question" element={<AskQuestionsPage />}></Route>
				</Routes>
			</Router>
		</AppContext>
	</React.StrictMode>
);
