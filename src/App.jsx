import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { OffersBoardSection } from "./components/OffersBoardSection";
import { CoursesSection } from "./components/CoursesSection";
import { ContactFooter } from "./components/ContactFooter";
import { usePromotions } from './hooks/usePromotions';
import { useSiteSettings } from './hooks/useSiteSettings';
import { buildSiteInfo } from './lib/siteInfo';
import { isPromotionVisible } from './lib/courses';
import { MobileCallBar } from './components/MobileCallBar';
import { ChatWidget } from './components/ChatWidget';

// Caricato solo quando si visita /gestore-forme-2026, fuori dal bundle pubblico
const AdminPage = lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));

function MainSite() {
	const { promotions, loading } = usePromotions();
	const { settings } = useSiteSettings();
	const info = buildSiteInfo(settings);
	const visiblePromotions = promotions.filter((p) => isPromotionVisible(p));
	const hasOffers = !loading && visiblePromotions.length > 0;

	return (
		<MotionConfig reducedMotion="user">
			<div className="min-h-[100svh] w-full bg-ink font-sans text-paper">
				<a href={hasOffers ? '#offerte' : '#corsi'} className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[4px] focus:bg-sun focus:px-4 focus:py-3 focus:font-semibold focus:text-ink">
					Vai ai contenuti
				</a>
				<Navbar hasOffers={hasOffers} info={info} />
				<main>
					<HeroSection info={info} />
					{hasOffers && <OffersBoardSection promotions={visiblePromotions} info={info} />}
					{/* La linea del battito solo sotto la Home: tra Offerte e Corsi niente */}
					<CoursesSection info={info} showPulse={!hasOffers} />
				</main>
				<ContactFooter info={info} />
				<MobileCallBar info={info} />
				<ChatWidget info={info} />
			</div>
		</MotionConfig>
	);
}

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<MainSite />} />
					<Route path="/classes" element={<MainSite />} />
					<Route path="/offers" element={<MainSite />} />
					<Route path="/contacts" element={<MainSite />} />
					<Route
						path="/gestore-forme-2026"
						element={
							<Suspense fallback={<div className="min-h-[100svh] bg-ink flex items-center justify-center text-mute">Caricamento…</div>}>
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
