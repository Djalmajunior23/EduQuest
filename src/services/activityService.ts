import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Activity, ActivitySubmission } from '../types/activities';

const ACTIVITIES_COLLECTION = 'activities';
const SUBMISSIONS_COLLECTION = 'activity_submissions';

export const activityService = {
  async createActivity(activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, ACTIVITIES_COLLECTION), {
      ...activity,
      createdAt: now,
      updatedAt: now
    });
    return docRef.id;
  },

  async updateActivity(id: string, updates: Partial<Activity>): Promise<void> {
    const docRef = doc(db, ACTIVITIES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  },

  async getActivitiesByTeacher(teacherId: string): Promise<Activity[]> {
    const q = query(collection(db, ACTIVITIES_COLLECTION), where('teacherId', '==', teacherId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async getActivitiesByClass(classId: string): Promise<Activity[]> {
    const q = query(collection(db, ACTIVITIES_COLLECTION), where('classId', '==', classId), where('status', '==', 'published'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
  },

  async submitActivity(submission: Omit<ActivitySubmission, 'id' | 'createdAt'>): Promise<string> {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      ...submission,
      createdAt: now
    });
    return docRef.id;
  },

  async getSubmissionsByActivity(activityId: string): Promise<ActivitySubmission[]> {
    const q = query(collection(db, SUBMISSIONS_COLLECTION), where('activityId', '==', activityId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivitySubmission));
  },

  async getStudentSubmissions(studentId: string): Promise<ActivitySubmission[]> {
    const q = query(collection(db, SUBMISSIONS_COLLECTION), where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ActivitySubmission));
  }
};
