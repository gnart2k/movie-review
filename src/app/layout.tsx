import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import HandleClick from "@/lib/utils/HandleClick";
import { Navbar } from "@/components/layout";
import { SpeedInsights } from '@vercel/speed-insights/next';
import favicon from '../../public/favicon/favicon.ico';
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Movie Review",
  description: "Reivew any movie you like",
  icons: [{ rel: "icon", url: favicon.src }],
};

const localization = {
  signUp: {
    start: {
      title: 'Create your account',
      subtitle: 'to continue to {{applicationName}}',
      actionText: 'Have an account?',
      actionLink: 'Sign in',
    },
    emailLink: {
      title: 'Verify your email',
      subtitle: 'to continue to {{applicationName}}',
      formTitle: 'Verification link',
      formSubtitle: 'Use the verification link sent to your email address',
      resendButton: "Didn't receive a link? Resend",
      verified: {
        title: 'Successfully signed up',
      },
      loading: {
        title: 'Signing up...',
      },
      verifiedSwitchTab: {
        title: 'Successfully verified email',
        subtitle: 'Return to the newly opened tab to continue',
        subtitleNewTab: 'Return to previous tab to continue',
      },
    },
    emailCode: {
      title: 'Verify your email',
      subtitle: 'to continue to {{applicationName}}',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the verification code sent to your email address',
      resendButton: "Didn't receive a code? Resend",
      
    },
    phoneCode: {
      title: 'Verify your phone',
      subtitle: 'to continue to {{applicationName}}',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the verification code sent to your phone number',
      resendButton: "Didn't receive a code? Resend",
    },
    continue: {
      title: 'Fill in missing fields',
      subtitle: 'to continue to {{applicationName}}',
      actionText: 'Have an account?',
      actionLink: 'Sign in',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
       <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
    <head>
    <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Fleur+De+Leah&display=swap" 
          rel="stylesheet" 
        />
        
      <Script
        src="/scripts/lang-config.js"
        strategy="beforeInteractive"
      />
      <Script
        src="/scripts/translation.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=TranslateInit"
        strategy="afterInteractive"
      />
    </head>
    <ClerkProvider localization={localization}>
     
        <body suppressHydrationWarning>
          <Navbar />
          <HandleClick />
          {children}
          <SpeedInsights />
        <Toaster/>
        </body>
    </ClerkProvider>
    </html>

  );
}
