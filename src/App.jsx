import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { OffersBoardSection } from "./components/OffersBoardSection";
import { CoursesSection } from "./components/CoursesSection";
import { ContactFooter } from "./components/ContactFooter";

function App() {
	return (
		<div className="font-sans antialiased text-white selection:bg-[#F7E842] selection:text-[#161D36] bg-[#161D36] min-h-screen overflow-x-hidden w-full">
			<Navbar />
			<main>
				<HeroSection />
				<OffersBoardSection />
				<CoursesSection />
			</main>
			<ContactFooter />
		</div>
	);
}

export default App;
