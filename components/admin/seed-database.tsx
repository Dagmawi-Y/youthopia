'use client';

import { useState } from 'react';
import { seedDatabase } from '@/lib/mock/seed';

export function SeedDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSeed = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      await seedDatabase();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Seeding...' : 'Seed Database with Mock Data'}
      </button>
      
      {error && (
        <div className="mt-2 text-red-600">
          Error: {error}
        </div>
      )}
      
      {success && (
        <div className="mt-2 text-green-600">
          Database seeded successfully!
        </div>
      )}
    </div>
  );
} 