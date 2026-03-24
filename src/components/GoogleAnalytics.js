'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function GoogleAnalyticsContent({ measurementId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', measurementId);

    return () => {
      // Cleanup
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
    };
  }, [measurementId]);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    const url = pathname + searchParams.toString();
    window.gtag('config', measurementId, {
      page_path: url,
    });
  }, [pathname, searchParams, measurementId]);

  return null;
}

export default function GoogleAnalytics({ measurementId }) {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsContent measurementId={measurementId} />
    </Suspense>
  );
}

// Helper function to track events
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Track form submission
export const trackFormSubmission = (formName, courseName) => {
  trackEvent('form_submission', {
    form_name: formName,
    course_name: courseName,
  });
};

// Track page view
export const trackPageView = (pageName) => {
  trackEvent('page_view', {
    page_name: pageName,
  });
};

// Track course interest
export const trackCourseInterest = (courseName) => {
  trackEvent('course_interest', {
    course_name: courseName,
  });
};