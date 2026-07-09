// Fill these in from your EmailJS dashboard (Email Services / Email
// Templates / Account > API Keys) and the Project Builder form will start
// actually sending. Until then, submissions are logged to the console
// instead of silently pretending to send.
export const EMAILJS_SERVICE_ID = 'service_q43tv3s';
export const EMAILJS_TEMPLATE_ID = 'template_bjf1ubs';
export const EMAILJS_PUBLIC_KEY = 'Nc_TNYXzJRErOX4pC';

export const isEmailConfigured =
  EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' &&
  EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID' &&
  EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
