/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react";
import { createItem, updateItem } from "../lib/api";
import { Item } from "../lib/types";
import ErrorMessage from "../components/ErrorMessage";

export default function ItemForm({
  item,
  onSuccess,
}: {
  item?: Item;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (item) {
        await updateItem(item.id, { title, description });
      } else {
        await createItem({ title, description });
      }
      setTitle("");
      setDescription("");
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <ErrorMessage message={error} />
      <input
        type="text"
        placeholder="Title"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {item ? "Update" : "Create"}
      </button>
    </form>
  );
}
