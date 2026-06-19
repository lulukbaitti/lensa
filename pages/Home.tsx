// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Image as ImageIcon,
  Sparkles,
  Download,
  ArrowRight,
  Heart,
  Star,
} from 'lucide-react';
import { useAuth } from '../utils/useAuth';
import { motion } from 'framer-motion';

export function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-16 sm:space-y-20 py-8 sm:py-12 relative">
      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute top-10 left-4 sm:left-10 text-pink-300 opacity-60"
        >
          <Star size={36} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="absolute top-40 right-4 sm:right-20 text-red-300 opacity-60"
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.5 }}
          className="absolute bottom-40 left-4 sm:left-20 text-yellow-300 opacity-60"
        >
          <Sparkles size={40} />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto relative z-10 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-pink-200 to-red-200 rounded-full text-[#4A3728] mb-2 shadow-xl shadow-pink-200/50"
        >
          <Camera className="w-10 h-10" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-['Cherry_Bomb_One'] text-[#4A3728] tracking-wide drop-shadow-sm"
        >
          LensaLoka
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl text-[#6B503B] font-medium max-w-2xl mx-auto leading-relaxed"
        >
          Photobooth aesthetic super cute ala Y2K! 🎀✨
          <br />
          Pilih template lucu, foto bareng bestie, hias dengan stiker, dan simpan kenangan manismu.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <Link
            to={user ? '/create' : '/auth'}
            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-[#4A3728] text-[#FFF5F5] rounded-full font-bold text-lg sm:text-xl hover:bg-[#3A2A1E] hover:scale-105 transition-all shadow-2xl shadow-[#4A3728]/30"
          >
            {user ? 'Mulai Foto Sekarang!' : 'Daftar & Mulai Foto!'}
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
        </motion.div>
      </section>

      {/* About Section */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-white to-[#FFF0F5] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 shadow-xl shadow-pink-100/50 border border-pink-100 relative overflow-hidden mx-2 sm:mx-0"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-['Cherry_Bomb_One'] text-[#4A3728]">
            Tentang LensaLoka
          </h2>
          <p className="text-[#6B503B] text-base sm:text-xl leading-relaxed font-medium">
            LensaLoka adalah web photobooth interaktif yang dirancang khusus untuk kamu yang suka
            mengabadikan momen dengan gaya yang unik dan <i>aesthetic</i>. Pilih berbagai template
            dekoratif yang super ramai, tambahkan filter pada fotomu, dan hias dengan berbagai stiker
            lucu dan teks sesuai kreativitasmu!
          </p>
        </div>
      </motion.section>

      {/* How to Use */}
      <motion.section
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="space-y-8 sm:space-y-12 px-2 sm:px-0"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-['Cherry_Bomb_One'] text-[#4A3728]">
            Cara Penggunaan
          </h2>
          <p className="text-[#6B503B] text-base sm:text-lg font-medium">
            Ikuti 5 langkah mudah ini untuk membuat photostrip impianmu!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <StepCard
            number={1}
            icon={<Heart className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />}
            title="Daftar / Login"
            desc="Buat akun dulu biar hasil fotomu tersimpan aman di galeri pribadimu."
          />
          <StepCard
            number={2}
            icon={<ImageIcon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-500" />}
            title="Pilih Template"
            desc="Pilih dari berbagai template super cute & tentukan warna background."
          />
          <StepCard
            number={3}
            icon={<Camera className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />}
            title="Foto / Upload"
            desc="Gunakan kamera dengan timer otomatis atau upload foto dari HP. Pilih filter!"
          />
          <StepCard
            number={4}
            icon={<Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-500" />}
            title="Hias Sesukamu"
            desc="Tambahkan teks dan berbagai stiker lucu agar photostrip makin ramai!"
          />
          <StepCard
            number={5}
            icon={<Download className="w-7 h-7 sm:w-8 sm:h-8 text-green-500" />}
            title="Simpan & Unduh"
            desc="Simpan ke galeri LensaLoka. Download, edit ulang, atau hapus kapan saja."
          />
        </div>
      </motion.section>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  desc,
}: {
  number: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg shadow-pink-100/50 border-2 border-pink-50 flex flex-col items-center text-center space-y-4 hover:border-pink-300 hover:-translate-y-1 transition-all duration-300 relative group">
      <div className="absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 bg-[#4A3728] text-[#FFF5F5] rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-xl font-['Cherry_Bomb_One'] group-hover:scale-110 transition-transform">
        {number}
      </div>
      <div className="p-4 bg-pink-50 rounded-full group-hover:bg-pink-100 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold text-[#4A3728] text-base sm:text-xl">{title}</h3>
      <p className="text-xs sm:text-sm text-[#6B503B] leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
