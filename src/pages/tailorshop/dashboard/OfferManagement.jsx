import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuthStore } from "../../../store/Auth.store";
import { useOfferStore } from "../../../store/Offer.store";

const OfferManagement = () => {
  const { offers, fetchOffersByTailorId, createOffer, deleteOffer } =
    useOfferStore();
  const { user } = useAuthStore();
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    percentage: 0,
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchOffersByTailorId(user.id);
    }
  }, [user, fetchOffersByTailorId]);

  const handleAddOffer = async () => {
    try {
      await createOffer(user.id, newOffer);
      setNewOffer({
        title: "",
        description: "",
        percentage: 0,
        startDate: "",
        endDate: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };

  const handleDelete = async (offerId) => {
    try {
      await deleteOffer(user.id, offerId);
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-6">Offer Management</h2>
      <div className="mb-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newOffer.title}
          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
          placeholder="Offer Title"
          className="p-2 border rounded"
        />
        <textarea
          value={newOffer.description}
          onChange={(e) =>
            setNewOffer({ ...newOffer, description: e.target.value })
          }
          placeholder="Description"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newOffer.percentage}
          onChange={(e) =>
            setNewOffer({ ...newOffer, percentage: e.target.value })
          }
          placeholder="Discount Percentage"
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={newOffer.startDate}
          onChange={(e) =>
            setNewOffer({ ...newOffer, startDate: e.target.value })
          }
          placeholder="Start Date"
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={newOffer.endDate}
          onChange={(e) =>
            setNewOffer({ ...newOffer, endDate: e.target.value })
          }
          placeholder="End Date"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={newOffer.imageUrl}
          onChange={(e) =>
            setNewOffer({ ...newOffer, imageUrl: e.target.value })
          }
          placeholder="Image URL"
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddOffer}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Offer
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Discount</th>
            <th className="p-2 text-left">End Date</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer._id} className="border-b">
              <td className="p-2">{offer.title}</td>
              <td className="p-2">{offer.percentage}%</td>
              <td className="p-2">{offer.endDate?.toLocaleDateString()}</td>
              <td className="p-2 flex space-x-2">
                <button className="text-blue-500">
                  <FaEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(offer._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfferManagement;
