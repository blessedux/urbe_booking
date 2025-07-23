import React from "react";
import Link from "next/link";

export const Component = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-2 w-full h-screen">
      <div className="flex flex-col items-center gap-8 w-1/2">
        <FlipLink href="/book">Book</FlipLink>
        <FlipLink href="/events">Events</FlipLink>
        <FlipLink href="/unguided-tour">Tours</FlipLink>
        <FlipLink href="https://www.google.com/maps/place/Urbe+Hub/data=!4m2!3m1!1s0x0:0xe7f07f0072499a3f?sa=X&ved=1t:2428&ictx=111" isExternal>Hub</FlipLink>
      </div>
    </section>
  );
};

const FlipLink = ({ children, href, isExternal = false }: { children: string; href: string; isExternal?: boolean }) => {
  const linkProps = isExternal ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };
  
  return (
    <a
      {...linkProps}
      className="group text-white relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl"
      style={{
        lineHeight: 0.75,
      }}
    >
      <div className="flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block transition-transform duration-300 ease-in-out group-hover:-translate-y-[110%]"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="absolute inset-0 flex">
        {children.split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block translate-y-[110%] transition-transform duration-300 ease-in-out group-hover:translate-y-0"
            style={{
              transitionDelay: `${i * 25}ms`,
            }}
          >
            {letter}
          </span>
        ))}
      </div>
    </a>
  );
}; 