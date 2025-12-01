// types/feedback.ts

export type FeedbackData = {
  visitor_name: string;
  visitor_email: string;
  feedback_text: string;
  rating?: number; // Nilai 1 sampai 5
};

// Tipe data lengkap dari database
export interface FullFeedbackItem extends FeedbackData {
    id: string; // uuid
    created_at: string;
    photo_url: string | null;
    status: 'new' | 'in-progress' | 'resolved';
    admin_response: string | null;
}