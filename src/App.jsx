import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { OffersBoardSection } from "./components/OffersBoardSection";
import { CoursesSection } from "./components/CoursesSection";
import { ContactFooter } from "./components/ContactFooter";
import { usePromotions } from './hooks/usePromotions';

// Caricato solo quando si visita /gestore-forme-2026, fuori dal bundle pubblico
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

function MainSite() {
	const { promotions, loading } = usePromotions();
	const hasOffers = !loading && promotions.some(p => p.is_active);

	return (
		<div className="font-sans antialiased text-white selection:bg-[#F7E842] selection:text-[#161D36] bg-[#161D36] min-h-screen overflow-x-hidden w-full">
			<Navbar hasOffers={hasOffers} />
			<main>
				<HeroSection />
				<CoursesSection />
				{hasOffers && <OffersBoardSection promotions={promotions} />}
			</main>
			<ContactFooter />
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<MainSite />} />
					<Route
						path="/gestore-forme-2026"
						element={
							<Suspense fallback={<div className="min-h-screen bg-[#0B0F24] flex items-center justify-center text-white text-xl">Caricamento...</div>}>
								<AdminPage />
							</Suspense>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
