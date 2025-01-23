"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import * as FirestoreService from "@/lib/services/firestore";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminRoute } from "@/components/auth/admin-route";

interface Topic {
  id: string;
  name: string;
  description: string;
}

export default function TopicsPage() {
  return (
    <AdminRoute>
      <TopicsContent />
    </AdminRoute>
  );
}

function TopicsContent() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      const fetchedTopics = await FirestoreService.getAllTopics();
      setTopics(fetchedTopics as Topic[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load topics",
        variant: "destructive",
      });
    }
  };

  const handleCreateTopic = async () => {
    try {
      if (!newTopic.name.trim()) {
        toast({
          title: "Error",
          description: "Topic name is required",
          variant: "destructive",
        });
        return;
      }

      await FirestoreService.createTopic(newTopic.name, newTopic.description);
      setNewTopic({ name: "", description: "" });
      loadTopics();
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTopic = async (topic: Topic) => {
    try {
      await FirestoreService.updateTopic(topic.id, {
        name: topic.name,
        description: topic.description,
      });
      setEditingTopic(null);
      loadTopics();
      toast({
        title: "Success",
        description: "Topic updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update topic",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    try {
      await FirestoreService.deleteTopic(topicId);
      loadTopics();
      toast({
        title: "Success",
        description: "Topic deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete topic",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Course Topics</h1>

      {/* Add New Topic Form */}
      <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Topic</h2>
        <div className="space-y-4">
          <Input
            placeholder="Topic Name"
            value={newTopic.name}
            onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
          />
          <Textarea
            placeholder="Topic Description (optional)"
            value={newTopic.description}
            onChange={(e) =>
              setNewTopic({ ...newTopic, description: e.target.value })
            }
          />
          <Button onClick={handleCreateTopic}>
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </Button>
        </div>
      </div>

      {/* Topics List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Existing Topics</h2>
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="bg-card p-4 rounded-lg shadow-sm flex items-start justify-between"
          >
            {editingTopic?.id === topic.id ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={editingTopic.name}
                  onChange={(e) =>
                    setEditingTopic({ ...editingTopic, name: e.target.value })
                  }
                />
                <Textarea
                  value={editingTopic.description}
                  onChange={(e) =>
                    setEditingTopic({
                      ...editingTopic,
                      description: e.target.value,
                    })
                  }
                />
                <div className="space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateTopic(editingTopic)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTopic(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold">{topic.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {topic.description}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingTopic(topic)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteTopic(topic.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
