import React from "react";
import Link from "next/link";

export const Component = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-2 w-full h-screen">
      <div className="flex flex-col items-center gap-8 w-1/2">
        <FlipLink href="/book">Hub</FlipLink>
        <FlipLink href="/unguided-tour">Tours</FlipLink>
        <FlipLink href="https://cherry.builders" isExternal>Hack</FlipLink>
        <FlipLink href="/events">Events</FlipLink>
      </div>
    </section>
  );
};

const FlipLink = ({ children, href, isExternal = false }: { children: string; href: string; isExternal?: boolean }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    if (isExternal) {
      e.preventDefault();
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return;
      }
      
      // Check if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile, try to open in Google Maps app first, fallback to browser
        const mapsAppUrl = href.replace('https://maps.google.com', 'comgooglemaps://');
        
        // Try to open in app, if it fails, open in browser
        window.location.href = mapsAppUrl;
        
        // Fallback to browser after a short delay if app doesn't open
        setTimeout(() => {
          window.open(href, '_blank', 'noopener,noreferrer');
        }, 1000);
      } else {
        // For desktop, open in new tab
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    }
  };
  
  const linkClassName = "group text-white relative block overflow-hidden whitespace-nowrap text-4xl font-black uppercase sm:text-7xl md:text-8xl lg:text-9xl";
  const linkStyle = { lineHeight: 0.75 };
  
  const linkContent = (
    <>
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
    </>
  );
  
  // Use Next.js Link for internal navigation
  if (!isExternal) {
    return (
      <Link href={href} className={linkClassName} style={linkStyle}>
        {linkContent}
      </Link>
    );
  }
  
  // Use anchor tag for external links
  return (
    <a
      href={href}
      onClick={handleExternalClick}
      rel="noopener noreferrer"
      className={linkClassName}
      style={linkStyle}
    >
      {linkContent}
    </a>
  );
}; 