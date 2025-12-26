import { ReactNode } from "react";

interface GameHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function GameHeader({ title, children }: GameHeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white mb-1 sm:mb-3">
        {title}
      </h1>
      {children}
    </div>
  );
}
