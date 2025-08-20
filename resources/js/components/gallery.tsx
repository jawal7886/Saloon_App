import React, { useEffect, useMemo, useState } from 'react';

interface PublicGalleryItem {
  id: number;
  image_path: string;
  category: string;
  title?: string;
  description?: string;
}

interface ApiGalleryResponse {
  success: boolean;
  data: PublicGalleryItem[];
}

const PublicGallery: React.FC = () => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [items, setItems] = useState<PublicGalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string>('');
  const [lightboxItem, setLightboxItem] = useState<PublicGalleryItem | null>(null);

  const categoryChips = useMemo(() => {
    return ['All', ...availableCategories];
  }, [availableCategories]);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoadError('');
      try {
        // Load categories first
        const categoriesRes = await fetch('/api/categories', { headers: { Accept: 'application/json' } });
        const categoriesJson = await categoriesRes.json();
        if (Array.isArray(categoriesJson)) {
          const categoryNames: string[] = categoriesJson.map((c: any) => c.name).filter(Boolean);
          setAvailableCategories(categoryNames);
        }
      } catch (err) {
        // Non-fatal, we can still render images; leave categories empty if failed
        console.error('Failed to load categories', err);
      }

      // Load images (active only) for initial view
      await fetchImages('All');
    };

    fetchInitial();
  }, []);

  const fetchImages = async (filter: string) => {
    try {
      setIsLoading(true);
      setLoadError('');

      const buildUrl = (f: string) => (f !== 'All' ? `/api/gallery/category/${encodeURIComponent(f)}` : '/api/gallery/active');
      let url = buildUrl(filter);

      const fetchAndParse = async (endpoint: string) => {
        const res = await fetch(endpoint, { headers: { Accept: 'application/json' } });
        const text = await res.text();
        let parsed: any = null;
        try {
          parsed = text ? JSON.parse(text) : null;
        } catch (e) {
          throw new Error(`Non-JSON response (${res.status})`);
        }
        return { ok: res.ok, body: parsed } as { ok: boolean; body: any };
      };

      let { ok, body } = await fetchAndParse(url);

      // Fallback if route not available or unexpected shape
      if (!ok || (!Array.isArray(body) && !(body && Array.isArray(body.data)))) {
        // For 'All', try generic index route
        if (filter === 'All') {
          ({ ok, body } = await fetchAndParse('/api/gallery'));
        }
      }

      let list: any[] = [];
      if (Array.isArray(body)) list = body;
      else if (body && Array.isArray(body.data)) list = body.data;

      if (!ok || !Array.isArray(list)) {
        throw new Error('Unexpected API response');
      }

      setItems(list as PublicGalleryItem[]);
    } catch (err: any) {
      console.error('Failed to load gallery items', err);
      setLoadError(err?.message || 'Failed to load images. Please try again later.');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterClick = async (category: string) => {
    if (category === activeFilter) return;
    setActiveFilter(category);
    await fetchImages(category);
  };

  const resolvedSrc = (item: PublicGalleryItem): string => {
    // Prefer backend accessor if present in future; default to /storage path
    return `/storage/${item.image_path}`;
  };

  return (
    <section id="gallery" className="py-20 px-4 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold font-serif text-[#2F2F2F] mb-4">Gallery</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our work, our team, and the barbershop experience.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categoryChips.map((cat) => (
            <button
              key={cat}
              className={`px-5 py-2 rounded-full font-semibold border transition-all duration-200 ${
                activeFilter === cat
                  ? 'bg-[#D4AF37] text-[#2F2F2F] border-[#D4AF37]'
                  : 'bg-white text-[#2F2F2F] border-gray-200 hover:bg-[#F5F5F5]'
              }`}
              onClick={() => handleFilterClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="text-center text-[#2F2F2F] py-20 text-xl font-semibold">Loading images...</div>
        ) : loadError ? (
          <div className="text-center text-red-500 py-20 text-lg">{loadError}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No images found for this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                <img
                  src={resolvedSrc(item)}
                  alt={item.title || item.category}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDUwMCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSIzMjAiIGZpbGw9IiNFRUUiLz48dGV4dCB4PSIxNTAiIHk9IjE2MCIgZmlsbD0iIzk5OSIgc3R5bGU9ImZvbnQtc2l6ZTogMjBweDsgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                  <p className="text-white text-base font-semibold mb-2 px-2 text-center">{item.title || item.category}</p>
                  <span className="text-[#D4AF37] text-xs">👈 Click to enlarge</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-[#D4AF37] font-bold"
                onClick={() => setLightboxItem(null)}
              >
                &times;
              </button>
              <img
                src={resolvedSrc(lightboxItem)}
                alt={lightboxItem.title || lightboxItem.category}
                className="w-full h-[400px] object-cover rounded-lg mb-4"
              />
              <div className="text-[#2F2F2F] text-lg font-semibold mb-2">
                {lightboxItem.title || lightboxItem.category}
              </div>
              {lightboxItem.description && (
                <div className="text-gray-500 text-sm">{lightboxItem.description}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicGallery;
