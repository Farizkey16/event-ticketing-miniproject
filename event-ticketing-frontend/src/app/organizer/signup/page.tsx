'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignUpCard() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = () => {
    if (!agreeTerms) {
      alert('Anda harus menyetujui syarat dan ketentuan.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Password tidak cocok.');
      return;
    }

    console.log({ username, email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-center">Organizer Sign Up</h2>

        <Input
          placeholder="Nama Pengguna"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <Input
            placeholder="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute right-2 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            
          
        </div>

        <div className="relative">
          <Input
            placeholder="Konfirmasi Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div
            className="absolute right-2 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={() => setAgreeTerms(!agreeTerms)}
            className="mt-1"
          />
          <span>
            Saya telah membaca dan menyetujui{' '}
            <Link href="/terms" className="text-blue-600 underline hover:text-blue-800">
              Syarat dan Ketentuan LOCAL EVENT.COM
            </Link>
          </span>
        </div>

        <Button
  onClick={handleSignUp}
  className="w-full bg-green-600 hover:bg-green-800 text-white"
>
  Daftar
</Button>

<div className="text-sm text-center">
  Sudah punya akun?{' '}
  <Link href="/organizer/signin" className="text-blue-600 underline hover:text-blue-800">
    Sign In
  </Link>
</div>
 </div>
    </div>
  )}