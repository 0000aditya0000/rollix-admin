import { Plus, Edit, Trash2, MoveUp, MoveDown } from "lucide-react";
import {
  getAllSliders,
  addSlider,
  deleteSlider,
} from "../../lib/services/sliderService";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
  active?: boolean;
}

const Sliders = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [openAddSlideModal, setOpenAddSlideModal] = useState(false);
  const [newSlide, setNewSlide] = useState<{
    image: string | null;
    title: string;
    description: string;
  }>({
    image: null,
    title: "",
    description: "",
  });

  const fetchSlides = async () => {
    try {
      const response = await getAllSliders();
      setSlides(response.sliders);
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "kyc-presets");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dwytm0sdm/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Cloudinary upload failed:", data);
        return null;
      }
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be under 5MB.");
      return;
    }

    const uploadedUrl = await uploadToCloudinary(file);

    if (uploadedUrl) {
      setNewSlide((prev) => ({
        ...prev,
        image: uploadedUrl,
      }));
      console.log("Image uploaded to Cloudinary:", uploadedUrl);
    } else {
      alert("Image upload failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSlide({
      ...newSlide,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSlide = async () => {
    if (!newSlide.image || !newSlide.title || !newSlide.description) {
      alert("Please fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("image", newSlide.image);
    formData.append("title", newSlide.title);
    formData.append("description", newSlide.description);
    try {
      const res = await addSlider(formData);
      if (res) {
        setOpenAddSlideModal(false);
        setNewSlide({ image: null, title: "", description: "" });
      }
    } catch {
      toast.error("unexpected error occur.");
    }
    setOpenAddSlideModal(false);
    setNewSlide({ image: null, title: "", description: "" });
  };

  const handleRemoveSlice = async (id: any) => {
    try {
      await deleteSlider(id);
      setSlides((prev) => prev.filter((slide) => slide.id !== id));
    } catch (error) {
      toast.error("unexpected error occur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Sliders</h1>
        <button
          onClick={() => setOpenAddSlideModal(true)}
          className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Modal */}
      {openAddSlideModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#1A1A2E] rounded-xl w-[90%] max-w-md p-6 relative border border-purple-500/20">
            <button
              onClick={() => setOpenAddSlideModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              x
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Add Slide</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={newSlide.title}
                  onChange={handleChange}
                  className="w-full bg-[#2A2A3E] border border-gray-600 text-white rounded-lg px-4 py-2"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={newSlide.description}
                  onChange={handleChange}
                  className="w-full bg-[#2A2A3E] border border-gray-600 text-white rounded-lg px-4 py-2"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Select Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-[#2A2A3E] border border-gray-600 text-white rounded-lg px-4 py-2"
                />
              </div>

              <button
                onClick={handleAddSlide}
                className="w-full py-2 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90"
              >
                Add Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="bg-gradient-to-br from-[#252547] to-[#1A1A2E] rounded-xl border border-purple-500/20 overflow-hidden">
        <div className="p-4 border-b border-purple-500/10">
          <h2 className="text-xl font-bold text-white">Homepage Slider</h2>
        </div>

        <div className="p-6 space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className={`bg-[#1A1A2E] rounded-lg border ${
                slide.active ? "border-purple-500/20" : "border-gray-700/20"
              } overflow-hidden`}
            >
              <div className="w-full h-64 bg-gray-800 flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:w-2/3 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {slide.title}
                      </h3>
                      <p className="text-gray-400 mt-1">{slide.description}</p>
                      {/* <div className="mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            slide.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {slide.active ? "Active" : "Inactive"}
                        </span>
                      </div> */}
                    </div>
                    <div className="flex gap-2">
                      {/* <button className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        <Edit size={16} />
                      </button> */}
                      <button
                        onClick={() => handleRemoveSlice(slide.id)}
                        className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    {/* <div className="text-sm text-gray-400">ID: {slide.id}</div> */}
                    {/* <div className="flex gap-2">
                      {index > 0 && (
                        <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                          <MoveUp size={16} />
                        </button>
                      )}
                      {index < slides.length - 1 && (
                        <button className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                          <MoveDown size={16} />
                        </button>
                      )}
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sliders;
