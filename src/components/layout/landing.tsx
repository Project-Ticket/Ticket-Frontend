import Footer from "../footer";
import Header from "../header";
import Navigation from "../navigation";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />

      {children}

      <Footer />
    </div>
  );
}
