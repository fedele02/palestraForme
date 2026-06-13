import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { OffersBoardSection } from "./components/OffersBoardSection";
import { CoursesSection } from "./components/CoursesSection";
import { ContactFooter } from "./components/ContactFooter";
import { AdminPage } from './pages/AdminPage';

function MainSite() {
	return (
		<div className="font-sans antialiased text-white selection:bg-[#F7E842] selection:text-[#161D36] bg-[#161D36] min-h-screen overflow-x-hidden w-full">
			<Navbar />
			<main>
				<HeroSection />
				<CoursesSection />
				<OffersBoardSection />
			</main>
			<ContactFooter />
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<Router basename="/palestraForme">
				<Routes>
					<Route path="/" element={<MainSite />} />
					<Route path="/gestore-forme-2026" element={<AdminPage />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
