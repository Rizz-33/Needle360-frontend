import { ChevronLeft, ChevronRight, Edit, Eye, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CustomButton } from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";
import { predefinedServices } from "../../../configs/Services.configs";
import { useAuthStore } from "../../../store/Auth.store";
import { useDesignStore } from "../../../store/Design.store";

const ImageSlider = ({ images, placeholderImg }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 1));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-h-[400px]">
        <img
          src={images[currentImageIndex] || placeholderImg}
          alt={`Image ${currentImageIndex + 1}`}
          className="w-full h-auto max-h-[400px] object-contain rounded-lg"
          onError={(e) => {
            e.target.src = placeholderImg;
            e.target.onerror = null;
          }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePreviousImage}
              disabled={currentImageIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              disabled={currentImageIndex === images.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full ${
                currentImageIndex === images.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-black/70"
              }`}
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        {images.length > 0
          ? currentImageIndex === 0
            ? "Final Product"
            : `Detail Image ${currentImageIndex}`
          : "No Images Available"}
      </p>
    </div>
  );
};

const DesignManagement = () => {
  const {
    tailorDesigns,
    fetchTailorDesignsById,
    createTailorDesign,
    updateTailorDesign,
    deleteTailorDesign,
    isLoading,
    error: storeError,
  } = useDesignStore();
  const { user } = useAuthStore();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [designForm, setDesignForm] = useState({
    title: "",
    description: "",
    price: "",
    tags: [],
    imageURLs: [],
  });
  const [newDesign, setNewDesign] = useState({
    title: "",
    description: "",
    price: "",
    tags: [],
    imageURLs: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [filters, setFilters] = useState({
    titleSearch: "",
    selectedTags: [],
    priceRange: { min: "", max: "" },
  });
  const [showMoreFormTags, setShowMoreFormTags] = useState(false);
  const [showMoreFilterTags, setShowMoreFilterTags] = useState(false);
  const [showMoreEditTags, setShowMoreEditTags] = useState(false);
  const [imageInput, setImageInput] = useState(""); // For comma-separated image URLs

  const initialTagLimit = 4;
  const placeholderImg = "/assets/placeholder-design.jpg";

  useEffect(() => {
    if (user?.id) {
      const filterParams = {
        title: filters.titleSearch || undefined,
        tags:
          filters.selectedTags.length > 0 ? filters.selectedTags : undefined,
        minPrice: filters.priceRange.min
          ? parseFloat(filters.priceRange.min)
          : undefined,
        maxPrice: filters.priceRange.max
          ? parseFloat(filters.priceRange.max)
          : undefined,
      };
      fetchTailorDesignsById(user.id, filterParams);
    }
  }, [user, fetchTailorDesignsById, filters]);

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? "N/A" : `LKR ${numericPrice.toFixed(2)}`;
  };

  // Handle form field changes for new design
  const handleNewDesignChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageURLs") {
      // Split comma-separated URLs into an array
      const urls = value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      setNewDesign((prev) => ({ ...prev, imageURLs: urls }));
      setImageInput(value);
    } else {
      setNewDesign((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle tags change for new design
  const handleNewTagsChange = (tag) => {
    setNewDesign((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  // Handle form field changes for edit modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "imageURLs") {
      const urls = value
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);
      setDesignForm((prev) => ({ ...prev, imageURLs: urls }));
      setImageInput(value);
    } else {
      setDesignForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle tags change for edit modal
  const handleTagsChange = (tag) => {
    setDesignForm((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "titleSearch") {
      setFilters((prev) => ({ ...prev, titleSearch: value }));
    } else if (name === "minPrice" || name === "maxPrice") {
      setFilters((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name === "minPrice" ? "min" : "max"]: value,
        },
      }));
    }
  };

  // Handle tag filter changes
  const handleTagFilterChange = (tag) => {
    setFilters((prev) => {
      const newSelectedTags = prev.selectedTags.includes(tag)
        ? prev.selectedTags.filter((t) => t !== tag)
        : [...prev.selectedTags, tag];
      return { ...prev, selectedTags: newSelectedTags };
    });
  };

  // Add new design
  const handleAddDesign = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newDesign.title) {
      setError("Title is required");
      return;
    }
    if (!newDesign.description) {
      setError("Description is required");
      return;
    }
    const priceValue = parseFloat(newDesign.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Price must be a positive number");
      return;
    }
    if (newDesign.tags.length === 0) {
      setError("At least one tag is required");
      return;
    }
    if (newDesign.imageURLs.length === 0) {
      setError("At least one image URL is required");
      return;
    }

    try {
      const designData = {
        title: newDesign.title,
        description: newDesign.description,
        price: priceValue,
        tags: newDesign.tags,
        imageURLs: newDesign.imageURLs,
      };
      await createTailorDesign(user.id, designData);
      setNewDesign({
        title: "",
        description: "",
        price: "",
        tags: [],
        imageURLs: [],
      });
      setImageInput("");
      setSuccess("Design added successfully");
      setTimeout(() => setSuccess(null), 1500);
    } catch (error) {
      setError(storeError || "Error adding design");
    }
  };

  // Open edit modal
  const handleOpenEditModal = (design) => {
    setSelectedDesign(design);
    setDesignForm({
      title: design.title,
      description: design.description,
      price: design.price ? design.price.toString() : "",
      tags: design.tags || [],
      imageURLs: design.imageURLs?.length
        ? design.imageURLs
        : design.imageUrl
        ? [design.imageUrl]
        : [],
    });
    setImageInput(
      design.imageURLs?.length
        ? design.imageURLs.join(", ")
        : design.imageUrl || ""
    );
    setEditModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  // Update design
  const handleUpdateDesign = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!designForm.title) {
      setError("Title is required");
      return;
    }
    if (!designForm.description) {
      setError("Description is required");
      return;
    }
    const priceValue = parseFloat(designForm.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError("Price must be a positive number");
      return;
    }
    if (designForm.tags.length === 0) {
      setError("At least one tag is required");
      return;
    }
    if (designForm.imageURLs.length === 0) {
      setError("At least one image URL is required");
      return;
    }

    try {
      const updatedData = {
        title: designForm.title,
        description: designForm.description,
        price: priceValue,
        tags: designForm.tags,
        imageURLs: designForm.imageURLs,
      };
      await updateTailorDesign(user.id, selectedDesign._id, updatedData);
      setSuccess("Design updated successfully");
      setTimeout(() => {
        setEditModalOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (error) {
      setError(storeError || "Error updating design");
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (design) => {
    setSelectedDesign(design);
    setDeleteModalOpen(true);
  };

  // Confirm design deletion
  const handleConfirmDelete = async () => {
    try {
      await deleteTailorDesign(user.id, selectedDesign._id);
      setDeleteModalOpen(false);
    } catch (error) {
      setError(storeError || "Error deleting design");
    }
  };

  // View design details
  const handleViewDesign = (design) => {
    setSelectedDesign(design);
    setViewModalOpen(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-xl font-bold text-gray-800">Design Management</h1>
      <p className="text-xs text-gray-600">
        Manage your tailoring designs and services.
      </p>

      {/* Add New Design Form */}
      <div className="my-6">
        <h2 className="text-sm font-medium text-primary mb-4">
          Add New Design
        </h2>
        <form
          onSubmit={handleAddDesign}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {error && (
            <p className="text-red-600 text-sm col-span-full">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm col-span-full">{success}</p>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={newDesign.title}
              onChange={handleNewDesignChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., Custom Suit"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Description
            </label>
            <textarea
              name="description"
              value={newDesign.description}
              onChange={handleNewDesignChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., Handcrafted suit with premium fabric"
              rows="1"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Price (LKR)
            </label>
            <input
              type="number"
              name="price"
              value={newDesign.price}
              onChange={handleNewDesignChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., 15000"
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Tags
            </label>
            <div className="flex flex-wrap gap-1 p-1 border border-gray-300 rounded-3xl">
              {predefinedServices
                .slice(
                  0,
                  showMoreFormTags ? predefinedServices.length : initialTagLimit
                )
                .map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleNewTagsChange(service)}
                    className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                      newDesign.tags.includes(service)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {service}
                  </button>
                ))}
              {predefinedServices.length > initialTagLimit && (
                <button
                  type="button"
                  onClick={() => setShowMoreFormTags(!showMoreFormTags)}
                  className="px-2 py-0.5 text-xs text-primary hover:underline"
                >
                  {showMoreFormTags ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">
              Image URLs (comma-separated)
            </label>
            <input
              type="text"
              name="imageURLs"
              value={imageInput}
              onChange={handleNewDesignChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
          <div className="flex items-end">
            <CustomButton
              type="submit"
              text={isLoading ? "Adding..." : "Add Design"}
              color="primary"
              hover_color="hoverAccent"
              variant="filled"
              width="w-full"
              height="h-9"
            />
          </div>
        </form>
      </div>

      {/* Filters */}
      <h2 className="text-sm font-medium text-primary mb-4">Filter Designs</h2>
      <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Search by Title
          </label>
          <input
            type="text"
            name="titleSearch"
            value={filters.titleSearch}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., Suit"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Filter by Tags
          </label>
          <div className="flex flex-wrap gap-1 p-1 border border-gray-300 rounded-3xl">
            {predefinedServices
              .slice(
                0,
                showMoreFilterTags ? predefinedServices.length : initialTagLimit
              )
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagFilterChange(tag)}
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    filters.selectedTags.includes(tag)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            {predefinedServices.length > initialTagLimit && (
              <button
                type="button"
                onClick={() => setShowMoreFilterTags(!showMoreFilterTags)}
                className="px-2 py-0.5 text-xs text-primary hover:underline"
              >
                {showMoreFilterTags ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Filter by Price Range (LKR)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              name="minPrice"
              value={filters.priceRange.min}
              onChange={handleFilterChange}
              placeholder="Min"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
              step="0.01"
            />
            <input
              type="number"
              name="maxPrice"
              value={filters.priceRange.max}
              onChange={handleFilterChange}
              placeholder="Max"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Designs Table */}
      <div className="overflow-x-auto mt-12">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Images
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tailorDesigns.length > 0 ? (
              tailorDesigns.map((design) => (
                <tr key={design._id} className="border-b">
                  <td className="p-2 text-primary text-sm">{design.title}</td>
                  <td className="p-2 text-gray-800 text-sm">
                    {formatPrice(design.price)}
                  </td>
                  <td className="p-2 text-gray-800 text-sm">
                    {design.tags.join(", ")}
                  </td>
                  <td className="p-2 text-gray-800 text-sm">
                    {design.imageURLs?.length
                      ? `${design.imageURLs.length} images`
                      : design.imageUrl
                      ? "1 image"
                      : "No images"}
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewDesign(design)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded-full transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(design)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded-full transition-colors"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(design)}
                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {isLoading ? <Loader /> : "No designs found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View Design Modal */}
      {viewModalOpen && selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">
                Design Details
              </h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">ID</h3>
                  <p className="text-gray-800">{selectedDesign._id}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Title
                  </h3>
                  <p className="text-gray-800">{selectedDesign.title}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-800">{selectedDesign.description}</p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Price
                  </h3>
                  <p className="text-gray-800">
                    {formatPrice(selectedDesign.price)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Tags
                  </h3>
                  <p className="text-gray-800">
                    {selectedDesign.tags.join(", ")}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Images
                  </h3>
                  <ImageSlider
                    images={
                      selectedDesign.imageURLs?.length
                        ? selectedDesign.imageURLs
                        : selectedDesign.imageUrl
                        ? [selectedDesign.imageUrl]
                        : []
                    }
                    placeholderImg={placeholderImg}
                  />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Created At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedDesign.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-1">
                    Updated At
                  </h3>
                  <p className="text-gray-800">
                    {new Date(selectedDesign.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t px-6 py-4 flex justify-end">
              <CustomButton
                onClick={() => setViewModalOpen(false)}
                text="Close"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-1/3"
                height="h-9"
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Design Modal */}
      {editModalOpen && selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Edit Design</h2>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateDesign}>
              <div className="p-6 space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Design ID
                  </label>
                  <input
                    type="text"
                    value={selectedDesign._id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl bg-gray-50 text-primary/75"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={designForm.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Custom Suit"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={designForm.description}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., Handcrafted suit with premium fabric"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Price (LKR)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={designForm.price}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., 15000"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-1 p-1 border border-gray-300 rounded-3xl">
                    {predefinedServices
                      .slice(
                        0,
                        showMoreEditTags
                          ? predefinedServices.length
                          : initialTagLimit
                      )
                      .map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => handleTagsChange(service)}
                          className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                            designForm.tags.includes(service)
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    {predefinedServices.length > initialTagLimit && (
                      <button
                        type="button"
                        onClick={() => setShowMoreEditTags(!showMoreEditTags)}
                        className="px-2 py-0.5 text-xs text-primary hover:underline"
                      >
                        {showMoreEditTags ? "Show Less" : "Show More"}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Image URLs (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="imageURLs"
                    value={imageInput}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="e.g., https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Preview Images
                  </label>
                  <ImageSlider
                    images={designForm.imageURLs}
                    placeholderImg={placeholderImg}
                  />
                </div>
              </div>
              <div className="border-t px-6 py-4 flex justify-end space-x-3">
                <CustomButton
                  onClick={() => setEditModalOpen(false)}
                  text="Cancel"
                  color="primary"
                  hover_color="hoverAccent"
                  variant="outlined"
                  width="w-1/3"
                  height="h-9"
                />
                <CustomButton
                  type="submit"
                  text={isLoading ? "Saving..." : "Save Changes"}
                  color="primary"
                  hover_color="hoverAccent"
                  variant="filled"
                  width="w-1/3"
                  height="h-9"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete design{" "}
                <span className="font-semibold text-primary">
                  {selectedDesign.title}
                </span>
                ? <br />
                <br />
                This action cannot be undone.
              </p>
            </div>
            <div className="border-t px-6 py-4 flex justify-end space-x-3">
              <CustomButton
                onClick={() => setDeleteModalOpen(false)}
                text="Cancel"
                color="primary"
                hover_color="hoverAccent"
                variant="outlined"
                width="w-1/3"
                height="h-9"
              />
              <CustomButton
                onClick={handleConfirmDelete}
                text="Delete"
                color="danger"
                hover_color="hoverAccent"
                variant="filled"
                width="w-1/3"
                height="h-9"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignManagement;
