import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import AuthDropdown from "./AuthDropdown";
import { ThemeToggle } from "./ThemeToggle";

const Header: FC = () => {
  return (
    <header className="flex items-center justify-between space-x-2 p-4">
      <Link href="/">
        <Image src="/iconLockerDarkBg.png" alt="logo" width={50} height={50} />
      </Link>
      <div className="flex items-center space-x-4">
        <div>
          <AuthDropdown />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
