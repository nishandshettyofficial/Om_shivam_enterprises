import React, { useState, useRef, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import ShaderButton from './ShaderButton';
import {
  UploadCloud,
  FileText,
  Printer,
  CheckCircle,
  X,
  BookOpen,
  Check,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

export default function PrintStudio({ isModal = false, onClose }) {
  const { setPickupSlip, triggerConfetti } = useShop();
  const { currentUser, setCurrentView } = useAuth();

  // Uploaded files
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [manualPageOverride, setManualPageOverride] = useState(null);

  // Configuration States
  // 1. Print Mode: 'bw' | 'color' | 'booklet'
  const [printMode, setPrintMode] = useState('bw');
  
  // 2. Print Sidedness: 'single' | 'back-to-back'
  const [sidedness, setSidedness] = useState('single');

  // 3. Layout: 1 | 2 (Images per sheet side)
  const [imagesPerPage, setImagesPerPage] = useState(1);

  // 4. Copies & Finishing
  const [copies, setCopies] = useState(1);
  const [binding, setBinding] = useState('none'); // 'none' | 'staple' | 'spiral'

  // Submission Status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [orderDone, setOrderDone] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState(null);

  const fileInputRef = useRef(null);

  // File Handlers
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const formatted = newFiles.map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2) + ' MB',
      estimatedPages: Math.max(1, Math.min(80, Math.round(f.size / 55000) || 6))
    }));
    setFiles((prev) => [...prev, ...formatted]);
    setManualPageOverride(null);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setManualPageOverride(null);
  };

  // Base document page count
  const detectedDocPages = files.reduce((acc, f) => acc + f.estimatedPages, 0);
  const documentPages = manualPageOverride !== null ? manualPageOverride : (detectedDocPages > 0 ? detectedDocPages : 10);

  // Exact pricing calculation
  const pricing = useMemo(() => {
    // 1. Calculate effective printed sides based on Images Per Page (1 vs 2 images/page)
    const effectiveSides = imagesPerPage === 2
      ? Math.ceil(documentPages / 2)
      : documentPages;

    let printCostPerCopy = 0;
    let rateExplanation = '';
    let slabBadge = '';
    let physicalSheets = 0;

    // RULE 1: BOOKLET SECTION
    // "for booklet section, it should be the exact price as the number of pages if the page is 20 the price is also 20"
    if (printMode === 'booklet') {
      printCostPerCopy = documentPages * 1;
      physicalSheets = Math.ceil(documentPages / 4); // Folded 4 pages per sheet
      rateExplanation = `Exact ₹1 per page flat rate (${documentPages} pages = ₹${documentPages})`;
      slabBadge = '₹1 / Page Exact';
    }
    // RULE 2: BLACK & WHITE
    else if (printMode === 'bw') {
      if (sidedness === 'single') {
        // "if print is of single side of two rupees only if the page is more than five or else, it is minimum three rupees"
        physicalSheets = effectiveSides;
        const isMoreThanFive = effectiveSides > 5;
        const rate = isMoreThanFive ? 2 : 3;
        printCostPerCopy = effectiveSides * rate;
        rateExplanation = isMoreThanFive
          ? `${effectiveSides} pgs × ₹2/page (>5 pages slab)`
          : `${effectiveSides} pgs × ₹3/page (1–5 pages min slab)`;
        slabBadge = isMoreThanFive ? '₹2 / Page (>5 Pgs)' : '₹3 / Page (≤5 Pgs)';
      } else {
        // "and if there is a back-to-back same condition applies if it is more than five back to back is for three rupees or else four"
        const backToBackSheets = Math.ceil(effectiveSides / 2);
        physicalSheets = backToBackSheets;
        const isMoreThanFiveB2B = backToBackSheets > 5;
        const rate = isMoreThanFiveB2B ? 3 : 4;
        printCostPerCopy = backToBackSheets * rate;
        rateExplanation = isMoreThanFiveB2B
          ? `${backToBackSheets} sheets × ₹3/sheet (>5 b2b slab)`
          : `${backToBackSheets} sheets × ₹4/sheet (1–5 b2b slab)`;
        slabBadge = isMoreThanFiveB2B ? '₹3 / B2B Sheet (>5)' : '₹4 / B2B Sheet (≤5)';
      }
    }
    // RULE 3: COLOR PRINTING
    else if (printMode === 'color') {
      if (sidedness === 'single') {
        physicalSheets = effectiveSides;
        printCostPerCopy = effectiveSides * 10;
        rateExplanation = `${effectiveSides} pgs × ₹10/page (High-res Color)`;
        slabBadge = '₹10 / Page';
      } else {
        const backToBackSheets = Math.ceil(effectiveSides / 2);
        physicalSheets = backToBackSheets;
        printCostPerCopy = backToBackSheets * 18;
        rateExplanation = `${backToBackSheets} sheets × ₹18/sheet (Color Back-to-Back)`;
        slabBadge = '₹18 / B2B Sheet';
      }
    }

    // Finishing add-ons (Booklet includes center saddle stapling for free!)
    const bindingCostPerCopy = printMode === 'booklet'
      ? 0
      : binding === 'spiral' ? 35 : binding === 'staple' ? 5 : 0;

    const totalPerCopy = printCostPerCopy + bindingCostPerCopy;
    const grandTotal = totalPerCopy * copies;

    return {
      documentPages,
      effectiveSides,
      physicalSheets,
      printCostPerCopy,
      bindingCostPerCopy,
      totalPerCopy,
      grandTotal,
      rateExplanation,
      slabBadge
    };
  }, [documentPages, printMode, sidedness, imagesPerPage, copies, binding]);

  // Order Submission Handler
  const handleProcessUpload = () => {
    setIsUploading(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setOrderDone(true);
            triggerConfetti();

            const tokenNumber = Math.floor(10 + Math.random() * 90);
            const orderInfo = {
              token: `C-${tokenNumber}`,
              customerName: currentUser?.name || 'Counter Customer',
              customerPhone: currentUser?.phone || 'Pickup at Store',
              pickupTime: 'Ready in 10-15 Minutes',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              items: [
                {
                  product: {
                    id: `print-${Date.now()}`,
                    brand: 'Xerox & Print Hub',
                    name: `${printMode === 'booklet' ? 'Folded Booklet' : printMode === 'color' ? 'Color Print' : 'B&W Print'} • ${pricing.documentPages} Pgs (${imagesPerPage} img/pg, ${sidedness === 'back-to-back' ? 'B2B' : 'Single Sided'})`,
                    price: pricing.totalPerCopy
                  },
                  quantity: copies
                }
              ],
              totalAmount: pricing.grandTotal,
              orderSummary: {
                printMode,
                sidedness,
                imagesPerPage,
                pages: pricing.documentPages,
                sheets: pricing.physicalSheets,
                rateText: pricing.rateExplanation,
                binding: printMode === 'booklet' ? 'Center Saddle Staple (Free)' : binding
              }
            };

            setCompletedOrderDetails(orderInfo);
            setPickupSlip(orderInfo);
          }, 350);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  const handleReset = () => {
    setFiles([]);
    setManualPageOverride(null);
    setPrintMode('bw');
    setSidedness('single');
    setImagesPerPage(1);
    setCopies(1);
    setBinding('none');
    setOrderDone(false);
    setCompletedOrderDetails(null);
  };

  return (
    <div className={`w-full bg-white border border-warm-border rounded-3xl shadow-sm overflow-hidden ${isModal ? 'max-h-[88vh] flex flex-col' : ''}`}>
      
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 sm:p-6 border-b border-warm-border/70 bg-[#FAF9F5] shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {!isModal && (
            <button
              onClick={() => setCurrentView('catalog')}
              className="p-1.5 -ml-1 sm:p-2 sm:-ml-2 rounded-xl text-stone-600 hover:text-black hover:bg-stone-200 transition-colors cursor-pointer shrink-0"
              title="Back to Catalog"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#141416] text-white flex items-center justify-center shadow-xs shrink-0">
            <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#141416] tracking-tight truncate">
                Print & Xerox Studio
              </h2>
              <span className="text-[9px] sm:text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                15-Min Pickup
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-normal truncate sm:line-clamp-1">
              Counter calculation with official B&W, Color & Booklet rates
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full hover:bg-stone-200 text-stone-400 hover:text-black transition-colors cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {orderDone && completedOrderDetails ? (
        <div className={`p-6 sm:p-10 text-center space-y-6 ${isModal ? 'overflow-y-auto' : ''}`}>
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block">
              Official Store Pickup Token
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#141416] tracking-tight mt-1">
              #{completedOrderDetails.token}
            </div>
            <p className="text-xs text-stone-600 max-w-sm mx-auto mt-2">
              Your print job has been sent to the <strong>OM SHIVAM</strong> counter queue. Pre-packed in 10–15 minutes!
            </p>
          </div>

          {/* Quick Summary Ticket */}
          <div className="bg-[#FAF9F5] rounded-2xl border border-warm-border p-5 text-xs max-w-md mx-auto text-left space-y-2.5">
            <div className="flex justify-between text-stone-600">
              <span>Print Type:</span>
              <span className="font-semibold text-stone-900 capitalize">
                {completedOrderDetails.orderSummary.printMode === 'bw' ? 'B&W Xerox' : completedOrderDetails.orderSummary.printMode}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Document Pages:</span>
              <span className="font-semibold text-stone-900">{completedOrderDetails.orderSummary.pages} pages</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Sheets Printed:</span>
              <span className="font-semibold text-stone-900">{completedOrderDetails.orderSummary.sheets} physical sheets</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Copies:</span>
              <span className="font-semibold text-stone-900">{copies} {copies === 1 ? 'copy' : 'copies'}</span>
            </div>
            <div className="pt-2 border-t border-warm-border flex justify-between items-baseline font-bold text-sm text-[#141416]">
              <span>Total at Counter:</span>
              <span className="text-lg font-black">₹{completedOrderDetails.totalAmount}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <ShaderButton
              variant="shader-amber"
              size="md"
              onClick={() => {
                if (isModal && onClose) onClose();
              }}
            >
              View Store Pickup Slip
            </ShaderButton>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-black border border-warm-border bg-white rounded-full transition-colors cursor-pointer"
            >
              Print Another Document
            </button>
          </div>
        </div>
      ) : (
        /* Interactive Checkout Form */
        <div className={`p-4 sm:p-8 space-y-6 ${isModal ? 'overflow-y-auto' : ''}`}>
          
          {/* 1. Drag & Drop File Upload + Document Pages Counter */}
          <div className="space-y-3">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : 'border-stone-300 hover:border-stone-400 bg-[#FAF9F5]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-xs border border-stone-200">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-xs sm:text-sm font-bold text-stone-800">
                Click or drag & drop files (PDF, Word, PPT, or Images)
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Upload notes, question papers, thesis, or blueprints for 10-minute counter pickup
              </p>
            </div>

            {/* Document Pages Stepper Bar */}
            <div className="flex items-center justify-between gap-3 bg-[#FAF9F5] p-3.5 rounded-2xl border border-warm-border text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="font-semibold text-stone-900 block truncate">
                    {files.length > 0 ? `${files.length} file(s) attached` : 'Document Page Count'}
                  </span>
                  <span className="text-[11px] text-stone-500 truncate block">
                    {files.length > 0 ? files.map(f => f.name).join(', ') : 'Adjust pages to see pricing slabs update live'}
                  </span>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-1.5 shrink-0 bg-white px-2 py-1 rounded-xl border border-warm-border shadow-xs">
                <button
                  type="button"
                  onClick={() => setManualPageOverride(Math.max(1, documentPages - 1))}
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="Decrease pages"
                >
                  -
                </button>
                <div className="px-2 text-center min-w-[55px]">
                  <span className="font-black text-sm text-[#141416]">{documentPages}</span>
                  <span className="text-[10px] text-stone-500 block leading-none">pages</span>
                </div>
                <button
                  type="button"
                  onClick={() => setManualPageOverride(documentPages + 1)}
                  className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="Increase pages"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 2. Interactive Print Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>Select Print Service</span>
              <span className="text-[11px] text-stone-500 font-normal">Transparent Counter Pricing</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Tab 1: Black & White */}
              <button
                type="button"
                onClick={() => setPrintMode('bw')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  printMode === 'bw'
                    ? 'bg-[#141416] text-white border-[#141416] shadow-md ring-2 ring-[#141416]/20'
                    : 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-700 border-warm-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">Black & White</span>
                  {printMode === 'bw' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className={`text-[11px] block mt-1 font-medium ${printMode === 'bw' ? 'text-amber-300' : 'text-stone-500'}`}>
                  From ₹2 / Page
                </span>
              </button>

              {/* Tab 2: Color */}
              <button
                type="button"
                onClick={() => setPrintMode('color')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  printMode === 'color'
                    ? 'bg-[#141416] text-white border-[#141416] shadow-md ring-2 ring-[#141416]/20'
                    : 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-700 border-warm-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">Full Color</span>
                  {printMode === 'color' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <span className={`text-[11px] block mt-1 font-medium ${printMode === 'color' ? 'text-indigo-300' : 'text-stone-500'}`}>
                  ₹10 / Page
                </span>
              </button>

              {/* Tab 3: Booklet Section */}
              <button
                type="button"
                onClick={() => setPrintMode('booklet')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  printMode === 'booklet'
                    ? 'bg-[#141416] text-white border-[#141416] shadow-md ring-2 ring-amber-500/30'
                    : 'bg-[#FAF9F5] hover:bg-stone-100 text-stone-700 border-warm-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold block">Booklet Print</span>
                  {printMode === 'booklet' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </div>
                <span className={`text-[11px] block mt-1 font-bold ${printMode === 'booklet' ? 'text-amber-400' : 'text-emerald-700'}`}>
                  Exact ₹1 / Page
                </span>
              </button>
            </div>
          </div>

          {/* 3. Detailed Interactive Controls (For B&W and Color) */}
          {printMode !== 'booklet' ? (
            <div className="space-y-4 bg-[#FAF9F5] p-5 rounded-2xl border border-warm-border">
              
              {/* Sidedness: Single Side vs Back-to-Back */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Print Sidedness
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {sidedness === 'single' ? 'Single sided printing' : 'Double sided front & back'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Single Side */}
                  <button
                    type="button"
                    onClick={() => setSidedness('single')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      sidedness === 'single'
                        ? 'border-[#141416] bg-[#141416] text-white shadow-xs'
                        : 'border-warm-border bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Single Side (1-Sided)</span>
                      {sidedness === 'single' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className={`text-[11px] mt-1 ${sidedness === 'single' ? 'text-stone-300' : 'text-stone-500'}`}>
                      {printMode === 'bw'
                        ? '₹2/page if >5 pages • ₹3/page if 1–5 pages'
                        : '₹10 per page'}
                    </p>
                  </button>

                  {/* Back to Back */}
                  <button
                    type="button"
                    onClick={() => setSidedness('back-to-back')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      sidedness === 'back-to-back'
                        ? 'border-[#141416] bg-[#141416] text-white shadow-xs'
                        : 'border-warm-border bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Back to Back (Double Sided)</span>
                      {sidedness === 'back-to-back' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className={`text-[11px] mt-1 ${sidedness === 'back-to-back' ? 'text-stone-300' : 'text-stone-500'}`}>
                      {printMode === 'bw'
                        ? '₹3/sheet if >5 sheets • ₹4/sheet if 1–5 sheets'
                        : '₹18 per double-sided sheet'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Images per Page Option: 1 image/page vs 2 images/page */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Page Layout (Images Per Page)
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Compress slides or multiple slides per sheet
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 1 Image / Page */}
                  <button
                    type="button"
                    onClick={() => setImagesPerPage(1)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      imagesPerPage === 1
                        ? 'border-[#141416] bg-white text-stone-900 font-bold ring-1 ring-[#141416]'
                        : 'border-warm-border bg-white/70 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">1 Image in a Page</span>
                      {imagesPerPage === 1 && <span className="w-2 h-2 rounded-full bg-[#141416]" />}
                    </div>
                    <p className="text-[11px] text-stone-500 font-normal mt-0.5">
                      Standard 1 document page per printed side
                    </p>
                  </button>

                  {/* 2 Images / Page */}
                  <button
                    type="button"
                    onClick={() => setImagesPerPage(2)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      imagesPerPage === 2
                        ? 'border-[#141416] bg-white text-stone-900 font-bold ring-1 ring-[#141416]'
                        : 'border-warm-border bg-white/70 hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">2 Images in a Page</span>
                      {imagesPerPage === 2 && <span className="w-2 h-2 rounded-full bg-[#141416]" />}
                    </div>
                    <p className="text-[11px] text-stone-500 font-normal mt-0.5">
                      Fits 2 slides/page side (cuts paper in half)
                    </p>
                  </button>
                </div>
              </div>

              {/* Binding Options & Copies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Finishing & Binding
                  </label>
                  <select
                    value={binding}
                    onChange={(e) => setBinding(e.target.value)}
                    className="w-full bg-white text-stone-800 text-xs font-medium py-2.5 px-3 rounded-xl border border-warm-border focus:outline-none cursor-pointer"
                  >
                    <option value="none">No Binding (Loose Sheets)</option>
                    <option value="staple">Corner Staple (+₹5)</option>
                    <option value="spiral">Spiral Project Binding (+₹35)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-800 block mb-1">
                    Number of Copies
                  </label>
                  <div className="flex items-center justify-between bg-white rounded-xl px-3 py-1.5 border border-warm-border">
                    <button
                      type="button"
                      onClick={() => setCopies((c) => Math.max(1, c - 1))}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-xs text-[#141416]">
                      {copies} {copies === 1 ? 'Copy' : 'Copies'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCopies((c) => c + 1)}
                      className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* 4. Booklet Section Details */
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#141416] text-amber-300 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#141416]">
                    Booklet Printing: Exact ₹1 Per Page
                  </h4>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                    For booklets, the cost is the <strong>exact number of document pages</strong>. For example, if your document has <strong>20 pages, the price is exactly ₹20</strong>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                  <span className="text-stone-500 text-[11px] block">Pages Format</span>
                  <span className="font-bold text-stone-900">A4 folded into A5 Booklet</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-amber-200/80">
                  <span className="text-stone-500 text-[11px] block">Binding Included</span>
                  <span className="font-bold text-emerald-800">Center Saddle Staple (Free)</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-stone-800">Number of Booklet Copies:</span>
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 border border-amber-200/80">
                  <button
                    type="button"
                    onClick={() => setCopies((c) => Math.max(1, c - 1))}
                    className="font-bold text-stone-700 hover:text-black px-1 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-bold text-xs text-stone-900">{copies}</span>
                  <button
                    type="button"
                    onClick={() => setCopies((c) => c + 1)}
                    className="font-bold text-stone-700 hover:text-black px-1 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Interactive Real-Time Calculation Ticket */}
          <div className="bg-[#141416] text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-stone-400 font-medium">Calculation Summary</span>
              <span className="bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full font-bold text-xs">
                {pricing.slabBadge}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-stone-400 text-[11px] block">Document Pages</span>
                <span className="font-bold text-white text-sm">{pricing.documentPages}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Physical Sheets</span>
                <span className="font-bold text-white text-sm">{pricing.physicalSheets} sheets</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Copies</span>
                <span className="font-bold text-white text-sm">{copies}</span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Applied Formula</span>
                <span className="font-medium text-amber-200 text-xs block truncate" title={pricing.rateExplanation}>
                  {pricing.rateExplanation}
                </span>
              </div>
            </div>

            {/* Total Payable & Shader Button */}
            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-400 block">Total Payable at Counter</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white tracking-tight">
                    ₹{pricing.grandTotal}
                  </span>
                  {copies > 1 && (
                    <span className="text-xs text-stone-400">
                      (₹{pricing.totalPerCopy} × {copies} copies)
                    </span>
                  )}
                </div>
              </div>

              {/* Martin Mroč Shader Button */}
              <ShaderButton
                variant="shader-upload"
                size="lg"
                icon={UploadCloud}
                onClick={handleProcessUpload}
                loading={isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? `Queueing Print ${uploadProgress}%...` : `Send to Counter Print (₹${pricing.grandTotal})`}
              </ShaderButton>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
