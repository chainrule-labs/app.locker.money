import { IconType } from "react-icons/lib";

export interface IIconLink {
  Icon: IconType;
  url: string | undefined;
  size: string | undefined;
}

function IconLink({ Icon, url, size }: IIconLink) {
  return (
    <a
      className="flex shrink-0 flex-col items-center justify-center p-3 outline-none hover:text-zinc-200"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon size={size} />
    </a>
  );
}

export default IconLink;
