import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface Memory {
  id: string;
  content: string;
}

const initialMemories: Memory[] = [
  { id: "1", content: "You live in Bangalore" },
  { id: "2", content: "You prefer calm conversations" },
  { id: "3", content: "You work in technology" },
  { id: "4", content: "You enjoy late-night thinking sessions" },
];

const Memories = () => {
  const navigate = useNavigate();
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newMemory, setNewMemory] = useState("");

  const handleEdit = (memory: Memory) => {
    setEditingId(memory.id);
    setEditValue(memory.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      setMemories((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, content: editValue } : m))
      );
      setEditingId(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddMemory = () => {
    if (newMemory.trim()) {
      setMemories((prev) => [
        ...prev,
        { id: Date.now().toString(), content: newMemory },
      ]);
      setNewMemory("");
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between p-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate("/home")}
          className="p-3 text-foreground-muted hover:text-foreground 
                     transition-colors duration-300 rounded-full hover:bg-background-surface"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-foreground font-medium">Memories</h1>
        <div className="w-11" /> {/* Spacer */}
      </motion.header>

      {/* Intro text */}
      <motion.div
        className="px-6 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-foreground-muted text-center text-sm">
          What NEX remembers about you
        </p>
      </motion.div>

      {/* Memories list */}
      <div className="max-w-lg mx-auto px-6 pb-12">
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {memories.map((memory, index) => (
            <motion.div
              key={memory.id}
              className="group flex items-center gap-3 p-4 bg-background-surface rounded-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              {editingId === memory.id ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 bg-transparent text-foreground outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-orb hover:bg-orb/10 rounded-full transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 text-foreground-muted hover:bg-background-elevated rounded-full transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-foreground">{memory.content}</span>
                  <button
                    onClick={() => handleEdit(memory)}
                    className="p-2 text-foreground-subtle opacity-0 group-hover:opacity-100 
                               hover:text-foreground-muted hover:bg-background-elevated 
                               rounded-full transition-all duration-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="p-2 text-foreground-subtle opacity-0 group-hover:opacity-100 
                               hover:text-destructive hover:bg-destructive/10 
                               rounded-full transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </motion.div>
          ))}

          {/* Add memory */}
          {isAdding ? (
            <motion.div
              className="flex items-center gap-3 p-4 bg-background-surface rounded-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Add a new memory..."
                className="flex-1 bg-transparent text-foreground placeholder:text-foreground-subtle outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddMemory();
                  if (e.key === "Escape") {
                    setIsAdding(false);
                    setNewMemory("");
                  }
                }}
              />
              <button
                onClick={handleAddMemory}
                className="p-2 text-orb hover:bg-orb/10 rounded-full transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewMemory("");
                }}
                className="p-2 text-foreground-muted hover:bg-background-elevated rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center gap-2 w-full p-4 
                         border-2 border-dashed border-foreground-subtle/20 
                         text-foreground-muted hover:text-foreground hover:border-foreground-subtle/40
                         rounded-2xl transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add memory</span>
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Memories;
