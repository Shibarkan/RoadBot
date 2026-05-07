import Header from "./Header";
import Footer from "./Footer";
const Member = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-16">
                    <h1 className="text-4xl font-bold mb-8 text-center">Halaman Member</h1>
                    <p className="text-lg text-gray-600 mb-12 text-center">
                        Selamat datang di halaman member RoadFix AI! Di sini Anda dapat mengelola akun Anda, melihat riwayat pembelian, dan mengakses fitur eksklusif untuk anggota.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default Member;