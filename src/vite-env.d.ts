export declare global {
	interface ImportMeta {
		env: {
			readonly VITE_WEBSITE_URL: any;
			readonly VITE_EMAILJS_PUBLIC_KEY: string;
			readonly VITE_EMAILJS_TEMPLATE_ID: string;
			readonly VITE_EMAILJS_SERVICE_ID: any;
			readonly VITE_API_KEY: string;
			readonly VITE_AUTH_DOMAIN: string;
			readonly VITE_DATABASE_URL: string;
			readonly VITE_PROJECT_ID: string;
			readonly VITE_STORAGE_BUCKET: string;
			readonly VITE_MESSAGING_SENDER_ID: string;
			readonly VITE_APP_ID: string;
		};
	}
}
