import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['hy', 'en', 'ru'],

  // Used when no locale matches
  defaultLocale: 'hy',

  // The default locale is not prefixed
  localePrefix: 'as-needed',

  // Disable automatic locale detection to force defaultLocale
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
