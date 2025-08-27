import Header from "@/components/config/layout/Header";

export default function Layout({ children }: Readonly<{ children: React.ReactNode}>) {

    return (
        <>
            <Header />
            <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8">{children}</main>
        </>
    )
}