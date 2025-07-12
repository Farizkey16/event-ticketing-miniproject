'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function OrganizerProfile() {
  const [profile, setProfile] = useState({
    name: 'PT Kreatif Maju',
    address: 'Jl. Sudirman No. 88, Jakarta',
    phone: '+62 812 3456 7890',
    image: '/organizer.jpg',
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Simpan data profil (dummy)
    console.log('💾 Simpan profil:', profile);
    setEditing(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profil Organizer</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <img
              src={profile.image}
              alt=""
              className="w-28 h-28 rounded-full object-cover border"
            />
            <div>
              <Label className="text-sm text-gray-600">Organizer Picrures</Label>
              <Input
                type="text"
                name="image"
                value={profile.image}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Organizer Name</Label>
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <Label>Address Organizer</Label>
              <Input
                name="address"
                value={profile.address}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>
          </div>

          {editing && (
            <div className="pt-2">
              <Link href="/organizer/reset-password">
                <Button variant="outline">Reset Password</Button>
              </Link>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-6">
            {!editing ? (
              <Button onClick={() => setEditing(true)}>Edit</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
