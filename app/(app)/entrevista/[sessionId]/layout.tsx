import Header from "./(header_entrevista)/header";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Header />
            <main>{children}</main>
        </>
    )
}