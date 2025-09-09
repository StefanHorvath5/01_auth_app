"use client";
import { useState } from "react";
import ItemList from "./ItemList";
import ItemForm from "./ItemForm";
import { Item } from "../lib/types";
import { useAuth } from "../lib/AuthProvider";

export default function ItemsPage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState<Item | undefined>(undefined);
  const [refresh, setRefresh] = useState(0);

  function handleEdit(item: Item) {
    setEditing(item);
  }

  function handleSuccess() {
    setEditing(undefined);
    setRefresh((r) => r + 1);
  }

  return (
    <>
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-2">Items</h2>
        {user && <ItemForm item={editing} onSuccess={handleSuccess} />}
        <ItemList key={refresh} onEdit={handleEdit} />
      </div>
    </>
  );
}
