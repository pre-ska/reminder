import { UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

type Props = {};

function NavBar({}: Props) {
  return (
    <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
      <Logo />
      <div className="flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />

        <ThemeSwitcher />
      </div>
    </nav>
  );
}

export default NavBar;
