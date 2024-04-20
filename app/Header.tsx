import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import AuthDropdown from "./AuthDropdown";

const Header: FC = () => {
  return (
    <header className="top-0 z-10 mb-5 flex h-20 w-full items-center justify-between p-4">
      <Link
        className="relative mr-2 flex h-9 w-28 shrink-0 justify-center outline-none"
        href="/"
      >
        <Image src="/logoLocker.svg" alt="logo" fill />
      </Link>
      <div className="flex items-center space-x-4">
        <div>
          <AuthDropdown />
        </div>
        {/* <ThemeToggle /> */}
      </div>
    </header>
  );
};

export default Header;
