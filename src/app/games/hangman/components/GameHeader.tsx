"use client";

export default function GameHeader() {
  return (
    <div className="mb-6 mx-auto max-w-md w-full px-4 sm:px-0">
      {/* Title */}
      <div className="text-center mb-1 sm:mb-3">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-black dark:text-white">
          Hangman
        </h1>
      </div>
    </div>
  );
}
