export function GallerySection() {
  const images = [
    {
      src: "https://via.placeholder.com/600x400/dc2626/ffffff?text=Urbe+Village",
      alt: "Urbe Village",
      title: "Urbe Village"
    },
    {
      src: "https://via.placeholder.com/600x400/ea580c/ffffff?text=ETH+Rome+Hackathon",
      alt: "ETH Rome Hackathon",
      title: "ETH Rome Hackathon"
    },
    {
      src: "https://via.placeholder.com/600x400/b91c1c/ffffff?text=ETH+Rome+Events",
      alt: "ETH Rome Events",
      title: "ETH Rome Events"
    },
    {
      src: "https://via.placeholder.com/600x400/7c3aed/ffffff?text=Co-working+Space",
      alt: "Co-working Space",
      title: "Co-working Space"
    },
    {
      src: "https://via.placeholder.com/600x400/059669/ffffff?text=Innovation+Lab",
      alt: "Innovation Lab",
      title: "Innovation Lab"
    },
    {
      src: "https://via.placeholder.com/600x400/d97706/ffffff?text=Community+Events",
      alt: "Community Events",
      title: "Community Events"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Experience Urbe Village
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a look at our vibrant community, exciting events, and amazing spaces
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 