"use client"

import {
  animate,
  cubicBezier,
  motion,
  useMotionValue,
  wrap,
  AnimatePresence,
} from "framer-motion";
import {
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { MapPin, Camera, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DotLoader } from "@/components/ui/dot-loader";
import { Header } from "@/components/header";


//Types
type variants = "default" | "masonry" | "polaroid";

// Create Context
const GridVariantContext = createContext<variants | undefined>(undefined);

// Animation frames for the dot loader - Pong game
const loaderFrames = [
    [14, 7, 0, 8, 6, 13, 20],
    [14, 7, 13, 20, 16, 27, 21],
    [14, 20, 27, 21, 34, 24, 28],
    [27, 21, 34, 28, 41, 32, 35],
    [34, 28, 41, 35, 48, 40, 42],
    [34, 28, 41, 35, 48, 42, 46],
    [34, 28, 41, 35, 48, 42, 38],
    [34, 28, 41, 35, 48, 30, 21],
    [34, 28, 41, 48, 21, 22, 14],
    [34, 28, 41, 21, 14, 16, 27],
    [34, 28, 21, 14, 10, 20, 27],
    [28, 21, 14, 4, 13, 20, 27],
    [28, 21, 14, 12, 6, 13, 20],
    [28, 21, 14, 6, 13, 20, 11],
    [28, 21, 14, 6, 13, 20, 10],
    [14, 6, 13, 20, 9, 7, 21],
];

//Motion Variants
const rowVariants = {
  initial: { opacity: 0, scale: 0.3 },
  animate: () => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: Math.random() + 1.5,
      duration: 1.4,
      ease: cubicBezier(0.18, 0.71, 0.11, 1),
    },
  }),
};

// Iconic Rome landmarks data
const romeLocations = [
  {
    id: 1,
    name: "Colosseum",
    description: "The world's largest ancient amphitheatre, built in AD 70–80. Immerse yourself in history where gladiators once fought.",
    image: "/images/luma/BirrettabytheColosseum.webp",
    category: "Historic Landmark",
    rating: 4.8,
    tips: "Consider a night tour to avoid crowds and gain a unique perspective",
    lumaUrl: "https://maps.google.com/?q=Colosseum,Rome"
  },
  {
    id: 2,
    name: "Trevi Fountain",
    description: "Rome's grandest Baroque fountain (26m × 49m), designed by Nicola Salvi in the 18th century. Legend says tossing a coin guarantees your return.",
    image: "/images/luma/Running Rome - Urbe Village.webp",
    category: "Fountain",
    rating: 4.7,
    tips: "Roughly €3,000 are tossed in daily and later donated to charity",
    lumaUrl: "https://maps.google.com/?q=Trevi+Fountain,Rome"
  },
  {
    id: 3,
    name: "Pantheon",
    description: "A 2nd-century Roman temple with the world's largest unreinforced concrete dome—still in use as a church.",
    image: "/images/luma/Urbe Campus - ETHRome edition.webp",
    category: "Historic Temple",
    rating: 4.9,
    tips: "Free to visit and a masterpiece of Roman architectural innovation",
    lumaUrl: "https://maps.google.com/?q=Pantheon,Rome"
  },
  {
    id: 4,
    name: "Vatican Museums + Sistine Chapel",
    description: "World-class art—including Michelangelo's frescoes in the Sistine Chapel and masterpieces in St. Peter's Basilica.",
    image: "/images/luma/Urbe Campus - ETHBari Edition.webp",
    category: "Museum",
    rating: 4.8,
    tips: "Book tickets in advance to avoid long queues",
    lumaUrl: "https://maps.google.com/?q=Vatican+Museums,Rome"
  },
  {
    id: 5,
    name: "Spanish Steps",
    description: "Baroque stairway of 135 steps linking Piazza di Spagna with Trinità dei Monti. A romantic and culturally rich gathering spot.",
    image: "/images/luma/campusethnaedition.webp",
    category: "Historic Site",
    rating: 4.6,
    tips: "Best visited early morning or late evening for fewer crowds",
    lumaUrl: "https://maps.google.com/?q=Spanish+Steps,Rome"
  },
  {
    id: 6,
    name: "Roman Forum",
    description: "The heart of ancient Rome, featuring ruins of government buildings, temples, and public spaces from the Roman Empire.",
    image: "/images/luma/urbecampusethwarwaw.webp",
    category: "Archaeological Site",
    rating: 4.7,
    tips: "Combine with Colosseum visit for a complete ancient Rome experience",
    lumaUrl: "https://maps.google.com/?q=Roman+Forum,Rome"
  },
  {
    id: 7,
    name: "St. Peter's Basilica",
    description: "The largest church in the world and the center of the Catholic Church, featuring stunning Renaissance architecture.",
    image: "/images/luma/10yearseth.webp",
    category: "Church",
    rating: 4.5,
    tips: "Dress modestly and arrive early to avoid security lines",
    lumaUrl: "https://maps.google.com/?q=St+Peter+Basilica,Vatican"
  }
];

