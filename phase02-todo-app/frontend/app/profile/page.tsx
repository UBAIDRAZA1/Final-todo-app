'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';

export default function ProfilePage() {
  const { session, signOut, updateSession } = useAuth();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (session?.data?.user) {
      setName(session.data.user.name || '');
      setImageUrl(session.data.user.image || '');
    }
  }, [session?.data?.user]);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.data?.user) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUpdating(true);
    setMessage(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';
      
      const response = await axios.post(
        `${apiBaseUrl}/api/users/me/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${session.data.token}`
          }
        }
      );

      // Backend returns relative path e.g. /uploads/filename
      // We need to construct full URL for display if it's relative
      let newImageUrl = response.data.image_url;
      if (newImageUrl && newImageUrl.startsWith('/')) {
        newImageUrl = `${apiBaseUrl}${newImageUrl}`;
      }

      setImageUrl(newImageUrl);

      // Update local session
      if (updateSession && session.data) {
        updateSession({
          ...session.data,
          user: {
            ...session.data.user,
            image: newImageUrl
          }
        });
      }

      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
      router.refresh();
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to upload image' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.data?.user) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001';
      
      const response = await axios.put(
        `${apiBaseUrl}/api/users/me`,
        {
          name,
          image_url: imageUrl
        },
        {
          headers: {
            'Authorization': `Bearer ${session.data.token}`
          }
        }
      );

      // Update local session
      if (updateSession && session.data) {
        updateSession({
          ...session.data,
          user: {
            ...session.data.user,
            name: response.data.name,
            image: response.data.image_url // Backend returns image_url, frontend expects image (mapped in useAuth/Navbar)
          }
        });
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      router.refresh();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to update profile' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Please log in to view your profile</h1>
          <Button onClick={() => router.push('/auth/login')} className="bg-gradient-to-r from-indigo-500 to-purple-500">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={session.data.user} onLogout={handleLogout} />
      
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>

          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-card/50">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-indigo-500/30">
                    <AvatarImage 
                      src={imageUrl || session.data.user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.data.user?.name || 'user'}`} 
                      alt={session.data.user?.name || 'User'} 
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      {session.data.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-muted-foreground">Preview</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={session.data?.user?.email || ''} 
                      disabled 
                      className="bg-muted/50" 
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your name" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Profile Image</Label>
                    <Input 
                      id="image-upload" 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload an image from your device to update your avatar.
                    </p>
                  </div>

                  {message && (
                    <div className={`p-3 rounded-md text-sm ${
                      message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
