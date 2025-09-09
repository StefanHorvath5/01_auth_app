/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { getItems, deleteItem } from "../lib/api";
import { Item, Roles } from "../lib/types";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../lib/auth";

export default function ItemList({ onEdit }: { onEdit: (item: Item) => void }) {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState("");
  const { user } = useAuth();

  async function fetchItems() {
    try {
      setItems(await getItems());
    } catch (err: any) {
      setError(err.message);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteItem(id);
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <ErrorMessage message={error} />
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-2 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-bold">{item.title}</div>
              <div>{item.description}</div>
            </div>
            {user && (
              <>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  {user.role == Roles.ADMIN && (
                    <>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
