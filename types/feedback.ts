// types/feedback.ts

export type FeedbackData = {
  visitor_name: string;
  visitor_email: string;
  feedback_text: string;
  rating?: number; // Nilai 1 sampai 5
};

// Tipe data ini digunakan untuk data yang akan kita kirim ke Supabase.
// Kita tidak menyertakan photo_url di sini karena upload foto ditangani terpisah 
// sebelum data ini disimpan.