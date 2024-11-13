'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface ProfileProps {
  name: string;
  detail: string;
  image?: string; // Optional profile image URL
}

export default function ProfileChip({ name, detail, image }: ProfileProps) {
  const initials = name.charAt(0).toUpperCase(); // Get the first letter of the name
  const pathName = usePathname(); // Get the profile URL

  const userType = pathName.split('/')[1];

  // Get the profile URL based on the current path
  const profileUrl = `/${userType}/perfil`;

  return (
    <Link
      href={profileUrl}
      role="link"
      className="flex items-center space-x-3 p-2 rounded-lg bg-qt_secondary hover:bg-qt_highlight transition-colors cursor-pointer"
      aria-label={`Go to profile settings for ${name}`} // Use dynamic `name` here
    >
      {/* Profile Image or Initial */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-qt_highlight flex items-center justify-center text-qt_primary text-xl font-bold">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className="object-cover rounded-full"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Name and Detail Stack */}
      <div className="flex flex-col">
        <span className="text-qt_primary font-medium">{name}</span>
        <span className="text-qt_dark text-sm">{detail}</span>
      </div>
    </Link>

  );
}