export const DraggableContainer = ({
  className,
  children,
  variant,
}: {
  className?: string;
  children: React.ReactNode;
  variant?: variants;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);
  const handleIsDragging = () => setIsDragging(true);
  const handleIsNotDragging = () => setIsDragging(false);

  useEffect(() => {
    const container = ref.current?.getBoundingClientRect();
    if (!container) return;

    const { width, height } = container;

    const xDrag = x.on("change", (latest: number) => {
      const wrappedX = wrap(-(width / 2), 0, latest);
      x.set(wrappedX);
    });

    const yDrag = y.on("change", (latest: number) => {
      const wrappedY = wrap(-(height / 2), 0, latest);
      y.set(wrappedY);
    });

    const handleWheelScroll = (event: WheelEvent) => {
      if (!isDragging) {
        animate(y, y.get() - event.deltaY * 2.7, {
          type: "tween",
          duration: 1.2,
          ease: cubicBezier(0.18, 0.71, 0.11, 1),
        });
      }
    };

    window.addEventListener("wheel", handleWheelScroll);
    return () => {
      xDrag();
      yDrag();
      window.removeEventListener("wheel", handleWheelScroll);
    };
  }, [x, y, isDragging]);

  return (
    <GridVariantContext.Provider value={variant}>
      <div className="h-screen w-screen overflow-hidden">
        <motion.div
          className="h-screen w-screen overflow-hidden"
        >
          <motion.div
            className={cn(
              "grid h-fit w-fit cursor-grab grid-cols-[repeat(2,1fr)] bg-transparent active:cursor-grabbing will-change-transform",
              className,
            )}
            drag
            dragMomentum={true}
            dragTransition={{
              timeConstant: 200,
              power: 0.28,
              restDelta: 0,
              bounceStiffness: 0,
            }}
            onMouseDown={handleIsDragging}
            onMouseUp={handleIsNotDragging}
            onMouseLeave={handleIsNotDragging}
            style={{ x, y }}
            ref={ref}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </GridVariantContext.Provider>
  );
};

export const GridItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const variant = useContext(GridVariantContext);

  const gridItemStyles = cva(
    "overflow-hidden hover:cursor-pointer w-full h-full will-change-transform",
    {
      variants: {
        variant: {
          default: "rounded-sm",
          masonry: "even:mt-[60%] rounded-sm ",
          polaroid:
            "border-10 border-b-28 border-white shadow-xl even:rotate-3 odd:-rotate-2 hover:rotate-0 transition-transform ease-out duration-300 even:mt-[60%]",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    },
  );

  return (
    <motion.div
      className={cn(gridItemStyles({ variant, className }))}
      variants={rowVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export const GridBody = memo(
  ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    const variant = useContext(GridVariantContext);

    const gridBodyStyles = cva("grid grid-cols-[repeat(6,1fr)] h-fit w-fit", {
      variants: {
        variant: {
          default: "gap-32 p-24 md:gap-40 md:p-32",
          masonry: "gap-32 p-24 md:gap-40 md:p-32",
          polaroid: "gap-32 p-24 md:gap-40 md:p-32",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    });

    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(gridBodyStyles({ variant, className }))}
          >
            {children}
          </div>
        ))}
      </>
    );
  },
);

