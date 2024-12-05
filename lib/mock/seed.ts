import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockUsers, mockPosts, mockCourses, mockChallenges } from './seed-data';

export async function seedDatabase() {
  try {
    // Seed users
    for (let i = 0; i < mockUsers.length; i++) {
      const user = mockUsers[i];
      const userId = `user${i + 1}`;
      await setDoc(doc(db, 'users', userId), {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    // Seed posts
    for (let i = 0; i < mockPosts.length; i++) {
      const post = mockPosts[i];
      const postId = `post${i + 1}`;
      await setDoc(doc(db, 'posts', postId), {
        ...post,
        id: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    // Seed courses
    for (let i = 0; i < mockCourses.length; i++) {
      const courseId = `course${i + 1}`;
      await setDoc(doc(db, 'courses', courseId), {
        ...mockCourses[i],
        id: courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    // Seed challenges
    for (let i = 0; i < mockChallenges.length; i++) {
      const challengeId = `challenge${i + 1}`;
      await setDoc(doc(db, 'challenges', challengeId), {
        ...mockChallenges[i],
        id: challengeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
} 