import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import AnnouncementBar from "../components/AnnouncementBar/AnnouncementBar";
function Layout({ children }) {

    return (
        <>
            <Navbar />
            <AnnouncementBar/>
            <main>
                {children}
            </main>
            <Footer/>
        </>
    );

}

export default Layout;