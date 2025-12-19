import Aside from "../components/Aside";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
  return (
    <section className="bg-[#F8F9FC] w-screen h-svh lg:h-screen grid place-items-center overflow-hidden">
      <section className="h-[calc(100vh-16px)] w-[calc(100vw-16px)] flex gap-5">
        <div
          className="relative z-40  hidden xl:block "
          style={{ overflow: "visible" }}
        >
          <Aside />
        </div>
        <div className="flex-1">
          <Header />
          <main className="overflow-y-scroll scroll-0 overflow-x-visible mt-5 rounded-lg h-[calc(100vh-110px)]">
            <Outlet />
          </main>
        </div>
      </section>
    </section>
  );
};

export default Layout;
