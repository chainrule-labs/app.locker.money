import { FaTelegram, FaXTwitter } from "react-icons/fa6";

import FarcasterIcon from "@/components/ui/FarcasterIcon";

function Footer() {
  return (
    <footer className="mt-5 flex h-20 w-full items-center justify-center p-4">
      {/* <a
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center hover:text-[#515EF1]"
        href={process.env.GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Link"
      >
        <FaGithub size="25px" />
      </a> */}
      <a
        className="flex size-12 shrink-0 items-center justify-center p-[14px] hover:text-[#515EF1]"
        href="https://warpcast.com/locker"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Warpcast Link"
      >
        <FarcasterIcon size="25px" />
      </a>
      <a
        className="flex size-12 shrink-0 items-center justify-center hover:text-[#515EF1]"
        href="https://twitter.com/locker_money"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter Link"
      >
        <FaXTwitter size="25px" />
      </a>
      <a
        className="flex size-12 shrink-0 items-center justify-center p-[14px] hover:text-[#515EF1]"
        href="https://t.me/+stsNEbe16tU5MTY5"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram Link"
      >
        <FaTelegram size="25px" />
      </a>
    </footer>
  );
}

export default Footer;
