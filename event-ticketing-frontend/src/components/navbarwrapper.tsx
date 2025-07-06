'use client';

import Navbar from './navbar';
import { useAuth } from '@/context/authcontext';

export default function NavbarWrapper() {
  const { toggleSignIn, toggleSignUp, user } = useAuth();

  return (
  <Navbar
    user={user}
    onSignInClick={toggleSignIn}
    onSignUpClick={toggleSignUp}
  />
)}