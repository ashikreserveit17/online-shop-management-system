import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../../context/ShopContext';
import { CategoryId, Product } from '../../types';
import { resolveImageUrl, IMAGES } from '../../data/assets';
import { X, Layers, Sparkles, Image as ImageIcon, Upload, Link as LinkIcon, Check, Trash2 } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  editingProduct,
}) => {
  const { addProduct, updateProduct, categories } = useShop();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('GreenCart Collection');
  const [category, setCategory] = useState<CategoryId>('womens_wardrobe');
  const [price, setPrice] = useState('1500');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [description, setDescription] = useState(
    'Premium quality crafted with authentic materials for long-lasting durability, comfort, and contemporary elegance.'
  );
  const [image, setImage] = useState(IMAGES.blackKnitTrousers);
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  const [multimediaType, setMultimediaType] = useState<'video_preview' | '360_view' | 'audio_demo'>('360_view');
  const [multimediaTitle, setMultimediaTitle] = useState('360° Material Flow & Finish Inspection');
  const [multimediaSnippet, setMultimediaSnippet] = useState('Inspect seam density, texture, and natural luster under studio light.');
  const [warranty, setWarranty] = useState('14-Day Free Exchange Guarantee');
  const [exchangePeriodDays, setExchangePeriodDays] = useState('14');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate when editingProduct changes or modal opens
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setBrand(editingProduct.brand);
      setCategory(editingProduct.category);
      setPrice(String(editingProduct.price));
      setOriginalPrice(editingProduct.originalPrice ? String(editingProduct.originalPrice) : '');
      setStock(String(editingProduct.stock));
      setDescription(editingProduct.description);
      setImage(editingProduct.image);
      setMultimediaType(editingProduct.multimediaType);
      setMultimediaTitle(editingProduct.multimediaTitle);
      setMultimediaSnippet(editingProduct.multimediaSnippet);
      setWarranty(editingProduct.warranty);
      setExchangePeriodDays(String(editingProduct.exchangePeriodDays));
      setImageSourceMode(editingProduct.image.startsWith('data:') ? 'upload' : 'url');
    } else {
      setName('');
      setBrand('GreenCart Collection');
      setCategory('womens_wardrobe');
      setPrice('1500');
      setOriginalPrice('');
      setStock('25');
      setDescription(
        'Premium quality crafted with authentic materials for long-lasting durability, comfort, and contemporary elegance.'
      );
      setImage(IMAGES.blackKnitTrousers);
      setMultimediaType('360_view');
      setMultimediaTitle('360° Material Flow & Finish Inspection');
      setMultimediaSnippet('Inspect seam density, texture, and natural luster under studio light.');
      setWarranty('14-Day Free Exchange Guarantee');
      setExchangePeriodDays('14');
      setImageSourceMode('upload');
    }
    setUploadNotice(null);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const presetImages = [
    { label: 'Knit & Trousers', url: IMAGES.blackKnitTrousers },
    { label: 'Azure Salwar', url: IMAGES.azureSalwarSuit },
    { label: 'Noir Salwar', url: IMAGES.noirSalwarSuit },
    { label: 'Polo T-Shirt', url: IMAGES.azurePoloShirt },
    { label: 'Panjabi', url: IMAGES.panjabi },
    { label: 'Leather Wallet', url: IMAGES.leatherWallet },
    { label: 'Smartwatch', url: IMAGES.smartWatch },
    { label: 'ANC Earbuds', url: IMAGES.wirelessEarbuds },
    { label: 'Air Fryer', url: IMAGES.airFryer },
    { label: 'Espresso', url: IMAGES.espressoMachine },
    { label: 'Curved Display', url: IMAGES.curvedMonitor },
    { label: 'Backpack', url: IMAGES.laptopBackpack },
    { label: 'Smartphone', url: IMAGES.satellitePhone },
    { label: 'Sneakers', url: IMAGES.runningSneakers },
    { label: 'Luxury Perfume', url: IMAGES.luxuryPerfume },
    { label: 'Luxury Sedan', url: IMAGES.luxurySedan },
  ];

  // Handle local file selection
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image file size is too large (max 10MB). Please select a compressed image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
        setUploadNotice(`Loaded "${file.name}" successfully!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedImage = image.startsWith('data:') ? image : resolveImageUrl(image, name);

    const productPayload = {
      name,
      brand,
      category,
      price: Number(price) || 1500,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock) || 10,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 24,
      description,
      features: [
        'Curated and quality inspected by GreenCart experts',
        'Direct certified craftsmanship and authentic materials',
        'Protected by GreenCart 14-day free exchange guarantee in Bangladesh',
      ],
      specifications: {
        'Quality Standard': 'GreenCart Approved & Inspected',
        'Origin': 'Dhaka Central Hub',
        'Status': 'Ready in Warehouse',
      },
      image: resolvedImage,
      gallery: [resolvedImage, IMAGES.hero],
      multimediaType,
      multimediaTitle,
      multimediaSnippet,
      variants: [
        { name: 'Option', options: ['Standard Edition', 'Premium Edition'] },
      ],
      warranty,
      exchangeEligible: true,
      exchangePeriodDays: Number(exchangePeriodDays) || 14,
      featured: editingProduct ? editingProduct.featured : true,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-emerald-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4 text-[#68BC20]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#064E3B]">
                {editingProduct ? 'Edit Catalog Product (৳ BDT)' : 'Add New Product to GreenCart Catalog'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Full administrator edit access: name, pricing, stock, description, and custom photo upload.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Row 1: Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eco-Cotton Organic Panjabi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. GreenCart Signature"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Row 2: Category & Pricing in Bangladeshi Taka (৳) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Price in Taka (৳ BDT) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="1500"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Original Price (৳ BDT)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="2000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Stock & Warranty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Stock Units Available</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Exchange Window (Days)</label>
              <input
                type="number"
                value={exchangePeriodDays}
                onChange={(e) => setExchangePeriodDays(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            />
          </div>

          {/* Product Photograph Section: File Upload / Paste URL / Presets */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="block text-[#064E3B] font-bold flex items-center gap-1.5 text-xs">
                <ImageIcon className="w-4 h-4 text-[#16A34A]" />
                <span>Product Photograph (Upload File, Paste URL, or Preset)</span>
              </label>

              {/* Mode Switcher Tabs */}
              <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
                <button
                  type="button"
                  onClick={() => setImageSourceMode('upload')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageSourceMode === 'upload'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceMode('url')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageSourceMode === 'url'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>Paste URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceMode('presets')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    imageSourceMode === 'presets'
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Library Presets</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Direct File Upload from Device */}
            {imageSourceMode === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#16A34A] bg-emerald-100/60 scale-[1.01]'
                      : 'border-emerald-300 hover:border-[#16A34A] bg-white hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#064E3B] flex items-center justify-center mb-2 shadow-xs">
                    <Upload className="w-6 h-6 text-[#16A34A]" />
                  </div>
                  <p className="text-xs font-bold text-[#064E3B]">
                    Click to browse or drag & drop product photo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports high-resolution PNG, JPG, or WEBP from your computer or phone (up to 10MB)
                  </p>
                  <button
                    type="button"
                    className="mt-3 px-4 py-1.5 bg-[#064E3B] hover:bg-[#053D2E] text-white rounded-xl text-[11px] font-bold shadow-xs transition-colors"
                  >
                    Select File from Computer
                  </button>
                </div>

                {uploadNotice && (
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>{uploadNotice}</span>
                  </p>
                )}
              </div>
            )}

            {/* TAB 2: Image URL Input */}
            {imageSourceMode === 'url' && (
              <div className="space-y-1 bg-white p-3.5 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Paste External Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or https://example.com/product.jpg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
                  />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                    title="Clear"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: Preset Catalog Thumbnails */}
            {imageSourceMode === 'presets' && (
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 max-h-40 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                {presetImages.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className={`aspect-square rounded-xl border overflow-hidden transition-all relative group cursor-pointer ${
                      image === p.url
                        ? 'ring-2 ring-[#16A34A] border-transparent shadow-sm'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                    title={p.label}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover block" />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 px-1 truncate text-center">
                      {p.label}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Active Image Preview Box */}
            {image && (
              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center gap-3">
                <img
                  src={image.startsWith('data:') ? image : resolveImageUrl(image, name)}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-200 block shrink-0"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== IMAGES.hero) {
                      target.src = IMAGES.hero;
                    }
                  }}
                />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#064E3B]">Current Selected Image:</span>
                    <span className="text-[10px] bg-emerald-100 text-[#16A34A] font-semibold px-2 py-0.2 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate font-mono">
                    {image.startsWith('data:') ? 'Custom file uploaded from device (Local Image)' : image}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#064E3B] hover:bg-[#053D2E] text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#68BC20]" />
              <span>{editingProduct ? 'Save Product Changes' : 'Add Product to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
