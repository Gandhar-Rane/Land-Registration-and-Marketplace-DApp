import { useState } from "react";

const generateLandId = () => {
  return "LAND-" + Math.floor(100000 + Math.random() * 900000);
};

function RegisterLand() {
  const [landId] = useState(generateLandId());
  const [form, setForm] = useState({
    title: "",
    area: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];

    if (file && file.size > 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [field]: "File must be less than 1MB",
      }));
      return;
    }

    if (field === "image") setImage(file);
    if (field === "document") setDocument(file);

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Login required");
      return;
    }

    if (!image || !document) {
      alert("Upload image and PDF");
      return;
    }

    const formData = new FormData();

    formData.append("user_id", user.user_id);
    formData.append("title", form.title);
    formData.append("area", form.area);
    formData.append("location", form.location);
    formData.append("image", image);
    formData.append("document", document);

    try {
      const res = await fetch("http://127.0.0.1:5000/register-land", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("Land submitted successfully ✅");

        // reset form
        setForm({ title: "", area: "", location: "" });
        setImage(null);
        setDocument(null);
      } else {
        alert(data.error || "Failed");
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg">

        <h2 className="text-3xl text-center mb-8 text-white">
          Register Land
        </h2>

        <input
          placeholder="Name"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-white/20 text-white"
        />

        <input
          value={landId}
          disabled
          className="w-full mb-4 p-3 rounded bg-white/10 text-gray-300"
        />

        <input
          type="number"
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full mb-4 p-3 rounded bg-white/20 text-white"
        />

        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full mb-6 p-3 rounded bg-white/20 text-white"
        />
        <p>upload Image</p>
        <input type="file" onChange={(e) => handleFileChange(e, "image")} />
        {errors.image && <p className="text-red-400">{errors.image}</p>}
        <p className="mt-4">upload Document (PDF)</p>
        <input type="file" onChange={(e) => handleFileChange(e, "document")} />
        {errors.document && <p className="text-red-400">{errors.document}</p>}

        <button
          onClick={handleSubmit}
          className="w-full py-3 mt-4 bg-blue-500 rounded-xl"
        >
          Submit
        </button>

      </div>
    </div>
  );
}

export default RegisterLand;