GridBody.displayName = "GridBody";

// Location Card Component
const LocationCard = ({ location }: { location: typeof romeLocations[0] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleCardClick = () => {
    if (location.lumaUrl) {
      window.open(location.lumaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="relative group cursor-pointer aspect-square w-48 md:w-64"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="w-full h-full bg-gradient-to-br from-red-100 to-orange-100 rounded-lg overflow-hidden relative">
        {/* Image container */}
        <div className="w-full h-full relative">
          <img 
            src={location.image} 
            alt={location.name}
            className="pointer-events-none absolute h-full w-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
          
          {/* Fallback placeholder */}
          <div className="w-full h-full flex items-center justify-center hidden">
            <Camera className="w-12 h-12 text-red-400" />
          </div>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <Badge className="bg-red-500 text-white text-xs">
              {location.category}
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 bg-white/20 hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                }}
              >
                <Heart 
                  className={`w-3 h-3 ${
                    isFavorited ? 'fill-red-500 text-red-500' : 'text-white'
                  }`} 
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 bg-white/20 hover:bg-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  if (location.lumaUrl) {
                    window.open(location.lumaUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                title="Get directions"
              >
                <Share2 className="w-3 h-3 text-white" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold line-clamp-2">{location.name}</h3>
            <p className="text-xs opacity-90 line-clamp-2">{location.description}</p>
            <div className="flex items-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              <span>{location.rating} ★</span>
            </div>
            {location.lumaUrl && (
              <div className="text-xs opacity-75">
                Click for directions →
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Unguided Tour Component
export const UnguidedTour = () => {
  const [selectedVariant, setSelectedVariant] = useState<variants>("default");
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const maxTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoadingComplete = () => {
    setLoaderComplete(true);
    // Wait for dot animation to fade out
    setTimeout(() => {
      setIsLoading(false);
      // Show controls after a short delay
      setTimeout(() => setShowControls(true), 1000);
    }, 500);
  };

  useEffect(() => {
    // Set maximum 5 second timeout
    maxTimeoutRef.current = setTimeout(() => {
      handleLoadingComplete();
    }, 5000);

    return () => {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background - same as homepage */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background1.png)' }}
      />
      
      {/* Header */}
      <Header />
      
      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-20 left-4 z-50 flex gap-2"
          >
            <Button
              variant="ghost"
              className="bg-white/80 hover:bg-white text-gray-900 backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-sm text-gray-700">
              <p>🖱️ Drag to explore • 📜 Scroll to zoom • 🖱️ Click for directions</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 h-screen w-screen pt-16"
      >
        <DraggableContainer variant={selectedVariant}>
          <GridBody>
            {romeLocations.map((location) => (
              <GridItem key={location.id} className="relative aspect-square w-48 md:w-64">
                <LocationCard location={location} />
              </GridItem>
            ))}
          </GridBody>
        </DraggableContainer>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8 relative"
            >
              <motion.h1 
                className="text-7xl md:text-9xl lg:text-[12rem] font-bold text-white/20 drop-shadow-lg absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                Unguided Tours
              </motion.h1>
              
              <motion.div 
                className="flex flex-col items-center space-y-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <DotLoader
                  frames={loaderFrames}
                  dotClassName="bg-white/15 [&.dot-loader-active]:bg-white size-1.5 transition-all duration-200"
                  duration={200}
                  className="scale-150 gap-0.5"
                  isPlaying={!loaderComplete}
                  onComplete={handleLoadingComplete}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 