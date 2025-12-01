'use client'; 

import { useState } from 'react';
import { FeedbackData } from '@/types/feedback';
import { supabase } from '@/lib/supabaseClient'; 
import React from 'react'; // Tambahkan import React jika belum ada secara implisit

// --- Komponen Rating Bintang Sederhana ---
interface RatingInputProps {
    value: number;
    onChange: (rating: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ value, onChange }) => {
    // Array untuk 5 bintang
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex space-x-1 justify-center sm:justify-start">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button" // Penting: type="button" agar tidak memicu submit form
                    onClick={() => onChange(star)}
                    className={`text-2xl transition-colors duration-100 ${
                        star <= value 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 hover:text-yellow-300' 
                    }`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};
// ---------------------------------------------


export default function FeedbackPage() {
  // State untuk data input teks dan rating
  const [formData, setFormData] = useState<FeedbackData>({
    visitor_name: '',
    visitor_email: '',
    feedback_text: '',
    rating: 0, // Inisialisasi rating
  });
  
  // State untuk file foto yang dipilih
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handler untuk input teks
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handler untuk rating
  const handleRatingChange = (newRating: number) => {
    // Jika mengklik rating yang sama, set menjadi 0 (untuk unselect), jika tidak set rating baru
    setFormData((prev) => ({ 
        ...prev, 
        rating: prev.rating === newRating ? 0 : newRating 
    }));
  };

  // Handler untuk input file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    } else {
      setPhotoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    let feedbackId: string | null = null;
    let photoUrl: string | null = null;

    try {
        // --- BAGIAN 1: INSERT DATA FEEDBACK UNTUK MENDAPATKAN ID ---
        
        // Siapkan data insert: jika rating 0, kirim NULL ke DB
        const dataToInsert = {
            visitor_name: formData.visitor_name,
            visitor_email: formData.visitor_email,
            feedback_text: formData.feedback_text,
            rating: formData.rating && formData.rating > 0 ? formData.rating : null, 
        };

        const { data: insertData, error: insertError } = await supabase
            .from('feedback')
            .insert([dataToInsert])
            .select('id') 
            .single(); 

        if (insertError || !insertData) {
            throw new Error(`Gagal menyimpan feedback awal: ${insertError?.message}`);
        }
        
        feedbackId = insertData.id; 

        // --- BAGIAN 2: UPLOAD FOTO MENGGUNAKAN ID SEBAGAI NAMA FILE ---
        if (photoFile && feedbackId) {
            const fileExtension = photoFile.name.split('.').pop();
            const fileName = `${feedbackId}.${fileExtension}`; 
            
            const { error: uploadError } = await supabase.storage
                .from('feedback-photos')
                .upload(fileName, photoFile);

            if (uploadError) {
                console.warn('Upload foto gagal. Error:', uploadError);
            } else {
                const { data: publicUrlData } = supabase.storage
                    .from('feedback-photos')
                    .getPublicUrl(fileName);
                    
                photoUrl = publicUrlData.publicUrl;
            }
        }

        // --- BAGIAN 3: UPDATE DATABASE DENGAN URL FOTO ---
        if (photoUrl) {
            const { error: updateError } = await supabase
                .from('feedback')
                .update({ photo_url: photoUrl })
                .eq('id', feedbackId); 

            if (updateError) {
                throw new Error(`Gagal update URL foto: ${updateError.message}.`);
            }
        }
        
        // Sukses
        setMessage('Terima kasih! Feedback dan Foto Anda berhasil dikirim.');
        
        // Reset state
        setFormData({ visitor_name: '', visitor_email: '', feedback_text: '', rating: 0 }); 
        setPhotoFile(null);
        
    } catch (err: unknown) {
        // Penanganan Error yang aman (memperbaiki error ESLint/TS)
        let errorMessage = "Terjadi kesalahan yang tidak terduga";
        
        if (err instanceof Error) {
            errorMessage = err.message;
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
            errorMessage = (err as { message: string }).message; 
        }

        console.error("Kesalahan umum saat submit:", err);
        setMessage(`Pengiriman Gagal: ${errorMessage}. Cek log konsol.`);
        
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800">☕ Form Feedback Pengunjung</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="visitor_name" className="block text-sm font-medium text-gray-700">Nama Anda</label>
            <input
              type="text"
              name="visitor_name"
              id="visitor_name"
              value={formData.visitor_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="visitor_email" className="block text-sm font-medium text-gray-700">Email (Untuk Balasan)</label>
            <input
              type="email"
              name="visitor_email"
              id="visitor_email"
              value={formData.visitor_email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          {/* BAGIAN RATING BARU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Pelayanan (1-5)
            </label>
            <RatingInput 
                value={formData.rating || 0}
                onChange={handleRatingChange}
            />
          </div>
          
          <div>
            <label htmlFor="feedback_text" className="block text-sm font-medium text-gray-700">Saran & Masukan</label>
            <textarea
              name="feedback_text"
              id="feedback_text"
              rows={4}
              value={formData.feedback_text}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
          
          {/* Input Upload Foto */}
          <div>
            <label htmlFor="photo_file" className="block text-sm font-medium text-gray-700">
              Upload Foto (Opsional)
            </label>
            <input
              type="file"
              name="photo_file"
              id="photo_file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            {loading ? 'Mengirim...' : 'Kirim Feedback'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center p-2 rounded-md ${message.includes('Gagal') || message.includes('Error') ? 'text-red-800 bg-red-100' : 'text-green-800 bg-green-100'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}