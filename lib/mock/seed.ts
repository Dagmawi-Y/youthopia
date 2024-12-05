import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { mockUsers, mockPosts, mockCourses, mockChallenges } from './seed-data';

export async function seedDatabase() {
  try {
    // Seed users
    for (const [index, user] of mockUsers.entries()) {
      const userId = `user${index + 1}`;
      await setDoc(doc(db, 'users', userId), {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed posts
    for (const [index, post] of mockPosts.entries()) {
      const postId = `post${index + 1}`;
      await setDoc(doc(db, 'posts', postId), {
        ...post,
        id: postId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed courses
    for (const [index, course] of mockCourses.entries()) {
      const courseId = `course${index + 1}`;
      await setDoc(doc(db, 'courses', courseId), {
        ...course,
        id: courseId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Seed challenges
    for (const [index, challenge] of mockChallenges.entries()) {
      const challengeId = `challenge${index + 1}`;
      await setDoc(doc(db, 'challenges', challengeId), {
        ...challenge,
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