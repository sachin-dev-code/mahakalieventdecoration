import { useState } from "react";
import { Camera, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const galleryImages = [
  { id: 1, category: "wedding", title: "Royal Wedding Setup" },
  { id: 2, category: "birthday", title: "Magical Birthday Party" },
  { id: 3, category: "anniversary", title: "Romantic Anniversary" },
  { id: 4, category: "smoke", title: "Grand Smoke Entry" },
  { id: 5, category: "wedding", title: "Mandap Decoration" },
  { id: 6, category: "birthday", title: "Kids Birthday Theme" },
  { id: 7, category: "festival", title: "Diwali Celebration" },
  { id: 8, category: "corporate", title: "Corporate Event" },
  { id: 9, category: "wedding", title: "Reception Stage" },
  { id: 10, category: "anniversary", title: "Golden Anniversary" },
  { id: 11, category: "smoke", title: "Fire Effects Show" },
  { id: 12, category: "birthday", title: "Balloon Decoration" },
];

const categories = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
  { id: "smoke", label: "Smoke/Fire" },
  { id: "festival", label: "Festival" },
  { id: "corporate", label: "Corporate" },
];

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = activeCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon/30 via-background to-background" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Our Work
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Event{" "}
            <span className="gradient-text-gold">Gallery</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our portfolio of stunning event decorations and see how 
            we transform celebrations into unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding pt-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-card border border-border/50"
                onClick={() => setSelectedImage(image.id)}
              >
                {/* Placeholder - gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-card to-primary/20" />
                
                {/* Icon placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-muted-foreground/30" />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-xs text-primary uppercase tracking-wider">{image.category}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl w-full aspect-video rounded-2xl bg-card border border-border flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-24 h-24 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {galleryImages.find(img => img.id === selectedImage)?.title}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
