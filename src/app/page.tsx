import Header from "@/components/ctc/Header";
import HeroSection from "@/components/ctc/HeroSection";
import CaseSelection from "@/components/ctc/CaseSelection";
import RegisterInterest from "@/components/ctc/RegisterInterest";
import Footer from "@/components/ctc/Footer";

const Index = () => {
  return (
    <main className="bg-background text-foreground min-h-screen">
      <Header />
      <HeroSection />
      <CaseSelection />
      <RegisterInterest />
      <Footer />
    </main>
  );
};

export default Index;
