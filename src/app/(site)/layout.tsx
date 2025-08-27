import Footer from "@/components/site/layout/Footer";
import Header from "@/components/site/layout/Header";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <>
            <Header />
            <main id="main" className="mx-auto max-w-6xl px-4">
                {children}
            </main>
            <Footer />
        </>
    )
}